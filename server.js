import express from 'express'
import {searchForSong, searchForGif, searchForLyrics, searchAllSongs} from './src/api-call.js'


    const app = express();
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    app.get('/search', async (req, res) => {
        // console.log('Req', req)
        const query = req.query.q;
        
        if (!query) {
        res.status(400).json({ error: 'Missing query parameter' });
        return;
        }
        const result = await searchForSong(query);

        res.json(result);
    });

    app.get('/searchAll', async (req, res) => {
        // console.log('Req', req)
        const query = req.query.q;
        
        if (!query) {
        res.status(400).json({ error: 'Missing query parameter' });
        return;
        }
        const result = await searchAllSongs(query);

        res.json(result);
    });

    app.get('/getGif', async (req, res) => {
        // console.log('Req', req)
        const query = req.query.q;
        
        if (!query) {
            res.status(400).json({ error: 'Missing query parameter' });
            return;
        }
        
        const response = await searchForGif(query)

        const gif = response.data

        res.json(gif.data);
    })

    app.get('/getLyrics', async (req, res) => {
        // console.log('Req', req)
        const title = req.query.title;
        const artist = req.query.artist
        
        if (!title || !artist) {
            res.status(400).json({ error: 'Missing query parameter' });
            return;
        }
        
        const response = await searchForLyrics({title, artist})
        console.log('Lyrics', response)
        // const gif = response.data

        res.json({ lyrics:response });
    })
    
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    
