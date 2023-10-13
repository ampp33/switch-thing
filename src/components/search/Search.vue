<template>
    <div>
        <div v-if="errorMessage">
            {{ errorMessage }}
        </div>
        <div v-else>
            <search-field v-for="searchField in searchFields"
                            :key="searchField.label"
                            :label="searchField.label"
                            :type="searchField.type"
                            :options="searchField.lookup ? filter_lookups[searchField.lookup] : null"
                            @on-change="searchFieldChanged"
                            @keyup.enter="search"
                            :ref="searchField.label"/>
            <input type="button" value="Search" class="search-button" @click="search" />
            <input type="button" value="Reset" class="search-button" @click="reset" />
            <div v-if="searchResults.length > 0">
                <div class="flex align-center justify-between pa3">
                    <div class="w-10 b">
                        Render
                    </div>
                    <div class="w-20 b">
                        Name
                    </div>
                    <!-- name, type, actuation, stem_material, top_material, bottom_material-->
                    <div class="w-10 b">
                        Type
                    </div>
                    <div class="w-10 b">
                        Weight
                    </div>
                    <div class="w-10 b">
                        Stem Material
                    </div>
                    <div class="w-10 b">
                        Top Material
                    </div>
                    <div class="w-10 b">
                        Bottom Material
                    </div>
                </div>
                <div v-for="result in searchResults" :key="result.name">
                    <div class="flex items-center align-center justify-between pa3 mb2 search-result">
                        <div class="w-10">
                            <div v-for="colorCombo in result.colorCombos" :key="colorCombo">
                                <switch-render height="100" width="100" :stem-color-rgba="colorCombo.stem_color" :top-color-rgba="colorCombo.top_housing_color" :bottom-color-rgba="colorCombo.bottom_housing_color" />
                            </div>
                        </div>
                        <div class="w-20">
                            <router-link :to="'/switch/' + result.slug">{{ result.name }}</router-link>
                        </div>
                        <!-- name, type, actuation, stem_material, top_material, bottom_material-->
                        <div class="w-10">
                            {{ result.type }}
                        </div>
                        <div class="w-10">
                            {{ result.weight }}
                        </div>
                        <div class="w-10">
                            {{ result.stem_material }}
                        </div>
                        <div class="w-10">
                            {{ result.top_material }}
                        </div>
                        <div class="w-10">
                            {{ result.bottom_material }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SwitchRender from '../view/SwitchRender.vue';
import SearchField from './SearchField.vue'
import { getSearchFields, search } from '../../../backend.js'
import { store as lsStore, get as lsGet } from '../../assets/local-store';

const SEARCH_FIELD_CACHE_TIME_IN_MS = 15 * 60 * 1000

export default {
    name: "Search",
    components: {
        SwitchRender,
        SearchField
    },
    data() {
        return {
            searchFields: [
                { label: "Name", type: "text", filterName: "name" },
                { label: "Company", type: "option", lookup: "company", filterName: "company" },
                { label: "Manufacturer", type: "option", lookup: "manufacturer", filterName: "manufacturer" },
                { label: "Type", type: "option", lookup: "type", filterName: "type" },
                { label: "Description", type: "text", filterName: "description" },
                // { label: "Spring Type", type: "option", lookup: "spring", filterName: "spring_type" },
                { label: "Min Weight", type: "option", lookup: "actuation", filterName: "min_weight" },
                { label: "Max Weight", type: "option", lookup: "actuation", filterName: "max_weight" },
                { label: "Stem Material", type: "option", lookup: "stem_material", filterName: "stem_material" },
                { label: "Top Material", type: "option", lookup: "top_material", filterName: "top_material" },
                { label: "Bottom Material", type: "option", lookup: "bottom_material", filterName: "bottom_material" },
            ],
            filter_lookups: [],
            searchResults: [],
            errorMessage: null
        };
    },
    async created() {
        await this.retrieveSearchFields()
    },
    methods: {
        async retrieveSearchFields() {
            this.errorMessage = null
            const cacheKey = 'search-fields'
            let cachedSearchFields = lsGet(cacheKey)
            if(!cachedSearchFields) {
                cachedSearchFields = await getSearchFields()
                lsStore(cacheKey, cachedSearchFields, SEARCH_FIELD_CACHE_TIME_IN_MS)
            }
            this.filter_lookups = cachedSearchFields
            if(cachedSearchFields == null) {
                this.errorMessage = 'We\'re currently experiencing technical difficulties that are stopping the search page from working, check back a little bit later!'
            }
        },
        searchFieldChanged(fieldLabel, fieldValue) {
            const searchField = this.searchFields.find((field) => field.label == fieldLabel)
            searchField.value = fieldValue
        },
        reset() {
            // reset field values
            for(const searchField of this.searchFields) this.$refs[searchField.label][0].reset()
            this.searchResults = []

        },
        async search() {
            const filter =
                this.searchFields
                    .filter(f => f.value)
                    .reduce((acc, curr) => {
                        acc[curr.filterName] = curr.value
                        return acc
                    }, {})

            const results = await search(filter)
            this.searchResults = results
            // this.searchResults = foundSwitches.map((swtch) => { return { name: swtch.name, url: 'switch/' + swtch.slug } } )
        }
    }
}
</script>

<style scoped>
.search-result {
    padding: 15px;
    color: #262335;
    background-color: white;
    border-radius: 10px;
}
</style>