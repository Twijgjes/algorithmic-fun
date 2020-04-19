import { Vector3, Vector } from "three";

export class Point<T> {
  constructor(
    public inhabitant: T,
    public position: Vector3, // Has to be a reference!!!
  ) {}
}

export class Octree<T> {
  private MAX_INHABITANTS: number = 4;

  // Properties
  private halfSize: number;
  private boundary: AABB;
  public parent: Octree<T> | undefined;

  // Contents
  private points: Array<Point<T>>;

  // Children
  private northEastFront: Octree<T> | undefined;
  private northWestFront: Octree<T> | undefined;
  private southEastFront: Octree<T> | undefined;
  private southWestFront: Octree<T> | undefined;
  private northEastBack: Octree<T> | undefined;
  private northWestBack: Octree<T> | undefined;
  private southEastBack: Octree<T> | undefined;
  private southWestBack: Octree<T> | undefined;
  // nef is [0][0][0];
  private map = [
    [
      [ this.northEastFront, this.northWestFront ],
      [ this.southEastFront, this.southWestFront ],
    ],
    [
      [ this.northEastBack, this.northWestBack ],
      [ this.southEastBack, this.southWestBack ],
    ]
  ];

  constructor(center: Vector3, halfSize: number, parent?: Octree<T>) {
    // A 2D array with an array of type T
    // console.info("Making octree at size:", halfSize);
    this.points = new Array<Point<T>>();
    this.halfSize = halfSize;
    this.boundary = new AABB(center, this.halfSize);
    this.parent = parent;
  }

  push(point: Point<T>): boolean {
    if (!this.boundary.containsPoint(point.position)) {
      return false;
    }

    if (this.points.length < this.MAX_INHABITANTS && this.northEastFront === undefined) {
      return this.points.push(point) > -1;
    }

    if (this.northEastFront === undefined) {
      this.subDivide();
    }

    return this.northEastFront.push(point)
      || this.northWestFront.push(point)
      || this.southEastFront.push(point)
      || this.southWestFront.push(point)
      || this.northEastBack.push(point)
      || this.northWestBack.push(point)
      || this.southEastBack.push(point)
      || this.southWestBack.push(point);
  }

  splice(point: Point<T>) {
    const pointIndex = this.points.indexOf(point);
    if (this.northEastFront === undefined) {
      if (pointIndex > -1) {
        this.points.splice(pointIndex, 1);
        return;
      }
      return;
    }

    if (!this.boundary.containsPoint(point.position)) {
      return;
    }

    this.northEastFront.splice(point);
    this.northWestFront.splice(point);
    this.southEastFront.splice(point);
    this.southWestFront.splice(point);
    this.northEastBack.splice(point);
    this.northWestBack.splice(point);
    this.southEastBack.splice(point);
    this.southWestBack.splice(point);
  }

  subDivide(): void {
    const center = this.boundary.center;
    const qs = this.halfSize / 2;
    this.northEastFront = new Octree<T>(center.clone().add(new Vector3( qs,  qs,  qs)), qs, this);
    this.northWestFront = new Octree<T>(center.clone().add(new Vector3(-qs,  qs,  qs)), qs, this);
    this.southEastFront = new Octree<T>(center.clone().add(new Vector3( qs, -qs,  qs)), qs, this);
    this.southWestFront = new Octree<T>(center.clone().add(new Vector3(-qs, -qs,  qs)), qs, this);
    this.northEastBack  = new Octree<T>(center.clone().add(new Vector3( qs,  qs, -qs)), qs, this);
    this.northWestBack  = new Octree<T>(center.clone().add(new Vector3(-qs,  qs, -qs)), qs, this);
    this.southEastBack  = new Octree<T>(center.clone().add(new Vector3( qs, -qs, -qs)), qs, this);
    this.southWestBack  = new Octree<T>(center.clone().add(new Vector3(-qs, -qs, -qs)), qs, this);
    for (const point of this.points) {
      let tree: Octree<T> | undefined = this;
      // Sometimes the point has already left the bounds
      // In that case we need to hand it off to it's parent
      while (tree) {
        tree = tree.push(point) ? undefined : tree.parent;
      }
    }
    this.points = [];
  }

