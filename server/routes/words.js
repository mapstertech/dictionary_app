const express = require('express')
const { TABLE_WORDS } = require('../Constants')
const Utility = require('../Utility')

module.exports = (knex) => {
    // api/features
    const router = express.Router()
    router.get('/', async (req, res) => {
        try {
            const words = await knex(TABLE_WORDS)
            return res.status(200).send(words)
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    router.post('/', validateWordsCreate, async (req, res) => {
        try {
            const { words } = req.body
            const createdWordsRows = await knex(TABLE_WORDS).insert(words, '*')
            return res.status(201).send(createdWordsRows)
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    router.patch('/', validateWordsUpdate, async (req, res) => {
        try {
            const { words } = req.body
            const completedTransaction = await Utility.batchUpdate(knex, TABLE_WORDS, words)
            const updatedRows = completedTransaction.flat()

            return res.status(201).send(updatedRows)
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    router.delete('/', validateWordsDelete, async (req, res) => {
        try {
            const { words } = req.body
            await knex(TABLE_WORDS)
                .whereIn('id', words)
                .del()

            return res.sendStatus(202)
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    router.get('/:wordId', async (req, res, next) => {
        try {
            if (typeof req.params.wordId !== 'number') {
                return next()
            }
            return res.send({})
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    return router
}

function validateWordsCreate(req, res, next) {
    if (req.body.words && Array.isArray(req.body.words)) {
        return next()
    } else {
        return res.status(400).send({ msg: 'words missing and/or words is not an array'})
    }
}

function validateWordsUpdate(req, res, next) {
    if (!req.body.words || !Array.isArray(req.body.words)) {
        return res.status(400).send({ msg: 'word missing and/or word is not an array'})
    }

    const validFeatureIds = req.body.words.every((word) => {
        return word.id && typeof word.id === 'number'
    })

    if (!validFeatureIds) {
        return res.status(400).send({ msg: 'id missing/not valid from one or more word(s)'})
    }

    return next()
}

function validateWordsDelete(req, res, next) {
    // TODO add is_admin authentication
    if (!req.body.words || !Array.isArray(req.body.words)) {
        return res.status(400).send({ msg: 'words missing and/or words is not an array'})
    }

    const validWordIds = req.body.words.every((id) => {
        return typeof id === 'number'
    })

    if (!validWordIds) {
        return res.status(400).send({ msg: 'one or more word ids is not of type number'})
    }

    return next()
}
