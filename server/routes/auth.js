const express = require('express')
const bcrypt = require('bcrypt')
const Utility = require('../Utility')
const { TABLE_USERS } = require('../Constants')

module.exports = (knex) => {
    // auth/login
    const router = express.Router()
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await knex(TABLE_USERS).where({
                email
            })
            .first()

            if (user) {
                const authorized = await bcrypt.compare(password, user.password_digest)
                if (authorized) {
                    return Utility.signJwtAndSend({ user }, res, 200)
                } else {
                    return res.status(401).send({ msg: 'invalid password' })
                }
            } else {
                return res.status(401).send({ msg: `email ${email} not found` })
            }
        } catch (err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    router.post('/register', async (req, res) => {
        try {
            const { email, password } = req.body
            const password_digest = await bcrypt.hash(password, 10)
            const user = await knex(TABLE_USERS).insert({
                email,
                password_digest
            }, '*')

            if (user) {
                return Utility.signJwtAndSend({ user }, res, 201)
            }

            return res.sendStatus(500)
        } catch(err) {
            console.log('error in POST auth/register', error)
            if (error.constraint === 'users_email_unique') {
                return res.status(403).send({
                    msg: `Email ${req.body.email} is already associated with an account.`
                })
            }

            return res.sendStatus(403)
        }
    })

    return router
}
