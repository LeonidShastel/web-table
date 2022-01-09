import React, {useState} from 'react';
import "../Prompt/Prompt.css";

const PromptSearch = ({value, setValue, row, setVisible}) => {
    const data = value;
    const [searchValue, setSearchValue] = useState("");

    function searchRows(){
        const newTable = data.filter(el=>el[row]===searchValue);
        setValue(newTable);
        setVisible(false);
    }

    return (
        <div className={"Prompt"}>
            <div className={"Prompt-body"}>
                <h1>Search: {row}</h1>
                <input type='text' value={searchValue} onChange={e => setSearchValue(e.target.value)}/>
                <button onClick={searchRows}>Search</button>
                <button onClick={()=>setVisible(false)}>Cansel</button>
            </div>
        </div>
    );
};

export default PromptSearch;