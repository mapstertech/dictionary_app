const bcrypt = require('bcrypt')
const { TABLE_USERS } = require('../../Constants')

exports.seed = async function(knex) {
    try {
        const users = [
            {
                email: 'admin@mapster.com',
                password_digest: await bcrypt.hash('testpass1', 10),
                is_admin: true
            },
            {
                email: 'general@mapster.com',
                password_digest: await bcrypt.hash('testpass1', 10),
                is_admin: false
            }
        ]

        return knex(TABLE_USERS).del().then(() => knex(TABLE_USERS).insert(users))
    } catch(err) {
        console.log('error in seeds/add-war-diaries.js')
        console.log(error)
    }
}
