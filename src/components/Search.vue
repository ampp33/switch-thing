<template>
    <div>
        <SearchField v-for="searchField in searchFields"
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
                    <a :href="result.url" target="_blank">{{ result.name }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import SearchField from './search/SearchField.vue'

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
                { label: "Spring Type", type: "option", lookup: "spring", filterName: "spring_type" },
                { label: "Min Weight", type: "option", lookup: "weight", filterName: "min_weight" },
                { label: "Max Weight", type: "option", lookup: "weight", filterName: "max_weight" },
                { label: "Stem Material", type: "option", lookup: "stem_material", filterName: "stem_material" },
                { label: "Top Material", type: "option", lookup: "top_material", filterName: "top_material" },
                { label: "Bottom Material", type: "option", lookup: "bottom_material", filterName: "bottom_material" },
            ],
            filter_lookups: [],
            searchResults: []
        };
    },
    async created() {
        const res = await fetch('http://localhost:8081/switch-filters')
        this.filter_lookups = await res.json()
    },
    methods: {
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
            let separator = ''
            let query = ''
            for(const searchField of this.searchFields) {
                if(searchField.value) query += separator + searchField.filterName + '=' + searchField.value
                separator = '&'
            }
            const res = await fetch('http://localhost:8081/search?' + query)
            const foundSwitches = await res.json()

            const switchNameToSlug = (name) => name.toLowerCase().replaceAll(" ", "-")
            this.searchResults = foundSwitches.docs.map((swtch) => { return { name: swtch.name, url: 'switch/' + switchNameToSlug(swtch.name) } } )
        }
    }
}
</script>

<style>

</style>