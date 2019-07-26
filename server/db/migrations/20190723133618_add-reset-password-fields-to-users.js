const { TABLE_USERS } = require('../../Constants')

exports.up = function(knex) {
    return knex.schema.table(TABLE_USERS, (table) => {
        table.string('reset_password_token')
        table.bigInteger('reset_password_expires')
    })
}

exports.down = function(knex) {
    return knex.schema.table(TABLE_USERS, (table) => {
        table.dropColumn('reset_password_token')
        table.dropColumn('reset_password_expires')
    })
}
