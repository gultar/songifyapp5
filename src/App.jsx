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
  const [searchLinks, setSearchLinks] = useState([])

  const handleSubmit = e => {
    e.preventDefault()
    // Do something with the search term, such as sending it to a server or updating state
    axios
      .get('http://localhost:3000/search', {
        params: {
          q: searchTerm,
        },
      })
      .then(response => handleSearchResult(response))
      .catch(error => console.log(error))
  }

  const handleSearchResult = response => {
    console.log(response.data) // handle the response data here
    const musicData = response.data
    setMusicData(musicData)
  }

  // Save currentSong in localStorage every time it changes
  useEffect(() => {
    if(Object.keys(currentSong).length == 0){
      let defaultSong = {
        id:761087,
        full_title:"Yo No Sé Mañana by Luis Enrique"
      }

      localStorage.setItem('currentSong', JSON.stringify(defaultSong))
    }else{
      localStorage.setItem('currentSong', JSON.stringify(currentSong))
    }
    
  }, [currentSong])

  // Load saved song from localStorage when the component mounts
  useEffect(() => {
    const savedSong = localStorage.getItem('currentSong')
    if (savedSong) {
      setCurrentSong(JSON.parse(savedSong))
    }
  }, [])

  const handleChange = async(e) => {
      setSearchTerm(e.target.value)
      let songTitleSuggestions = []
      let suggestionLinks = []
      const response = await axios.get('http://localhost:3000/searchAll', {
          params: {
            q: e.target.value,
          },
        });
        const matches = response.data
        matches.map(hit =>{
          const suggestion = hit.result;
          songTitleSuggestions.push(suggestion.full_title)
          let link = {
            id:suggestion.id,
            title:suggestion.full_title
          }
          suggestionLinks.push(link)
        })
        console.log(matches)
        console.log(suggestionLinks)
        setSearchLinks(suggestionLinks)
        e.target.value = ""
    
  }

  const onClickSuggestion = (suggestion) => {
    setSearchTerm(suggestion.title)
    setSearchLinks([])
  }

  return (
    <div className="App">
      <div class="dashboard">
        <div class="header">
          <div class="logo"></div>
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
              />
              {searchLinks.length > 0 && (
                <div className="search-dropdown">
                  {searchLinks.map((result, index) => (
                    <div key={index} className="search-dropdown-item">
                      <a href="#" onClick={() => {
                        onClickSuggestion(result)
                        }}>{result.title}</a>
                    </div>
                  ))}
                </div>
              )}
              <button type="submit" className="search-btn">
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