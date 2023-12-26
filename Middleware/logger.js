const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const Log  = require('../models/LogModel')

// dateTime ID req orgin

const logEvents = async (message , origin) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    //const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    const logItem = {
        dateTime: dateTime,
        uuid: uuid(),
        message: message,
        origin : origin
    }

    try {
        const log = new Log(logItem)
        await log.save()
        console.log(logItem)

    }
    catch (err) {
        console.log(err)
    }
    // try {
    //     if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
    //         await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    //     }
    //     await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    // } catch (err) {
    //     console.log(err)
    // }
}

// const logger = (req, res, next) => {
//     logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, req.headers.origin)
//     console.log(`${req.method} ${req.path}`)
//     next()
// }

module.exports = { logEvents } //logger