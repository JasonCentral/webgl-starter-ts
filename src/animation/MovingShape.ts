class MovingShape {
  constructor(
    public readonly position: [number, number],
    public readonly velocity: [number, number],
    public readonly size: number,
    public readonly vaoName: string
  ) {}

  update(dt: number) {
    this.position[0] += dt * this.velocity[0];
    this.position[1] += dt * this.velocity[1];
  }
}

export default MovingShape;
