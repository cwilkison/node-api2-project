const express = require('express')
const postsRouter = require('./posts/posts-router')
const server = express()
server.use(express.json())
server.get('/', (req, res) => {
    res.json({ query: req.query, params: req.params, headers: req.header})
})
server.use('/api/posts', postsRouter)
server.listen(4000, () => {
    console.log('\n*** Server Running on localhost:4000 ***\n')
})