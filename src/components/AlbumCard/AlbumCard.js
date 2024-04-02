import React from 'react';
import './AlbumCard.css';


function AlbumCard(props) {
  const {title, artist, genre, year, image, favorite} = props.albumDetail
  const {handleFavorite} = props

  return (
    <div className={"card"}>
      <div className={"cardContent"}>
        <img className={"cover"} src={image} alt={"Album Cover. Title: " + title + ", artist: " + artist}/>
        <h4 className={"title"}>{title}</h4>
        <h4 className={"artist"}>{artist}</h4>
        <h4 className={"genre-year"}>{genre + " · " + year}</h4>
        <button className={"favorite"} onClick={() => handleFavorite(title, artist)}>{favorite ? "❤️ Delete" : "Favorite"}</button>
      </div>
    </div>
  );
}

export default AlbumCard;