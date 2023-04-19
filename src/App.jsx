import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios'
import Song from './pages/Song'
import Favorites from './pages/Favorites'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [currentSong, setCurrentSong] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [musicData, setMusicData] = useState({})
  const [suggestions, setSuggestions] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  let searchBarEntryTimeoutId;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSearchBarSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3000/search', {
        params: {
          q: searchTerm,
        },
      });
      handleSearchResult(response);
      
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleSearchResult = response => {
    const musicData = response.data
    setMusicData(musicData)
    localStorage.setItem('currentSong', JSON.stringify(musicData))
  }

  // Load saved song from localStorage when the component mounts
  useEffect(() => {
    const savedSong = localStorage.getItem('currentSong')
    if (savedSong) {
      setCurrentSong(JSON.parse(savedSong))
    }
  }, [])

  

  const handleSearchBarChange = async(e) => {
    clearTimeout(searchBarEntryTimeoutId); // clear previous timeout if there is any
  
    setSearchTerm(e.target.value);
  
    searchBarEntryTimeoutId = setTimeout(async () => {
      let songTitleSuggestions = [];
      let suggestionLinks = [];
  
      const response = await axios.get('http://localhost:3000/searchAll', {
        params: {
          q: e.target.value,
        },
      });
  
      const matches = response.data;
      matches.map(hit =>{
        const suggestion = hit.result;
        songTitleSuggestions.push(suggestion.full_title);
        let link = {
          id:suggestion.id,
          title:suggestion.full_title
        };
        suggestionLinks.push(link);
      });
        
      setSuggestions(suggestionLinks);
      e.target.value = "";
    }, 1000); // wait for 1 second before making the API request
  }

  const onClickSuggestion = (suggestion) => {
    clearTimeout(searchBarEntryTimeoutId);
    setSearchTerm(suggestion.title)
    setSuggestions([])
    
    setTimeout(()=>{
      document.getElementById('search-btn').click();
      setSuggestions([])
      setSearchTerm("")
    }, 500)
  }

  return (
    <div className={`App ${isDarkMode ? 'light-mode' : 'dark-mode'}`}>
      <div class="dashboard">
        <div class="header">
          <div class="logo"></div>
          
          <form onSubmit={handleSearchBarSubmit} className="search-form" id="search-form">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchBarChange}
                onBlur={() => setSuggestions([])}
              />
              {suggestions.length > 0 && (
                <div className="search-dropdown">
                  {suggestions.map((result, index) => (
                    <div key={index} className="search-dropdown-item">
                      <a href="#" onClick={() => {
                        onClickSuggestion(result)
                        }}>{result.title}</a>
                    </div>
                  ))}
                </div>
              )}
              <button type="submit" className="search-btn" id="search-btn">
                <i className="fa fa-search"></i>
              </button>
            </div>
          </form>

          <div class="nav-buttons">
            <button onClick={() => setCurrentPage('home')} class="home-btn">Home</button>
            <button onClick={() => setCurrentPage('favorites')} class="favorites-btn">Favorites</button>
            
          </div>
        </div>
        {currentPage === 'home' ? (
            <Song musicData={musicData} />
          ) : (
            <Favorites />
        )}

      </div>
    </div>
  )
}

export default App