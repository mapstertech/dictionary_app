const { TABLE_WORDS } = require('../../Constants')

exports.up = function(knex) {
    return knex.schema.createTable(TABLE_WORDS, (table) => {
        table.increments('id').unsigned().primary()
        table.string('word').notNull()
        table.string('meaning').notNull()
        table.string('audio')
        table.string('images')
        table.string('grammar')
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable(TABLE_WORDS)
}
