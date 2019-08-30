const path = require('path')
const express = require('express')
const hbs = require('hbs')
const PexelsAPI = require('pexels-api-wrapper')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


var pexelsClient = new PexelsAPI('563492ad6f917000010000017fef476acd514156a6fbab947a67eb75')

const app = express()

// Paths for express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Luiz Fernando'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Luiz Fernando'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide a location.'
        })
    }

    geocode(req.query.address, (error, { longitude, latitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            pexelsClient.search(req.query.address, 1, 1)
                .then(function (result) {
                    if (!result.photos[0]) {
                        return res.send({ error: 'Place not found. Please try again.' })
                    }
                    let imgURL = result.photos[0].src.medium
                    res.send({ location, forecastData, imgURL })
                }).
                catch(function (e) {
                    console.log(e);
                });


        })
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        message: 'Page not found!',
        name: 'Luiz Fernando'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})

