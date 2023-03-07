<template>
    <div></div>
</template>

<script>
const dbCreds = require('../../credentials.json')
const nano = require('nano')(`http://${dbCreds.username}:${dbCreds.password}@127.0.0.1:5984`)

export default {
    name: 'Search',
    data() {
        return {
            switches: []
        }
    },
    async mounted() {
        const switchTable = nano.db.use('switch')
        const switches = await switchTable.list()
        for(const swtch of switches.rows) {
            console.log(swtch.name)
        }
    }
}
</script>

<style>

</style>