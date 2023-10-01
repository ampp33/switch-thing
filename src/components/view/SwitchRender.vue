<template>
    <div ref="switch" class="switch">
    </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ModifiedRoomEnvironment } from '/src/assets/ModifiedRoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default {
    props: ['stemColorRgba', 'topColorRgba', 'bottomColorRgba'],
    data() {
        return {
            top: null,
            bottom: null,
            stem: null,
            spring: null
        }
    },
    methods: {
        rgbaToThreeColor(rgba) {
            const [ _, r, g, b ] = rgba.split(/ |\(|\)/)
            return new THREE.Color(`rgb(${r}, ${g}, ${b})`)
        },
        getTransmission(rgba) {
            return 1 - parseFloat(rgba.split(/ |\(|\)/)[5])
        },
        updateColors() {
            if(this.topColorRgba) {
                this.top.material.color = this.rgbaToThreeColor(this.topColorRgba)
                this.top.material._transmission = this.getTransmission(this.topColorRgba)
            }
            if(this.bottomColorRgba) {
                this.bottom.material.color = this.rgbaToThreeColor(this.bottomColorRgba)
                this.bottom.material._transmission = this.getTransmission(this.bottomColorRgba)
            }
            if(this.stemColorRgba) {
                this.stem.material.color = this.rgbaToThreeColor(this.stemColorRgba)
                this.stem.material._transmission = this.getTransmission(this.stemColorRgba)
            }


            // console.log(this.top)
            // this.spring.material.color.r = 1
            // this.spring.material.color.g = 0
            // this.spring.material.color.b = 0
        }
    },
    mounted() {
        // scene
        const scene = new THREE.Scene();
        
        // camera
        const camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 1000 );
        
        const {offsetHeight: elementHeight, offsetWidth: elementWidth} = this.$refs.switch

        // renderer
        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( elementWidth, elementHeight );
        this.$refs.switch.appendChild( renderer.domElement );

        // scene.background = new THREE.Color( 0xbfe3dd );
        scene.background = new THREE.Color( 0xffffff );
        const pmremGenerator = new THREE.PMREMGenerator( renderer );
        scene.environment = pmremGenerator.fromScene( new ModifiedRoomEnvironment( renderer )).texture;

        // add mouse controls
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0, 0 );
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;
        // controls.addEventListener('change', (event) => {
        //     console.log(camera.position, camera.rotation)
        // })
        
        // model
        var loader = new GLTFLoader();
        // var mixer;
        const self = this
        // https://sketchfab.com/3d-models/cherry-mx-switches-71e8e1687abc4a8fbef195ab09581287
        loader.load(
            '/switch2.gltf', function(gltf) {
    
            gltf.scene.traverse( function( node ) {
                if ( node instanceof THREE.Mesh ) { 
                    node.castShadow = true; 
                    node.material.side = THREE.DoubleSide;

                    if(node.name == 'Top') self.top = node
                    if(node.name == 'Bottom') self.bottom = node
                    if(node.name == 'Stem') self.stem = node
                    if(node.name == 'Spring') self.spring = node
                }
            });
            
            const model = gltf.scene;
            model.scale.set(2,2,2);

            const box = new THREE.Box3().setFromObject( model );
            const center = box.getCenter( new THREE.Vector3() );

            model.position.x += ( model.position.x - center.x );
            model.position.y += ( model.position.y - center.y );
            model.position.z += ( model.position.z - center.z );
            
            scene.add(model);

            self.updateColors()

            // mixer = new THREE.AnimationMixer(model);
            // mixer.clipAction(gltf.animations[1]).play();
        });

        camera.position.z = 4.28
        camera.position.x = 3.94
        camera.position.y = 2.69
        // camera.rotation.z = -15 * Math.PI / 180
    
        // animate
        function animate() {
            requestAnimationFrame( animate );
            controls.update();
            renderer.render( scene, camera );
        }
        animate();
    }
}
</script>

<style scoped>
.switch {
    height: 300px;
    width: 300px;
}
</style>