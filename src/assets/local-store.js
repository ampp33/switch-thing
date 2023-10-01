function store(key, value, ttlInMs) {
    console.log(typeof value == 'object' ? JSON.stringify(value) : value)
    localStorage.setItem(key, JSON.stringify({
        value,
        expiry: ttlInMs ? new Date().getTime() + ttlInMs : null
    }))
}

function get(key) {
    const itemStr = localStorage.getItem(key)
    if(!itemStr) return null
    const item = JSON.parse(itemStr)

    if(new Date().getTime() > item.expiry) {
        localStorage.removeItem(key)
        return null
    }

    return item.value
}

export {
    store,
    get
}