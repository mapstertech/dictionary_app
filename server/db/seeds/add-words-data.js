const wordsTable = 'words'

exports.seed = async function(knex) {
    try {
        const wordsSeed = require('../../../assets/rubys-sample-data.json')        

        return knex(wordsTable).del()
            .then(() => knex(wordsTable).insert(wordsSeed))
    } catch(err) {
        console.log('error in seeds/add-units.js')
        console.log(error)
    }
}
