// "use client";

// import {Trash, X } from "lucide-react";
// import { History } from "lucide-react";

// export interface ChatItem {
//   question: string;
//   answer: string | React.ReactElement;
// }

// interface ChatHistorySidebarProps {
//   chatHistory: ChatItem[];
//   onClose: () => void;
//   onDelete: (index: number) => void;
// }

// export default function ChatHistorySidebar({
//   chatHistory,
//   onClose,
//   onDelete
// }: ChatHistorySidebarProps) {

//   return (
//     <aside className="fixed top-0 right-0 z-50 h-[100vh] w-70 bg-[#0D0D0D] border border-[#3e3e3e] flex flex-col rounded-[10px]">
//       <header className="flex items-center py-3 border-b border-[#3e3e3e]">
//         <History size={"17px"} className="ml-2"/>
//         <h3 className="text-md font-semibold text-white ml-2">Chat History</h3>
//         <button onClick={onClose} aria-label="Close" style={{cursor:"pointer",marginLeft:"110px"}}>
//           <X className="w-5 h-5 text-white" />
//         </button>
//       </header>

//       <div className="flex-1 overflow-y-auto space-y-2 px-2 pb-4 mt-2">
//         {chatHistory.length === 0 ? (
//           <p className="text-sm text-gray-400">No questions yet.</p>
//         ) : (
//           chatHistory.map((h, i) => (
//              <div key={i} className="flex justify-between items-center text-sm text-gray-300 bg-[#3e3e3e] p-2 rounded-lg hover:bg-[#4e4e4e] transition-colors">
//     <p className="truncate w-[85%]" title={h.question}>
//       {h.question}
//     </p>
//     <button onClick={() => onDelete(i)} className="text-gray-400 hover:text-red-500">
//       <Trash className="w-4 h-4" />
//     </button>
//   </div>
//           ))
//         )}
//       </div>
//       <footer className="flex justify-center items-center py-2 w-full">
//         <button
//           onClick={onClose}
//           className="w-full h-8 ml-2 mr-2  bg-[#1a1a1a] text-white rounded-lg hover:bg-[#333] border border-[#3e3e3e]"
//         >
//           Close
//         </button>
//         </footer>
//     </aside>
//   );
// }


"use client";
import React, { useState } from "react";
import { Trash, X, History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

export interface ChatItem {
  question: string;
  answer: string | React.ReactElement;
  response?: {
    llm_response: string;
}
}

export interface ChatSession {
  id: string;
  messages: ChatItem[];
  createdAt: string;
}

interface ChatHistorySidebarProps {
  chatSessions: ChatSession[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onSelectSession: (id: string) => void;
}

export default function ChatHistorySidebar({
  chatSessions,
  onClose,
  onDelete,
  onSelectSession,
}: ChatHistorySidebarProps) {
    const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  return (
    <aside className="fixed top-0 right-0 z-50 h-[100vh] w-70 dark:bg-[#0D0D0D] bg-[#ececec] border dark:border-[#3e3e3e] border-[#CED4DA] flex flex-col rounded-[10px]">
      <header className="flex items-center py-3 border-b border-[#3e3e3e]">
        <History size={"17px"} className="ml-2 dark:text-white text-[black]" />
        <h3 className="text-md font-semibold dark:text-white text-[black] ml-2">Chat History</h3>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ cursor: "pointer", marginLeft: "110px" }}
        >
          <X className="w-5 h-5 dark:text-white text-[black]" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto space-y-2 px-2 pb-4 mt-2">
        {/* {chatSessions.length === 0 ? (
          <p className="text-sm text-gray-400">No chat sessions yet.</p>
        ) : (
          chatSessions.map((session) => (
            <div
              key={session.id}
              className="flex justify-between items-center text-sm text-gray-300 bg-[#3e3e3e] p-2 rounded-lg hover:bg-[#4e4e4e] transition-colors cursor-pointer"
              onClick={() => onSelectSession(session.id)}
            >
              <p
                className="truncate w-[85%]"
                title={session.messages[0]?.question || "Untitled Chat"}
              >
                {session.messages[0]?.question || "Untitled Chat"}
              </p>
              <button
  onClick={(e) => {
    e.stopPropagation(); // prevent selecting the session
    setDeleteSessionId(session.id); // trigger confirmation popup
  }}
  
  className="text-gray-400 hover:text-red-500"
>
  <Trash className="w-4 h-4" />
</button>
            </div>
          ))
        )} */}

        {chatSessions.length === 0 ? (
            <p className="text-sm dark:text-gray-400 text-black">No chat sessions yet.</p>
            ) : (
                 chatSessions.map((session) => (
                     <div key={session.id} className="flex justify-between items-center text-sm dark:text-gray-300 text-black dark:bg-[#3e3e3e] bg-white p-2 rounded-lg dark:hover:bg-[#4e4e4e] hover:bg-[#b1afaf] transition-colors cursor-pointer">
                    <div
                    className="cursor-pointer"
                    onClick={() => onSelectSession(session.id)}
                >
                    {session.messages?.[0]?.question || "Untitled Chat"}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // prevent selecting the session
                        setDeleteSessionId(session.id); // trigger confirmation popup
                    }}
                    className="dark:text-gray-400 text-black dark:hover:text-gray-100 "
                    >
                    <Trash className="w-4 h-4" />
            </button>
        </div>
    ))
            )}
      </div>

      <footer className="flex justify-center items-center py-2 w-full">
        <button
          onClick={onClose}
          className="w-full h-8 ml-2 mr-2 dark:bg-[#1a1a1a] bg-[white] dark:text-white text-black rounded-lg dark:hover:bg-[#333] hover:bg-[#b1afaf] border dark:border-[#3e3e3e] border-[#CED4DA]"
        >
          Close
        </button>
      </footer>

     {deleteSessionId && (
  <Dialog open={!!deleteSessionId} onOpenChange={() => setDeleteSessionId(null)}>
    <DialogContent className="bg-[#1a1a1a] border border-[#3e3e3e] text-white sm:max-w-[320px] rounded-2xl">
      <DialogHeader>
        <p className="text-sm">Are you sure you want to delete this conversation?</p>
      </DialogHeader>
      <DialogFooter className="flex justify-end space-x-3">
        <button
          onClick={() => setDeleteSessionId(null)}
          className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onDelete(deleteSessionId); // delete the session
            setDeleteSessionId(null); // close confirmation popup
            onClose(); // close the sidebar (to show initial state)
          }}
          className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-500"
        >
          Delete
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}

    </aside>
  );
}
