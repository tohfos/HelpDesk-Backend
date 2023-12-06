const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.REACT_APP_API_URL,
]

module.exports = allowedOrigins