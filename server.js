require('dotenv').config()

// Manuel Reicht 5A NVSV
// JWT Intro

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
app.use(express.json())

const posts = [
    {
        username: 'Manuel',
        title: 'Post 1'
    },
    {
        username: 'Max',
        title: 'Post 2'
    }
]

// gibt nur posts von dem angemeldeten user zurück
app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

// authentifiziert den token
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401) //401 = unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403) //403 = forbidden, not valid
        req.user = user
        next()
    })
}

app.listen(3000)