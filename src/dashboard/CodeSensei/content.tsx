"use client";

import { useState, useRef, useEffect, type JSX } from "react";
import axios from "axios";
import { v4 as uuid } from 'uuid';
import { Input } from "@/components/ui/input";
import ChatHistorySidebar, { type ChatItem, type ChatSession} from "@/dashboard/CodeSensei/chatHistorySibebar";
import SearchChatModal from "./searchChatPopup";
import ConfigurationSidebar from "./configuratinoSidebar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown, Mic } from "lucide-react";



interface ContentProps {
  showHistory: boolean;
  onCloseHistory: () => void;
   resetSignal?: number; 
   showSearchModal?: boolean;
   setShowSearchModal: (value: boolean) => void;
   showConfiguration?: boolean;
   setShowConfiguration: (value: boolean) => void;
   isSidebarExpanded?: boolean;

}

export default function Content({ showHistory, onCloseHistory, resetSignal, showSearchModal,setShowSearchModal, isSidebarExpanded, showConfiguration, setShowConfiguration }: ContentProps) {
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

const [isRecording, setIsRecording] = useState(false);
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const recognitionRef = useRef<any>(null);

const [prevResponses, setPrevResponses] = useState<any[]>([]);



useEffect(() => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("❌ SpeechRecognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => console.log("🎙️ Speech recognition started");
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    console.log("🎤 Received speech:", transcript);
    setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };
  recognition.onerror = (event: any) => {
    console.error("❌ Error:", event.error);
  };
  recognition.onend = () => {
    console.log("🛑 Speech recognition ended");
    setIsRecording(false); // ← update UI when it ends
  };

  recognitionRef.current = recognition;
}, []);

const toggleRecording = () => {
  const recognition = recognitionRef.current;
  if (!recognition) {
    alert("Speech Recognition not supported in this browser.");
    return;
  }

  if (isRecording) {
    recognition.stop(); // will trigger onend
  } else {
    try {
      recognition.start(); // manual trigger
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start:", err);
    }
  }
};







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
// Speech recognition setup





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


const handleSend = async () => {
  if (!inputText.trim()) return;

  const currentQuestion = inputText.trim();
  setInputText("");
  setIsGenerating(true);

  const tempAnswer: ChatItem = {
    question: currentQuestion,
    answer: <div className="flex items-center gap-2 text-black dark:text-white">
      <img src="/bot_icon.svg" alt="Loading" className="w-6 h-6" />
      <span>Generating...</span>
    </div>,
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

// useEffect(() => {
//   console.log("isLanguageSelected changed:", isLanguageSelected);
//   console.log("type of isLanguageSelected:", typeof isLanguageSelected);
// })
const getAnswerForQuestion = async (question: string): Promise<JSX.Element> => {
  try {
    const selectedLang = localStorage.getItem("selectedLanguage") ;

    const res = await axios.post("http://10.73.80.148:8081/api/getLLMInference", {
      langtype: selectedLang,
      query: question,
      prev_response: prevResponses,
    });

    const result = res?.data?.response;
    setPrevResponses((prev) => [...prev, result]);
    const displayText =
      typeof result === "string"
        ? result
        : result?.[Object.keys(result)[0]] || "No response found.";

    
    let processedText = displayText.replace(
      /\*\*(.+?):\*\*/g,
      `<span class="inline-block text-[blue] bg-[#ececec] dark:text-[#6DD8FF] dark:bg-[#2F2F2F] px-1 py-0.5 rounded font-semibold">$1:</span>`
    );

    // Then: Replace `PARAGRAPH-NAME` with blue highlight
    processedText = processedText.replace(
      /`([@a-zA-Z0-9_.-]+)`/g,
      `<span class="inline-block text-[blue] dark:text-[#6DD8FF] px-1 py-0.5 rounded font-mono">$1</span>`
    );

     const codeSnippets = result?.code_snippets || [];

    return (
       <div className="space-y-4 text-black dark:text-white">
         {/* LLM Response */}

         <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: processedText }}
        />

        {/* Accordion */}
        {codeSnippets.length > 0 && (
          <Accordion type="single" collapsible className="dark:bg-[#181818] bg-[#ccc] rounded-xl border dark:border-[#2E2E2E] border-[#f4f4f4]">
            <AccordionItem value="code-snippets">
              <AccordionTrigger
                className="flex items-center justify-between text-left text-[13px] font-semibold mt-[-10px] before:hidden"
              >
                <div className="flex items-center gap-2 text-[13px] pl-3 mt-1">
                  Code Snippet
                  <span className="text-md text-white bg-[#292828] px-2 rounded-xl text-[10px]">
                    {selectedLang}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180 ml-85" />
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-4">
                  {codeSnippets.map((snippet: string, idx: number) => (
                    <pre
                      key={idx}
                      className="bg-gray-100 dark:bg-gray-900 text-sm text-black dark:text-white p-3 rounded overflow-x-auto h-35 overflow-y-auto"
                    >
                      <code>{snippet}</code>
                    </pre>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
       
      </div>
    );
    } catch (error) {
      console.error("API error:", error);
      return (
        <p className="text-red-400 text-[13px]">
          Failed to fetch response from the server.
        </p>
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
        <div className="flex flex-col items-center overflow-y-auto px-6 pt-6 space-y-2 w-full h-[67vh]  ">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`${isSidebarExpanded ? "w-[10vw]" : "w-[44vw]"} space-y-2`}>
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
  <ConfigurationSidebar onClose={() => setShowConfiguration(false)} />)}
       
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
            className=" h-[12vh] dark:!bg-[#2E2D2D] !bg-[#ececec] rounded-xl border-none outline-none focus:outline-none focus:ring-0 pr-25 dark:text-white text-black placeholder:text-gray-400"
            placeholder="Ask anything..."
          />
           <button
            onClick={toggleRecording}
            className={`absolute right-14 top-1/2 transform -translate-y-1/2 
              h-8 w-8 flex items-center justify-center rounded-full 
              ${isRecording ? 'bg-[#b164ff] animate-pulse' : 'bg-[#1f1e1e]'} 
              transition-colors duration-300`}
          >
            <Mic className="w-5 h-4 text-white" />
          </button>
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
