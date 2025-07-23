// import {
//   Dialog,
//   DialogContent,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Search, X } from "lucide-react";

// interface SearchChatModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSearch?: (text: string) => void; // Optional callback for search action
// }

// export default function SearchChatModal({ open, onClose }: SearchChatModalProps) {
//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent
//         className="border border-none bg-white dark:bg-[#161A26] text-black dark:text-white p-0 h-70 gap-0 [&>button:last-child]:hidden"
//       >
//         {/* Custom Close Button */}
//         <DialogClose asChild>
//           <button
//             className="absolute right-3 top-2.5 text-gray-400 hover:text-black dark:hover:text-white"
//             aria-label="Close"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </DialogClose>

//         <div>
//           <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-2 py-2.5">
//               <Search className="w-4 h-4" />
//               <span className="px-2 text-sm tracking-wider">Search Chat</span>
//         </div>
//                       <Input placeholder="Search here.." className="mt-4 ml-3 mr-3 w-[35.7vw] outline-none border border-none !bg-[#323a50]" />

//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, SendHorizontal, X } from "lucide-react";
import { useState, useMemo } from "react";
import { type ChatItem } from "@/dashboard/CodeSensei/chatHistorySibebar";

interface SearchChatModalProps {
  open: boolean;
  onClose: () => void;
  chatHistory: ChatItem[];
   recentSearches: string[];
  setRecentSearches: React.Dispatch<React.SetStateAction<string[]>>;
}

// Helper: Extract plain text from JSX answer
function extractTextFromJSX(node: any): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return node.toString();
  if (Array.isArray(node)) return node.map(extractTextFromJSX).join(" ");
  if (node && typeof node === "object" && node.props) {
    return extractTextFromJSX(node.props.children);
  }
  return "";
}

// Highlight matching text
function highlightText(text: string, keyword: string) {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={index} className="bg-yellow">
        {part}
      </mark>
    ) : (
      part
    )
  );
}


export default function SearchChatModal({
  open,
  onClose,
  chatHistory,
    recentSearches,
    setRecentSearches
}: SearchChatModalProps) {
    const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState("");

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   setSearchText(e.target.value);
// };

useEffect(() => {
  const saved = localStorage.getItem("recentSearches");
  if (saved) {
    setRecentSearches(JSON.parse(saved));
  }
}, []);

// Save to localStorage every time it updates
useEffect(() => {
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}, [recentSearches]);


// Called when user presses Enter
// const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
//   if (e.key === "Enter") {
//     const trimmed = searchText.trim().toLowerCase();
//     if (trimmed && !recentSearches.includes(trimmed)) {
//       setRecentSearches((prev) => {
//         const updated = [trimmed, ...prev.filter((item) => item !== trimmed)];
//         return updated.slice(0, 5); // Keep latest 5
//       });
//     }
//   }
// };



const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setInputText(value);

  if (searchText && value.trim() === "") {
    setSearchText(""); // fallback to recent searches
  }
};


const handleSubmitSearch = () => {
  const trimmed = inputText.trim().toLowerCase();
  if (trimmed) {
    setSearchText(trimmed);

    // Always move the term to top (whether it's new or existing)
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((item) => item !== trimmed)];
      return updated.slice(0, 3); // Limit to latest 5
    });
  }
};


const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSubmitSearch();
  }
};



 const filteredChats = useMemo(() => {
  const keyword = searchText.trim().toLowerCase();
  if (!keyword) return [];

  return chatHistory.filter((chat) => {
    const questionMatch = chat.question.toLowerCase().includes(keyword);

    const answerText =
      typeof chat.answer === "string"
        ? chat.answer
        : extractTextFromJSX(chat.answer);

    const answerMatch = answerText.toLowerCase().includes(keyword);

    return questionMatch || answerMatch;
  });
}, [searchText, chatHistory]);



  return (
    <Dialog open={open} onOpenChange={onClose}>
     <DialogContent
  className="h-[55vh] border-none bg-white dark:bg-[#161A26] text-black dark:text-white p-0 [&>button:last-child]:hidden"
>
  {/* Custom Close Button */}
  <DialogClose asChild>
    <button
      className="absolute right-3 top-2.5 text-gray-400 hover:text-black dark:hover:text-white"
      aria-label="Close"
    >
      <X className="w-5 h-5" />
    </button>
  </DialogClose>

  <div className="space-y-0">
    {/* Header */}
    <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3 py-2">
      <Search className="w-4 h-4" />
      <span className="ml-2 text-sm tracking-wider">Search Chat</span>
    </div>

    {/* Input */}
    <div className="relative px-3 py-2">
     <Input
  value={inputText}
    onChange={handleInputChange}
    onKeyDown={handleKeyDown}
  placeholder="Search here..."
  className="dark:!bg-[#323a50] !bg-gray-300 dark:text-white text-black text-sm mt-2"
/>
    <div className="absolute right-5 top-1/2 -translate-y-1" onClick={handleSubmitSearch}>
        <SendHorizontal className="h-4 w-5 dark:text-[lightgrey] text-gray-800" />
    </div>
    </div>
   

   {searchText ? (
  <div className="px-4 pt-1 overflow-y-auto h-[37vh]">
   {filteredChats.length > 0 ? (
  <div className="mb-4">
    <h4 className="text-sm dark:text-gray-400 text-[black] mb-2">Search Results ({filteredChats.length})</h4>
     <div className="space-y-2">
          {filteredChats.map((chat, index) => (
            <div key={index} className="dark:bg-[#313a50] bg-gray-300 px-3 rounded-lg overflow-y-auto">
              <p className="text-sm dark:text-white text-black ">
                {highlightText(chat.question, searchText)}
              </p>
              <p className="text-sm mt-1 dark:text-white text-black ">
                {typeof chat.answer === "string"
                  ? <div>{highlightText(chat.answer, searchText)}</div>
                  : highlightText(extractTextFromJSX(chat.answer), searchText)}
              </p>
            </div>
          ))}
        </div>
  </div>
) : (
    <div className="text-sm dark:text-[white] text-[black]">
        No results found for "<span className="font-semibold">{searchText}</span>"
    </div>
)}

  </div>
) : 
    recentSearches.length > 0 && (
  <div className="px-4">
    <h4 className="text-sm dark:text-gray-400 text-[black] mb-2">Recent Searches</h4>
    <ul className="space-y-2">
      {recentSearches.map((item, idx) => (
        <li
          key={idx}
          className="text-sm dark:text-white  text-[black] dark:bg-[#323a50] bg-gray-300 flex justify-between items-center px-3 py-2 rounded-md"
        >
          <span>{item}</span>
          <button
            onClick={() =>
              setRecentSearches((prev) => prev.filter((_, i) => i !== idx))
            }
            className="dark:text-gray-400 text-[black] dark:hover:text-gray-100 hover:text-gray-800"
          >
            {/* ✖ */}
             <X className="w-5 h-4" />
          </button>
        </li>
      ))}
    </ul>
  </div>
)}



     {/* {!searchText.trim() && recentSearches.length > 0 && (
  <div className="px-4 pb-2 pt-1 text-sm">
    <p className="text-xs text-muted-foreground mb-1">Recent Searches:</p>
    <ul className="space-y-1">
      {recentSearches.map((term, index) => (
        <li key={index}>
          <button
            className="text-blue-400 hover:underline text-sm"
            onClick={() => setSearchText(term)}
          >
            {term}
          </button>
        </li>
      ))}
    </ul>
  </div>
)} */}

  </div>
</DialogContent>

    </Dialog>
  );
}
