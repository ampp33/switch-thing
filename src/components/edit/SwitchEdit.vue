<template>
    <card v-if="switchData">
        <modal :show="isDisplayColorPicker" @on-cancel="isDisplayColorPicker = false" @on-keypress="handleModalKeyPresses($event, cancelColorPicker)">
            <div class="color-picker-modal">
                <div>
                    <ColorPicker :color="pendingColor" :visible-formats="['hex']" @color-change="colorChange" />
                </div>
                <input type="button" value="OK" @click="isDisplayColorPicker = false"/>
                <input type="button" value="Cancel" @click="cancelColorPicker"/>
            </div>
        </modal>
        <div>
            <div class="flex">
                <div class="w-20 pa2">
                    <!-- name -->
                    <div>
                        <label>Name: </label><br>
                        <input type="text" v-model="switchData.name" />
                        <reference :references="switchData.references?.['name']" @reference-updated="(refs) => updateReferences(switchData, 'name', refs)" />
                    </div>
                    <!-- company, -->
                    <div>
                        <label>Company(s): </label>
                        <vue-multi-select v-model="switchData.company" :options="autocomplete.company" :taggable="true" :multiple="true" @tag="addCustomDropdownItem($event, autocomplete.company, value => switchData.company.push(value))" />
                    </div>
                    <!-- manufacturer -->
                    <div>
                        <label>Manufacturer: </label>
                        <vue-multi-select v-model="switchData.manufacturer" :options="autocomplete.manufacturer" @tag="addCustomDropdownItem($event, autocomplete.manufacturer, value => switchData.manufacturer = value)" />
                    </div>
                    <!-- factory_lubed (list) -->
                    <div>
                        <label>Factory Lubed: </label>
                        <vue-multi-select v-model="switchData.factory_lubed" :options="['none','slight','significant']" />
                    </div>
                    <!-- type (list) -->
                    <div>
                        <label>Type: </label>
                        <vue-multi-select v-model="switchData.type" :options="['linear','tactile','clicky']" />
                    </div>
                    <!-- description -->
                    <!-- mount (3 or 5) -->
                    <div>
                        <label>Mount: </label>
                        <select v-model.number="switchData.mount">
                            <option></option>
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
                </div>
                <div class="w-30 pa2">
                    <label>Description: </label>
                    <div>
                        <textarea v-model="switchData.description" class="w-100 h5" />
                    </div>
                </div>
            </div>
            <!-- specs -->
            <div v-for="(spec,index) in switchData.specs" :key="index" style="margin: 0px 0px 10px 10px; color: #383252; border: 1px solid black; padding: 10px; border-radius: 15px; padding: 20px;">
                <input type="button" value="Remove Switch Model" @click="removeSwitchModel(index)" />
                <div class="flex">
                    <div class="w-20 pa2">
                        <!-- name -->
                        <div>
                            <label>Name: </label>
                            <input type="text" v-model="spec.name" class="w-50" />
                            <reference :references="spec.references?.['name']" @reference-updated="(refs) => updateReferences(spec, 'name', refs)" />
                        </div>
                        <!-- actuation -->
                        <div>
                            <label>Actuation (g): </label>
                            <input type="number" v-model="spec.spring.actuation_weight" class="w-25" />
                        </div>
                        <!-- bottom_out -->
                        <div>
                            <label>Bottom-out (g): </label>
                            <input type="number" v-model="spec.spring.bottom_out_weight" class="w-25" />
                        </div>
                        <!-- pretravel -->
                        <div>
                            <label>Pre-travel (mm): </label>
                            <input type="number" v-model="spec.spring.pre_travel_distance" class="w-25" />
                        </div>
                        <!-- total_travel -->
                        <div>
                            <label>Total-travel (mm): </label>
                            <input type="number" v-model="spec.spring.total_travel_distance" class="w-25" />
                        </div>
                        <!-- led_support (list) -->
                        <div>
                            <label>Led Support: </label>
                            <select v-model="spec.led_support">
                                <option></option>
                                <option label="through only">inswitch-through</option>
                                <option label="smd only">smd</option>
                                <option label="smd and through">smd-and-inswitch</option>
                            </select>
                        </div>
                        <!-- spring -->
                        <!-- material (list) -->
                        <div>
                            <label>Spring Type: </label>
                            <vue-multi-select v-model="spec.spring.type" :options="autocomplete.spring" :taggable="true" @tag="addCustomDropdownItem($event, autocomplete.spring, value => spec.spring = value)" />
                        </div>
                    </div>
                    <div class="w-20 pa2">
                        <!-- stem -->
                        <h3>Stem</h3>
                        <!-- material (list) -->
                        <div>
                            <label>Material: </label>
                            <vue-multi-select v-model="spec.stem.material" :options="autocomplete.plastic" :taggable="true" :multiple="false" @tag="addCustomDropdownItem($event, autocomplete.plastic, value => spec.stem.material = value)"/>
                        </div>
                        <!-- color -->
                        <div>
                            <label>Color: </label>
                            <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                                    :style="{backgroundColor: spec.stem.color}"
                                    @click="showColorPicker(spec.stem.color, (color) => spec.stem.color = color)"></div>
                        </div>
                        <!-- length (list) -->
                    </div>
                    <div class="w-20 pa2">
                        <!-- top_housing -->
                        <h3>Top Housing</h3>
                        <!-- material (list) -->
                        <div>
                            <label>Material: </label>
                            <vue-multi-select v-model="spec.top_housing.material" :options="autocomplete.plastic" :taggable="true" :multiple="false" @tag="addCustomDropdownItem($event, autocomplete.plastic, value => spec.top_housing.material = value)"/>
                        </div>
                        <!-- color -->
                        <div>
                            <label>Color: </label>
                            <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                                    :style="{backgroundColor: spec.top_housing.color}"
                                    @click="showColorPicker(spec.top_housing.color, (color) => spec.top_housing.color = color)"></div>
                        </div>
                    </div>
                    <div class="w-20 pa2">
                        <!-- bottom_housing -->
                        <h3>Bottom Housing</h3>
                        <!-- material (list) -->
                        <div>
                            <label>Material: </label>
                            <vue-multi-select v-model="spec.bottom_housing.material" :options="autocomplete.plastic" :taggable="true" :multiple="false" @tag="addCustomDropdownItem($event, autocomplete.plastic, value => spec.bottom_housing.material = value)"/>
                        </div>
                        <!-- color -->
                        <div>
                            <label>Color: </label>
                            <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                                    :style="{backgroundColor: spec.bottom_housing.color}"
                                    @click="showColorPicker(spec.bottom_housing.color, (color) => spec.bottom_housing.color = color)"></div>
                        </div>
                    </div>
                    <div class="w-20 pa2">
                        <switch-render animate="true" :top-color-rgba="spec.top_housing.color" :bottom-color-rgba="spec.bottom_housing.color" :stem-color-rgba="spec.stem.color" />
                    </div>
                </div>
            </div>
            <input type="button" value="Add Switch Model" @click="addSwitchModel">
            <div class="flex">
                <div>
                    <!-- images (urls) -->
                </div>
                <div class="w-50 pa2">
                    <!-- videos (urls) -->
                    <h2>Videos</h2>
                    <textarea v-model="videoListText" @input="videoListUpdated" rows="6" class="w-100" />
                </div>
                <div  class="w-50 pa2">
                    <!-- prices (urls) -->
                    <h2>Prices</h2>
                    <textarea v-model="priceListText" @input="priceListUpdated" rows="6" class="w-100" />
                </div>
            </div>
        </div>
        <modal :show="showDeleteDialog" @on-cancel="showDeleteDialog = false" @on-keypress="handleModalKeyPresses($event, () => this.showDeleteDialog = false)">
            <div class="delete-modal">
                <p><b>Are you sure you want to delete this switch?</b></p>
                <div>Type <i>delete</i> in the textbox below to confirm</div>
                <input type="text" v-model="deleteConfirmText" class="mt2"/>
                <div>
                    <button type="button" @click="executeDelete" :disabled="deleteConfirmText != 'delete'" class="w3 mt2 mr2">Yes</button>
                    <button type="button" @click="showDeleteDialog = false" class="w3 mt2">No</button>
                </div>
            </div>
        </modal>
        <input @click="save" type="button" value="Save" />
        <input @click="console.log(switchData)" type="button" value="Console Log" />
        <input v-if="showDeleteButton" @click="showDeleteDialog = true" type="button" value="Delete" />
        <loading-overlay :show="showLoading" />
    </card>
