require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();
//onst bodyParser = require(body-parser);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(urlencoded({extended:true}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


// In-memory storage for URLs and their mappings
const urlMap = {};
let nextId = 1;

// Generate a sequential short URL
const generateShortUrl = (id) => {
    return id.toString(); // Use ID as short URL
};

// Route to shorten a URL
app.post('/api/shorturl', (req, res) => {
    const { url} = req.body;

    if (!url) {
      console.log(url);
        return res.status(400).json({ message: 'Original URL is required' });
        //console.log(url)
    }

    // Check if the original URL already has a shortened version
    for (const [shortUrl, urls] of Object.entries(urlMap)) {
        if (urls === url) {
            return res.json({ shortUrl, url });
        }
    }

    // Generate a new short URL
    const shortUrl = generateShortUrl(nextId);
    
    // Store the mapping in memory
    urlMap[shortUrl] = url;
    
    // Increment the ID for the next URL
    nextId++;

    res.status(201).json({ shortUrl, url });
});

// Route to resolve a short URL to its original URL
app.get('/api/shorturl/:shorturl', (req, res) => {
    const { shortUrl } = req.params;

    // Look up the original URL
    const original_url = urlMap[shortUrl];

    if (!original_url) {
        return res.status(404).json({ message: 'Short URL not found' });
    }

    res.redirect(url);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
