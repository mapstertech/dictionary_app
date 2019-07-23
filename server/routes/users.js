const express = require('express')
const bcrypt = require('bcrypt')
const { TABLE_USERS, EMAIL_ADDRESS_MISSING_ERROR, ID_TYPE_ERROR, PASSWORD_RESTRICTED_ERROR } = require('../Constants')
const { validateJwt, signJwtAndSend, validateUserAdmin, batchUpdate } = require('../Utility')

module.exports = (knex) => {
    // /api/users
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

    router.patch('/', validateJwt, validateUsersUpdate, async (req, res) => {
        try {
            const { users } = req.body
            const completedTransaction = await batchUpdate(knex, TABLE_USERS, users)
            const updatedRows = completedTransaction.flat()

            return res.status(201).send(updatedRows)
        } catch(err) {
            console.log('error in PATCH users:', err)
            if (err.constraint === 'users_email_unique') {
                return res.status(403).send({
                    msg: `Email ${req.body.email} is already associated with an account.`
                })
            }
            return res.sendStatus(500)
        }
    })

    router.delete('/', validateJwt, validateUsersDelete, async (req, res) => {
        try {
            const { users } = req.body

            await knex(TABLE_USERS)
                .whereIn('id', users)
                .del()

            return res.sendStatus(202)
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

function validateUsersUpdate(req, res, next) {
    if (!req.body.users || !Array.isArray(req.body.users)) {
        return res.status(400).send({
            msg: 'users missing and/or users is not an array'
        })
    }

    const errorMessages = req.body.users.reduce((acc, cur) => {
        if (typeof cur.id !== 'number' && !acc.includes(ID_TYPE_ERROR)) {
            acc.push(ID_TYPE_ERROR)
        }
        if (!cur.email && !acc.includes(EMAIL_ADDRESS_MISSING_ERROR)) {
            acc.push(EMAIL_ADDRESS_MISSING_ERROR)
        }
        if (cur.password && !acc.includes(PASSWORD_RESTRICTED_ERROR)) {
            acc.push(PASSWORD_RESTRICTED_ERROR)
        }

        return acc
    }, [])

    if (errorMessages.length > 0) {
        return res.status(400).send({
            msg: errorMessages
        })
    }

    return next()
}
