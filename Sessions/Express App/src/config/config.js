
const env = process.env.NODE_ENV; //'dev'/'test'/'production'

const dev = {
    app: {
        host: process.env.DEV_HOST,
        port: process.env.DEV_PORT
    },
    db: {
        connectionString: process.env.DEV_DB_CONNECTION_STRING
    }
}

const test = {
    app: {
        host: process.env.TEST_HOST,
        port: process.env.TEST_PORT
    },
    db: {
        connectionString: process.env.TEST_DB_CONNECTION_STRING
    }
}

const production = {
    app: {
        host: process.env.DEV_HOST,
        port: process.env.DEV_PORT
    },
    db: {
        connectionString: process.env.DEV_DB_CONNECTION_STRING
    }
}

const config = {
    dev,
    test,
    production
}

module.exports = config[env];