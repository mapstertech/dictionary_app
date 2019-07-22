const express = require('express')
const wordsRoutes = require('./words')
const usersRoutes = require('./users')

module.exports = {
    API: (knex) => {
        // define submodules of /api here
        const router = express.Router()
        router.use('/words', wordsRoutes(knex))
        router.use('/users', usersRoutes(knex))

        router.get('/', async (req, res) => {
            console.log('api')
            res.send('/api')
        })

        return router
    },
    // AUTH: (knex) => {
    //     // define submodules of /auth here
    //     const router = express.Router()
    //     router.use('/', authRoutes(knex))

    //     router.get('/', async (req, res) => {
    //         console.log('auth')
    //         res.send('/auth')
    //     })

    //     return router
    // },
}
