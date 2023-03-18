const dirPath = '/home/ampp33/projects/keyboards/switches.mx/content/collections/switches/'

const yaml = require('yamljs')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

function generateFilename(rawObj) {
    const fileifyName = (text) => text.toLowerCase().replace(/[^a-zA-Z0-9]/g,"-")
    const brand = rawObj.brand || rawObj.manufacturer
    const rawTitle = rawObj.title
    return fileifyName(brand) + '-' + fileifyName(rawTitle)
}

function convertHexToRgba(hex, isTransparent) {
    if(!hex) return null
    const hexValues = hex.replaceAll('#','')
    const r = parseInt(hexValues.substring(0,2), 16)
    const g = parseInt(hexValues.substring(2,4), 16)
    const b = parseInt(hexValues.substring(4,6), 16)
    return `rgba(${r},${g},${b},${isTransparent ? .5 : 1})`
}

function convertToSwitchObj(rawObj) {
    return {
        id: uuidv4(),
        name: rawObj.title,
        company: [ rawObj.brand ],
        manufacturer: rawObj.manufacturer,
        factory_lubed: rawObj.factory_lubed,
        type: rawObj.switch_type,
        description: rawObj.notes,
        mount: parseInt(rawObj.mount),
        limited_run: 'yes' === rawObj.limited_run.toLowerCase(),
        specs:
            rawObj.specs.map((spec) => {
                return {
                    name: spec.name,
                    stem: {
                        material: spec.stem_material,
                        color: convertHexToRgba(spec.stem_color, spec.stem_type === 'transparent'),
                        length: rawObj.stem_length
                    },
                    top_housing: {
                        material: spec.housing_top_material,
                        color: convertHexToRgba(spec.housing_top_color, spec.housing_top_type === 'transparent')
                    },
                    bottom_housing: {
                        material: spec.housing_bottom_material,
                        color: convertHexToRgba(spec.housing_bottom_color, spec.housing_bottom_type === 'transparent')
                    },
                    spring: {
                        material: spec.spring?.toLowerCase() || 'stainless-steel',
                        color: "rgba(0,0,0,1)"
                    },
                    actuation: parseFloat(spec.actuation),
                    bottom_out: parseFloat(spec['bottom-out']),
                    pretravel: parseFloat(spec['pre-travel']),
                    total_travel: parseFloat(spec['total-travel']),
                    led_support: spec.led_support,
                }
            }),
        images: [],
        videos: [],
        links: [],
        prices: rawObj.prices?.map(price => {
                return {
                    url: price.source
                }
            })
    }
}

fs.readdir(dirPath, (err, files) => {
    const outputDir = dirPath + 'output/'

    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    files.forEach(file => {
        const text = fs.readFileSync(dirPath + file, 'utf8').replace('---','')
        const rawObj = yaml.parse(text)

        const fileName = generateFilename(rawObj)
        const switchObj = convertToSwitchObj(rawObj)

        fs.writeFileSync(outputDir + fileName + ".json", JSON.stringify(switchObj))
    })
})

// yaml.parse()