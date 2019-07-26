const express = require('express')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { validateJwt, signJwtAndSend } = require('../Utility')
const { TABLE_USERS } = require('../Constants')

module.exports = (knex) => {
    // /auth
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

    router.get('/reset_password', async (req, res) => {
        try {
            const { token: reset_password_token } = req.query
            const user = await knex(TABLE_USERS).where({
                reset_password_token,
            }).first()

            if (user) {
                console.log({
                    eat: Number(user.reset_password_expires),
                    now: +Date.now()
                })
            }

            if (!user) {
                return res.status(403).send({
                    msg: 'password reset link invalid'
                })
            } else if (+Date.now() > Number(user.reset_password_expires)) { // token expired
                return res.status(403).send({
                    msg: 'password reset link expired'
                })
            } else {
                return res.status(200).send({
                    token: reset_password_token
                })
            }
        } catch(err) {
            console.log('reset_password', err)
            return res.sendStatus(500)
        }
    })

    router.post('/reset_password', async (req, res) => {
        try {
            const { email } = req.body
            if (!email) {
                return res.status(400).send({
                    msg: 'email required'
                })
            }

            const user = await knex(TABLE_USERS).where({
                email
            }).first()

            if (!user) {
                return res.status(400).send({
                    msg: 'email not found'
                })
            } else {
                const token = crypto.randomBytes(20).toString('hex')
                await knex(TABLE_USERS).where({
                    email
                })
                .update({
                    reset_password_token: token,
                    reset_password_expires: Date.now() + (60 * 60 * 1000) // valid for one hour from now
                }, '*')

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_ADDRESS,
                        pass: process.env.EMAIL_PASSWORD
                    }
                })
                const mailOptions = {
                    from: process.env.EMAIL_ADDRESS,
                    // to: user.email,
                    to: 'keanov@gmail.com',
                    subject: 'Link to reset password',
                    text: [
                        'You are receiving this because you (or someone else) has requested the reset of your password.',
                        'Please click on the following link to complete the process within one hour of receiving it:',
                        `http://localhost:3000/reset/${token}`,
                        'If you did not request this, please ignore this email and your password will remain unchanged.'
                    ].join('\n\n')
                }

                console.log('PASS RESET TOKEN:', token)
                transporter.sendMail(mailOptions, (err, resp) => {
                    if (err) {
                        console.error('Error sending password recovery email', err)
                        return res.sendStatus(500)
                    } else {
                        console.log('Nodemailer response:', resp)
                        return res.status(200).send({ token })
                    }
                })
            }
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    router.patch('/update_password_with_email', validateUpdatePasswordWithEmail, async (req, res) => {
        try {
            const { email, password, token } = req.body
            const password_digest = await bcrypt.hash(password, 10)
            const updatedUser = await knex(TABLE_USERS)
                .where({
                    email,
                    reset_password_token: token
                })
                .update({
                    password_digest,
                    reset_password_token: null,
                    reset_password_expires: null
                }, '*')

            // console.log('updated user', updatedUser)
            if (updatedUser.length > 0) {
                return res.sendStatus(204)
            } else {
                return res.status(400).send({
                    msg: 'Password not updated. Email/token was not valid.'
                })
            }
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    return router
}

function validateUpdatePasswordWithEmail(req, res, next) {
    if (!req.body.email) {
        return res.status(400).send({
            msg: 'email is a required field'
        })
    }

    if (!req.body.password) {
        return res.status(400).send({
            msg: 'password is a required field'
        })
    }

    if (!req.body.token) {
        return res.status(400).send({
            msg: 'token is a required field'
        })
    }

    return next()
}
