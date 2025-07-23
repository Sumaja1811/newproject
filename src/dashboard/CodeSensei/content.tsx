"use client";

import { useState, useRef, useEffect, type JSX } from "react";
import axios from "axios";
import { v4 as uuid } from 'uuid';
import { Input } from "@/components/ui/input";
import ChatHistorySidebar, { type ChatItem, type ChatSession} from "@/dashboard/CodeSensei/chatHistorySibebar";
import SearchChatModal from "./searchChatPopup";
import ConfigurationSidebar from "./configuratinoSidebar";


interface ContentProps {
  showHistory: boolean;
  onCloseHistory: () => void;
   resetSignal?: number; 
   showSearchModal?: boolean;
   setShowSearchModal: (value: boolean) => void;
   showConfiguration?: boolean;
   setShowConfiguration: (value: boolean) => void;
}

export default function Content({ showHistory, onCloseHistory, resetSignal, showSearchModal,setShowSearchModal, showConfiguration, setShowConfiguration }: ContentProps) {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  // const [chatHistory, setChatHistory] = useState<
  //   { question: string; answer: string | JSX.Element }[]
  // >([]);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  // const [showSearchModal, setShowSearchModal] = useState(false);
    // const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

const [recentSearches, setRecentSearches] = useState<string[]>([]);

const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
const currentSession = chatSessions.find(s => s.id === currentSessionId);

const handleSelectSession = (sessionId: string) => {
  const selected = chatSessions.find((s) => s.id === sessionId);
  if (selected) {
    setCurrentSessionId(sessionId);
    setChatHistory(selected.messages);
  }
  onCloseHistory();
};



const handleDeleteSession = (sessionId: string) => {
  setChatSessions((prevSessions) => {
    const updatedSessions = prevSessions.filter((s) => s.id !== sessionId);

    if (sessionId === currentSessionId) {
      if (updatedSessions.length > 0) {
        const latestSession = updatedSessions[0];
        setCurrentSessionId(latestSession.id);
        setChatHistory(latestSession.messages || []);
      } else {
        setCurrentSessionId(null);
        setChatHistory([]);
        setChatHistory([]); // optional: hide the sidebar if needed
      }
    }

    return updatedSessions;
  });
};



const saveCurrentSession = () => {
  if (chatHistory.length === 0) return;

  const newSessionId = currentSessionId ?? crypto.randomUUID();
  const newSession: ChatSession = {
    id: newSessionId,
    messages: chatHistory,
    createdAt: new Date().toISOString(),
  };

  setChatSessions((prev) => {
    const exists = prev.find((s) => s.id === newSessionId);
    if (exists) {
      return prev.map((s) => (s.id === newSessionId ? newSession : s));
    } else {
      return [newSession, ...prev];
    }
  });
};


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isGenerating]);

  useEffect(() => {
  if (chatHistory.length > 0) {
    // Save current session before resetting
    const newSessionId = currentSessionId ?? crypto.randomUUID();
    const newSession: ChatSession = {
      id: newSessionId,
      messages: chatHistory,
      createdAt: new Date().toISOString(),
    };

    setChatSessions((prev) => {
      // If session already exists (i.e., not a new chat), replace it
      const exists = prev.find((s) => s.id === newSessionId);
      if (exists) {
        return prev.map((s) => (s.id === newSessionId ? newSession : s));
      } else {
        return [newSession, ...prev];
      }
    });
  }

  // Reset everything for new session
   saveCurrentSession();
  setChatHistory([]);
  setInputText("");
  setResponse("");
  setCurrentSessionId(null);
}, [resetSignal]);



//   const handleSend = () => {
//   if (!inputText.trim()) return;

//   const currentQuestion = inputText.trim();
//   setInputText("");
//   setIsGenerating(true);

//   const tempAnswer: ChatItem = {
//     question: currentQuestion,
//     answer: <p className="text-black dark:text-white">Generating...</p>,
//   };

//   let targetSessionId = currentSessionId;

//   // Create a new session if none exists
//   if (!currentSessionId) {
//     const newId = crypto.randomUUID();
//     const newSession: ChatSession = {
//       id: newId,
//       messages: [tempAnswer],
//       createdAt: new Date().toISOString(),
//     };
//     setChatSessions(prev => [newSession, ...prev]);
//     setCurrentSessionId(newId);
//     targetSessionId = newId; // use this for later updates
//     setChatHistory([tempAnswer]);
//   } else {
//     // Append to existing session
//     setChatSessions(prev =>
//       prev.map(session =>
//         session.id === currentSessionId
//           ? { ...session, messages: [...session.messages, tempAnswer] }
//           : session
//       )
//     );
//     setChatHistory(prev => [...prev, tempAnswer]);
//   }

//   // Simulate async response
//   setTimeout(() => {
//     const generatedAnswer = getAnswerForQuestion(currentQuestion);

