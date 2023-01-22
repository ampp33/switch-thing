<template>
    <div class="ml2">
        <div class="fl w-60">
            <h1 class="sans-serif f-headline lh-solid tl mv0">
                {{switchObj.name}}
            </h1>
            <h1 v-if="companyAndManufacturer" class="sans-serif f2 lh-copy tl ma0">{{companyAndManufacturer}}</h1>
            <p class="f4 fw4 i lh-title mt0 measure" v-html="description"></p>
        </div>
        <div class="fl w-40 pa2 serif">
            <div class="w-100 bg-light-gray pa2 f4">
                <div><b>{{type}}</b></div>
                <div><b>Mount: </b>{{switchObj.mount}}-pin</div>
                <div><b>Factory Lube: </b>{{switchObj.factory_lubed}}</div>
            </div>
        </div>
        <div class="center sans-serif h3">
            <div class="cf">
                <div v-for="spec in switchObj.specs" :key="spec" class="fl w-50 mw6 pr2 pb2 f4">
                    <div class="cf bg-light-gray pa3">
                        <div class="fl w-34">
                            <table class="w-100">
                                <tr>
                                    <td class="tl">Actuation</td>
                                    <td class="tr">{{spec.actuation}}g</td>
                                </tr>
                                <tr>
                                    <td class="tl">Bottom-out</td>
                                    <td class="tr">{{spec.weight}}g</td>
                                </tr>
                                <tr>
                                    <td class="tl">Pre-travel</td>
                                    <td class="tr">{{spec.pretravel ? spec.pretravel + 'g' : ''}}</td>
                                </tr>
                                <tr>
                                    <td class="tl">Total travel</td>
                                    <td class="tr">{{spec.total_travel}}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="fr w-40">
                            <img class="h4" src="../assets/switch-outline.png">
                        </div>
                        <div class="fr w-20 tr mr1">
                            <table class="w-100">
                                <tr>
                                    <td class="">{{spec.stem.material}}</td>
                                </tr>
                                <tr>
                                    <td class="pt2">{{spec.top_housing.material}}</td>
                                </tr>
                                <tr class="">
                                    <td class="pt3">{{spec.bottom_housing.material}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="center">
            <div class="cf">
                <div class="fl w-70 w-50-ns bg-light-gray pa2">
                    <h1 class="ma0">Images</h1>
                    Stuff
                </div>
                <div class="fl w-30 w-50-ns bg-light-gray pa2">
                    <h1 class="ma0">Links</h1>
                    Stuff
                </div>
                <div class="fl w-100 bg-light-gray pa2">
                    <h1 class="ma0">Videos</h1>
                    Stuff
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        switchObj: Object
    },
    data() {
        return {
            
        }
    },
    computed: {
        companyAndManufacturer() {
            const companies = this.switchObj.company
            if(!companies) return undefined

            let result = ''
            if(companies.length > 0) result = companies.join(', ')
            else result = companies[0]

            if(this.switchObj.manufacturer) result += ' (' + this.switchObj.manufacturer + ')'

            return result
        },
        type() {
            return this.switchObj.type.charAt(0).toUpperCase() + this.switchObj.type.slice(1)
        },
        description() {
            return this.switchObj.description.replaceAll("\\n", "<br>")
        }
    }
}
</script>

<style>

</style>