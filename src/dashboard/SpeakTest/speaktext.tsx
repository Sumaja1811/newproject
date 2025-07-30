// 'use client';

// import React, { useState } from 'react';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '@/components/ui/tabs';
// import {
//   Card,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import VoiceTranscriber from './recorder';
// import axios from 'axios';
// import  Sitevalidator  from './sitevalidator';

// interface TabsDemoProps {
//   isSidebarCollapsed?: boolean;
// }
// export function TabsDemo({ isSidebarCollapsed }: TabsDemoProps) {
//   const [transcribedText, setTranscribedText] = useState('');
//  const [speakIframeUrl, setSpeakIframeUrl] = useState<string | null>(null);
//   const [speakLoading, setSpeakLoading] = useState(false);  
 

//   const [speakResponse, setSpeakResponse] = useState<{
//     output?: string;
//     error?: string;
//     status?: string;
//   } | null>(null);

//    const [siteTranscribedText, setSiteTranscribedText] = useState('');
//     const [siteIframeUrl, setSiteIframeUrl] = useState<string | null>(null);
//   const [siteLoading, setSiteLoading] = useState(false);
 
//   const [siteResponse, setSiteResponse] = useState<{
//     output?: string;
//     error?: string;
//     status?: string;
//   } | null>(null);

//  const handleProceed = async () => {
//   setSpeakResponse(null)
//   setSpeakLoading(true);
//   try {
//     const response = await axios.post('http://localhost:8000/run_voice_task/', {
//       input_text: transcribedText,
//       sender_id:"user1234"
//     });

//     // const { output, status, error } = response.data;

//     // Show Swagger only if successful
//     // if (status === 'Success') {
//     //   setIframeUrl('https://petstore.swagger.io/'); // or any other target
   
//     // } else {
//     //   setIframeUrl(null);
//     //   console.error('Voice task failed:', error || 'Unknown error');
//     // }

//     setSpeakResponse(response.data);
//   } catch (err) {
//     console.error('Request failed:', err);
//     setSpeakIframeUrl(null);
//   } finally {
//     setSpeakLoading(false);
//   }
// };



//  const handleSiteValidator = async () => {
//   setSiteResponse(null);
//   setSiteLoading(true);
//   try {
//     const response = await axios.post('http://localhost:8000/run_text_task/', {
//       input_text: siteTranscribedText,
//       sender_id:"user1234"
//     });

//     // const { output, status, error } = response.data;

//     // Show Swagger only if successful
//     // if (status === 'Success') {
//     //   setSiteIframeUrl('https://preview--smooth-service-solution.lovable.app/login'); // or any other target

//     // } else {
//     //   setSiteIframeUrl(null);
//     //   console.error('Voice task failed:', error || 'Unknown error');
//     // }

//     setSiteResponse(response.data);
//   } catch (err) {
//     console.error('Request failed:', err);
//     setSiteIframeUrl(null);
//   } finally {
//     setSiteLoading(false);
//   }
// };
// const dynamicwidth = isSidebarCollapsed ? 'w-[93vw]' : 'w-[77.6vw]';

//   return (
//     <div className="flex w-full max-w-sm flex-col gap-6">
//       <Tabs defaultValue="Speaktest">
//         <TabsList className="h-[7vh] w-[23vw] bg-[#2E2D2D] rounded-xl">
//           <TabsTrigger value="Speaktest" className="flex items-center "><span><svg xmlns="http://www.w3.org/2000/svg" width="14.839" height="15.097" viewBox="0 0 14.839 20.097">
//   <g id="mic" transform="translate(-30.21 -5.89)">
//     <path id="Path_66" data-name="Path 66" d="M64.743,18.9a3.948,3.948,0,0,0,3.943-3.943V10.023a3.943,3.943,0,0,0-7.887,0v4.929A3.948,3.948,0,0,0,64.743,18.9Zm-2.629-8.873a2.629,2.629,0,0,1,5.258,0v4.929a2.629,2.629,0,0,1-5.258,0Z" transform="translate(-27.114)" fill="#fff" stroke="#fff" stroke-width="0.38"/>
//     <path id="Path_67" data-name="Path 67" d="M43.545,66.88v2.3a5.915,5.915,0,1,1-11.83,0v-2.3H30.4v2.3a7.239,7.239,0,0,0,6.572,7.2v3.645h1.314V76.38a7.239,7.239,0,0,0,6.572-7.2v-2.3Z" transform="translate(0 -54.228)" fill="#fff" stroke="#fff" stroke-width="0.38"/>
//   </g>
// </svg></span><span style={{marginLeft:"8px"}}>Speak Test</span></TabsTrigger>

