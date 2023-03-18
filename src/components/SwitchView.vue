<template>
    <div v-if="swtch">
        <h1>{{ swtch.name}}</h1>
        <H2>{{ swtch.type }}</H2>
        <h2>{{ swtch.manufacturer }}</h2>
        <p v-html="swtch.description"></p>
        <div><b>Mount:</b> {{ swtch.mount }}-pin</div>
        <h2>Variants</h2>
        <div style="background-color: lightgray; margin: 5px; padding: 5px"
                v-for="spec of swtch.specs" v-bind:key="spec">
            <h3 v-if="spec.name">{{ spec.name }}</h3>
            <div><b>Actuation: </b>{{ spec.actuation }}</div>
            <div><b>Bottom-out: </b>{{ spec.bottom_out }}</div>
            <div><b>Pre-travel: </b>{{ spec.pretravel }}</div>
            <div><b>Total-travel: </b>{{ spec.total_travel }}</div>

            <br>
            <b>Stem</b>
            <div><b>Material: </b>{{ spec.stem.material }}</div>
            <div><b>Color: </b>
                <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                        :style="{backgroundColor: spec.stem.color}">
                </div>
            </div>

            <br>
            <b>Top Housing</b>
            <div><b>Material: </b>{{ spec.top_housing.material }}</div>
            <div><b>Color: </b>
                <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                        :style="{backgroundColor: spec.top_housing.color}">
                </div>
            </div>

            <br>
            <b>Bottom Housing</b>
            <div><b>Material: </b>{{ spec.bottom_housing.material }}</div>
            <div><b>Color: </b>
                <div style="height: 20px; width:20px; display: inline-block; margin-bottom: -5px; border: 1px solid black"
                        :style="{backgroundColor: spec.bottom_housing.color}">
                </div>
            </div>
        </div>
        <h2>Prices</h2>
        <div v-for="price in swtch.prices" :key="price.url">
            <a :href="price.url">{{ price.url }}</a>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'SwitchView',
    props: ['slug'],
    data() {
        return {
            swtch: null
        }
    },
    async created() {
        // look up switch based on slug
        const res = await fetch('http://localhost:8081/switch?slug=' + this.slug)
        const json = await res.json()
        this.swtch = json.value
    }
}
</script>

<style>

</style>