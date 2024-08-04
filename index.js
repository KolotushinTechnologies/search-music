const express = require("express");
const axios = require("axios");
const fs = require("fs");
const config = require("config");
const qs = require('querystring');

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const port = 4000;

// Connect DataBase
connectDB();


    // Discogs: waTRxYVsDLhHwwboYevxzKxvOrmoluDzhpxKRMbc
    // discogsApiKey	yQxqSzaAbuCKfLlUStcQ
    // discogsApiSecret	WTkhVXsVIhHMZzzpOYCrbgTsgXTNAlaM
    // Access to URL	https://api.discogs.com/oauth/access_token
    // YouTube: AIzaSyCB7ZtMqcUX2Ij6GyBV7DlqsYg8GfcM3AI

    // Spotify Client ID 185b0225d20e41ffa3184cc7cad1b83a
    // Spotify Client secret c4b9e87df8564cbc9074c16a5fc1f8b4

// title
// artist
// album

app.get('/search', async (req, res) => {
  const { title, artist, album, label, year, genre, style } = req.query;
  const searchTerm = req.query.term;

  try {
    const youtubeMusicApiKey = 'AIzaSyCB7ZtMqcUX2Ij6GyBV7DlqsYg8GfcM3AI';

    const youtubeMusicUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}+${title}+${artist}+${album}+${label}+${year}+${genre}+${style}&key=${youtubeMusicApiKey}`;

    const youtubeMusicResponse = await axios.get(youtubeMusicUrl);

    const youtubeMusicResults = youtubeMusicResponse.data.items.map(item => {
      return {
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        url: `https://youtube.com/video/${item.id.videoId}`,
        additionally: item
      };
    });

    const discogsApiKey = 'yQxqSzaAbuCKfLlUStcQ';
    const discogsApiSecret = 'WTkhVXsVIhHMZzzpOYCrbgTsgXTNAlaM';

    const discogsUrl = `https://api.discogs.com/database/search?q=${searchTerm}+${title}+${artist}+${album}+${label}+${year}+${genre}+${style}&type=release`;

    const discogsResponse = await axios.get(discogsUrl, {
      headers: {
        Authorization: `Discogs key=${discogsApiKey}, secret=${discogsApiSecret}`,
      },
    });

    const discogsResults = discogsResponse.data.results.map(result => {
      return {
        title: result.title,
        artist: result.artist,
        year: result.year,
        url: `https://www.discogs.com/${result.uri}`,
        additionally: result
      };
    });

    const spotifyClientId = '185b0225d20e41ffa3184cc7cad1b83a';
    const spotifyClientSecret = 'c4b9e87df8564cbc9074c16a5fc1f8b4'

    const authResponse = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'client_credentials',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64')}`,
      },
    });

    const spotifyAccessToken = authResponse.data.access_token;

    const spotifyUrl = `https://api.spotify.com/v1/search?q=${searchTerm}+${title}+${artist}+${album}+${label}+${year}+${genre}+${style}&type=track`;

    const spotifyResponse = await axios.get(spotifyUrl, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    const spotifyResults = spotifyResponse.data.tracks.items.map(item => {
      return {
        title: item.name,
        artist: item.artists[0].name,
        album: item.album.name,
        url: item.external_urls.spotify,
        additionally: item
      };
    });

    res.json({
      youtube: youtubeMusicResults,
      spotify: spotifyResults,
      discogs: discogsResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  return console.log(`Express server listening at http://localhost:${port}`);
});
