import { unpatch } from "jsondiffpatch"

function switchNameToSlug(switchName) {
    return switchName.toLowerCase().replaceAll(" ", "-")
}

function getUiErrorMessage(error, genericMessage) {
    if(!error) return null
    if(error.public) return error.message
    else return genericMessage ||
            'An error occurred, please refresh the page and try making your updates again'
}

function anyColorToHexa(color) {
    if(!color) return color
    const colorClean = color.trim().toLowerCase()
    // rgba
    if(colorClean.startsWith('rgba')) {
        const toHex = (numStr) => parseInt(numStr).toString(16).padStart(2, '0')
        const [_, r, g, b, a] = colorClean.split(/\(|,|\)/)
        const alpha = parseInt(parseFloat(a) * 255)
        return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`
    }
    // hex
    if(colorClean.startsWith('#')) {
        // hex (no alpha), so add on 100% alpha and return
        if(colorClean.length == 7) return `${colorClean}ff`
        // hex with alpha, return string as-is
        if(colorClean.length == 9) return colorClean
        // 3 color hex
        if(colorClean.length == 4) {
            const [_,a,b,c] = colorClean
            return `#${a}0${b}0${c}0`
        }
        // not sure, return the default fallback color (black)
        return '#000000ff'
    }
}

const changeSwitchVersion = (history, switchData, targetVersion) => {
    let prev = switchData
    for(const historyItem of history) {
        if(historyItem.version == targetVersion) break
        prev = unpatch(prev, historyItem.diff)
    }
    return prev
}

export {
    switchNameToSlug,
    anyColorToHexa,
    getUiErrorMessage,
    changeSwitchVersion
}