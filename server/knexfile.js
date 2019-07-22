module.exports = {
  development: {
      client: 'postgresql',
      connection: {
          database: 'diti_dictionary_dev',
          host: '127.0.0.1',
          user: process.env.USER,
          password: '',
          debug: true
      },
      migrations: {
          directory: './db/migrations'
      },
      seeds: {
          directory: './db/seeds'
      }
  },
  production: {
      client: 'postgresql',
      connection: process.env.DATABASE_URL,
      migrations: {
          directory: './db/migrations'
      },
      seeds: {
          directory: './db/seeds'
      },
      pool: {
          min: 2,
          max: 10
      },
  },
}
