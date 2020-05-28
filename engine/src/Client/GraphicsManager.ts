import * as T from '../types.js'

export default class GraphicsManager {
    
    renderer
    scene
    camera

    constructor ( public threeJS : any ) {

        let resize  = () => this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.renderer = new threeJS.WebGLRenderer();
        this.scene = new threeJS.Scene( );
        this.camera = this.create_camera( )
        
        document.body.appendChild( this.renderer.domElement );
        window.addEventListener( 'resize', resize, false );

        // TODO load light sources from the server terrain information
        //this.renderer.setClearColor( 0xffffff, 1 );
        this.create_light( 1, 1, 1 );
        this.create_light( -1, - 0.5, -1 );

        resize ();

    }

    /* Create new items in the scene */

    create_light ( x : number, y : number, z : number ) : any {
        let light = new this.threeJS.DirectionalLight( 0xffffff, 0.75 )
        light.position.set( x, y, z )
        this.scene.add( light )
        return light
    }

    create_cube ( data: T.SpacialCube ) : any {

        let baseGeometry = new this.threeJS.CubeGeometry( data.w, data.h, data.d )
        let baseMaterial  = new this.threeJS.MeshPhongMaterial (  )
        let mesh = new this.threeJS.Mesh( baseGeometry, baseMaterial )

        this.scene.add( mesh )

        return mesh;
    }

    create_camera () : T.ThreeCamera{
    
        let camera = new this.threeJS.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 1000 );
        let yawObject = new this.threeJS.Object3D();
        let pitchObject = new this.threeJS.Object3D();
    
        pitchObject.add( camera );
        yawObject.add( pitchObject )
        this.scene.add( yawObject )
    
        return { pitchObject, yawObject, camera }
    }

    /* Does the render */

    render ( data : T.ThreeRenderPerspective ) {
        
        let { yaw, pitch, position } = data;

        this.camera.yawObject.rotation.y = yaw
        this.camera.pitchObject.rotation.x = pitch
        this.camera.yawObject.position.set( position )

        this.renderer.render( this.scene, this.camera.camera )
    }

}
