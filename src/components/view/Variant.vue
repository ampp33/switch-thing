<template>
    <div class="variant">
        topper variant: name
        <h3 v-if="spec.name">{{ spec.name }}</h3>
        
        <div class="flex">
            <div class="section">
                <div><b>Spring: </b>{{ spec.spring.type }}</div>
                <div><b>Actuation: </b>{{ spec.spring.actuation_weight?.toString().concat('g') }}</div>
                <div><b>Bottom-out: </b>{{ spec.spring.bottom_out_weight?.toString().concat('g') }}</div>
                <div><b>Pre-travel: </b>{{ spec.spring.pre_travel_distance?.toString().concat('mm') }}</div>
                <div><b>Total-travel: </b>{{ spec.spring.total_travel_distance?.toString().concat('mm') }}</div>
            </div>
            <div class="section">
                <div class="component-box">
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
                </div>
        
                <div class="component-box">
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
                </div>
        
                <div class="component-box">
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
                </div>
            </div>
            <div class="render">
                <switch-render animate="true" :top-color-rgba="spec.top_housing.color" :bottom-color-rgba="spec.bottom_housing.color" :stem-color-rgba="spec.stem.color" />
            </div>
        </div>
    </div>
</template>

<script>
import SwitchRender from './SwitchRender.vue'

export default {
    props: ['spec'],
    components: {
        SwitchRender
    }
}
</script>

<style scoped>
.variant {
    display: inline-block;
    color: #262335;
    background-color: white;
    border-radius: 15px;
    margin: 10px;
    padding: 20px;
    width: auto;
    /* width: 30%; */
}

.section {
    width: 250px;
}

.render {
    width: 300px;
}

.component-box {
    margin-bottom: 15px;
}
</style>