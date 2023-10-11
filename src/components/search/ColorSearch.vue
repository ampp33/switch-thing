<template>
    <div>
        <div class="flex flex-wrap">
            <div class="color-box" :style="{ backgroundColor: '#' + searchColorHex }" :title="asHsvCss(searchColorHex)"></div>
            <input type="text" v-model="searchColorHex" @input="filterColors" />
            <input type="text" v-model="maxDeviance" @input="filterColors" />
        </div>
        <div class="flex flex-wrap">
            <div class="color-box" v-for="color in filteredColors" :style="{ backgroundColor: color }" :title="asHsvCss(color)"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            maxDeviance: 25,
            searchColorHex: '',
            numBoxes: 5000,
            colors: [],
            filteredColors: []
        }
    },
    methods: {
        asHsv(rgbHexColor) {
            const { r: preR, g: preG, b: preB } = this.getRgbValues(rgbHexColor)
            const r = preR / 255
            const g = preG / 255
            const b = preB / 255

            let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
            let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
            return { h: 60*(h<0?h+6:h), s: v&&c/v, v };
        },
        asHsvCss(rgbHexColor) {
            const { h, s, v } = this.asHsv(rgbHexColor)
            return `hsv(${parseInt(h)}, ${parseInt(s * 100)}%, ${parseInt(v * 100)}%)`
        },
        getRgbValues(hexColor) {
            const color = hexColor.replace('#', '')
            const r = parseInt(color.substring(0,2), 16)
            const g = parseInt(color.substring(2,4), 16)
            const b = parseInt(color.substring(4), 16)
            return { r, g, b }
        },
        filterColors() {
            if(this.searchColorHex.trim().length < 6) {
                this.filteredColors = this.colors
                return
            }
            const { h: searchH, s: searchS, v: searchV } = this.asHsv(this.searchColorHex)
            const isGrayscale = searchS == 0
            this.filteredColors = this.colors.filter(color => {
                const { h, s, v } = this.asHsv(color)
                if(isGrayscale) return s == 0 && Math.abs((searchV * 100) - (v * 100)) <= this.maxDeviance
                return Math.abs(searchH - h) <= this.maxDeviance
                        && Math.abs((searchS * 100) - (s * 100)) <= this.maxDeviance
                        && Math.abs((searchV * 100) - (v * 100)) <= this.maxDeviance
            })

            // const { r: searchR, g: searchG, b: searchB } = this.getRgbValues('#' + this.searchColorHex)
            // const isGrayscale = searchR == searchG && searchG == searchB
            // this.filteredColors = this.colors.filter(color => {
            //     const { r, g, b } = this.getRgbValues(color)
            //     if(isGrayscale) {
            //         // only work with grayscale colors
            //         if(!(r == g && g == b)) return false
            //     }
            //     return Math.abs(searchR - r) <= this.maxDeviance
            //             && Math.abs(searchG - g) <= this.maxDeviance
            //             && Math.abs(searchB - b) <= this.maxDeviance
            // })
        }
    },
    mounted() {
        // generate color matrix of random colors
        const getRandHexColor = () => parseInt(Math.random() * 255).toString(16).padStart(2, '0')
        const getRandomColor = () => '#' + getRandHexColor() + getRandHexColor() + getRandHexColor()
        const getRandomGrayscaleColor = () => {
            const color = getRandHexColor()
            return '#' + color + color + color
        }
        const toHsv = (rgbHexColor) => {
            const { h, s, v } = this.asHsv(rgbHexColor)
            return `hsv(${parseInt(h)}, ${parseInt(s * 100)}%, ${parseInt(v * 100)}%)`
        }
        for(let i = 0; i < this.numBoxes; i++) {
            const color = i % 5 == 0 ? getRandomGrayscaleColor() : getRandomColor()
            console.log(color)
            this.colors.push(color)
        }
        this.filteredColors = this.colors
        console.log(this.colors)
    }
}
</script>

<style scoped>
.color-box {
    width: 20px;
    height: 20px;
    border: 1px solid black;
}
</style>