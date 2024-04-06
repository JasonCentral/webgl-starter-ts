function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export { randInt, rand };
