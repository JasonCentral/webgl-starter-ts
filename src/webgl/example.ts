import {
  basicVertexShaderSource,
  fragmentShaderGlobalColor,
} from "./shaders.js";

import { createProgram, compileShader } from "./glUtil.js";

/**
 * Creates a program which just generates triangles given global "u_color"
 *
 * @param {!WebGL2RenderingContext} gl The WebGL context.
 * @return {!WebGLProgram} A program.
 */
export function getSampleProgram(gl: WebGL2RenderingContext) {
  const vertexShaderSource = basicVertexShaderSource;
  const fragmentShaderSource = fragmentShaderGlobalColor;

  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(
    gl,
    fragmentShaderSource,
    gl.FRAGMENT_SHADER
  );

  return createProgram(gl, vertexShader, fragmentShader);
}
