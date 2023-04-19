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
    
    return sortedWords.slice(0, 10);
}


async function getTopWordsGifs(lyrics) {
    // Remove punctuation and convert to lowercase
    const cleanedLyrics = lyrics.replace(/[^\w\s]/gi, '').toLowerCase();
    // Split into words
    const words = cleanedLyrics.split(/\s+/);
    // Count the frequency of each word
    const frequencies = {};
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (frequencies[word]) {
        frequencies[word]++;
      } else {
        frequencies[word] = 1;
      }
    }
    // Sort the words by frequency and get the top 10
    const topWords = Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]).slice(0, 10);
    // Get a GIF for each word
    const gifs = [];
    for (let i = 0; i < topWords.length; i++) {
      const word = topWords[i];
      try {
        const gifSrc = await getGif(word);
        gifs.push({ word, gifSrc });
      } catch (error) {
        console.log(error);
      }
    }
    return gifs;
  }      
  

const extractSongFromData = (musicData)=>{
    let song = {
        player:musicData.apple_music_player_url,
        artists:musicData.artist_names,
        title:musicData.full_title,
        id:musicData.id,
        lyrics:musicData.url,
        data:musicData.release_date_for_display
    }

    return song
}


function Song({ musicData }) {
    const [gifSrcs, setGifSrcs] = useState([])
    const [lyrics, setLyrics] = useState("")
    const [isFavorite, setIsFavorite] = useState(false)
    const [words, setWords] = useState([]);
    const [song, setSong] = useState({})
    
    
    
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
                console.log('Gif', gifSrc)
                return { word, gifSrc };
              } catch (error) {
                console.log(error);
                return { word, gifSrc: "" };
              }
            })
          );
          console.log('gifSrcs',gifSrcs)
          
          setGifSrcs(gifSrcs);
    }

    const getLyrics = async (title, artist) => {
        console.log('Lyrics get', title, artist)
        try {
          const response = await axios.get("http://localhost:3000/getLyrics", {
            params: {
              title: title,
              artist: artist,
            },
          });
          console.log('Response for lyrics', response)
          let { lyrics } = response.data;
          if(lyrics === null){
            //dangerous
            lyrics = "No lyrics could be found"
          }

          setLyrics(lyrics);

          const sortedLyrics = lyrics.toLowerCase().replace(/[^\w\s]/g, "").split(" ")
          const topWords = sortedLyrics.slice(0, 10)
          console.log('Top words', topWords)
          fetchAllGifs(topWords)
        } catch (error) {
          console.log(error);
        }
      };
    

    return (
        <div className="song-container">
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
                <h3>Top 10 Words:</h3>
                <div style={{ display: "flex" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {gifSrcs.slice(0, 4).map((gifSrc, index) => (
                            <div key={index}>
                                <img src={gifSrc?.gifSrc} alt="" height="100" />
                            </div>
                        ))}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {gifSrcs.slice(4, 8).map((gifSrc, index) => (
                            <div key={index}>
                                <img src={gifSrc?.gifSrc} alt="" height="100" />
                            </div>
                        ))}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {gifSrcs.slice(8, 10).map((gifSrc, index) => (
                            <div key={index}>
                                <img src={gifSrc?.gifSrc} alt="" height="100" />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <div className="song-details">

                <h1>{song.title}</h1>
                <h2>{song.artists}</h2>
                <FavoriteButton song={song} isFavorite={isFavorite} setIsFavorite={setIsFavorite} />
                <p>Year: {song.year}</p>
                <div>
                    <h3>Top 10 Words:</h3>
                    {getTopWords(words).map((word, index) => (
                        <span key={index}>{word} </span>
                    ))}
                </div>
                <pre>{lyrics}</pre>
            </div>
        </div>
    );
}

export default Song;
