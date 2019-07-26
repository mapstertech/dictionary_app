const { TABLE_USERS } = require('../../Constants')

exports.up = function(knex) {
    return knex.schema.createTable(TABLE_USERS, (table) => {
        table.increments('id').unsigned().primary()
        table.string('email').notNull()
        table.string('password_digest').notNull()
        table.boolean('is_admin').notNull().defaultTo(false)

        table.unique('email')
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable(TABLE_USERS)
}
