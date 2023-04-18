import axios from 'axios'
import dotenv  from "dotenv"
import { getLyrics } from 'genius-lyrics-api';

dotenv.config()

const GENIUS_API_URL = 'https://api.genius.com';
const SESSION_TOKEN = process.env.VITE_SESSION_TOKEN

const GIPHY_API_KEY = process.env.VITE_GIPHY_API_KEY
const GIPHY_API_URL = `https://api.giphy.com/v1/gifs`


// Function to search for a song by title
export const searchForSong = async (songTitle) => {
  try {
    const response = await axios.get(`${GENIUS_API_URL}/search?q=${songTitle}`, {
      headers: {
        Authorization: `Bearer ${SESSION_TOKEN}`
      }
    });

    // Extract the song ID from the search results
    const songId = response.data.response.hits[0].result.id;

    // Fetch the song details using the ID
    const songResponse = await axios.get(`${GENIUS_API_URL}/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${SESSION_TOKEN}`
      }
    });


    return songResponse.data.response.song;
  } catch (error) {
    console.error(error);
    return { error:error.message }
  }
}

export const searchAllSongs = async (songTitle) => {
  try {
    const response = await axios.get(`${GENIUS_API_URL}/search?q=${songTitle}`, {
      headers: {
        Authorization: `Bearer ${SESSION_TOKEN}`
      }
    });

    // Extract the song ID from the search results
    const matches = response.data.response.hits;
    return matches
  } catch (error) {
    console.error(error);
    return { error:error.message }
  }
}

export const searchForGif = async (searchTerm) =>{
  try {
    const response = await axios.get(`${GIPHY_API_URL}/translate?api_key=${GIPHY_API_KEY}&s=${searchTerm}`);
    // console.log(response)
    return response
  } catch (error) {
    console.error(error);
    return { error:error.message }
  }
}

export const searchForLyrics = async ({title, artist}) =>{
  try {
    const options = {
      apiKey: process.env.VITE_SESSION_TOKEN,
      title: title,
      artist: artist,
      optimizeQuery: true
    };
    
    const lyrics = await getLyrics(options);
    return lyrics
  } catch (error) {
    console.error(error);
    return { error:error.message }
  }
}

export default { searchForSong, searchForGif, searchForLyrics, searchAllSongs }
