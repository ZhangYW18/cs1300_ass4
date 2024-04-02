import React from 'react';
import './FilterButton.css';


function FilterButton(props) {
  const {text, selected, onClick} = props

  return (
    <div>
      <button
        className={"filter"}
        style={{
          background: selected ? "red" : "black"
        }}
        onClick={() => onClick(text)}
      >{text}</button>
    </div>
  );
}

export default FilterButton;