  // Check all points' positions
  updatePoints(): void {
    for (const point of this.points) {
      if (!this.boundary.containsPoint(point.position)) {
        this.splice(point);
        let parent = this.parent;
        // let parentFound = false;
        while (parent !== undefined) {
          if (parent.boundary.containsPoint(point.position)) {
            // const pushSuccess = 
            parent.push(point);
            // parentFound = true;
            parent = undefined;
            // if (!pushSuccess) {
            //   console.info("Push unsuccessful");
            // }
          } else {
            // If the parent has no parent, create a new one.
            if (!parent.parent) {
              parent.createParent(point);
            }
            parent = parent.parent;
          }
        }
        // if (!parentFound) {
        //   console.info("Parent not found");
        // }
      }
    }

    if (this.northEastFront === undefined) {
      return;
    }

    this.northEastFront.updatePoints();
    this.northWestFront.updatePoints();
    this.southEastFront.updatePoints();
    this.southWestFront.updatePoints();
    this.northEastBack.updatePoints();
    this.northWestBack.updatePoints();
    this.southEastBack.updatePoints();
    this.southWestBack.updatePoints();
  }

  // Returns all points contained within this range
  queryRange(range: AABB): Array<Point<T>> {
    const pointsInRange = new Array<Point<T>>();
    if (!this.boundary.intersectsAABB(range)) {
      return pointsInRange;
    }

    for (const point of this.points) {
      if (range.containsPoint(point.position)) {
        pointsInRange.push(point);
      }
    }

    if (this.northEastFront === undefined) {
      return pointsInRange;
    }

    pointsInRange.push(...this.northEastFront.queryRange(range));
    pointsInRange.push(...this.northWestFront.queryRange(range));
    pointsInRange.push(...this.southEastFront.queryRange(range));
    pointsInRange.push(...this.southWestFront.queryRange(range));
    pointsInRange.push(...this.northEastBack.queryRange(range));
    pointsInRange.push(...this.northWestBack.queryRange(range));
    pointsInRange.push(...this.southEastBack.queryRange(range));
    pointsInRange.push(...this.southWestBack.queryRange(range));
    return pointsInRange;
  }

  createParent(pointOutside: Point<T>) {
    if (this.parent) {
      return;
    }
    const center = this.boundary.center.clone();
    const direction = pointOutside.position.clone().sub(center);
    direction.x = direction.x >= 0 ? 1 : -1;
    direction.y = direction.y >= 0 ? 1 : -1;
    direction.z = direction.z >= 0 ? 1 : -1;
    const newCenter = direction.clone().multiplyScalar(this.halfSize);
    const newTree = new Octree<T>(newCenter, this.halfSize * 2);
    // Just a shit way to find out which octal division this tree is in
    // It's easy, shut the fuck up
    if (newTree.northEastFront.boundary.center.manhattanDistanceTo(center) < 0.01) {
      newTree.northEastFront = this;
    }
    if (newTree.northWestFront.boundary.center.manhattanDistanceTo(center) < 0.01) {
      newTree.northWestFront = this;
    }
    if (newTree.southEastFront.boundary.center.manhattanDistanceTo(center) < 0.01) {
      newTree.southEastFront = this;
    }
    if (newTree.southWestFront.boundary.center.manhattanDistanceTo(center) < 0.01) {
      newTree.southWestFront = this;
    }

    if (newTree.northEastBack.boundary.center.manhattanDistanceTo(center) < 0.01) {
      newTree.northEastBack = this;
    }
    if (newTree.northWestBack.boundary.center.manhattanDistanceTo(center) < 0.01) {
      newTree.northWestBack = this;
    }
    if (newTree.southEastBack.boundary.center.manhattanDistanceTo(center) < 0.01) {
      newTree.southEastBack = this;
    }
    if (newTree.southWestBack.boundary.center.manhattanDistanceTo(center) < 0.01) {
      newTree.southWestBack = this;
    }

    this.parent = newTree;
  }

  count(): number {
    let count = this.points.length;
    if (this.northEastFront) {
      count += this.northEastFront.count();
      count += this.northWestFront.count();
      count += this.southEastFront.count();
      count += this.southWestFront.count();
      count += this.northEastBack.count();
      count += this.northWestBack.count();
      count += this.southEastBack.count();
      count += this.southWestBack.count();
    }
    return count;
  }
}

export class AABB {
  private min: Vector3;
  private max: Vector3;

  constructor(
    public center: Vector3, 
    public halfSize: number
  ) { 
    const halfVec = new Vector3(halfSize, halfSize, halfSize);
    this.min = center.clone().sub(halfVec);
    this.max = center.clone().add(halfVec);
  }

  public containsPoint(point: Vector3) {
    return point.x > this.min.x
      && point.x < this.max.x
      && point.y > this.min.y
      && point.y < this.max.y
      && point.z > this.min.z
      && point.z < this.max.z;
  }

  public intersectsAABB(other: AABB): boolean {
    return AABB.intersectsAABB(this, other);
  }

  static intersectsAABB(a: AABB, b: AABB): boolean {
    return (a.min.x <= b.max.x && a.max.x >= b.min.x) &&
         (a.min.y <= b.max.y && a.max.y >= b.min.y) &&
         (a.min.z <= b.max.z && a.max.z >= b.min.z);
  }
}