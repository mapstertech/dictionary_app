const express = require('express')
const bcrypt = require('bcrypt')
const { validateJwt, signJwtAndSend } = require('../Utility')
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
                    return signJwtAndSend({ user }, res, 200)
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

    router.post('/verify', validateJwt, (req, res) => {
        const { token } = req
        return res.status(200).json({
            token,
            user: {
                id: req.user.id,
                email: req.user.email,
                is_admin: req.user.is_admin
            }
        });
    })

    return router
}