//           <TabsTrigger value="SiteValidator"  className="flex items-center" ><span><svg xmlns="http://www.w3.org/2000/svg" width="14.197" height="15.368" viewBox="0 0 23.197 22.368">
//   <g id="cloud-monitoring" transform="translate(-12 -17.999)">
//     <path id="Path_68" data-name="Path 68" d="M33.54,33.942v4.971H13.657V25.657h5.8V24h-5.8A1.657,1.657,0,0,0,12,25.657V38.912a1.657,1.657,0,0,0,1.657,1.657h6.628v3.314H16.971V45.54H30.226V43.883H26.912V40.569H33.54A1.657,1.657,0,0,0,35.2,38.912V33.942Zm-8.285,9.942H21.942V40.569h3.314Z" transform="translate(0 -5.172)" fill="#fff"/>
//     <path id="Path_69" data-name="Path 69" d="M71.8,30.426h-.008a.828.828,0,0,1-.788-.6l-1.485-5.2H66V22.97h4.142a.828.828,0,0,1,.8.6l.89,3.115,2.493-8.1A.84.84,0,0,1,75.113,18a.812.812,0,0,1,.786.567l1.467,4.4h4.374v1.657H76.77a.829.829,0,0,1-.786-.567l-.839-2.518-2.553,8.3A.828.828,0,0,1,71.8,30.426Z" transform="translate(-46.544 0)" fill="#fff"/>
//   </g>
// </svg></span><span style={{marginLeft:"10px"}}>Site Validator</span></TabsTrigger>
//         </TabsList>

//         <TabsContent value="Speaktest">
//           <Card className={`bg-[#181818] ${dynamicwidth} mt-2 transition-all duration-300 h-[12rem]`}>
//             <CardHeader>
//               <CardTitle className="text-white" style={{marginTop:"-14px", marginBottom:"5px",fontFamily:"fantasy", fontSize:"13px"}} >Let's get started</CardTitle>
//               <VoiceTranscriber
//                 transcribedText={transcribedText}
//                 setTranscribedText={setTranscribedText}
//               />
//             </CardHeader>

//             <CardFooter className="flex flex-col items-start gap-2 mt-[-11px]">
//               <Button onClick={handleProceed} disabled={speakLoading}>
//                 {speakLoading ? 'Loading...' : 'Proceed'}
//               </Button>

//               {/* {speakIframeUrl ? (
//                 <iframe
//                   src={speakIframeUrl}
//                   title="Swagger API Viewer"
//                   width="100%"
//                   height="500px"
//                   className="rounded-md border"
//                 />
//               ) : (
//                 !speakLoading && (
//                   <p className="text-sm text-muted-foreground">
//                     {/* Swagger UI will appear here after clicking Proceed. 
//                   </p>
//                 )
//               )} */}

//               {speakResponse?.output && (
//                 <div className="bg-gray-900 text-white p-4 rounded-md w-full mt-4 max-h-[230px] overflow-auto text-sm">
//                   <h3 className="font-semibold mb-2">Automation Output:</h3>
//                   <pre className="whitespace-pre-wrap">
//                     {typeof speakResponse.output === 'object'
//                       ? JSON.stringify(speakResponse.output, null, 2)
//                       : speakResponse.output.replace(/\\n/g, '\n')
//                       .replace(/},\s*/g, '},\n\n')
//                           // .replace(/(\{|\[)/g, '\n$1')
//                           // .replace(/(\}|\])/g, '$1\n')
//                           .replace(/,/g, ',\n')}
//                   </pre>
//                 </div>
//               )}
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="SiteValidator">
//           <Card className={`bg-[#181818] ${dynamicwidth} h-full mt-2 transition-all duration-300 h-[12rem]`}>
//             <CardHeader>
//               <CardTitle style={{marginTop:"-14px", marginBottom:"5px",fontFamily:"fantasy", fontSize:"13px"}} >Enter Task Instructions</CardTitle>
//               <Sitevalidator siteTranscribedText={siteTranscribedText} setSiteTranscribedText={setSiteTranscribedText} />
//             </CardHeader>
//             <CardFooter className="flex flex-col items-start gap-2 mt-[-11px]">
//               <Button onClick={handleSiteValidator} disabled={siteLoading}>
//                 {siteLoading ? 'Loading...' : 'Proceed'}
//               </Button>

