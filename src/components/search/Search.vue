<template>
    <div>
        <div v-if="errorMessage">
            {{ errorMessage }}
        </div>
        <div v-else>
            <div class="flex justify-center">
                <div class="w-15 mr2">
                    <input type="text" placeholder="Name" v-model="search.name" @keypress.enter="executeSearch" class="w-100 pa2 mb2" />
                    <vue-multi-select v-model="search.type" :options="dropdown.type" placeholder="Type" selectLabel="" />
                </div>
                <div class="w-15 mr2">
                    <vue-multi-select v-model="search.company" :options="dropdown.company" placeholder="Company" selectLabel="" class="mb2" />
                    <vue-multi-select v-model="search.manufacturer" :options="dropdown.manufacturer" placeholder="Manufacturer" selectLabel="" />
                </div>
                <div class="w-15 mr2 spring-filter">
                    <div>
                        Spring Weight
                    </div>
                    <div v-if="dropdown.spring_weight" class="mt3 ml3 mr3">
                        <slider v-model="search.weight" :min="0" :max="Math.max(...dropdown.spring_weight)" tooltipPosition="bottom" />
                    </div>
                </div>
                <div class="w-15 mr2">
                    <vue-multi-select v-model="search.stem_material" :options="dropdown.stem_material" placeholder="Stem Material" selectLabel="" class="mb2" />
                    <vue-multi-select v-model="search.top_material" :options="dropdown.top_material" placeholder="Top Material" selectLabel="" class="mb2" />
                    <vue-multi-select v-model="search.bottom_material" :options="dropdown.bottom_material" placeholder="Bottom Material" selectLabel="" />
                </div>
                <div class="w-10 mr2">
                    <input type="button" value="Search" @click="executeSearch" />
                    <input type="button" value="Reset" @click="reset" />
                </div>
            </div>
            <div class="flex justify-center items-center h3">
                {{ searchResults.length }} result{{ searchResults.length > 1 ? 's' : '' }} found
            </div>
            <div v-if="searchResults && searchResults.length > 0">
                <div class="flex align-center justify-between pa3">
                    <div class="w-10 b">
                        Render
                    </div>
                    <div class="w-20 b">
                        Name
                    </div>
                    <!-- name, type, spring_weight, stem_material, top_material, bottom_material-->
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
                <div v-for="result in paginatedSearchResults" :key="result.name">
                    <div class="flex items-center align-center justify-between pa3 mb2 search-result">
                        <div class="w-10">
                            <div v-for="colorCombo in result.colorCombos" :key="colorCombo">
                                <!-- <switch-render height="100" width="100" :stem-color-rgba="colorCombo.stem_color" :top-color-rgba="colorCombo.top_housing_color" :bottom-color-rgba="colorCombo.bottom_housing_color" /> -->
                            </div>
                        </div>
                        <div class="w-20">
                            <router-link :to="'/switch/' + result.slug">{{ result.name }}</router-link>
                        </div>
                        <!-- name, type, spring_weight, stem_material, top_material, bottom_material-->
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
                <div v-if="numPages > 1" class="flex items-center align-center justify-center pa3 mb2">
                    <div
                        v-for="pageNumber in numPages"
                        :key="pageNumber" class="page-link"
                        :class="{ 'page-link-active': pageNumber == page + 1 }"
                        @click="page = pageNumber - 1">
                        {{ pageNumber }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia';
import SwitchRender from '../view/SwitchRender.vue';
import Slider from '@vueform/slider'
import VueMultiselect from 'vue-multiselect'
import { getSearchFields, search } from '../../../backend.js'
import { store as lsStore, get as lsGet } from '../../assets/local-store';
import { useLoadingStore } from '../../stores/loading-store';

const SEARCH_FIELD_CACHE_TIME_IN_MS = 15 * 60 * 1000
const SWITCHES_PER_PAGE = 20

export default {
    name: "Search",
    components: {
        SwitchRender,
        Slider,
        'vue-multi-select': VueMultiselect
    },
    data() {
        return {
            search: {
                name: null,
                company: null,
                manufacturer: null,
                type: null,
                weight: [ 0, 999 ],
                stem_material: null,
                top_material: null,
                bottom_material: null
            },
            dropdown: {
                company: null,
                manufacturer: null,
                type: null,
                spring_weight: null,
                stem_material: null,
                top_material: null,
                bottom_material: null
            },
            searchResults: [],
            page: 0,
            errorMessage: null
        };
    },
    async created() {
        await this.retrieveSearchFields()
    },
    computed: {
        ...mapStores(useLoadingStore),
        numPages() {
            return Math.ceil(this.searchResults.length / SWITCHES_PER_PAGE)
        },
        paginatedSearchResults() {
            const startIndex = this.page * SWITCHES_PER_PAGE
            return this.searchResults.slice(startIndex, startIndex + SWITCHES_PER_PAGE)
        }
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
            if(cachedSearchFields == null) {
                this.errorMessage = 'We\'re currently experiencing technical difficulties that are stopping the search page from working, check back a little bit later!'
                return
            }

            const { company, manufacturer, type, spring_weight, stem_material, top_material, bottom_material } = cachedSearchFields
            this.dropdown = { company, manufacturer, type, spring_weight, stem_material, top_material, bottom_material }

            // set min and max weight values
            this.search.weight = [ 0, Math.max(...spring_weight) ]
        },
        reset() {
            for(const searchField in this.search) {
                if(searchField == 'weight') {
                    const spring_weight = this.dropdown.spring_weight
                    this.search[searchField] = [ 0, Math.max(...spring_weight) ]
                } else {
                    this.search[searchField] = null
                }
            }
            this.searchResults = []
        },
        async executeSearch() {
            this.loadingStore.toggleLoading()
            let results = null
            try {
                const filter =
                    Object.keys(this.search)
                        .reduce((acc, curr) => {
                            if(curr == 'weight') {
                                const [ min_weight, max_weight ] = this.search[curr]
                                acc.min_weight = min_weight
                                acc.max_weight = max_weight
                                return acc
                            }
                            acc[curr] = this.search[curr]
                            return acc
                        }, {})
                    console.log(filter)
                results = await search(filter)
            } finally {
                this.loadingStore.toggleLoading(() => this.searchResults = results)
            }
            // this.searchResults = foundSwitches.map((swtch) => { return { name: swtch.name, url: 'switch/' + swtch.slug } } )
        }
    }
}
</script>

<style>
:root {
    --slider-connect-bg: #A387FE;
    --slider-tooltip-bg: #A387FE;
}
</style>

<style scoped>
.w-15 {
    width: 15%;
}

.search-result {
    padding: 15px;
    color: #262335;
    background-color: white;
    border-radius: 10px;
}

.page-link {
    margin-right: 5px;
    padding: 12px;
    color: #262335;
    background-color: white;
    border-radius: 10px;
    cursor: pointer;
}

.page-link-active {
    background-color: #A387FE;
}

.spring-filter {
    color: #262335;
    padding: 10px;
    border-radius: 5px;
    background-color: white;
}


/* .search-results-enter-from,
.search-results-leave-to {
    opacity: 0
}

.search-results-enter-active,
.search-results-leave-active {
    transition: opacity 1s ease;
} */
</style>

<style lang="css">
@import '@vueform/slider/themes/default.css'
</style>