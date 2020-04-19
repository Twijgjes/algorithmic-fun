import { BoidOrchestrator } from './boid';
import { Clock, Camera, Scene, Renderer, Geometry, 
  Material, Mesh, PerspectiveCamera, BoxGeometry, 
  MeshNormalMaterial, WebGLRenderer, MeshBasicMaterial, Vector3 } from 'three';
import Stats from 'stats.js';
import { initGUI, initBoidGUI } from './boidGUI';

class Game {
  public camera: Camera;
  public scene: Scene; 
  public renderer: Renderer;
  public geometry: Geometry;
  public material: Material;
  public mesh: Mesh;
  public clock: Clock;
  private boidOrchestrator: BoidOrchestrator;
  private stats: Stats;

  constructor() { }

  public init() {
 
    this.camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    this.camera.position.x = 25;
    this.camera.position.y = 25;
    this.camera.position.z = 25;
    this.camera.lookAt(new Vector3());
 
    this.scene = new Scene();
 
    this.geometry = new BoxGeometry( 10, 10, 10 );
    this.material = new MeshBasicMaterial({wireframe: true});
    // this.material.wireframe = true;
 
    // this.mesh = new Mesh( this.geometry, this.material );
    // this.scene.add( this.mesh );
 
    this.renderer = new WebGLRenderer( { antialias: true } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.clock = new Clock();
    document.body.appendChild( this.renderer.domElement );

    // Gotta include OrbitControls this separately
    // const controls = new OrbitControls( this.camera, this.renderer.domElement );

    // this.makeExtrudedShape();
    const boidBehavior = {
      amount: 500,
      maxEffectDistance: 5, // 5
      cohesionDistance: 5, // 5
      cohesionForce: .01, // .01
      separationDistance: 3, // 5
      separationForce: 40, // 100
      alignmentDistance: 5, // 5
      alignmentForce: .125, // .125
      maxSpeed: 8,
      maxDistance: 20,
    };
    this.boidOrchestrator = new BoidOrchestrator(boidBehavior, this.scene, false);
    const GUI = initGUI();
    const boidGUI = initBoidGUI(GUI, boidBehavior, this.boidOrchestrator);
    this.stats = new Stats();
    this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( this.stats.dom );
  }

  // public makeExtrudedShape() {
  //   var length = 4, width = 2;

  //   var shape = new Shape();
  //   shape.moveTo( 0,0 );
  //   shape.lineTo( 0, width );
  //   shape.lineTo( length, width );
  //   shape.lineTo( length, 0 );
  //   shape.lineTo( 0, 0 );

  //   var extrudeSettings = {
  //     steps: 2,
  //     depth: 4,
  //     bevelEnabled: true,
  //     bevelThickness: 1,
  //     bevelSize: 1,
  //     bevelOffset: 0,
  //     bevelSegments: 1
  //   };

  //   var geometry = new ExtrudeBufferGeometry( shape, extrudeSettings );
  //   var material = new MeshBasicMaterial( { color: 0x00ff00 } );
  //   var mesh = new Mesh( geometry, material ) ;
  //   this.scene.add( mesh );
  // }

  public animate() {
 
    requestAnimationFrame( this.animate.bind(this) );
    this.stats.begin();

    // monitored code goes here
    const delta = this.clock.getDelta();

    this.boidOrchestrator.update(delta);
 
    this.renderer.render( this.scene, this.camera );

    this.stats.end(); 
  }
} 

const game = new Game();
game.init();
game.animate();