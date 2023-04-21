import axios from 'axios';
import { useEffect, useState } from 'react';
import FavoriteButton from '../components/FavoriteButton';

const getGif = async (searchTerm) => {
    try {
      const response = await axios.get("http://localhost:3000/getGif", {
        params: {
          q: searchTerm,
        },
      });
  
      const { images } = response.data;
      const { original } = images;
      return original.url
      
    } catch (error) {
      console.log(error);
    }
};


const getTopWords = (words) => {
    const freqMap = {};
    words.forEach(function(word) {
        freqMap[word] = (freqMap[word] || 0) + 1;
    });
    
    const sortedWords = Object.keys(freqMap).sort(function(a, b) {
        
        return freqMap[b] - freqMap[a];
    });
    
    return sortedWords.filter((word, index) => index < 12 && !sortedWords.slice(0, index).includes(word));
}; 
  

const extractSongFromData = (musicData)=>{
    if(!musicData){
        console.log('Music data provided is invalid', musicData)
        return {}
    }

    let song = {
        player:musicData.apple_music_player_url,
        artists:musicData.artist_names,
        title:musicData.full_title,
        id:musicData.id,
        lyrics:musicData.url,
        release:musicData.release_date_for_display
    }

    return song
}


function Song({ musicData }) {
    const [gifSrcs, setGifSrcs] = useState([])
    const [lyrics, setLyrics] = useState("")
    const [isFavorite, setIsFavorite] = useState(false)
    const [words, setWords] = useState([]);
    const [song, setSong] = useState({})
    const [wordToGif, setWordToGif] = useState({})
    
    useEffect(()=>{
        setSong(extractSongFromData(musicData))
    }, [musicData])

    const title = song.title
    const artist = song.artists

    useEffect(()=>{
        getLyrics(title, artist)
    },[title, artist])


    const fetchAllGifs = async (topWords) =>{
        const gifSrcs = await Promise.all(
           topWords.map(async (word) => {
              try {
                const gifSrc = await getGif(word);
                return { word, gifSrc };
              } catch (error) {
                console.log(error);
                return { word, gifSrc: "" };
              }
            })
          );
          
          setGifSrcs(gifSrcs);
          mapWordToGif()
    }

    const getLyrics = async (title, artist) => {
        
        try {
          const response = await axios.get("http://localhost:3000/getLyrics", {
            params: {
              title: title,
              artist: artist,
            },
          });
          
          let { lyrics } = response.data;
          if(lyrics === null){
            lyrics = "No lyrics could be found"
          }

          setLyrics(lyrics);

          const lyricsArray = lyrics.toLowerCase().replace(/[^\w\s]/g, "").split(" ")
          const topWords = getTopWords(lyricsArray)
          setWords(topWords)
          fetchAllGifs(topWords)
        } catch (error) {
          console.log(error);
        }
      };

      const mapWordToGif = () =>{
        const gifMap = {}

        for(var i=0; i<words.length; i++){
            gifMap[words[i]] = gifSrcs[i]
        }

        console.log(gifMap)
      }
    

    return (
        <div className="song-container">
            
            <div className="song-details">

                <h1>{song.title}</h1>
                <h2>{song.artists}</h2>
                <FavoriteButton song={song} isFavorite={isFavorite} setIsFavorite={setIsFavorite} />
                <p>Released: {song.release}</p>
                <div>
                    <h3>Top 12 Words:</h3>
                    {
                        getTopWords(words).map((word, index) => (
                            <span key={index}>{word} </span>
                        ))
                    }
                </div>
                <h3>Lyrics:</h3>
                <pre className="lyrics-box">
                    {lyrics.split(" ").map((word, index) => (
                        <span
                            key={index}
                            style={{
                                textDecoration: words.includes(word.toLowerCase()) ? "underline" : "none",
                            }}
                        >
                        {`${word} `}
                        </span>
                    ))}
                </pre>
            </div>
            <div className="music-player">
                <iframe
                title={song.title}
                className="iframe"
                width="400"
                height="100"
                src={song.player}
                frameBorder="0"
                allowFullScreen
                />
                <h3>Top 12 GIFs:</h3>
                <div className="gif-grid">
                    {gifSrcs.map((gifSrc, index) => (
                        <div class="gif-cell" key={index}>
                            <img src={gifSrc?.gifSrc} alt="" height="100" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Song;
