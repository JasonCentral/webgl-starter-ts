import {
  compileShader,
  createProgram,
  getGL,
  initProgram,
} from "./webgl/glUtil.js";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
const gl = getGL(canvas);

//prettier-ignore
const triangleVerticesCpuBuffer = new Float32Array([
    // Top middle
    0.0, 0.5,
    // bottom left
    -0.5, -0.5,
    // bottom right
    0.5, -0.5
])

// const triangleGeoBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);

const vertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec2 vertexPosition;

void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
}`;

const fragmentShaderSourceCode = `#version 300 es
precision mediump float;

out vec4 outputColor;

void main() {
    outputColor = vec4(0.294, 0.0, 0.51, 1.0);
}`;

const vertexShader = compileShader(
  gl,
  vertexShaderSourceCode,
  gl.VERTEX_SHADER
);
const fragmentShader = compileShader(
  gl,
  fragmentShaderSourceCode,
  gl.FRAGMENT_SHADER
);

const triangleShaderProgram = createProgram(gl, vertexShader, fragmentShader);

gl.clearColor(0.08, 0.08, 0.08, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

initProgram(gl, triangleShaderProgram, "vertexPosition", 2);
gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesCpuBuffer, gl.STATIC_DRAW);

// Draw Call / Primitive assembly
gl.drawArrays(gl.TRIANGLES, 0, 3);
