const dirPath = '/home/ampp33/projects/keyboards/switches.mx/content/collections/switches/output/'

const dbCreds = require('./credentials.json')
const fs = require('fs')
const nano = require('nano')(`http://${dbCreds.username}:${dbCreds.password}@127.0.0.1:5984`)

const switchTable = nano.db.use('switch')

fs.readdir(dirPath, async (err, files) => {
    const promises = []

    files.forEach(async file => {
        const text = fs.readFileSync(dirPath + file, 'utf8')
        const json = JSON.parse(text)
        const data = {
            ...json,
            _id: json.id
        }

        promises.push(
            switchTable.insert(data)
        )
    })

    console.log('waiting for all promises to complete...')
    Promise.all(promises)
    console.log('done!')
})
