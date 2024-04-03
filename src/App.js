import './App.css';
import AlbumLib from "./components/AlbumLib/AlbumLib";
import albumJsonData from "./assets/albums.json";
import React, {useState} from "react";
import FilterButton from "./components/FilterButton/FilterButton";

const myCompare = (a, b) => {
  return a.toString().localeCompare(b.toString(), 'en', { sensitivity: 'base' })
}

let albumData = albumJsonData.map((item, index) => {
  // item.image = process.env.PUBLIC_URL + "/" + item.image;
  // Local Test Image
  item.image = process.env.PUBLIC_URL + "/images/" +
    item.artist.toLowerCase().replaceAll(" ", "-") + "-" +
    item.title.toLowerCase().replaceAll(" ", "-") +
    ".jpg"
  item.favorite = false
  item.filtered = false
  item.originalIndex = index
  // TODO debug
  // if (item.artist === "The Cribs") item.favorite = true
  return item
})

// Deep copy, not shallow copy
let backupAlbumData = JSON.parse(JSON.stringify(albumData));
// console.log(backupAlbumData)

// albumData.sort((a, b) => {
//   const artistOrder = myCompare(a.artist, b.artist)
//   return artistOrder === 0 ? myCompare(a.title, b.title) : artistOrder
// });

let genres = Array.from(new Set(albumData.map(album => {
  return album.genre
}))).sort();
genres.unshift("All")

const defaultLowerYear = Math.min(...albumData.map((album) => album.year))
const defaultUpperYear = 2024

function App() {
  // const [albums, setAlbums] = useState([])
  const [favorites, setFavorites] = useState([])
  // const [favoriteCount, setFavoriteCount] = useState(0)
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedOrder, setSelectedOrder] = useState("none")

  const [lowerYear, setLowerYear] = useState(defaultLowerYear);
  const [upperYear, setUpperYear] = useState(defaultUpperYear);
  const [appliedLowerYear, setAppliedLowerYear] = useState(defaultLowerYear);
  const [appliedUpperYear, setAppliedUpperYear] = useState(defaultUpperYear);

  const handleLowerYear = (e) => {
    setLowerYear(e.target.value);
  };
  const handleUpperYear = (e) => {
    setUpperYear(e.target.value);
  };

  const handleFavorite = (title, artist) => {
    // console.log(favorites)
    albumData.forEach(album => {
      if (title !== album.title || artist !== album.artist)
        return;
      album.favorite = !album.favorite
      if (!album.favorite) {
        // Delete from favorite
        // console.log(album)
        const index = favorites.findIndex(album => {
          return title === album.title && artist === album.artist
        })
        // console.log(favorites, index)
        setFavorites(favorites.toSpliced(index, 1));
      } else {
        // Favorite
        const newList = [...favorites, album]
        setFavorites(newList);
      }
    })
  };

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre)
    albumData = albumData.map(album => {
      if ((genre !== "All" && album.genre !== genre) || album.year > appliedUpperYear || album.year < appliedLowerYear) {
        album.filtered = true;
      } else {
        album.filtered = false;
      }
      return album;
    })
  }

  const handleYearFilter = (text) => {
    if (lowerYear < 1900 || lowerYear > 2024 || upperYear < 1900 || upperYear > 2024) {
      alert("Year must between 1900 and current year.")
      return
    }
    if (lowerYear > upperYear) {
      alert("Lower year must be less than or equal to upper year.")
      return
    }
    setAppliedLowerYear(lowerYear)
    setAppliedUpperYear(upperYear)
    albumData = albumData.map(album => {
      if ((selectedGenre !== "All" && album.genre !== selectedGenre) || album.year > upperYear || album.year < lowerYear) {
        album.filtered = true;
      } else {
        album.filtered = false;
      }
      return album;
    })
  }


  const handleSort = (sortKey) => {
    setSelectedOrder(sortKey)
    sortKey = sortKey.toLowerCase()
    let order = []
    if (sortKey === "artist") {
      order = ["artist", "title", "year"]
    } else if (sortKey === "year") {
      order = ["year", "artist", "title"]
    } else {
      order = ["title", "artist", "year"]
    }
    albumData.sort((a, b) => {
      for (let i = 0; i < order.length; i++) {
        const cmpRes = myCompare(a[order[i]], b[order[i]])
        if (cmpRes !== 0) return cmpRes;
      }
      return 0;
    });
  }

  const resetAll = (text) => {
    // console.log(albumData)
    setSelectedGenre("All")
    setSelectedOrder("none")
    setLowerYear(defaultLowerYear)
    setAppliedLowerYear(defaultLowerYear)
    setUpperYear(defaultUpperYear)
    setAppliedUpperYear(defaultUpperYear)
    // Update favorite information to backup, then reset album data to backup
    albumData.forEach((album, index) => {
      backupAlbumData[album.originalIndex].favorite = album.favorite
    })
    // Deep copy
    albumData = JSON.parse(JSON.stringify(backupAlbumData));
    // console.log(albumData)
  }

  return (
    <div className="App">

      <div>
        <h1>My Albums</h1>
      </div>

      <div className={"AppContent"}>
        <div className={'AlbumLib'}>
          <AlbumLib albumData={albumData.filter(album => !album.filtered)} handleFavorite={handleFavorite}/>
        </div>

        <div className={"AppSidebar"}>
          <div className={"Selectors"}>
            <FilterButton text={" Reset All "} onClick={resetAll}/>
          </div>

          <div className={"Selectors"}>
            Genre:
            {genres.map(genre => {
              return <FilterButton text={genre} selected={selectedGenre === genre}
                                   onClick={handleGenreFilter} key={genre}/>
            })}
          </div>

          <div className={"Selectors"}>
            Time:
            <input name="minimum-release-year" type="number" min="1900" max="2024" onChange={handleLowerYear} value={lowerYear}/> to
            <label for={"minimum-release-year" } className={"HiddenLabel"}>Filters albums released before this year</label>
            <input name="maximum-release-year" type="number" min="1900" max="2024" onChange={handleUpperYear} value={upperYear}/>
            <label htmlFor={"maximum-release-year"} className={"HiddenLabel"}>Filters albums released after this
              year</label>
            <FilterButton text={"Apply"} onClick={handleYearFilter}/>
          </div>

          <div className={"Selectors"}>
            Sort by
            <FilterButton text={"Artist"} selected={selectedOrder === "Artist"} onClick={handleSort}/>
            <FilterButton text={"Title"} selected={selectedOrder === "Title"} onClick={handleSort}/>
            <FilterButton text={"Year"} selected={selectedOrder === "Year"} onClick={handleSort}/>
          </div>

          <div className={"Aggregator"}>
            <h2 key={"FavoriteCount"}>Favorites: {favorites.length}</h2>
            <ul key={"FavoriteList"} className={"Favorites"}>
            {
              favorites.map((album, index) => (
                <li className={"FavoriteRow"} key={"Row"+index}>
                  <span className={"Bold"} key={"Title"+index}>{album.title}</span>
                  <span key={"By"+index}> by </span>
                  <span className={"LightBold"} key={"Artist"+index}>{album.artist}</span>
                </li>
              ))
            }
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
