require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

//hier werden alle refresh tokens gespeichert
//datenbank wäre besser
let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401) //401 = unauthorized
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403) //403 = forbidden, not valid
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json( { accessToken: accessToken })
    })
})

app.delete('/logout', (req, res) => {
    //löscht den refresh token aus dem array
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204) //204 = no content
})

app.post('/login', (req, res) => {
    // Authenticate User with JWT
    const username = req.body.username
    const user = { name: username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken: accessToken, refreshToken: refreshToken})
})

function generateAccessToken(user){
    //ACCESS_TOKEN_SECRET wurde mit require('crypto').randomBytes(64).toString('hex') erstellt
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

app.listen(4000)