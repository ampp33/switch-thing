function switchNameToSlug(switchName) {
    return switchName.toLowerCase().replaceAll(" ", "-")
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

export {
    switchNameToSlug,
    anyColorToHexa
}