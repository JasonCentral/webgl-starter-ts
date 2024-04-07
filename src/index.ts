import AnimationLoop from "./animation/AnimationLoop.js";
import MovingShape from "./animation/MovingShape.js";
import { rand, randInt } from "./util/randomUtil.js";
import GLProgram from "./webgl/GLProgram.js";
import { getGL } from "./webgl/glUtil.js";
import {
  basicFragmentShaderSourceCode,
  basicVertexShaderSourceCode,
} from "./webgl/shaders.js";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
const gl = getGL(canvas);

//prettier-ignore
const triangleVerticesCpuBuffer = new Float32Array([
    // Top middle
    0.0, 1,
    // bottom left
    -1, -1,
    // bottom right
    1, -1
])

//prettier-ignore
const rgbTriangleColors = new Uint8Array([
    255, 0, 0,
    0, 255, 0,
    0, 0, 255
]);

//prettier-ignore
const fireyTriangleColors = new Uint8Array([
    229, 47, 15,
    246, 206, 29,
    233, 154, 26
]);

const glProgram = new GLProgram(
  gl,
  basicVertexShaderSourceCode,
  basicFragmentShaderSourceCode
);

glProgram.createBuffer(
  "position",
  triangleVerticesCpuBuffer,
  "vertexPosition",
  2,
  gl.FLOAT,
  false
);

glProgram.createBuffer(
  "rgbColor",
  rgbTriangleColors,
  "vertexColor",
  3,
  gl.UNSIGNED_BYTE,
  true
);

glProgram.createBuffer(
  "fireyColor",
  fireyTriangleColors,
  "vertexColor",
  3,
  gl.UNSIGNED_BYTE,
  true
);

// Initialize program
glProgram.initProgram();
glProgram.registerUniforms(["shapeLocation", "shapeSize", "canvasSize"]);
glProgram.setUniform("canvasSize", canvas.width, canvas.height);

// Create VAOs
const rgbTriangleVAO = "RGB_Triangle";
glProgram.startVAO(rgbTriangleVAO);
glProgram.setAttributePointer("position");
glProgram.setAttributePointer("rgbColor");
glProgram.endVAO();

const fieryTriangleVAO = "Fiery_Triangle";
glProgram.startVAO(fieryTriangleVAO);
glProgram.setAttributePointer("position");
glProgram.setAttributePointer("fireyColor");
glProgram.endVAO();

function animate(numTriangles: number, logFrames: boolean = false) {
  const loop = new AnimationLoop();

  const triangles = Array.from({ length: numTriangles }, () => {
    return new MovingShape(
      [randInt(0, 800), randInt(0, 800)],
      [randInt(-50, 50), randInt(-50, 50)],
      randInt(5, 50),
      rgbTriangleVAO
    );
  });

  function animationFrame() {
    if (logFrames) console.log(1 / loop.deltaTime);
    triangles.forEach((triangle) => triangle.update(loop.deltaTime));

    glProgram.clear(0.08, 0.08, 0.08, 1.0);

    triangles.forEach((triangle) => {
      glProgram.setUniform("shapeSize", triangle.size);
      glProgram.setUniform("shapeLocation", ...triangle.position);
      glProgram.bindVAO(triangle.vaoName);
      glProgram.draw(3);
    });

    loop.requestAnimationFrame(animationFrame);
  }
  animationFrame();
}

function animateBatched(numTriangles: number, logFrames: boolean = false) {
  const loop = new AnimationLoop();
  const triangles = Array.from({ length: numTriangles }, () => {
    return new MovingShape(
      [randInt(0, 800), randInt(0, 800)],
      [randInt(-50, 50), randInt(-50, 50)],
      randInt(5, 50),
      rgbTriangleVAO
    );
  });

  glProgram.setUniform("shapeSize", 1);
  glProgram.setUniform("shapeLocation", 0, 0);

  glProgram.createBuffer(
    "positionsBatched",
    new Float32Array(triangles.length * 3 * 2),
    "vertexPosition",
    2,
    gl.FLOAT,
    false
  );

  const triangleColors = [
    [255, 0, 0, 0, 255, 0, 0, 0, 255],
    [229, 47, 15, 246, 206, 29, 233, 154, 26],
  ];

  const colorsRepeated = Array.from({ length: triangles.length }).flatMap(
    () => triangleColors[randInt(0, triangleColors.length - 1)]
  );

  glProgram.createBuffer(
    "colorsBatched",
    new Uint8Array(colorsRepeated),
    "vertexColor",
    3,
    gl.UNSIGNED_BYTE,
    true
  );

  const trianglesVAO = `lots_of_triangles`;
  glProgram.startVAO(trianglesVAO);
  glProgram.setAttributePointer("positionsBatched");
  glProgram.setAttributePointer("colorsBatched");
  glProgram.endVAO();
  glProgram.bindVAO(trianglesVAO);

  function animationFrame() {
    if (logFrames) console.log(1 / loop.deltaTime);
    const positionBuffer = new Float32Array(triangles.length * 3 * 2);
    for (let i = 0; i < triangles.length; i++) {
      const triangle = triangles[i];
      triangle.update(loop.deltaTime);
      const [x, y] = triangle.position;

      positionBuffer[6 * i] = x;
      positionBuffer[6 * i + 1] = triangle.size + y;
      positionBuffer[6 * i + 2] = -triangle.size + x;
      positionBuffer[6 * i + 3] = -triangle.size + y;
      positionBuffer[6 * i + 4] = triangle.size + x;
      positionBuffer[6 * i + 5] = -triangle.size + y;
    }
    glProgram.updateBuffer("positionsBatched", positionBuffer);
    glProgram.clear(0.08, 0.08, 0.08, 1.0);

    glProgram.draw(triangles.length * 3);

    loop.requestAnimationFrame(animationFrame);
  }
  animationFrame();
}

// animate(10000, false);
animateBatched(10000);
