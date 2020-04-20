import TWEEN from '@tweenjs/tween.js';
import { Scene, Vector3, Group, Color, Vector2, LatheGeometry, MeshBasicMaterial, Mesh } from 'three';
import { COLORS } from './Colors';
import { MeshData } from './MeshGeneratorUtils';

// export function generateAutonomousBirds(scene: Scene, amount: number, center: Vector3, radius: number) {
//   for (let i = 0; i < amount; i++) {
//     generateAutonomousBird(
//       scene,
//       center.add(
//         addRandomYRotation(
//           Vector3.Forward().scale(radius),
//           Math.PI * 2,
//         )
//       ),
//     )
//   }
// }

// export function generateAutonomousBird(scene: Scene, position: Vector3) {
//   const bird = generateBird(scene, position);
//   bird.position.y += Math.random() * 5;
//   bird.scaling.scale(1 + Math.random());
//   flyTo(bird, {speed: .05});
// }

export function generateBirdMesh(scene: Scene, position: Vector3, animated: boolean = true): Group {
  const parent = new Group();
  parent.position.copy(position);
  // parent.rotation.y = Math.PI / 2;

  const birdColor = new Color(COLORS.BROWN);

  // Bird body
  const path = [
    new Vector2(0, .15),
    new Vector2(0.02, .13),
    new Vector2(0.07, .11),
    new Vector2(0.08, .07),
    new Vector2(0.07, .05),
    new Vector2(0.1, -.02),
    new Vector2(0.08, -.07),
    new Vector2(0.02, -.15),
  ]
  // const widths = [
  //   0,
  //   0.02,
  //   0.07,
  //   0.08,
  //   0.07,
  //   0.1,
  //   0.08,
  //   0.02,
  // ];

  // var points = [];
  // for ( var i = 0; i < 10; i ++ ) {
  //   points.push( new Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
  // }
  const geometry = new LatheGeometry( path );
  const material = new MeshBasicMaterial( { color: 0xffff00 } );
  const lathe = new Mesh( geometry, material );
  parent.add(lathe);

  // const scaleFunction = (i: number, distance: number) => {
  //   return widths[i];
  // }
  // const birdBody = MeshBuilder.ExtrudeShapeCustom("birdBody", {
  //   shape: hexagon,
  //   path,
  //   scaleFunction,
  //   sideOrientation: BABYLON.Mesh.DOUBLESIDE,
  //   updatable: true,
  // });

  // simplePrepMesh(birdBody, birdColor);
  // birdBody.parent = parent;
  // const rightWing = createWing(scene, birdColor, false);
  // const leftWing = createWing(scene, birdColor, true);
  // rightWing.parent = parent;
  // leftWing.parent = parent;
  // rightWing.position.x = .025;
  // leftWing.position.x = -.025;
  // rightWing.position.y = .03;
  // leftWing.position.y = .03;

  // if (animated) {
  //   const flapTime = 300 + Math.random() * 150;

  //   rightWing.rotation.z = - Math.PI / 4;
  //   const rTween = (new TWEEN.Tween(rightWing.rotation) as any)
  //     .to({ z: Math.PI / 4 }, flapTime)
  //     .easing((TWEEN as any).Easing.Quadratic.InOut)
  //     .yoyo(true)
  //     .repeat(Infinity)
  //     .start();

  //   leftWing.rotation.z = Math.PI / 4;
  //   const lTween = (new TWEEN.Tween(leftWing.rotation) as any)
  //     .to({ z: - Math.PI / 4 }, flapTime)
  //     .easing((TWEEN as any).Easing.Quadratic.InOut) 
  //     .yoyo(true)
  //     .repeat(Infinity)
  //     .start();
  // }
  

  // const tail = createTail(scene, birdColor);
  // tail.parent = parent;
  // tail.position.z = -.14;

  scene.add(parent);

  return parent;
}

function createWing(scene: Scene, wingColor: Color, mirror = false): Mesh {
  // const wps = {
  //   a: new Vector3(.1, .02, .06),
  //   b: new Vector3(.25, 0, .03),
  //   c: new Vector3(.2, .005, -.03),
  //   d: new Vector3(.12, .01, -.05),
  //   e: new Vector3(0, 0, -.03),
  //   f: new Vector3(0, 0, .03),
  // };
  // if (mirror) {
  //   wps.a.x *= -1;
  //   wps.b.x *= -1;
  //   wps.c.x *= -1;
  //   wps.d.x *= -1;
  //   wps.e.x *= -1;
  //   wps.f.x *= -1;
  // }
  // const md = {
  //   vertices: new Array<Vector3>(),
  //   indices: new Array<number>(),
  //   colors: new Array<number>(),
  // };
  // addFace(md, wps.a, wps.e, wps.f, wingColor);
  // addFace(md, wps.a, wps.d, wps.e, wingColor);
  // addFace(md, wps.a, wps.c, wps.d, wingColor);
  // addFace(md, wps.a, wps.b, wps.c, wingColor);

  // return completeMesh(md, scene);
  const mesh = new Mesh();
  return mesh;
}

function createTail(scene: Scene, wingColor: Color): Mesh {
  // const wps = {
  //   a: new Vector3(-.01,  0, 0),
  //   b: new Vector3( .01,  0, 0),
  //   c: new Vector3( .06,  0, -.1),
  //   d: new Vector3( .015, .01, -.13),
  //   e: new Vector3(-.015, .01, -.13),
  //   f: new Vector3(-.06,  0, -.1),
  // };
  // const md = {
  //   vertices: new Array<Vector3>(),
  //   indices: new Array<number>(),
  //   colors: new Array<number>(),
  // };
  // addFace(md, wps.a, wps.e, wps.f, wingColor);
  // addFace(md, wps.a, wps.d, wps.e, wingColor);
  // addFace(md, wps.a, wps.c, wps.d, wingColor);
  // addFace(md, wps.a, wps.b, wps.c, wingColor);

  // return completeMesh(md, scene);
  const mesh = new Mesh();
  return mesh;
}

function completeMesh(md: MeshData, scene: Scene): Mesh {
  // const vertexData = new VertexData();
  // vertexData.positions = flattenVertices(md.vertices);
  // vertexData.colors = md.colors;
  // vertexData.indices = md.indices;
  // const normals = new Array<number>();
  // VertexData.ComputeNormals(vertexData.positions, md.indices, normals);

  // const mesh = new Mesh("wing");
  // vertexData.applyToMesh(mesh);
  // mesh.useVertexColors = true;
  // mesh.receiveShadows = true;

  // const material = new StandardMaterial("birdMaterial", scene);
  // material.diffuseColor = Color3.White();
  // material.specularColor = Color3.Black();
  // material.backFaceCulling = false;
  // mesh.material = material;
  const mesh = new Mesh();
  return mesh;
}

