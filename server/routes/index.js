const express = require('express')
const wordsRoutes = require('./words')
const usersRoutes = require('./users')
const authRoutes = require('./auth')

module.exports = {
    API: (knex) => {
        // define submodules of /api here
        const router = express.Router()
        router.use('/words', wordsRoutes(knex))
        router.use('/users', usersRoutes(knex))

        router.get('/', async (req, res) => {
            res.send({ msg: '/api'})
        })

        return router
    },
    AUTH: (knex) => {
        // define submodules of /auth here
        const router = express.Router()
        router.use('/', authRoutes(knex))

        router.get('/', async (req, res) => {
            res.send({ msg: '/auth'})
        })

        return router
    },
}
