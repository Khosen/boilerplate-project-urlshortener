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
app.post('/api/short_url', (req, res) => {
    const { original_url} = req.body;

    if (!original_url) {
      console.log(original_url);
        return res.status(400).json({ message: 'Original URL is required' });
        //console.log(url)
    }

    // Check if the original URL already has a shortened version
    for (const [short_url, urls] of Object.entries(urlMap)) {
        if (urls === original_url) {
            return res.json({ original_url, short_url });
        }
    }

    // Generate a new short URL
    const short_url = generateShortUrl(nextId);
    
    // Store the mapping in memory
    urlMap[short_url] = original_url;
    
    // Increment the ID for the next URL
    nextId++;

    res.status(201).json({ original_url, short_url });
});

// Route to resolve a short URL to its original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
    const { short_url } = req.params;

    // Look up the original URL
    const original_url = urlMap[short_url];

    if (!original_url) {
        return res.status(404).json({ message: 'Short URL not found' });
    }

    res.redirect(original_url);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