//              {siteResponse?.output && (
//   <div className="bg-gray-900 text-white p-4 rounded-md w-full mt-4 max-h-[230px] overflow-auto text-sm">
//     <h3 className="font-semibold mb-2">Automation Output:</h3>
//     <pre className="whitespace-pre-wrap">
//       {typeof siteResponse.output === 'object'
//         ? JSON.stringify(siteResponse.output, null, 2)
//         : siteResponse.output.replace(/\\n/g, '\n')
//          .replace(/},\s*/g, '},\n\n')
//             // .replace(/(\{|\[)/g, '\n$1')
//             // .replace(/(\}|\])/g, '$1\n')
//             .replace(/,/g, ',\n')}
//     </pre>
//   </div>
// )}
//             </CardFooter>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// export default TabsDemo;


'use client';

import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VoiceTranscriber from './recorder';
import axios from 'axios';
import Sitevalidator from './sitevalidator';
import { Input } from '@/components/ui/input';

import { ArrowDownAZ, ArrowUpAZ, Car, ChevronDown, Mic, Scroll } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ScrollBar } from '@/components/ui/scroll-area';
import './speaktext.css'
import GenericTable from './jiratasks';

interface TabsDemoProps {
  isSidebarCollapsed?: boolean;
}

/* 
  Moved global scrollbar styles to a CSS file (e.g., speaktext.css) and import it here:
  import './speaktext.css';
*/


export function TabsDemo({ isSidebarCollapsed }: TabsDemoProps) {
  const [transcribedText, setTranscribedText] = useState('');
  const [speakIframeUrl, setSpeakIframeUrl] = useState<string | null>(null);
  const [speakLoading, setSpeakLoading] = useState(false);
  const [speakResponse, setSpeakResponse] = useState<{
    output?: string;
    error?: string;
    status?: string;
  } | null>(null);

  // const [inputText, setInputText] = useState<string>('');
  const [siteTranscribedText, setSiteTranscribedText] = useState('');
  const [siteIframeUrl, setSiteIframeUrl] = useState<string | null>(null);
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteResponse, setSiteResponse] = useState<{
    output?: string;
    error?: string;
    status?: string;
  } | null>(null);

  const [inputText, setInputText] = useState<string>('');

  const [jiraInput, setJiraInput] = useState('');
  const [jiraLoading, setJiraLoading] = useState(false);
  const [jiraResponse, setJiraResponse] = useState<JiraApiResponse | null>(null);
const columns = jiraResponse?.tasks?.length
  ? Object.keys(jiraResponse.tasks[0])
  : ['key', 'summary', 'status', 'priority', 'created', 'updated', 'description'];
  interface JiraTask {
  id: string;
  key: string;
  summary: string;
  status: string;
  priority: string;
  created: string;
  updated: string;
  description: any; // You can refine this further if needed
}

interface JiraApiResponse {
  tasks: JiraTask[];
  status: string;
}

// jirakeytest states
const [jiraProcessedTasks, setJiraProcessedTasks] = useState<any[] | null>(null);
const [jiraTableLoading, setJiraTableLoading] = useState(false);
const [jiraTestOutput, setJiraTestOutput] = useState<string>('');

// const [jiraResponse, setJiraResponse] = useState<JiraApiResponse | null>(null);


const [searchTerm, setSearchTerm] = useState('');
 const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'priority' | 'status' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

const normalizeValue = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'object') {
    if (val?.content?.[0]?.content?.[0]?.text) {
      return val.content.flatMap((c: any) =>
        (c.content || []).map((cc: any) => cc.text || '')
      ).join(' ');
    }
    return JSON.stringify(val);
  }
  return String(val);
};

