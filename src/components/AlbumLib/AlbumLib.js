import React from 'react';
import './AlbumLib.css';
import AlbumCard from "../AlbumCard/AlbumCard";


function AlbumLib(props) {
  const albumData = props.albumData
  const {handleFavorite} = props

  return (
    <div className={"album-lib"}>
      {albumData.map((albumDetail, index) => (
        <AlbumCard albumDetail={albumDetail} handleFavorite={handleFavorite} key={"album"+index}/>
      ))}
    </div>
  );
}

export default AlbumLib;