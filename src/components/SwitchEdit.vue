<template>
    <div>
        <div v-if="isDisplayColorPicker" style="position: fixed; top: 0; right: 0; bottom: 0; left: 0; height: 100%; width: 100%; background-color: rgba(0,0,0,.5);">
            <div style="padding: 10px; background-color: white; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">
                <div>
                    <ColorPicker :color="color" :visible-formats="['rgb']" @color-change="colorChange" />
                </div>
                <input type="button" value="OK" @click="isDisplayColorPicker = false"/>
            </div>
        </div>
        <div>
            <h2>Details</h2>
            <!-- name -->
            <div>
                <label>Name: </label>
                <input type="text" v-model="switchData.name" />
            </div>
            <!-- company, -->
            <div>
                <label>Company(s) (comma separated): </label>
                <input type="text" :value="companies" @input="updateCompanies" />
            </div>
            <!-- manufacturer -->
            <div>
                <label>Manufacturer: </label>
                <input type="text" v-model="switchData.manufacturer" />
            </div>
            <!-- factory_lubed (list) -->
            <div>
                <label>Factory Lubed: </label>
                <select v-model="switchData.factory_lubed">
                    <option label="none">no</option>
                    <option label="slight">slight</option>
                    <option label="significant">significant</option>
                </select>
            </div>
            <!-- type (list) -->
            <div>
                <label>Type: </label>
                <select v-model="switchData.type">
                    <option label="linear">linear</option>
                    <option label="tactile">tactile</option>
                    <option label="clicky">clicky</option>
                </select>
            </div>
            <!-- description -->
            <div>
                <label>Description: </label>
                <div>
                    <textarea v-model="switchData.description" cols="80" rows="6" />
                </div>
            </div>
            <!-- mount (3 or 5) -->
            <div>
                <label>Mount: </label>
                <select v-model="switchData.mount">
                    <option label="3-pin">3</option>
                    <option label="5-pin">5</option>
                    <option label="both">both</option>
                </select>
            </div>
            <!-- limited_run (boolean) -->
            <div>
                <label>Limited Run: </label>
                <input type="checkbox" v-model="switchData.limited_run" />
            </div>
            <h2>Models</h2>
            <!-- specs -->
            <div v-for="(spec,index) in switchData.specs" :key="index" style="margin: 0px 0px 10px 10px; background-color: #EEE; padding: 10px">
                <input type="button" value="Remove Switch Model" @click="removeSwitchModel(index)" />
                <h3>Details</h3>
                <!-- name -->
                <div>
                    <label>Name: </label>
                    <input type="text" v-model="spec.name" />
                </div>
                <!-- actuation -->
                <div>
                    <label>Actuation (g): </label>
                    <input type="number" v-model="spec.actuation" />
                </div>
                <!-- bottom_out -->
                <div>
                    <label>Bottom-out (g): </label>
                    <input type="number" v-model="spec.bottom_out" />
                </div>
                <!-- pretravel -->
                <div>
                    <label>Pre-travel (mm): </label>
                    <input type="number" v-model="spec.pretravel" />
                </div>
                <!-- total_travel -->
                <div>
                    <label>Total-travel (mm): </label>
                    <input type="number" v-model="spec.total_travel" />
                </div>
                <!-- led_support (list) -->
                <div>
                    <label>Led Support: </label>
                    <select v-model="spec.led_support">
                        <option label="through only">inswitch-through</option>
                        <option label="smd only">smd</option>
                        <option label="smd and through">smd-and-inswitch</option>
                    </select>
                </div>
        
                <!-- stem -->
                <h3>Stem</h3>
                <!-- material (list) -->
                <div>
                    <label>Material: </label>
                    <select v-model="spec.stem.material">
                        <option v-for="choice in plasticMaterialChoices" :key="choice" :label="choice">{{ choice }}</option>
                    </select>
                    <input v-if="spec.stem.material == 'custom'" type="text" v-model="spec.stem.custom_material_notes" />
                </div>
                <!-- color -->
                <div>
                    <label>Color: </label>
                    <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                            :style="{backgroundColor: spec.stem.color}"
                            @click="showColorPicker(spec.stem.color, (color) => spec.stem.color = color)"></div>
                </div>
                <!-- length (list) -->
        
                <!-- top_housing -->
                <h3>Top Housing</h3>
                <!-- material (list) -->
                <div>
                    <label>Material: </label>
                    <select v-model="spec.top_housing.material">
                        <option v-for="choice in plasticMaterialChoices" :key="choice" :label="choice">{{ choice }}</option>
                    </select>
                    <input v-if="spec.top_housing.material == 'custom'" type="text" v-model="spec.top_housing.custom_material_notes" />
                </div>
                <!-- color -->
                <div>
                    <label>Color: </label>
                    <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                            :style="{backgroundColor: spec.top_housing.color}"
                            @click="showColorPicker(spec.top_housing.color, (color) => spec.top_housing.color = color)"></div>
                </div>
        
                <!-- bottom_housing -->
                <h3>Bottom Housing</h3>
                <!-- material (list) -->
                <div>
                    <label>Material: </label>
                    <select v-model="spec.bottom_housing.material">
                        <option v-for="choice in plasticMaterialChoices" :key="choice" :label="choice">{{ choice }}</option>
                    </select>
                    <input v-if="spec.bottom_housing.material == 'custom'" type="text" v-model="spec.bottom_housing.custom_material_notes" />
                </div>
                <!-- color -->
                <div>
                    <label>Color: </label>
                    <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                            :style="{backgroundColor: spec.bottom_housing.color}"
                            @click="showColorPicker(spec.bottom_housing.color, (color) => spec.bottom_housing.color = color)"></div>
                </div>

                <!-- spring -->
                <h3>Spring</h3>
                <!-- material (list) -->
                <div>
                    <label>Type: </label>
                    <select v-model="spec.spring">
                        <option></option>
                        <option v-for="choice in springChoices" :key="choice" :label="choice">{{ choice }}</option>
                    </select>
                </div>
                <!-- color -->
            </div>
            <input type="button" value="Add Switch Model" @click="addSwitchModel">
            <!-- images (urls) -->
            <!-- videos (urls) -->
            <h2>Videos</h2>
            <textarea v-model="videoListText" @input="videoListUpdated" cols="80" rows="6" />
            <!-- prices (urls) -->
            <h2>Prices</h2>
            <textarea v-model="priceListText" @input="priceListUpdated" cols="80" rows="6" />
        </div>
    </div>
