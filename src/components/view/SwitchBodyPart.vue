<template>
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
</template>

<style scoped>
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