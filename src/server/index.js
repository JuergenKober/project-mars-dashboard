require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// API call to retrieve latest rover photos by date
// example API call http://localhost:3000/rover_photos/curiosity/2015-6-3
app.get('/rover_photos/:rover_name/:earth_date', async (req, res) => {
    try {
        let rover_photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.rover_name.toLowerCase()}/photos?earth_date=${req.params.earth_date}&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ rover_photos });
    } catch (err) {
        console.log('error:', err);
    }
})


// API call to retrieve mission manifest
// from https://api.nasa.gov/: A mission manifest is available for each Rover
// at /manifests/rover_name. This manifest will list details of the Rover's
// mission to help narrow down photo queries to the API
// example API call http://localhost:3000/manifest/Curiosity
app.get('/manifest/:rover_name', async (req, res) => {
    try {
        console.log('rover_name:', req.params.rover);
        let manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${req.params.rover_name}/?api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ manifest });
    } catch (err) {
        console.log('error:', err);
    }
})

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        console.log('image from /apod');
        res.send({ image });
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
