import React, {useState} from 'react';
import "./Prompt.css";

const Prompt = ({value, setValue, currentCell, setVisible}) => {
    const data = value;
    const [currentValue, setCurrentValue] = useState(data[currentCell.row][currentCell.column]+"");

    function editCell() {
        data[currentCell.row][currentCell.column] = currentValue;
        setVisible(false);
        setValue(data);
    }

    return (
        <div className={"Prompt"}>
            <div className={"Prompt-body"}>
                <h1>{currentCell.column}</h1>
                <input type='text' value={currentValue} onChange={e => setCurrentValue(e.target.value)}/>
                <button onClick={editCell}>Save</button>
                <button onClick={()=>setVisible(false)}>Cansel</button>
            </div>
        </div>
    );
};

export default Prompt;