const jiraTasks: JiraTask[] = jiraResponse?.tasks ?? [];

const filteredTasks = jiraTasks.filter((task) =>
  columns.some((col) => {
    const val = normalizeValue(task[col as keyof JiraTask]);
    return val.toLowerCase().includes(searchTerm.toLowerCase());
  })
);

if (sortField) {
    filteredTasks.sort((a, b) => {
      const valA = a[sortField].toLowerCase();
      const valB = b[sortField].toLowerCase();
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

const toggleCheckbox = (value: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const toggleSort = (field: 'priority' | 'status') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSpeakTest = async () => {
 const finalInput = transcribedText?.trim() || inputText?.trim();
if (!finalInput) return;

  setSpeakLoading(true);
  try {
    const response = await axios.post('http://localhost:8000/run_voice_task/', {
      input_text: finalInput,
      sender_id: 'user1234',
    });

    setSpeakResponse(response.data);
  } catch (err) {
    console.error('Request failed:', err);
    setSpeakIframeUrl(null);
  } finally {
    setSpeakLoading(false);
  }
};
  const handleSiteValidator = async () => {
    if (!siteTranscribedText.trim()) return;
    setSiteLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/run_text_task/', {
        input_text: siteTranscribedText,
        sender_id: 'user1234',
      });

      setSiteResponse(response.data);
    } catch (err) {
      console.error('Request failed:', err);
      setSiteIframeUrl(null);
    } finally {
      setSiteLoading(false);
    }
  };

  const handleJiraTasks = async () => {
    setJiraLoading(true);
   
    try {
      const response = await axios.post('http://localhost:8000/jira_tasklist/', {
        project_id: jiraInput,
      });

      setJiraResponse(response.data);
    } catch (err) {
      console.error('Request failed:', err);
    } finally {
      setJiraLoading(false);
    }
  };

 
 const handleJiraKey = async (key: string): Promise<any[]> => {
  console.log('📨 handleJiraKey called with:', key);
  setJiraTableLoading(true);
  setJiraTestOutput(''); // Clear previous output
  try {
    const response = await fetch('http://127.0.0.1:8000/run_jira_test/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        issue_key: key,
        sender_id: 'string',
      }),
    });

    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();

    // Extract test_output from response
    const output = Array.isArray(data)
      ? data.map(item => item.test_output).join('\n\n')
      : data?.test_output || '';

    setJiraTestOutput(output); // Save output as plain text
    return data;
  } catch (error) {
    console.error('Error:', error);
    setJiraTestOutput('Error retrieving test output.');
    return [];
  } finally {
    setJiraTableLoading(false);
  }
};

  const dynamicwidth = isSidebarCollapsed ? 'w-[93.15vw]' : 'w-[77.75vw]';
  const dynamicHeight = isSidebarCollapsed ? 'h-[253px]' : 'h-[238px]';
  const dynamicHeightJira = isSidebarCollapsed ? 'h-[373px]' : 'h-[359px]';
  const dynamicActivityLogHeight = isSidebarCollapsed ? 'h-[327px]' : 'h-[312px] ';
  const dynamicTabsWidth = isSidebarCollapsed ? 'w-[93vw]' : 'w-[77.7vw]'

  return (
    <div className="flex w-full flex-col">
      <Tabs defaultValue="Speaktest">
        <TabsList
          className={`flex flex-row gap-2 items-center px-2 py-1 h-auto bg-[#ececec] dark:bg-[#2E2D2D] rounded-xl overflow-x-auto`}
        >
          <TabsTrigger
            value="Speaktest"
            className="flex items-center justify-center px-4 py-2 rounded-full whitespace-nowrap text-white w-full"
          >
            <Mic className="w-4 h-4" />
            <span className="ml-2">Speak Test</span>
          </TabsTrigger>

          <TabsTrigger
            value="SiteValidator"
            className="flex items-center justify-center px-4 py-2 rounded-full whitespace-nowrap bg-[#2e2e2e] text-white w-full"
          >
            <img src="/siteval.svg" className="w-4 h-4" />
            <span className="ml-2">Site Validator</span>
          </TabsTrigger>

          <TabsTrigger
            value="JiraTasks"
            className="flex items-center justify-center  px-4 py-2 rounded-full whitespace-nowrap bg-[#2e2e2e] text-white w-full"
          >
            <img src="/jira_icon.svg" className='w-4 h-4' />
            <span className="ml-2">Jira Tasks</span>
          </TabsTrigger>
        </TabsList>


        <TabsContent value="Speaktest">
          <Card className={`bg-[#ececec] dark:bg-[#181818] border border-[#ccc] dark:border-[#444] ${dynamicwidth} mt-2 transition-all duration-300 h-[11rem]`}>
            <CardHeader>
              <CardTitle  style={{ marginTop: '-14px', marginBottom: '5px', fontFamily: 'fantasy', fontSize: '13px' }}>
                Let's get started
              </CardTitle>
              <VoiceTranscriber
                transcribedText={transcribedText}
                setTranscribedText={setTranscribedText}
                inputText={inputText}
                setInputText={setInputText}
              />
            </CardHeader>

            <CardFooter className="flex flex-col items-start gap-2 mt-[-12px]">
              
              <Button className='bg-[#b164FF] dark:bg-white dark:hover:bg-[#ececec] tracking-wide hover:bg-[#9b4cd6] cursor-pointer'
                onClick={handleSpeakTest}
              disabled={speakLoading || !(transcribedText?.trim() || inputText?.trim())}
              >
                {speakLoading ? 'Loading...' : 'Proceed'}
              </Button>
            </CardFooter>
          </Card>
            {speakResponse?.output && (
              <Card className={`${dynamicHeight} ${dynamicwidth} mt-4 overflow-x-auto scrollbar-thin p-0 dark:bg-[#1c1e28] border border-[#ccc] dark:border-[#444] bg-[#ececec] text-black dark:text-white p-4 rounded-xl text-sm`}>
                {/* <div className="bg-gray-900 text-white p-4 rounded-md w-full mt-4 max-h-[250px] overflow-auto text-sm"> */}
                  <p className="font-semibold p-0">Activity Log:</p>
                  <pre className="whitespace-pre-wrap mt-[-17px]">
                    {typeof speakResponse.output === 'object'
                      ? JSON.stringify(speakResponse.output, null, 2)
                      : speakResponse.output
                          .replace(/\\n/g, '\n')
                          .replace(/},\s*/g, '},\n\n')
                          .replace(/,/g, ',\n')}
                  </pre>
                {/* </div> */}
              </Card>
              )}
      
     
        </TabsContent>

        <TabsContent value="SiteValidator">
          <Card className={`bg-[#ececec] dark:bg-[#181818] border border-[#ccc] dark:border-[#444] ${dynamicwidth} mt-2 transition-all duration-300 h-[11rem]`}>
            <CardHeader>
              <CardTitle style={{ marginTop: '-14px', marginBottom: '5px', fontFamily: 'fantasy', fontSize: '13px' }}>
                Enter Task Instructions
              </CardTitle>
              <Sitevalidator siteTranscribedText={siteTranscribedText} setSiteTranscribedText={setSiteTranscribedText} />
            </CardHeader>

            <CardFooter className="flex flex-col items-start gap-2 mt-[-11px]">
              <Button className='cursor-pointer bg-[#b164FF] dark:bg-white dark:hover:bg-[#ececec] tracking-wide hover:bg-[#9b4cd6]' onClick={handleSiteValidator} disabled={siteLoading || !siteTranscribedText.trim()}>
                {siteLoading ? 'Loading...' : 'Proceed'}
              </Button>
              </CardFooter>
          </Card>
            {siteResponse?.output && (
              <Card className={`${dynamicHeight} ${dynamicwidth} mt-4 overflow-x-auto scrollbar-thin p-0 dark:bg-[#1c1e28] border border-[#ccc] dark:border-[#444] bg-[#ececec] text-balck dark:text-white p-4 rounded-xl text-sm`}>
                  <h3 className="font-semibold">Activity Log:</h3>
                  <pre className="whitespace-pre-wrap mt-[-17px]">
                    {typeof siteResponse.output === 'object'
                      ? JSON.stringify(siteResponse.output, null, 2)
                      : siteResponse.output
                          .replace(/\\n/g, '\n')
                          .replace(/},\s*/g, '},\n\n')
                          .replace(/,/g, ',\n')}
                  </pre>
              </Card>
            )}
        </TabsContent>

      <TabsContent value="JiraTasks">
          <div className="flex flex-row gap-5 mb-4 mt-2 rounded-xl">
            <Input
              className={`${dynamicwidth}`}
              value={jiraInput}
              onChange={(e) => setJiraInput(e.target.value)}
              placeholder="e.g., TESTING"
            />
            <Button
              onClick={handleJiraTasks}
              disabled={!jiraInput.trim() || jiraLoading}
              className="bg-[#B164FF] text-white hover:bg-[#9b4cd6] transition-colors duration-200"
            >
              {jiraLoading ? 'Loading...' : 'Proceed'}
            </Button>
          </div>

          {(searchTerm.trim().length > 0 || filteredTasks.length > 0) && (
            <ScrollArea>
              <Card className={`${dynamicHeightJira} w-full p-0 h-[385px]`}>
                
                <div className="text-xs font-semibold tracking-wide px-3 text-white flex flex-wrap gap-4 justify-between items-center mt-3">
                  <span className="text-black dark:text-white">Task List (Jira)</span>
                  <div className="flex flex-wrap items-center gap-2">
                     <div className="relative">
                      <button
                        onClick={() => setShowStatusDropdown(prev => !prev)}
                        className="px-2 py-1 text-sm border rounded-md bg-white text-black dark:text-white dark:bg-black flex items-center gap-1"
                      >
                        Status <ChevronDown size={12} />
                      </button>
                      {showStatusDropdown && (
                        <div className="absolute z-50 bg-[grey] dark:bg-[#1c1e28] shadow-lg rounded-md p-2 mt-1">
                          {['To Do', 'In Progress', 'Done'].map((status) => (
                            <label key={status} className="block text-sm">
                              <input
                                type="checkbox"
                                checked={selectedStatus.includes(status)}
                                onChange={() => toggleCheckbox(status, selectedStatus, setSelectedStatus)}
                                className="mr-2"
                              />
                              {status}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowPriorityDropdown(prev => !prev)}
                        className="px-2 py-1 text-sm border rounded-md bg-white text-black dark:text-white dark:bg-black flex items-center gap-1"
                      >
                        Priority <ChevronDown size={12} />
                      </button>
                      {showPriorityDropdown && (
                        <div className="absolute z-50 bg-[grey] dark:bg-[#1c1e28] shadow-lg rounded-md p-2 mt-1">
                          {['High', 'Medium', 'Low'].map((priority) => (
                            <label key={priority} className="block text-sm">
                              <input
                                type="checkbox"
                                checked={selectedPriority.includes(priority)}
                                onChange={() => toggleCheckbox(priority, selectedPriority, setSelectedPriority)}
                                className="mr-2"
                              />
                              {priority}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <Input
                      style={{ width: '200px' }}
                      type="text"
                      placeholder="Search tasks..."
                      className="px-3 py-1 border rounded-md text-black dark:text-white dark:bg-black"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                   
                  </div>
                </div>

                {jiraTableLoading ? (
                  <div className="text-center text-muted-foreground py-2 animate-pulse text-black dark:text-white text-md">
                    Loading...
                  </div>
                ) : jiraTestOutput ? (
                  <div className={`${dynamicActivityLogHeight} dark:bg-[#1c1e28] bg-[#ececec] text-black dark:text-white w-full overflow-auto text-sm px-3 pt-2 rounded-b-lg`}>
                    <h3 className="font-semibold">Activity Log:</h3>
                    <pre className="whitespace-pre-wrap pt-2">{jiraTestOutput}</pre>
                  </div>
                )  :
                 (
                  <div className="overflow-y-auto mt-[-15px]">
                    
                     <GenericTable
                        isSidebarCollapsed={isSidebarCollapsed}
                        onProceed={handleJiraKey}
                        columns={columns}
                        data={filteredTasks}
                        searchTerm={searchTerm}
                      />
                  </div>
                )}
              </Card>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
           )}
        </TabsContent>

      </Tabs>
    </div>
  );
}

export default TabsDemo;
