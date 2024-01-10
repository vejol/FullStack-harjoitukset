const express = require('express')
const logger = require('./utils/logger')

const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { PORT, MONGODB_URI } = require('./utils/config')
const blogsRouter = require('./controllers/blogs')

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
