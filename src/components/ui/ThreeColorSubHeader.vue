<template>
    <div class="flex mb2">
        <div class="w-33 darkest pa2" :title="leftTitle">
            {{ leftText }}
        </div>
        <div class="w-33 dark pa2" :title="middleTitle">
            {{ middleText }}
        </div>
        <div class="w-33 light pa2" :title="rightTitle">
            {{ rightText }}
        </div>
    </div>
</template>

<script>
export default {
    props: ['left-text', 'left-title', 'middle-text', 'middle-title', 'right-text', 'right-title' ]
}
</script>

<style scoped>
.darkest {
    background-color: #383252;
}

.dark {
    color: #262335;
    background-color: #A387FE;
}

.light {
    color: #262335;
    background-color: #D2DBED;
}
</style>