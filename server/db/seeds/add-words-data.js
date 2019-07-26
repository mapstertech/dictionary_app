const { TABLE_WORDS } = require('../../Constants')

exports.seed = async function(knex) {
    try {
        const wordsSeed = require('../data/diti-seed-data.json').map((row) => {
            return {
                word: row.Ditidaht,
                meaning: row.English
            }
        })

        return knex(TABLE_WORDS).del()
            .then(() => knex(TABLE_WORDS).insert(wordsSeed))
    } catch(err) {
        console.log('error in seeds/add-units.js')
        console.log(error)
    }
}
