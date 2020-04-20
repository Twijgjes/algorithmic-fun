import * as dat from 'dat.gui';
import { BoidProperties, BoidOrchestrator } from './boid';

export function initGUI() {
  return new dat.GUI();
}

export function initBoidGUI(gui: dat.GUI, boidBehavior: BoidProperties, boidOrchestrator: BoidOrchestrator) {
  const bbF = gui.addFolder("Boids behavior");
  bbF.add(boidBehavior, "amount", 1, 2000);
  bbF.add(boidBehavior, "maxSpeed", 1, 100);
  bbF.add(boidBehavior, "maxDistance", 1, 100);
  bbF.add(boidBehavior, "maxEffectDistance", .5, 20);
  bbF.add(boidBehavior, "cohesionDistance", .5, 10);
  bbF.add(boidBehavior, "cohesionForce", .001, .1);
  bbF.add(boidBehavior, "separationDistance", .5, 10);
  bbF.add(boidBehavior, "separationForce", 1, 100);
  bbF.add(boidBehavior, "alignmentDistance", .5, 10);
  bbF.add(boidBehavior, "alignmentForce", .01, 1);
  bbF.add(boidOrchestrator, "destroyBoids");
  bbF.add(boidOrchestrator, "createBoids");
}