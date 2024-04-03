import React from 'react';
import './FilterButton.css';


function FilterButton(props) {
  const {text, selected, onClick} = props

  return (
    <div>
      <button
        className={"filter"}
        style={{
          background: selected ? "#2718F7" : "black"
        }}
        onClick={() => onClick(text)}
      >{text}</button>
    </div>
  );
}

export default FilterButton;