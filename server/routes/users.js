const express = require('express')
const bcrypt = require('bcrypt')
const { TABLE_USERS } = require('../Constants')
const { validateJwt, signJwtAndSend } = require('../Utility')

module.exports = (knex) => {
    // api/features
    const router = express.Router()
    router.get('/', validateJwt, async (req, res) => {
        try {
            const users = await knex.select(['id', 'email', 'is_admin']).from(TABLE_USERS)
            return res.status(200).send(users)
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    router.post('/', async (req, res) => {
        try {
            const { email, password, is_admin } = req.body
            const password_digest = await bcrypt.hash(password, 10)
            const user = await knex(TABLE_USERS).insert({
                email,
                password_digest,
                is_admin
            }, '*')

            if (user) {
                return signJwtAndSend({ user: user[0] }, res, 201)
            }

            return res.sendStatus(500)
        } catch(err) {
            console.log('error in POST api/users', err)
            if (err.constraint === 'users_email_unique') {
                return res.status(403).send({
                    msg: `Email ${req.body.email} is already associated with an account.`
                })
            }

            return res.sendStatus(500)
        }
    })

    router.patch('/', async (req, res) => {
        try {
            return res.status(201).send({})
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    router.delete('/', validateJwt, validateUsersDelete, async (req, res) => {
        try {
            const { user } = req
            const { users } = req.body
            if (user.is_admin) {
                await knex(TABLE_USERS)
                    .whereIn('id', users)
                    .del()

                return res.sendStatus(202)
            } else {
                return res.status(403).send({ msg: `user ${user.email} is not an admin` })
            }
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    router.get('/:userId', async (req, res, next) => {
        try {
            const userFields = ['id', 'email', 'is_admin']
            const user = await knex.select(userFields)
                .from(TABLE_USERS).where({
                    id: req.params.userId
                })
            return res.send(user)
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    return router
}

function validateUsersDelete(req, res, next) {
    // TODO add is_admin authentication
    if (!req.body.users || !Array.isArray(req.body.users)) {
        return res.status(400).send({
            msg: 'users missing and/or users is not an array'
        })
    }

    const validUserIds = req.body.users.every((id) => {
        return typeof id === 'number'
    })

    if (!validUserIds) {
        return res.status(400).send({
            msg: 'one or more word ids is not of type number'
        })
    }

    return next()
}
