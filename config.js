module.exports = {
    SERVER_URL: process.env.NODE_ENV === 'production' ? "" : "http://localhost:3000",
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USERNAME: process.env.DB_USERNAME || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'password',
    DB_DATABASE: process.env.DB_DATABASE || 'smartalarm',
    PG_URL: process.env.HEROKU_POSTGRESQL_NAVY_URL || "postgres://jsxxfjdcdrhgml:fa3355e144d9592c096fc4be5d4f67f9d76490417b4b00ebc2e24a0880296353@ec2-107-20-153-39.compute-1.amazonaws.com:5432/d74f8100q5obef",
}