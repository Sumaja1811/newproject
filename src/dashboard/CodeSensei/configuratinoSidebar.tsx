import React from "react";
import { Settings, X } from "lucide-react";

const ConfigurationSidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
     <aside className="fixed top-0 right-0 z-50 h-[100vh] w-70 dark:bg-[#0D0D0D] bg-[#ececec] border dark:border-[#3e3e3e] border-[#CED4DA] flex flex-col rounded-[10px]">
      <header className="flex items-center py-3 border-b border-[#3e3e3e]">
        {/* <History size={"17px"} className="ml-2"/> */}
        <Settings size={"17px"} className="ml-2 dark:text-[white] text-[black]" />
        <h3 className="text-md font-semibold dark:text-white text-black ml-2">Configuration</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white" style={{cursor:"pointer",marginLeft:"105px"}}>
          <X className="w-5 h-5 dark:text-white text-black" />
        </button>
      </header>
      

      {/* Content */}
      <div className="flex flex-col p-4 text-sm gap-1 mt-[-10px]">
        {/* Repo URL */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-gray-300 text-black">Repo URL</label>
          <input
            type="text"
            placeholder="https://sample.com/my-project/app..."
            className="px-3 py-2 rounded-md dark:bg-[#1e1e1e] bg-[white] text-[black] dark:text-[white] border dark:border-gray-600 placeholder-gray-500"
          />
        </div>

        {/* Local Code Base */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-gray-300 text-black">Local Code Base</label>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="/codebase"
              className="flex-grow px-3 py-2 rounded-l-md dark:bg-[#1e1e1e] bg-[white] text-[black] dark:text-[white] border dark:border-gray-600 placeholder-gray-500"
            />
            <button className="dark:bg-[#1e1e1e] bg-[white] px-3 py-2 rounded-r-md border border-l-0 dark:border-gray-600 hover:bg-[#3a3a3a]">
              📁
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-gray-300 text-black">Selected Language</label>
          <select className="py-2 rounded-md dark:bg-[#1e1e1e] bg-[white] text-black dark:text-white border dark:border-gray-600">
            <option>COBOL</option>
            <option>Java</option>
            <option>Python</option>
            <option>JavaScript</option>
          </select>
        </div>

        {/* LLM Provider */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-gray-300 text-black">LLM</label>
          <select className="py-2 rounded-md dark:bg-[#1e1e1e] bg-[white] text-black dark:text-white border dark:border-gray-600">
            <option>Open AI</option>
            <option>Anthropic</option>
            <option>Google</option>
          </select>
        </div>

        {/* Model */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-gray-300 text-black">Model</label>
          <select className="py-2 rounded-md dark:bg-[#1e1e1e] bg-[white] text-black dark:text-white border dark:border-gray-600">
            <option>GPT-4o</option>
            <option>GPT-4</option>
            <option>Claude 3</option>
            <option>Gemini</option>
          </select>
        </div>
      </div>
<div className="mt-27">
      <footer className="flex justify-center items-center w-full">
        <button
          onClick={onClose}
          className="w-full text-sm h-8 ml-2 mr-2 dark:bg-[#1a1a1a] bg-[white] dark:text-[white] text-[black] rounded-lg dark:hover:bg-[#333] border border-[gray] dark:border-[#3e3e3e]"
        >
          Save
        </button>
      </footer>
       <footer className="flex justify-center items-center py-2 w-full">
        <button
          onClick={onClose}
          className="w-full h-8 ml-2 text-sm mr-2 dark:bg-[#1a1a1a] bg-[white] dark:text-[white] text-[black] rounded-lg dark:hover:bg-[#333] border border-[gray] dark:border-[#3e3e3e]"
        >
          Close
        </button>
      </footer>
      </div>
    </aside>
  );
};

export default ConfigurationSidebar;