//     // 🔥 Use `targetSessionId` to ensure correct session is updated
//     setChatSessions(prev =>
//       prev.map(session => {
//         if (session.id === targetSessionId) {
//           const updatedMessages = [...session.messages];
//           updatedMessages[updatedMessages.length - 1] = {
//             ...updatedMessages[updatedMessages.length - 1],
//             answer: generatedAnswer,
//           };
//           return { ...session, messages: updatedMessages };
//         }
//         return session;
//       })
//     );

//     setChatHistory(prev => {
//       const updated = [...prev];
//       updated[updated.length - 1] = {
//         ...updated[updated.length - 1],
//         answer: generatedAnswer,
//       };
//       return updated;
//     });

//     setIsGenerating(false);
//   }, 2000);
// };



//  const getAnswerForQuestion = (question: string): JSX.Element => {
//   if (
//     question ===
//     "What are all the data structures used in the programs and indicate data structures wise usage?"
//   ) {
//     return (
//       <ul className="space-y-3">
//   <li className="text-black dark:text-white">
//     1. <span className="text-[#6DD8FF] bg-[#2F2F2F] rounded-lg px-2">BILL-NEW-DATA</span>: This record structure contains input data for each bill. It includes patient information (NPI, provider number, patient status), diagnosis and procedure codes (tables), length of stay, covered days, charges, and other relevant billing details. It’s used as input to the payment calculation routines.
//   </li>
//   <li className="text-black dark:text-white">
//     2. <span className="text-[#6DD8FF] bg-[#2F2F2F] rounded-lg px-2">PPS-DATA-ALL</span>: This is a large record containing various parameters and calculated values used in the payment calculation process. It includes data elements such as MSA (Medicare Severity Adjustment), wage index, average length of stay, relative weight, payment amounts (site neutral, standard, outlier), and other crucial factors. It acts as a central repository for intermediate and final results.
//   </li>
//   <li className="text-black dark:text-white">
//     3. <span className="text-[#6DD8FF] bg-[#2F2F2F] rounded-lg px-2">PPS-PAYMENT-DATA</span>: This record structure specifically holds the calculated payment amounts. It separates the different types of payments (site-neutral cost, site-neutral IPPS, standard full, standard SSO).
//   </li>
//   <li className="text-black dark:text-white">
//     4. <span className="text-[#6DD8FF] bg-[#2F2F2F] rounded-lg px-2">PPS-OTHER-DATA</span>: This record holds various percentages and rates used in the calculations, such as national labor and non-labor percentages, standard federal rate, budget neutral rate, and IPPS threshold.
//   </li>
//   <li className="text-black dark:text-white">
//     5. <span className="text-[#6DD8FF] bg-[#2F2F2F] rounded-lg px-2">PPS-PC-DATA</span>: This record structure likely contains data related to procedure codes and other relevant procedure-specific information. The exact contents are unclear from the snippet.
//   </li>
//   <li className="text-black dark:text-white">
//     6. <span className="text-[#6DD8FF] bg-[#2F2F2F] rounded-lg px-2">CBSA-WI-TABLE</span>: This is a table (array) containing data indexed by CBSA (Core Based Statistical Area code). Each entry includes an effective date and wage indices (multiple years). This table is used to look up wage indices based on the CBSA of the patient’s location.
//   </li>
//   <li className="text-black dark:text-white">
//     7. <span className="text-[#6DD8FF] bg-[#2F2F2F] rounded-lg px-2">IPPS-CBSA-WI-TABLE</span>: Similar to CBSA-WI-TABLE, but this table likely contains wage index data specifically for IPPS (Inpatient Prospective Payment System) calculations.
//   </li>
//   <li className="text-black dark:text-white">
//     8. <span className="text-[#6DD8FF] bg-[#2F2F2F] rounded-lg px-2">MSA-WI-TABLE</span>: This table contains data indexed by MSA (Metropolitan Statistical Area) code, providing wage indices for different years. Used for MSA-based wage index lookups.
//   </li>
//   <li className="text-black dark:text-white">
//     9. <span className="text-[#6DD8FF] bg-[#2F2F2F] rounded-lg px-2">PROV-RECORD</span>: This structure seems to hold provider-specific information read from a provider file. It’s divided into three parts (PROV-REC1, PROV-REC2, PROV-REC3) likely for better organization or handling of large amounts of data.
//   </li>
//   <li className="text-black dark:text-white">
//     10. <span className="text-[#6DD8FF] bg-[#2F2F2F] rounded-lg px-2">B-DIAGNOSIS-CODE-TABLE and B-PROCEDURE-CODE-TABLE</span>: These are tables containing lists of diagnosis and procedure codes, respectively. They are used to store and access the codes associated with each patient’s bill.
//   </li>
// </ul>

//     );
//   }
//   if (question.toLowerCase().includes("pps-data-all")) {
//     return (
//       <p>
//         <strong className="text-[#38DEEB]">PPS-DATA-ALL</strong> stores various intermediate values during the payment calculation like wage index, LOS, site-neutral and standard payment components. It acts like a centralized memory for all PPS-related computations.
//       </p>
//     );
//   }