</template>

<script>
import Modal from '../ui/Modal.vue'
import Card from '../ui/Card.vue'
import SwitchRender from '../view/SwitchRender.vue'
import Reference from './Reference.vue'
import LoadingOverlay from '../ui/LoadingOverlay.vue'
import { getSwitch, getSearchFields, createSwitch, updateSwitch, deleteSwitch } from '../../../backend'
import { useAuthStore } from '../../stores/auth-store'
import { mapStores } from 'pinia'
import { ColorPicker } from 'vue-accessible-color-picker'
import VueMultiselect from 'vue-multiselect'
import { anyColorToHexa, getUiErrorMessage } from '../../../util'

const DEFAULT_COLOR = '#000000ff'

const SPEC_PROTOTYPE = {
    name: null,
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
        type: null,
        color: null,
        material: null,
        actuation_weight: null,
        bottom_out_weight: null,
        pre_travel_distance: null,
        total_travel_distance: null
    }
}

const SWITCH_PROTOTYPE = {
    name: null,
    company: [],
    manufacturer: null,
    factory_lubed: null,
    type: null,
    description: null,
    mount: null,
    limited_run: false,
    specs: [{
        ...(JSON.parse(JSON.stringify(SPEC_PROTOTYPE)))
    }],
    images: [],
    videos: [],
    prices: []
}

