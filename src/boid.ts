import { Geometry, Material, Scene, Mesh, ConeGeometry, MeshNormalMaterial, Vector3, Quaternion } from "three";
import { Octree, Point, AABB } from "./octree";

export interface BoidProperties {
  amount: number; // 500
  maxSpeed: number; // 8
  maxDistance: number; // 20
  maxEffectDistance: number; // 5
  cohesionDistance: number; // 5
  cohesionForce: number; // .01
  separationDistance: number; // 5
  separationForce: number; // 100
  alignmentDistance: number; // 5
  alignmentForce: number; // .125
}

export class BoidOrchestrator {
  private boids: Array<Boid>;
  private octree: Octree<Boid>;
  public geometry: Geometry;
  public material: Material;

  constructor(
    public behavior: BoidProperties,
    public scene: Scene,
    public twoDMode: boolean,
  ) {
    this.boids = [];
    this.geometry = new ConeGeometry(.2, .5, 5, 1);
    this.material = new MeshNormalMaterial();
    this.createBoids();
  }

  createBoids() {
    this.octree = new Octree(new Vector3(), 100);

    for (let i = 0; i < this.behavior.amount; i++) {
      const boid = new Boid(
        this.scene, this.geometry, this.material,
        this.twoDMode ? random2DVector(-10, 10) : randomVector(-10, 10), 
        this.twoDMode ? random2DVector(-2, 2) : randomVector(-2, 2),
      );
      this.boids.push(boid);
      this.octree.push(new Point(boid, boid.mesh.position));
    }
  }

  update(delta: number) {
    this.octree.updatePoints();
    // console.info("Total boids", this.octree.count());
    // const octree = new Octree(new Vector3(), 100);
    // this.boids.map(boid => octree.push(new Point(boid, boid.mesh.position)));
    // let count = 0;
    for (const boid of this.boids) {
      // this.containToBox(boid);
      const neighbors = this.calculateBoidData(
        boid, 
        this.octree
          .queryRange(new AABB(boid.mesh.position, 2.5))
          .map(point => point.inhabitant as Boid),
        this.behavior.maxEffectDistance,
      );

      const forces: Array<Vector3> = [];
      forces.push(this.avoidBorders(boid));

      if (neighbors.length > 0) {
        forces.push(this.cohesion(boid, neighbors));
        forces.push(this.separation(boid, neighbors));
        forces.push(this.alignment(boid, neighbors));
      }

      for (const v of forces) {
        boid.velocity.add(v);
      }

      const magnitude = boid.velocity.length();
      if (magnitude > this.behavior.maxSpeed) {
        boid.velocity.multiplyScalar(this.behavior.maxSpeed / magnitude);
      }

      // if (this.twoDMode) {
      //   this.make2D(boid);
      // }

      boid.update(delta);
    }
    // console.info("Number of neighbors:", count);
  }

  // Boids try to fly towards the centre of mass of neighbouring boids.
  cohesion(boid: Boid, neighbors: Array<BoidData>): Vector3 {
    const v = new Vector3(0,0,0);

    for (const neighbor of neighbors) {
      // console.info("Distance len:", distance.length())
      if (neighbor.distance < this.behavior.cohesionDistance) {
        v.add(neighbor.boid.mesh.position);
      }
    }
    v.divideScalar(neighbors.length);
    return v.sub(boid.mesh.position).multiplyScalar(this.behavior.cohesionForce);
  }

  // Boids try to keep a small distance away from other objects (including other boids).
  separation(boid: Boid, neighbors: Array<BoidData>): Vector3 {
    // Needs rework. Move away more strongly when getting closer.
    const v = new Vector3(0,0,0);
    // const neighbor
    for (const neighbor of neighbors) {
      // vector from boid away from neighbor
      const awayVector = neighbor.to.clone().negate();
      if (neighbor.distance < this.behavior.separationDistance) {
        v.add(awayVector.normalize().divideScalar(neighbor.distance * this.behavior.separationForce))
      }
    }

		// RETURN c
    return v;
  }

  // Boids try to match velocity with near boids.
  alignment(boid: Boid, neighbors: Array<BoidData>): Vector3 {
    const v = new Vector3(0,0,0);
    
    for (const neighbor of neighbors) {
      if (neighbor.distance < this.behavior.alignmentDistance) {
        v.add(neighbor.boid.velocity);
      }
    }

    v.divideScalar(neighbors.length);
    v.multiplyScalar(this.behavior.alignmentForce);
    return v;
  }

  // TODO refactor to increase when getting closer to border
  avoidBorders(boid: Boid) {
    const v = new Vector3(0,0,0);
    if (boid.mesh.position.x > this.behavior.maxDistance) {
      v.x -= 1;
    }
    if (boid.mesh.position.y > this.behavior.maxDistance) {
      v.y -= 1;
    }
    if (boid.mesh.position.z > this.behavior.maxDistance) {
      v.z -= 1;
    }

    if (boid.mesh.position.x < -this.behavior.maxDistance) {
      v.x += 1;
    }
    if (boid.mesh.position.y < -this.behavior.maxDistance) {
      v.y += 1;
    }
    if (boid.mesh.position.z < -this.behavior.maxDistance) {
      v.z += 1;
    }
    return v;
  }

  containToBox(boid: Boid) {
    if (Math.abs(boid.mesh.position.x) > this.behavior.maxDistance) {
      boid.mesh.position.x *= -1;
    }
    if (Math.abs(boid.mesh.position.y) > this.behavior.maxDistance) {
      boid.mesh.position.y *= -1;
    }
    if (Math.abs(boid.mesh.position.z) > this.behavior.maxDistance) {
      boid.mesh.position.z *= -1;
    }
  }

  // This is actually less efficient than brute forcing -_-
  calculateBoidData(boid: Boid, boids: Array<Boid>, maxDistance: number): Array<BoidData> {
    const neighbors: Array<BoidData> = [];
    for (const otherBoid of boids) {
      if (otherBoid === boid) {
        continue;
      }
      const to = otherBoid.mesh.position.clone().sub(boid.mesh.position);
      const distance = to.length();
      if (distance < maxDistance) {
        neighbors.push({
          to, distance, boid: otherBoid,
        });
      }
    }
    return neighbors;
  }

  destroyBoids() {
    for (const boid of this.boids) {
      this.scene.remove(boid.mesh);
    }
    this.boids = [];
  }
}

interface BoidData {
  to: Vector3;
  distance: number;
  boid: Boid;
}

export class Boid {
  public mesh: Mesh;
  public velocity: Vector3;

  constructor(scene: Scene, geometry: Geometry, material: Material, position: Vector3, velocity: Vector3) {
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.copy(position);
    this.velocity = velocity;
    scene.add(this.mesh);
  }

  update(delta: number) {
    this.mesh.position.add(this.velocity.clone().multiplyScalar(delta));
    this.mesh.rotation.setFromQuaternion((new Quaternion()).setFromUnitVectors(new Vector3(0,1,0), this.velocity.clone().normalize()));
  }

}

function randomVector(min: number, max: number) {
  const range = max - min;
  return new Vector3(
    min + Math.random() * range,
    min + Math.random() * range,
    min + Math.random() * range,
  );
}

function random2DVector(min: number, max: number) {
  const range = max - min;
  return new Vector3(
    min + Math.random() * range,
    min + Math.random() * range,
    0,
  );
}