//   return <p className="text-black dark:text-white">Sorry, I don’t have an answer for that yet.</p>;
// };

const handleSend = async () => {
  if (!inputText.trim()) return;

  const currentQuestion = inputText.trim();
  setInputText("");
  setIsGenerating(true);

  const tempAnswer: ChatItem = {
    question: currentQuestion,
    answer: <p className="text-black dark:text-white">Generating...</p>,
  };

  let targetSessionId = currentSessionId;

  if (!currentSessionId) {
    const newId = crypto.randomUUID();
    const newSession: ChatSession = {
      id: newId,
      messages: [tempAnswer],
      createdAt: new Date().toISOString(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    targetSessionId = newId;
    setChatHistory([tempAnswer]);
  } else {
    setChatSessions(prev =>
      prev.map(session =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, tempAnswer] }
          : session
      )
    );
    setChatHistory(prev => [...prev, tempAnswer]);
  }

  // 🔥 Call the actual backend API here
  const generatedAnswer = await getAnswerForQuestion(currentQuestion);

  // Update session with real answer
  setChatSessions(prev =>
    prev.map(session => {
      if (session.id === targetSessionId) {
        const updatedMessages = [...session.messages];
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          answer: generatedAnswer,
        };
        return { ...session, messages: updatedMessages };
      }
      return session;
    })
  );

  setChatHistory(prev => {
    const updated = [...prev];
    updated[updated.length - 1] = {
      ...updated[updated.length - 1],
      answer: generatedAnswer,
    };
    return updated;
  });

  setIsGenerating(false);
};


const getAnswerForQuestion = async (question: string): Promise<JSX.Element> => {
  try {
    const res = await axios.post("http://10.73.80.148:8081/api/getLLMInference", {
      langtype: "java",
      query: question,
      prev_response: [{}]
    });

    const result = res?.data?.response;

    const displayText =
      typeof result === "string"
        ? result
        : result?.[Object.keys(result)[0]] || "No response found.";

    return (
      <p className="text-black dark:text-white whitespace-pre-wrap">
        {displayText}
      </p>
    );
  } catch (error) {
    console.error("API error:", error);
    return (
      <p className="text-red-400">Failed to fetch response from the server.</p>
    );
  }
};

  const isChatStarted = chatHistory.length > 0 || isGenerating;

  return (
    <div
      className={`flex flex-col h-[82vh] text-white relative ${
        isChatStarted ? "justify-between" : "justify-center"
      } items-center`}
    >
      {/* Chat History */}
      {isChatStarted && (
        <div className="flex flex-col items-center overflow-y-auto px-6 pt-6 space-y-2 w-full h-[67vh]">
          {chatHistory.map((chat, index) => (
            <div key={index} className="space-y-2 w-[44vw]">
              <div className="flex justify-end">
                <div className="dark:bg-[#525252] bg-[#f4f4f4] px-3 py-2 rounded-[10px] text-sm text-black dark:text-white max-w-xl">
                  {chat.question}
                </div>
              </div>

              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg text-[12px] tracking-wider text-gray-300 whitespace-pre-wrap">
                  {typeof chat.answer === "string" ? (
  <pre>{chat.answer}</pre>
) : (
  chat.answer
)}
                </div>
              </div>
            </div>
          ))}

        {/* <div className="flex justify-start items-center w-[44vw]">
        {isGenerating && (
          <div className="text-white animate-pulse text-sm">
            Generating...
          </div>
        )}
        </div> */}
          <div ref={chatEndRef} />
        </div>
      )}

{/* {currentSession && (
  <div className="text-sm text-gray-400 mt-2">
    Session started: {new Date(currentSession.createdAt).toLocaleString()}<br />
    Messages: {currentSession.messages.length}
  </div>
)} */}

      {showHistory && (
        <ChatHistorySidebar
  chatSessions={chatSessions}
  onClose={onCloseHistory}
  onSelectSession={handleSelectSession}
  onDelete={handleDeleteSession}
/>
      )}
{showSearchModal && (
  <SearchChatModal
    open={showSearchModal}
    onClose={() => setShowSearchModal(false)}
    chatHistory={chatHistory}
    recentSearches={recentSearches}
    setRecentSearches={setRecentSearches}
  />
)}

{showConfiguration && (
  <ConfigurationSidebar onClose={() => setShowConfiguration(false)}/>)}
       
      {/* Input Box */}
      <div
        className={`w-full flex flex-col items-center ${
          isChatStarted ? "pb-0" : ""
        }`}
      >
        {/* Welcome Prompt on First Load */}
        {!isChatStarted && (
          <h4 className="text-2xl mb-4">How may I help you</h4>
        )}

        <div className="relative w-[44vw]">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full h-[12vh] dark:!bg-[#2E2D2D] !bg-[#ececec] rounded-xl border-none outline-none focus:outline-none focus:ring-0 pr-12 dark:text-white text-black placeholder:text-gray-400"
            placeholder="Ask anything..."
          />
          <button
            onClick={handleSend}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <img src="/Send_icon.svg" alt="Send" className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
