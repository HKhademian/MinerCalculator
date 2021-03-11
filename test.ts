class MyTest {
  public x: number = 1;
  public y: number = 1;

  public get z() {
    return this.x * this.y + 2;
  }

  public toString = (): string => {
    return `MyTest (z: ${this.z})`;
  };
}

console.log(new MyTest());
