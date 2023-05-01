<template>
    <div>
        Hello
    </div>
</template>

<script>
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

    export default {
        data() {
            return {}
        },
        created() {
            // scene
            const scene = new THREE.Scene();
        
            // camera
            const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
            // renderer
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );
        
            // lights
            // var light = new THREE.DirectionalLight(0xefefff, 3);
            // light.position.set(2, 5, 5).normalize();
            // scene.add(light);

            var light = new THREE.DirectionalLight(0xffefef, 3);
            light.position.set(-5, -5, -5).normalize();
            scene.add(light);
        
            // model
            var loader = new GLTFLoader();
            // var mixer;
            var model;
            loader.load(
                'http://localhost:8080/one-switch.gltf', function(gltf) {
        
                gltf.scene.traverse( function( node ) {
                    if ( node instanceof THREE.Mesh ) { 
                        node.castShadow = true; 
                        node.material.side = THREE.DoubleSide;
                    }
                });
                
                model = gltf.scene;
                model.scale.set(90,90,90);
                scene.add(model);
        
                // mixer = new THREE.AnimationMixer(model);
                // mixer.clipAction(gltf.animations[1]).play();
            });
        
            // cube
            // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            // const cube = new THREE.Mesh( geometry, material );
            // scene.add( cube );
        
            camera.position.z = 4
            camera.position.x = 1
            camera.position.y = 0
            camera.rotation.y = -15 * Math.PI / 180
        
            // animate
            function animate() {
                requestAnimationFrame( animate );
        
                // cube.rotation.x += 0.01;
                // cube.rotation.y += 0.01;
        
                // model.rotation.y += 0.01
        
                renderer.render( scene, camera );
            }
            animate();
        }
    }


</script>