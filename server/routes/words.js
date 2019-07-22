const express = require('express')
const tableName = 'words'

module.exports = (knex) => {
    // api/features
    const router = express.Router()
    router.get('/', async (req, res) => {
        try {
            return res.status(200).send({})            
        } catch(err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    router.post('/', async (req, res) => {
        try {
            return res.status(201).send({})
        } catch(err) {
            console.log(err)
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

    router.delete('/', async (req, res) => {
        try {
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

// function validateFrontLinesCreate(req, res, next) {
//     if (req.body.features && Array.isArray(req.body.features)) {
//         return next()
//     } else {
//         return res.status(400).send('features missing and/or features is not an array')
//     }
// }

// function validateFeaturesUpdate(req, res, next) {
//     if (!req.body.features || !Array.isArray(req.body.features)) {
//         return res.status(400).send('features missing and/or features is not an array')
//     }

//     const validFeatureIds = req.body.features.every((feature) => {
//         return feature.properties.feature_id && typeof feature.properties.feature_id === 'number'
//     })

//     if (!validFeatureIds) {
//         return res.status(400).send('feature.properties.feature_id missing/not valid from one or more features')
//     }

//     return next()
// }

// function validateFeaturesDelete(req, res, next) {
//     if (!req.body.features || !Array.isArray(req.body.features)) {
//         return res.status(400).send('features missing and/or features is not an array')
//     }

//     const validFeatureIds = req.body.features.every((id) => {
//         return typeof id === 'number'
//     })

//     if (!validFeatureIds) {
//         return res.status(400).send('one or more feature ids is not of type number')
//     }

//     return next()
// }
