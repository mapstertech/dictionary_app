module.exports = {
    batchUpdate(knex, table, collection) {
        return knex.transaction((trx) => {
            const queries = collection.map((tuple) =>
                knex(table)
                .where('id', tuple.id)
                .update(tuple, '*')
                .transacting(trx)
            )
            return Promise.all(queries)
                .then(trx.commit)
                .catch(trx.rollback);
        })
    },
}
