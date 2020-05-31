import * as T from '../../types/types.js'
import PlayerObjectLink from './playerObject.js'
let threeJS: any

let renderer : any
let scene : any 
let camera : T.Client.Camera

export function initialize ( _three : any ) {

    let resize  = () => renderer.setSize( window.innerWidth, window.innerHeight );

    threeJS = _three
    renderer = new threeJS.WebGLRenderer();
    scene = new threeJS.Scene( );
    camera = create_camera( )
    
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', resize, false );

    // TODO load light sources from the server terrain information
    renderer.setClearColor( 0xCCCCCC, 1 );
    create_light( 1, 1, 1 );
    create_light( -1, - 0.5, -1 );

    for ( let i = 0; i < 10 ; i ++ ){
        let x = -20 + Math.random() * 40
        let y = -20 + Math.random() * 40
        let z = -20 + Math.random() * 40
        create_cube({ x,y,z, w:1, h:1, d:1} )
    }

    resize ();

    // Do linking data with renderer
    PlayerObjectLink()

}

function create_light ( x : number, y : number, z : number ) : any {
    let light = new threeJS.DirectionalLight( 0xffffff, 0.75 )
    light.position.set( x, y, z )
    scene.add( light )
    return light
}

export function create_cube ( data: T.Physics.Cube ) : any {

    let baseGeometry = new threeJS.CubeGeometry( data.w, data.h, data.d )
    let baseMaterial  = new threeJS.MeshPhongMaterial (  )
    let mesh = new threeJS.Mesh( baseGeometry, baseMaterial )
    mesh.position.set( data.x, data.y, data.z )
    scene.add( mesh )

    return mesh;
}

function create_camera () : T.Client.Camera {

    let camera = new threeJS.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 1000 );
    let yawObject = new threeJS.Object3D();
    let pitchObject = new threeJS.Object3D();

    pitchObject.add( camera );
    yawObject.add( pitchObject )
    scene.add( yawObject )

    return { pitchObject, yawObject, camera }
}

/* Does the render */

export function render ( data : T.Client.RenderPerspective ) {
    
    let { yaw, pitch, position } = data;

    camera.yawObject.rotation.y = yaw
    camera.pitchObject.rotation.x = pitch
    camera.yawObject.position.set( position.x, position.y, position.z )

    renderer.render( scene, camera.camera )
}

