export const basicVertexShaderSource = `#version 300 es
precision mediump float;

in vec2 vertexPosition;

void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
}`;

export function basicFragmentShaderSource(r: number, g: number, b: number) {
  return `#version 300 es
precision mediump float;

out vec4 outputColor;

void main() {
    outputColor = vec4(${r / 255}, ${g / 255}, ${b / 255}, 1.0);
}`;
}

export const fragmentShaderGlobalColor = `#version 300 es
precision mediump float;
uniform vec4 u_color;

out vec4 outputColor;

void main() {
    outputColor = u_color;
}`;
