require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const useMorgan = process.env.NODE_ENV === 'production' ? morgan('prod') : morgan('dev')
const cors = require('cors')
const bodyParser = require('body-parser')
const { production: knexConfigProd, development: knexConfigDev } = require('./knexfile')
const knexConfig = process.env.NODE_ENV === 'production' ? knexConfigProd : knexConfigDev
const knex = require('knex')(knexConfig)
const PORT = process.env.PORT || 4000
const routes =  require('./routes')

const app = express()
app.use(useMorgan)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors())

// Router
app.use('/api', routes.API(knex))
app.use('/auth', routes.AUTH(knex))

app.get('*', (req, res) => {
    return res.sendStatus(404)
})

app.listen(PORT, () => {
    console.log(`Project 44 server started on ${PORT}`)
})
