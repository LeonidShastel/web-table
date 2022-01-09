import './App.css';
import React, {useEffect, useState} from "react";
import Prompt from "./components/Prompt/Prompt";
import {MdNavigateBefore, MdNavigateNext, MdSearch, MdSort} from "react-icons/md";
import PromptSearch from "./components/PromptSearch/PromptSearch";
import {useSortBy, useTable,usePagination} from "react-table";

const EditableCell = ({
                          value: initialValue,
                          row: { index },
                          column: { id },
                        updateMyData
                      }) => {
    const [value, setValue] = React.useState(initialValue)
    const onChange = e => {
        setValue(e.target.value)
    }
    const onBlur = () => {
        updateMyData(index, id, value)
    }
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    return <input value={value} onChange={onChange} onBlur={onBlur} />
}

const defaultColumn = {
    Cell: EditableCell,
}

function Table({ columns, data, updateMyData, skipPageReset }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize},
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            autoResetPage: !skipPageReset,
            updateMyData,
        },
        usePagination
    )
    return (
        <>
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th className="title" {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
          Page{' '}
                    <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
                <span>
          | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
        </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

function App() {
    const [defaultDataBase, setDefaultDataBase] = useState([]);
    const [visionDataBase, setVisionDataBase] = useState([]);
    const [title, setTitle] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [visiblyPrompt, setVisiblyPrompt] = useState(false);
    const [visiblyPromptSearch, setVisiblyPromptSearch] = useState(false);
    const [searchRow, setSearchRow] = useState("");
    const [sortRow, setSortRow] = useState("");
    const [currentCell, setCurrentCell] = useState({row: 0, column: ""});
    //
    useEffect(() => {
        fetch("http://localhost:80")
            .then(res => res.json())
            .then(data => {
                setDefaultDataBase(JSON.parse(JSON.stringify(data)));
                setVisionDataBase(JSON.parse(JSON.stringify(data)));
                setData(JSON.parse(JSON.stringify(data)));
                setOriginalData(JSON.parse(JSON.stringify(data)))
            })
            .catch(err => console.log(err))
    }, []);
    const SaveDataBase = () => {
        const body = visionDataBase.filter((el, index) => JSON.stringify(el) !== JSON.stringify(defaultDataBase[index]));

        fetch("http://localhost:80", {method: 'POST', body: JSON.stringify(body)})
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }
    // const GenerateTitle = () => (
    //     <tr className="title">{title.map(el =>
    //         <th key={el.toString()}>
    //             <div>
    //                 <span>{el}</span><MdSearch size={18} onClick={() => {
    //                 setSearchRow(el);
    //                 setVisiblyPromptSearch(true);
    //             }}/>
    //                 <MdSort onClick={()=>SortTable(el)}/>
    //             </div>
    //         </th>
    //     )}</tr>
    // );
    // const GeneratePage = () => (
    //     visionDataBase.slice(currentPage * 50 - 50, currentPage * 50).map((el, index_row) =>
    //         <tr key={el.id}>{Object.values(el).map((cell, index_col) =>
    //             <td key={index_col} onClick={() => {
    //                 setCurrentCell({row: index_row, column: title[index_col]});
    //                 setVisiblyPrompt(!visiblyPrompt);
    //             }}>{cell}
    //             </td>
    //         )}</tr>
    //     )
    // );
    // const SortTable =(row)=> {
    //     if(sortRow!==row){
    //         setSortRow(row);
    //         const data = JSON.parse(JSON.stringify(visionDataBase));
    //         data.sort((a,b)=>a[row].localeCompare(b[row]));
    //         setVisionDataBase(data);
    //     }else{
    //         const data = JSON.parse(JSON.stringify(visionDataBase)).reverse();
    //         setVisionDataBase(data);
    //     }
    // }
    // return (
    //     <div className="App">
    //         {visiblyPrompt ? <Prompt value={visionDataBase} setValue={setVisionDataBase} currentCell={currentCell}
    //                                  setVisible={setVisiblyPrompt}/> : null}
    //         {visiblyPromptSearch ? <PromptSearch value={defaultDataBase} setValue={setVisionDataBase} row={searchRow}
    //                                              setVisible={setVisiblyPromptSearch}/> : null}
    //         <table>
    //             <thead>
    //             {title.length ? GenerateTitle() : null}
    //             </thead>
    //             <tbody>
    //             {visionDataBase.length ? GeneratePage() : null}
    //             </tbody>
    //         </table>
    //
    //         <button className={'App-button'} onClick={SaveDataBase}>Save MySQL</button>
    //         <button className={'App-button'} onClick={()=>setVisionDataBase(defaultDataBase)}>Reset setting search</button>
    //         <div className="App-navigation">
    //             <MdNavigateBefore className="App-navigation-button" size={40}
    //                               onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}/>
    //             <MdNavigateNext className="App-navigation-button" size={40} onClick={() => {
    //                 setCurrentPage(currentPage >= Math.ceil(defaultDataBase.length / 50) ? Math.ceil(defaultDataBase.length / 50) : currentPage + 1)
    //             }}/>
    //         </div>
    //     </div>
    // );

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id', // accessor is the "key" in the data
            },
            {
                Header: 'Owner',
                accessor: 'owner',
            },
            {
                Header: 'Price',
                accessor: 'price', // accessor is the "key" in the data
            },
            {
                Header: 'For sale',
                accessor: 'for_sale',
            },
            {
                Header: 'Updated at',
                accessor: 'updated_at', // accessor is the "key" in the data
            },
            {
                Header: 'Port',
                accessor: 'port', // accessor is the "key" in the data
            },
            {
                Header: 'Airport',
                accessor: 'airport',
            },
            {
                Header: 'Volcano',
                accessor: 'volcano', // accessor is the "key" in the data
            },
            {
                Header: 'Mystery',
                accessor: 'mystery',
            },
            {
                Header: 'Crops',
                accessor: 'crops', // accessor is the "key" in the data
            },
            {
                Header: 'Fruit',
                accessor: 'fruit',
            },
            {
                Header: 'Minerals',
                accessor: 'minerals', // accessor is the "key" in the data
            },
            {
                Header: 'Raw meat',
                accessor: 'raw_meat',
            },
            {
                Header: 'Titanium',
                accessor: 'titanium',
            },
            {
                Header: 'Fish',
                accessor: 'fish',
            },
            {
                Header: 'Iron',
                accessor: 'iron',
            },
            {
                Header: 'Oil',
                accessor: 'oil',
            },
            {
                Header: 'Stone',
                accessor: 'stone',
            },
            {
                Header: 'Wood',
                accessor: 'wood',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Country count',
                accessor: 'country_count',
            },
            {
                Header: 'Countries',
                accessor: 'countries',
            },
            {
                Header: 'Urban count',
                accessor: 'urban_count',
            },
            {
                Header: 'Urban areas',
                accessor: 'urban_areas',
            },
            {
                Header: 'Water',
                accessor: 'water',
            },
            {
                Header: 'Is reserved',
                accessor: 'is_reserved',
            },
        ],
        [visionDataBase]
    )
    const [data, setData] = React.useState(() => visionDataBase)
    const [originalData,setOriginalData] = React.useState(defaultDataBase)
    const [skipPageReset, setSkipPageReset] = React.useState(false)

    const updateMyData = (rowIndex, columnId, value) => {
        setSkipPageReset(true)
        setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }

    React.useEffect(() => {
        setSkipPageReset(false)
    }, [data])

    const resetData = () => setData(originalData)
    return (
        <div className={"App"}>
            {/*{visiblyPrompt ? <Prompt value={visionDataBase} setValue={setVisionDataBase} currentCell={currentCell}*/}
            {/*                         setVisible={setVisiblyPrompt}/> : null}*/}
            {/*{visiblyPromptSearch ? <PromptSearch value={defaultDataBase} setValue={setVisionDataBase} row={searchRow}*/}
            {/*                                     setVisible={setVisiblyPromptSearch}/> : null}*/}
            {/*{defaultDataBase.length ?*/}
            {/*    <table {...getTableProps()}>*/}
            {/*        <thead>*/}
            {/*        {headerGroups.map(headerGroup => (*/}
            {/*            <tr {...headerGroup.getHeaderGroupProps()} className="title">*/}
            {/*                {headerGroup.headers.map(column => (*/}
            {/*                    <th*/}
            {/*                        {...column.getHeaderProps(column.getSortByToggleProps())}*/}
            {/*                    >*/}
            {/*                        {column.render('Header')}*/}
            {/*                        <span>*/}
            {/*                            {column.isSorted*/}
            {/*                            ? column.isSortedDesc*/}
            {/*                            ? ' 🔽'*/}
            {/*                            : ' 🔼'*/}
            {/*                            : ''}*/}
            {/*                        </span>*/}
            {/*                    </th>*/}
            {/*                ))}*/}
            {/*            </tr>*/}
            {/*        ))}*/}
            {/*        </thead>*/}
            {/*        <tbody {...getTableBodyProps()}>*/}
            {/*        {rows.map(row => {*/}
            {/*            prepareRow(row)*/}
            {/*            return (*/}
            {/*                <tr {...row.getRowProps()}>*/}
            {/*                    {row.cells.map(cell => {*/}
            {/*                        return (*/}
            {/*                            <td*/}
            {/*                                {...cell.getCellProps()}*/}
            {/*                            >*/}
            {/*                                {cell.render('Cell')}*/}
            {/*                            </td>*/}
            {/*                        )*/}
            {/*                    })}*/}
            {/*                </tr>*/}
            {/*            )*/}
            {/*        })}*/}
            {/*        </tbody>*/}
            {/*    </table>*/}
            {/*    : null*/}
            {/*}*/}
            {visionDataBase.length ?
                <>
                    <button onClick={resetData}>Reset Data</button>
                    <Table
                        columns={columns}
                        data={data}
                        updateMyData={updateMyData}
                        skipPageReset={skipPageReset}
                    />
                </>
            :null}
        </div>
    )
}

export default App;