export default {
    name: 'SwitchEdit',
    components: {
        Modal,
        ColorPicker,
        Card,
        SwitchRender,
        Reference,
        'vue-multi-select': VueMultiselect,
        LoadingOverlay
    },
    props: ['slug'],
    data() {
        return {
            errorMessage: null,
            showDeleteButton: true,
            showDeleteDialog: false,
            deleteConfirmText: '',
            showLoading: false,
            isDisplayColorPicker: false,
            pendingColor: DEFAULT_COLOR,
            originalColor: DEFAULT_COLOR,
            onColorChangeCallback: undefined,
            currentVersion: 1,
            switchDetails: null,
            initialSwitchData: null,
            switchData: null,
            videoListText: null,
            priceListText: null,
            autocomplete: {
                name: [],
                company: [],
                manufacturer: [],
                spring: [],
                plastic: []
            }
        }
    },
    computed: {
        ...mapStores(useAuthStore)
    },
    methods: {
        addCustomDropdownItem(newOption, options, setter) {
            options.push(newOption)
            setter(newOption)
        },
        updateCompanies(event) {
            this.switchData.company = event.target.value.split(',').map(val => val.trim())
        },
        async loadExistingSpringValues() {
            const { name, company, manufacturer, spring_type, stem_material, top_material, bottom_material } = await getSearchFields()

            const materials = new Set()
            top_material.forEach(material => materials.add(material))
            bottom_material.forEach(material => materials.add(material))
            stem_material.forEach(material => materials.add(material))

            this.autocomplete.name = name
            this.autocomplete.company = company
            this.autocomplete.manufacturer = manufacturer
            this.autocomplete.spring = spring_type
            this.autocomplete.plastic = Array.from(materials)
        },
        showColorPicker(currentColor, onChangeCallback) {
            const inputColor = anyColorToHexa(currentColor) || DEFAULT_COLOR
            this.originalColor = inputColor
            this.pendingColor = inputColor
            this.isDisplayColorPicker = true
            this.onColorChangeCallback = onChangeCallback
            this.onColorChangeCallback(this.pendingColor)
        },
        colorChange(color) {
            this.onColorChangeCallback(color.cssColor)
        },
        cancelColorPicker() {
            this.onColorChangeCallback(this.originalColor)
            this.isDisplayColorPicker = false
        },
        removeSwitchModel(index) {
            this.switchData.specs.splice(index, 1)
        },
        addSwitchModel() {
            // add switch model via deep clone of the prototype
            this.switchData.specs.push({
                ...(JSON.parse(JSON.stringify(SPEC_PROTOTYPE)))
            })
        },
        videoListUpdated() {
            this.switchData.videos = this.videoListText.split("\n").filter(item => item.trim().length > 0)
        },
        priceListUpdated() {
            this.switchData.prices = this.priceListText.split("\n").filter(item => item.trim().length > 0).map(item => { return { url: item } })
        },
        updateReferences(dataObj, dataSelector, refs) {
            if(!dataObj.references) dataObj.references = {}
            dataObj.references = {
                ...dataObj.references,
                [dataSelector]: refs
            }
        },
        handleModalKeyPresses(e, cancelCallback, confirmCallback) {
            if(e.key == 'Escape' && cancelCallback) cancelCallback()
            if(e.key == 'Enter' && e.ctrlKey && confirmCallback) confirmCallback()
        },
        async save() {
            this.errorMessage = null
            this.showLoading = true
            try {
                if(this.$route && this.$route.path.toLowerCase().startsWith('/new')) {
                    const session = this.authStore.getSession
                    console.log(this.switchData)
                    const { data, error } = await createSwitch(this.switchData, session.user.id)
                    this.errorMessage = getUiErrorMessage(error)
                    if(!this.errorMessage) this.$router.push('/')
                } else {
                    const session = this.authStore.getSession
                    const { error }
                        = await updateSwitch(
                                    this.switchDetails.id,
                                    this.currentVersion,
                                    this.initialSwitchData,
                                    this.switchData,
                                    session.user.id
                                )
                    this.errorMessage = getUiErrorMessage(error,'An error occurred saving the switch, '
                                                                + 'please refresh the page and try making your updates again,'
                                                                + 'someone may have updated the same switch at the same time as you.')
                    if(!this.errorMessage) this.$router.push('/')
                }
            } finally {
                this.showLoading = false
            }
        },
        executeDelete() {
            this.errorMessage = null
            this.showLoading = true
            this.deleteConfirmText = ''
            try {
                // reset confirmation text
                // delete switch
                const { error } = deleteSwitch(this.switchDetails.id) || {}
                // handle errors, if any
                this.errorMessage = getUiErrorMessage(error, 'Failed to delete switch, please refresh the page and try again')
                if(!this.errorMessage) this.$router.push('/')
            } finally {
                this.showLoading = false
            }
        }
    },
    async mounted() {
        await this.loadExistingSpringValues()
        if(this.$route && this.$route.path.toLowerCase().startsWith('/new')) {
            this.switchData = JSON.parse(JSON.stringify(SWITCH_PROTOTYPE))
            // hide delete button, since it woudln't make sense to show it
            this.showDeleteButton = false
        }
        if(this.$route && this.$route.path.toLowerCase().startsWith('/edit')) {
            // load switch to be displayed on page
            this.errorMessage = null
            const { data, error } = await getSwitch(this.slug)
            this.errorMessage = getUiErrorMessage(error, 'An error occurred loading the switch\'s data, please refresh or try again later')
            if(this.errorMessage) return

            this.switchDetails = data
            this.currentVersion = this.switchDetails.version
            this.switchData = this.switchDetails.data

            // copy switch data into a separate variable so we can diff against
            // the updates before we save (to keep track of switch history)
            this.initialSwitchData = JSON.parse(JSON.stringify(this.switchDetails.data))
            this.videoListText = this.switchData.videos?.filter(item => item.trim().length > 0).join("\n")
            this.priceListText = this.switchData.prices?.map(item => item.url).join("\n")
        }
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.multiselect {
    max-width: 300px;
}

.delete-modal {
    display: flex;
    flex-direction: column;
    color: black;
    background-color: white;
    border-radius: 15px;
    padding: 20px;
}

.color-picker-modal {
    padding: 20px;
    background-color: white;
}
</style>