</template>

<script>
import { ColorPicker } from 'vue-accessible-color-picker'

const SPEC_PROTOTYPE = {
    name: null,
    actuation: null,
    bottom_out: null,
    pretravel: null,
    total_travel: null,
    led_support: null,
    stem: {
        material: null,
        color: null,
        length: null
    },
    top_housing: {
        material: null,
        color: null
    },
    bottom_housing: {
        material: null,
        color: null
    },
    spring: {
        material: null,
        color: null
    }
}

const DEFAULT_MATERIALS = [
    'nylon',
    'pc',
    'pom',
    'uhmwpe'
]

const SPRING_CHOICES = [
    "coated",
    "double-stage",
    "double-stage-standard",
    "gold-plated",
    "kailh",
    "long",
    "progressive",
    "standard"
]

export default {
    name: 'SwitchEdit',
    components: {
        ColorPicker
    },
    props: ['slug'],
    data() {
        return {
            isDisplayColorPicker: false,
            color: {
                rgb: '#000000'
            },
            plasticMaterialChoices: [],
            springChoices: SPRING_CHOICES,
            switchData: {
                name: null,
                company: null,
                manufacturer: null,
                factory_lubed: null,
                type: null,
                description: null,
                mount: null,
                limited_run: false,
                specs: [{
                    ...SPEC_PROTOTYPE
                }],
                images: [],
                videos: [],
                prices: []
            },
            onColorChangeCallback: undefined,
            videoListText: null,
            priceListText: null
        }
    },
    computed: {
        companies() {
            return this.switchData.company ? this.switchData.company.join(',') : ''
        }
    },
    methods: {
        updateCompanies(event) {
            this.switchData.company = event.target.value.split(',').map(val => val.trim())
        },
        async loadMaterialChoices() {
            const res = await fetch('http://localhost:8081/switch-filters')
            const json = await res.json()

            const materials = new Set()
            DEFAULT_MATERIALS.forEach(material => materials.add(material))
            json.top_material.forEach(material => materials.add(material))
            json.bottom_material.forEach(material => materials.add(material))
            json.stem_material.forEach(material => materials.add(material))

            this.materialChoices = Array.from(materials)
            this.materialChoices = this.materialChoices.filter(material => material.toLowerCase().trim() != 'custom')
            this.materialChoices.push('custom')
            console.log(this.materialChoices)
            this.plasticMaterialChoices = this.materialChoices
        },
        showColorPicker(currentColor, onChangeCallback) {
            if(!currentColor) currentColor = 'rgb(0 0 0 / 1)'
            this.color = currentColor
            this.isDisplayColorPicker = true
            this.onColorChangeCallback = onChangeCallback
        },
        colorChange(color) {
            const c = color.colors.rgb
            const rgba = `rgba(${parseInt(c.r * 255)},${parseInt(c.g * 255)},${parseInt(c.b * 255)},${c.a})`
            this.onColorChangeCallback(rgba)
        },
        removeSwitchModel(index) {
            this.switchData.specs.splice(index, 1)
        },
        addSwitchModel() {
            this.switchData.specs.push({ ...SPEC_PROTOTYPE })
        },
        videoListUpdated() {
            this.switchData.videos = this.videoListText.split("\n")
        },
        priceListUpdated() {
            this.switchData.prices = this.priceListText.split("\n").map(item => { return { url: item } })
        }
    },
    async created() {
        this.loadMaterialChoices()
        if(this.$route && this.$route.path.toLowerCase().startsWith('/edit')) {
            // load switch to be displayed on page
            const res = await fetch('http://localhost:8081/switch?slug=' + this.slug)
            const json = await res.json()
            this.switchData = json.value
            this.videoListText = this.switchData.videos.join("\n")
            this.priceListText = this.switchData.prices.map(item => item.url).join("\n")
        }
    }
}
</script>