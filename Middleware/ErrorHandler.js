const { logEvents } = require('./logger')

const errorHandler = async (err, req, res, next) => {
    await logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}`, req.headers.origin)
    console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500 // server error 

    res.status(status)

    res.json({ message: err.message })
}

module.exports = errorHandler 