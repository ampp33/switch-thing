const axios = require("axios");
const cheerio = require("cheerio"); 

function getSiteIdentifier(url) {
    // https://thekey.company/products/tangerine-switches?variant=40056847827033
    const groups = /^(?:http[s]:\/\/)?([^/]+).*$/g.exec(url)
    const parsedUrl = groups.length > 0 ? groups[1] : null
    // not a valid url, return null
    if(!parsedUrl) return null
    // check if url has a full www.site.com name, rather than site.com, and if so only return the site.com part
    // thereby ignoring the sub-domain
    const urlTokens = parsedUrl.split('\.')
    if(urlTokens.length > 2) return urlTokens[1] + '.' + urlTokens[2]
    // url doesn't have a sub-domain, so just return it
    return parsedUrl
}

function convertPriceToDouble(price) {
    if(!price) return null
    const trimmedPrice = price.trim()
    return /[^\d]*([\d]+\.?\d?\d?)/g.exec(trimmedPrice)[1]
}

async function getPrice(url, switchQuantityCssSelector, priceCssSelectors) {
    const res = await axios.get(url)
    const $ = cheerio.load(res.data)
    // determine quantity
    let quantity
    $(switchQuantityCssSelector).each((idx,el) => {
        $(el).each((idx,el) => {
            const number = /[^\d]*([\d]+)[^\d]*/g.exec($(el).text())[1]
            quantity = parseInt(number)
        })
    })
    // get prices
    const results = []
    for(const cssSelector of priceCssSelectors) {
        results.push(convertPriceToDouble($(cssSelector).first().text()))
    }

    // sort and return the cheapest option
    results.sort((a,b) => a-b)

    if(results.length > 0) {
        return (results[0] / quantity).toFixed(2)
    }
    return null
}


const config = {
    'novelkeys.com': {
        quantityCssSelector: '.product-single__subtitle',
        priceCssSelectors: ['.price-item--regular', '.price-item--sale']
    },
    'thekey.company': {
        quantityCssSelector: 'label[for="ProductSelect-option-variant-70 Switches"]',
        priceCssSelectors: ['#ProductPrice']
    }
}

const switchSites = [
    'https://thekey.company/products/tangerine-switches?variant=40056847827033',
    'https://novelkeys.com/collections/switches/products/gateron-baby-kangaroo-switches',
]

async function findPrices(switchUrls) {
    const promises = []
    for(const switchUrl of switchUrls) {
        const siteIdentifier = getSiteIdentifier(switchUrl)
        const siteConfig = config[siteIdentifier]
        if(!siteConfig) {
            console.warn(`no site parsing config for ${siteIdentifier}`)
            continue
        }
        const {quantityCssSelector, priceCssSelectors} = siteConfig
        promises.push(
            getPrice(switchUrl, quantityCssSelector, priceCssSelectors).then((price) => {
                console.log(`${switchUrl}: $${price}`)
            })
        )
    }
    Promise.all(promises).then(() => {
        console.log('done!')
    })
}

findPrices(switchSites)