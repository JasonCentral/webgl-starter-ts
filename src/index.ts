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

glProgram.initProgram();
glProgram.registerUniforms(["shapeLocation", "shapeSize", "canvasSize"]);
glProgram.setUniform("canvasSize", canvas.width, canvas.height);

gl.clearColor(0.08, 0.08, 0.08, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

glProgram.setAttributePointer("position");
glProgram.setAttributePointer("rgbColor");

glProgram.setUniform("shapeSize", 200);
glProgram.setUniform("shapeLocation", 300, 600);
glProgram.drawTriangles();

glProgram.setUniform("shapeSize", 100);
glProgram.setUniform("shapeLocation", 650, 300);
glProgram.drawTriangles();
