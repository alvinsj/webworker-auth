const express = require('express')
const app = express().use(express.json())

let authToken = undefined

app.get('/', (req, res) => {
  res.send('Hello from the server!')
})

app.post('/login', (req, res) => {
  const {username, password} = req.body || {}

  if(username ===  "alvin" && password === "#secretAvocad0") {
    authToken = authToken || require('crypto').randomBytes(64).toString('hex')
    res.json({ token: authToken })
    
    return
  }
  
  res.status(400).json({ error: "Invalid login.", body: { username, password } })
})

const isAuthenticated = (authorization) => 
  authToken && new RegExp(authToken).test(authorization)

app.delete('/logout', (req, res) => {
  const { authorization } = req.headers || {}

  if( isAuthenticated(authorization) ) {
    authToken = undefined // unset 
    res.json({ message: 'ok' })

    return
  }
  
  res.status(400).json({ error: "Invalid auth token.", authToken, authorization })
})

app.post('/new', (req, res) => {
  const { authorization } = req.headers || {}

  if( isAuthenticated(authorization) ) {
    res.json({ message: 'ok' })

    return
  }

  res.status(401).json({ error: "Unauthorized request." })
})

app.get('/download', (req, res) => {
  const { authorization } = req.headers || {}

  if( isAuthenticated(authorization) ) {
    res.sendFile(require('path').join(__dirname, '../public/github-git-cheat-sheet.pdf'))
  
    return
  }

  res.status(401).json({ error: "Unauthorized request." })
})

app.post('/upload', (req, res) => {
  const { authorization } = req.headers || {}

  if( isAuthenticated(authorization) ) {
    res.json({ message: 'ok' })
  }

  res.status(401).json({ error: "Unauthorized request." })
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
