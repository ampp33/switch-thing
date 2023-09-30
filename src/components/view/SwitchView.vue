<template>
    <div v-if="swtch">
        <h1>{{ swtch.name}}</h1>
        <H2>{{ swtch.type }}</H2>
        <h2>{{ swtch.manufacturer }}</h2>
        <p v-html="swtch.description"></p>
        <div><b>Mount:</b> {{ swtch.mount }}-pin</div>
        <!-- <div class="relative">
            <div class="box-wrapper">
                <div class="box">
                    <b>Stem</b>
                    <div>pom</div>
                </div>
            </div>
            <div class="box-wrapper-black">
                <div class="box-black">
                    <b>Top</b>
                    <div>nylon</div>
                </div>
            </div>
            <div class="box-wrapper-black">
                <div class="box-black">
                    <b>Bottom</b>
                    <div>nylon</div>
                </div>
            </div>
        </div> -->
        <h2>Variants</h2>
        <div style="background-color: lightgray; margin: 5px; padding: 5px"
                v-for="spec of swtch.specs" v-bind:key="spec">
            <h3 v-if="spec.name">{{ spec.name }}</h3>
            <div><b>Spring: </b>{{ spec.spring }}</div>
            <div><b>Actuation: </b>{{ spec.actuation }}</div>
            <div><b>Bottom-out: </b>{{ spec.bottom_out }}</div>
            <div><b>Pre-travel: </b>{{ spec.pretravel }}</div>
            <div><b>Total-travel: </b>{{ spec.total_travel }}</div>

            <br>
            <b>Stem</b>
            <div><b>Material: </b>{{ spec.stem.material }}</div>
            <div v-if="spec.stem.material == 'custom'">
                {{ spec.stem.custom_material_notes }}
            </div>
            <div><b>Color: </b>
                <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                        :style="{backgroundColor: spec.stem.color}">
                </div>
            </div>

            <br>
            <b>Top Housing</b>
            <div><b>Material: </b>{{ spec.top_housing.material }}</div>
            <div v-if="spec.top_housing.material == 'custom'">
                {{ spec.top_housing.custom_material_notes }}
            </div>
            <div><b>Color: </b>
                <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                        :style="{backgroundColor: spec.top_housing.color}">
                </div>
            </div>

            <br>
            <b>Bottom Housing</b>
            <div><b>Material: </b>{{ spec.bottom_housing.material }}</div>
            <div v-if="spec.bottom_housing.material == 'custom'">
                {{ spec.bottom_housing.custom_material_notes }}
            </div>
            <div><b>Color: </b>
                <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                        :style="{backgroundColor: spec.bottom_housing.color}">
                </div>
            </div>
            <Thingy :top-color-rgba="spec.top_housing.color" :bottom-color-rgba="spec.bottom_housing.color" :stem-color-rgba="spec.stem.color" />
        </div>
        <h2>Prices</h2>
        <div v-for="price in swtch.prices" :key="price.url">
            <a :href="price.url">{{ price.url }}</a>
        </div>
        <div>
            <input type="button" value="Edit" @click="gotoEditPage" />
        </div>
    </div>
</template>

<script>
import Thingy from './Thingy.vue'
import { getSwitch } from '../../../backend'

export default {
    name: 'SwitchView',
    props: ['slug'],
    components: {
        Thingy
    },
    data() {
        return {
            swtch: null
        }
    },
    methods: {
        gotoEditPage() {
            window.location.href = '/edit/' + this.slug
        }
    },
    async created() {
        this.swtch = await getSwitch(this.slug)
    }
}
</script>

<style>
.box-wrapper {
    width: 100px;
    margin: 10px;
    position: relative;
    border-radius: 15px;
}

.box-wrapper:before {
    content: '';
    box-shadow: 0px 0px 76px -2px rgb(68, 169, 255);
    z-index: -1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    border-radius: inherit;
}

.box {
    padding: 15px;
    width: 100%;
    height: 100%;
    color: white;
    background-color: rgb(68, 169, 255);
    border-radius: inherit;
}

.box-wrapper-black {
    width: 100px;
    margin: 10px;
    position: relative;
    border-radius: 15px;
}

.box-wrapper-black:before {
    content: '';
    box-shadow: 0px 0px 76px -2px black;
    z-index: -1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    border-radius: inherit;
}

.box-black {
    padding: 15px;
    width: 100%;
    height: 100%;
    color: white;
    background-color: black;
    border-radius: inherit;
}
</style>