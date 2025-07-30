// import React, { useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { ChevronDown, ChevronUp } from 'lucide-react';

// interface GenericTableProps {
//   data: any[];
//   columns: string[];
//   onProceed: (key: string) => Promise<any[]>;
//    isSidebarCollapsed?: boolean;
// }

// const getFlatValue = (value: any): string => {
//   if (value === null || value === undefined) return '—';
//   if (typeof value === 'object') {
//     if (value?.content?.[0]?.content?.[0]?.text) {
//       return value.content
//         .flatMap((c: any) =>
//           (c.content || []).map((cc: any) => cc.text || '')
//         )
//         .join(' ');
//     }
//     return JSON.stringify(value);
//   }
//   return String(value);
// };

// const formatDate = (dateString: string | null | undefined): string => {
//   if (!dateString) return '—';
//   const cleaned = dateString.replace('T', ' ').split('+')[0];
//   return cleaned.slice(0, 19); // Keep only YYYY-MM-DD HH:mm:ss
// };

// const GenericTable: React.FC<GenericTableProps> = ({
//   data,
//   columns,
//   onProceed,
//   isSidebarCollapsed, // Default value for sidebar collapsed state
// }) => {
//   const [expandedRows, setExpandedRows] = useState<number[]>([]);
//   const [loadingRow, setLoadingRow] = useState<number | null>(null);
//   const [tableData, setTableData] = useState(data);

//   const toggleRow = (index: number) => {
//     setExpandedRows((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };

//   if (!tableData || tableData.length === 0)
//     return <p className="text-white">No data available</p>;

//     const dynamicwidth = isSidebarCollapsed ? 'w-[91.3vw] min-w-[1000px]' : 'w-[76vw] min-w-[1020px]';
//     const dynamicHeight = isSidebarCollapsed ? 'h-[350px]' : 'h-[238px]';


//   return (
//     <Table className={`table-fixed mt-0 ${dynamicwidth} ${dynamicHeight}`}>
//       <TableHeader>
//         <TableRow>
//           {columns.map((header) => (
//             <TableHead key={header} className="capitalize">
//               {header.replace(/_/g, ' ')}
//             </TableHead>
//           ))}
//           {/* <TableHead>Action</TableHead> */}
//         </TableRow>
//       </TableHeader>

//       <TableBody>
//         {tableData.map((row, rowIndex) => {
//           const isExpanded = expandedRows.includes(rowIndex);
//          const key = row['key'];// 👈 assumes 'Key' is always present

//           return (
//             <TableRow
//               key={rowIndex}
//               className={rowIndex % 2 === 0 ? 'bg-[#d0d0d0] dark:bg-[#2E2E2E]' : 'bg-[#ececec] dark:bg-[#181818]'}
//             >
//               {columns.map((col) => {
//                 let cellValue = row[col];

//                 if (col === 'description') {
//                     cellValue = getFlatValue(cellValue);
//                   } else if (col === 'created' || col === 'updated') {
//                     cellValue = formatDate(cellValue);
//                   } else if (typeof cellValue === 'object') {
//                     cellValue = JSON.stringify(cellValue, null, 2);
//                   }


//                 const isLong =
//                   typeof cellValue === 'string' && cellValue.length > 80;

//                 return (
//                   <TableCell
//                     key={col}
//                     className="break-words whitespace-pre-wrap"
//                   >
//                     {isLong ? (
//                       <div className="flex flex-col gap-2">
//                         {!isExpanded ? (
//                           <div className="flex justify-between items-center">
//                             <span className="truncate max-w-[90%]">
//                               {cellValue}
//                             </span>
//                             <button onClick={() => toggleRow(rowIndex)}>
//                               <ChevronDown className="w-4 h-4" />
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="flex justify-between items-start flex-col">
//                             <span className='max-w-[88%]'>{cellValue}</span>
//                             <button
//                               onClick={() => toggleRow(rowIndex)}
//                               className="self-end mt-1"
//                             >
//                               <ChevronUp className="w-4 h-4" />
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <span>{cellValue}</span>
//                     )}
//                   </TableCell>
//                 );
//               })}

//               {/* Proceed Button Cell */}
//               <TableCell className="px-4 py-3">
//                 {loadingRow === rowIndex ? (
//                   <span className="text-sm text-muted-foreground">Loading...</span>
//                 ) : (
//                   <button
//                     onClick={async () => {
//                       setLoadingRow(rowIndex);
//                       try {
//                         const result = await onProceed(key);
//                         setTableData(result); // 🔁 replace table content
//                       } catch (err) {
//                         console.error('Error in onProceed:', err);
//                       } finally {
//                         setLoadingRow(null);
//                       }
//                     }}
//                     className="bg-[#30302e] hover:bg-[black] text-white dark:bg-white dark:text-black px-2 py-1 rounded-lg w-[6] cursor-pointer"
//                   >
//                     Proceed
//                   </button>
//                 )}
//               </TableCell>
//             </TableRow>
//           );
//         })}
//       </TableBody>
//     </Table>
//   );
// };

// export default GenericTable;


// GenericTable.tsx
import React, { useState, useEffect, type JSX, useMemo } from 'react';
import { ChevronDown, ChevronUp, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';

interface GenericTableProps {
  data: any[];
  columns: string[];
  onProceed: (key: string) => Promise<any[]>;
  isSidebarCollapsed?: boolean;
  searchTerm?: string;
}

const getFlatValue = (value: any): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') {
    if (value?.content?.[0]?.content?.[0]?.text) {
      return value.content
        .flatMap((c: any) => (c.content || []).map((cc: any) => cc.text || ''))
        .join(' ');
    }
    return JSON.stringify(value);
  }
  return String(value);
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '—';
  const cleaned = dateString.replace('T', ' ').split('+')[0];
  return cleaned.slice(0, 19);
};

