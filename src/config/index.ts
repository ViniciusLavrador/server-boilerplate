import dotenv from 'dotenv'

// set NODE_ENV to development by default 
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let envFound = dotenv.config();

// crash the entire server process if .env file isn't found
if (envFound.error) {
    throw new Error("Could't find a valid .env file");
}

const config =  {
    server: {
        hostname: process.env.NODE_ENV == 'development' ? 
            'localhost' : process.env.hostname,
        port: process.env.PORT || 3000, 
        ssl: !!+process.env.SSL_ENABLED || false,
    },
    log: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    api: {
        path: '/api',
        authentication: {
            saltRounds: process.env.SALT_ROUNDS || 10,
            tokens: {
                accessToken: {
                    duration: '15m',
                    secret: process.env.ACCESS_TOKEN_SECRET || 'IAIDQW48QWHAHQWH'
                },
                refreshToken: {
                    duration: '7d',
                    secret: process.env.REFRESH_TOKEN_SECRET || 'HD9AYSD7AGSDGASD'
                }
            }
        }
    }
}

export default config;