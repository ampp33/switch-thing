<template>
    <div>
        <search-field v-for="searchField in searchFields"
                        :key="searchField.label"
                        :label="searchField.label"
                        :type="searchField.type"
                        :options="searchField.lookup ? filter_lookups[searchField.lookup] : null"
                        @on-change="searchFieldChanged"
                        @keyup.enter="search"
                        :ref="searchField.label"/>
        <input type="button" value="Search" @click="search" />
        <input type="button" value="Reset" @click="reset" />
        <div>
            <ul>
                <li v-for="result in searchResults" :key="result.name">
                    <router-link :to="result.url">{{ result.name }}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import SearchField from './SearchField.vue'
import { getSearchFields, search } from '../../../backend.js'
import { store as lsStore, get as lsGet } from '../../assets/local-store';

const SEARCH_FIELD_CACHE_TIME_IN_MS = 2 * 60 * 1000

export default {
    name: "Search",
    components: { SearchField },
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
            searchResults: []
        };
    },
    async created() {
        await this.retrieveSearchFields()
    },
    methods: {
        async retrieveSearchFields() {
            const cacheKey = 'search-fields'
            let cachedSearchFields = lsGet(cacheKey)
            if(!cachedSearchFields) {
                cachedSearchFields = await getSearchFields()
                lsStore(cacheKey, cachedSearchFields, SEARCH_FIELD_CACHE_TIME_IN_MS)
            }
            this.filter_lookups = cachedSearchFields
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

            const foundSwitches = await search(filter)
            this.searchResults = foundSwitches.map((swtch) => { return { name: swtch.name, url: 'switch/' + swtch.slug } } )
        }
    }
}
</script>

<style>

</style>