const highlightMatch = (text: string, term: string): JSX.Element => {
  if (!term) return <>{text}</>;
  const regex = new RegExp(`(${term})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-350 text-black px-1">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const GenericTable: React.FC<GenericTableProps> = ({
  data,
  columns,
  onProceed,
  isSidebarCollapsed,
  searchTerm = '',
}) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loadingRow, setLoadingRow] = useState<number | null>(null);
  const [tableData, setTableData] = useState(data);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 50;

const totalPages = Math.ceil(tableData.length / itemsPerPage);

const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return tableData.slice(start, start + itemsPerPage);
}, [tableData, currentPage]);

useEffect(() => {
  setCurrentPage(1);
}, [tableData]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });

    const sorted = [...tableData].sort((a, b) => {
      const valA = getFlatValue(a[column]).toLowerCase();
      const valB = getFlatValue(b[column]).toLowerCase();
      return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    setTableData(sorted);
  };

  const dynamicwidth = isSidebarCollapsed ? 'w-[91.3vw] min-w-[1000px]' : 'w-[76.5vw] min-w-[1020px]';

if (searchTerm?.trim() && data.length === 0) {
  return (
    // <div className="flex items-center justify-center align-center w-[76vw] h-[300px]">
      <p className="flex items-center justify-center text-sm text-muted-foreground dark:text-white">No matching results</p>
    // </div>
  );
}

if (!searchTerm?.trim() && data.length === 0) {
  return null; // ⛔ Don't show anything on initial render
}

return (
  <div className="w-full max-w-full overflow-x-auto px-2">
  <div className="max-h-[283px] overflow-y-auto border rounded-md">
      <table className="min-w-[1024px] w-full border-collapse table-fixed">
        <thead className="bg-white dark:bg-[#1e1e1e] sticky top-0 z-10">
          <tr>
            {columns.map((header) => (
              <th
                key={header}
                onClick={() => handleSort(header)}
                className="px-4 py-2 text-left text-sm capitalize cursor-pointer bg-white dark:bg-[#1e1e1e]"
              >
                <div className="flex items-center gap-1">
                  {header.replace(/_/g, ' ')}
                  {sortConfig?.key === header ? (
                    sortConfig.direction === 'asc' ? (
                      <ArrowUpAZ size={14} />
                    ) : (
                      <ArrowDownAZ size={14} />
                    )
                  ) : (
                    <ArrowUpAZ size={14} className="text-white" />
                  )}
                </div>
              </th>
            ))}
            <th className="px-4 py-2 bg-white dark:bg-[#1e1e1e] sticky top-0 z-10">Action</th>
          </tr>
        </thead>

        <tbody className="text-sm">
          {paginatedData.map((row, index) => {
            const rowIndex = (currentPage - 1) * itemsPerPage + index;
            const isExpanded = expandedRows.includes(rowIndex);
            const key = row['key'];

            return (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-[#d0d0d0] dark:bg-[#2E2E2E]' : 'bg-[#ececec] dark:bg-[#181818]'}
              >
                {columns.map((col) => {
                  let cellValue = row[col];
                  if (col === 'description') {
                    cellValue = getFlatValue(cellValue);
                  } else if (col === 'created' || col === 'updated') {
                    cellValue = formatDate(cellValue);
                  } else if (typeof cellValue === 'object') {
                    cellValue = JSON.stringify(cellValue, null, 2);
                  }

                  const isLong = typeof cellValue === 'string' && cellValue.length > 80;

                  return (
                    <td key={col} className="px-4 py-2 break-words whitespace-pre-wrap">
                      {isLong ? (
                        <div className="flex flex-col gap-2">
                          {!isExpanded ? (
                            <div className="flex justify-between items-center">
                              <span className="truncate max-w-[90%]">
                                {highlightMatch(cellValue, searchTerm)}
                              </span>
                              <button onClick={() => toggleRow(rowIndex)}>
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start flex-col">
                              <span className="max-w-[88%]">
                                {highlightMatch(cellValue, searchTerm)}
                              </span>
                              <button
                                onClick={() => toggleRow(rowIndex)}
                                className="self-end mt-1"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span>{highlightMatch(cellValue, searchTerm)}</span>
                      )}
                    </td>
                  );
                })}

                <td className="px-4 py-2">
                  {loadingRow === rowIndex ? (
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  ) : (
                    <button
                      onClick={async () => {
                        setLoadingRow(rowIndex);
                        try {
                          const result = await onProceed(key);
                          setTableData(result);
                        } catch (err) {
                          console.error('Error in onProceed:', err);
                        } finally {
                          setLoadingRow(null);
                        }
                      }}
                      className="bg-[#30302e] hover:bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded-lg cursor-pointer"
                    >
                      Proceed
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Pagination (outside the scroll) */}
    <div className="flex justify-end items-center mt-2 gap-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-[rgba(177,100,255,0.5)] text-sm hover:bg-[rgba(185, 116, 255, 0.5)] disabled:opacity-50 text-white"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded text-sm ${
            page === currentPage
              ? 'bg-[black] text-white dark:bg-[#b164ff] dark:text-white'
              : 'bg-[#1f2937] hover:bg-[#6e7885]'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-[rgba(177,100,255,0.5)] text-sm hover:bg-[rgba(177,100,255,0.5)] disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);

};

export default GenericTable;
