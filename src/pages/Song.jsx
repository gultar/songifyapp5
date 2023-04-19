import axios from 'axios';
import { useEffect, useState } from 'react';
import FavoriteButton from '../components/add-button';

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
    const [gifSrc, setGifSrc] = useState("")
    const [lyrics, setLyrics] = useState("")
    const [isFavorite, setIsFavorite] = useState(false)

    const song = extractSongFromData(musicData)
    const searchTerm = song.title

    useEffect(()=>{
        getLyrics(song.title, song.artists)
    },[searchTerm])


    const getGif = async (searchTerm) => {
        try {
          const response = await axios.get("http://localhost:3000/getGif", {
            params: {
              q: searchTerm,
            },
          });
      
          const { images } = response.data;
          const { original } = images;
          setGifSrc(original.url);
        } catch (error) {
          console.log(error);
        }
      };

    const getLyrics = async (title, artist) => {
        try {
          const response = await axios.get("http://localhost:3000/getLyrics", {
            params: {
              title: title,
              artist: artist
            },
          });
          
          const {lyrics} = response.data;
          setLyrics(lyrics);
          getGif(song.title)
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
                height="300"
                src={song.player}
                frameBorder="0"
                allowFullScreen
                />
                This Song's inspired GIF : <img src={gifSrc} alt="" height="150" width="250" />
            </div>
            <div className="song-details">

                <h1>{song.title}</h1>
                <h2>{song.artists}</h2>
                <FavoriteButton song={song} isFavorite={isFavorite} setIsFavorite={setIsFavorite} />
                <p>Year: {song.year}</p>
                <pre>{lyrics}</pre>
            </div>
        </div>
    );
}

export default Song;
