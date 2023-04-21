import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { Routes, Route, BrowserRouter as Router, useNavigate } from 'react-router-dom'
import Song from './pages/Song'
import Favorites from './pages/Favorites'
import SearchBar from './components/SearchBar'
import { slide as Menu } from 'react-burger-menu'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [musicData, setMusicData] = useState({})
  const [suggestions, setSuggestions] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  let searchBarEntryTimeoutId;

  const handleToggleMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleSearchBarSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetchMusicData(searchTerm)
      handleSearchResult(response);
      
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMusicData = async (searchTerm) => {
    const response = await axios.get('http://localhost:3000/search', {
      params: {
        q: searchTerm,
      },
    });

    return response
  }


  const handleSearchResult = response => {
    if (!response) {
      console.log('Invalid response data:', response)
      return
    }
  
    setMusicData({})

    try {
      const musicData = response.data
      
      if(musicData) {
        setMusicData(musicData)
        sessionStorage.setItem('currentSong', JSON.stringify(musicData))
      }
      
    } catch (error) {
      console.log(error)
    }
    
  }
  
  const fetchDefault = async () => {
    try {
      const response = await fetchMusicData('Yo No Sé Mañana by Luis Enrique')
      handleSearchResult(response);
    } catch (error) {
      console.log(error)
    }
  }

  // Load saved song from localStorage when the component mounts
  useEffect(() => {
    const savedSong = sessionStorage.getItem('currentSong')
    if (savedSong && savedSong !== "undefined" && currentPage === 'home') {
      try {
        const song = JSON.parse(savedSong)
        handleSearchResult({ data: song })
      } catch (error) {
        console.log('Error parsing saved song:', error)
        fetchDefault()
      }
    } else {
      fetchDefault()
    }
  }, [currentPage])



  const handleSearchBarChange = async (e) => {
    e.preventDefault()
    clearTimeout(searchBarEntryTimeoutId); // clear previous timeout if there is any
    setSearchTerm(e.target.value);

    searchBarEntryTimeoutId = setTimeout(async () => {
      

      if(e.target.value != ""){
        let songTitleSuggestions = [];
        let suggestionLinks = [];
        const response = await axios.get('http://localhost:3000/searchAll', {
          params: {
            q: e.target.value,
          },
        });
  
        const matches = response.data;
        matches.map(hit => {
          const suggestion = hit.result;
          songTitleSuggestions.push(suggestion.full_title);
          let link = {
            id: suggestion.id,
            title: suggestion.full_title
          };
          suggestionLinks.push(link);
        });
  
        setSuggestions(suggestionLinks);
      }
      e.target.value = "";
    }, 1000); // wait for 1 second before making the API request
  }

  const onClickSuggestion = (suggestion) => {

    clearTimeout(searchBarEntryTimeoutId);
    setSearchTerm(suggestion.title)

    //For some reason, useRef and ref.current.submit() doesn't work at all. 
    //I have to manually press the button to submit the form
    document.getElementById('search-btn').click();
    setSuggestions([])
    // setTimeout(() => {

    //   setSuggestions([])
    //   setSearchTerm("")
    // }, 500)
  }

    return (
      <Router>
          <div className={`App ${isDarkMode ? 'light-mode' : 'dark-mode'}`}>
            
            <div className="dashboard">
            
            <div class="topnav" id="myTopnav">
                <a href="/" className="home-btn nav-item">Home</a>
                <a href="/favorites" className="favorites-btn nav-item">Favorites</a>
                <a className="mode-btn nav-item" href="#" onClick={handleToggleMode}>{isDarkMode ? 'Light' : 'Dark'}</a>
            </div>
            <div className="search-bar-container">
                <SearchBar 
                  onSearchSubmit={handleSearchBarSubmit}
                  onSearchChange={handleSearchBarChange}
                  searchTerm={searchTerm}
                  suggestions={suggestions}
                  setSuggestions={setSuggestions}
                  onSuggestionClick={onClickSuggestion}
                />
              </div>
              <Routes>
                <Route exact path="/" element={<Song musicData={musicData} />}/>
                <Route exact path="/favorites" element={<Favorites />}/>
            </Routes>
          

        </div>
        
      </div>
      </Router>

  );
}

export default App;
