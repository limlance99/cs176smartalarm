module.exports = {
    SERVER_URL: process.env.NODE_ENV === 'production' ? "" : "http://localhost:3000",
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USERNAME: process.env.DB_USERNAME || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'password',
    DB_DATABASE: process.env.DB_DATABASE || 'smartalarm',
}