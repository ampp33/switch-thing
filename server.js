const express = require('express')
const cors = require('cors');
const app = express()
const port = 8081

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:8080'
}));

// TODO log the history of ALL switch changes (see the new switch-history table)

const dbCreds = require('./credentials.json')
const nano = require('nano')(`http://${dbCreds.username}:${dbCreds.password}@127.0.0.1:5984`)

async function handleDbExceptions(res, func, customErrorHandler) {
    try {
        await func()
    } catch (error) {
        if(customErrorHandler) {
            console.error(error)
            customErrorHandler(error)
        } else {
            console.error(error)
            res.sendStatus(500)
        }
    }
}

app.get('/', async (req, res) => {
    res.send('Hello World!')
})

app.get('/switch', async (req, res) => {
    handleDbExceptions(res, async () => {
        const swtch = nano.db.use('switch')
        const viewData = await swtch.view('switch-designs','find-switch-by-slug', {
            keys: [ req.query.slug ]
        })
        
        if(viewData.rows.length > 0) return res.json(viewData.rows[0])
        return res.json({})
    })
})

app.post('/switch', async (req, res) => {
    handleDbExceptions(res, async () => {
        const swtch = nano.db.use('switch')
        const result = await swtch.insert(req.body)
        res.sendStatus(200)
    }, (error) => {
        res.status(500).json({
            message: error.description
        })
    })
})

app.patch('/switch', async (req, res) => {
    handleDbExceptions(res, async () => {
        const swtch = nano.db.use('switch')
        const result = await swtch.insert(req.body)
        res.sendStatus(200)
    }, (error) => {
        res.status(500).json({
            message: error.description
        })
    })
})

app.delete('/switch', async (req, res) => {
    handleDbExceptions(res, async () => {
        const swtch = nano.db.use('switch')

        // find switch's ID
        const viewData = await swtch.view('switch-designs','find-switch-by-slug', {
            keys: [ req.query.slug ]
        })

        let docId
        let rev
        if(viewData.rows.length > 0) {
            docId = viewData.rows[0].id
            rev = viewData.rows[0].value._rev
        }

        if(docId && rev) {
            const result = await swtch.destroy(docId, rev)
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    }, (error) => {
        res.status(500).json({
            message: error.description
        })
    })
})

app.get('/search', async (req, res) => {
    handleDbExceptions(res, async () => {
        const createOrClause = (fieldName, values) => {
            return { "$or": values.map((val) => { return { [fieldName]: val } }) }
        }
        
        const selectorJson = {
            selector: {
                "$and": []
            },
            limit: 500
        }
        const selectorAnd = selectorJson['selector']["$and"]
        
        const query = req.query;
        if(query) {
            const specAnd = []
            selectorAnd.push({ 'specs': { "$elemMatch": { "$and": specAnd } } })

            if(query.name) selectorAnd.push({ 'name': { "$regex": `(?i).*${query.name}.*` } })
            if(query.company) selectorAnd.push({ 'company': { '$elemMatch': { '$or': query.company.split(',') } } })
            if(query.manufacturer) selectorAnd.push(createOrClause('manufacturer', query.manufacturer.split(',')))
            if(query.type) selectorAnd.push(createOrClause('type', query.type.split(',')))
            if(query.description) selectorAnd.push({ 'description': { "$regex": `(?i).*${query.description}.*` } })
            if(query.min_weight) specAnd.push({ actuation: { "$gte": parseFloat(query.min_weight) } })
            if(query.max_weight) specAnd.push({ actuation: { "$lte": parseFloat(query.max_weight) } })
            if(query.spring_type) specAnd.push(createOrClause('spring', query.spring_type.split(',')))
            if(query.stem_material) specAnd.push(createOrClause('stem.material', query.stem_material.split(',')))
            if(query.top_material) specAnd.push(createOrClause('top_housing.material', query.top_material.split(',')))
            if(query.bottom_material) specAnd.push(createOrClause('bottom_housing.material', query.bottom_material.split(',')))
        }

        const switchTable = nano.db.use('switch')
        const results = await switchTable.find(selectorJson)

        return res.json(results)
    })
})

app.get('/switch-filters', async (req, res) => {
    handleDbExceptions(res, async () => {
        const swtch = nano.db.use('switch')
        const viewData = await swtch.view('switch-designs','switch-filters', { group_level: 1 })
        
        const filters = {}
        for(const row of viewData.rows) {
            filters[row.key] = row.value
        }
        
        return res.json(filters)
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})