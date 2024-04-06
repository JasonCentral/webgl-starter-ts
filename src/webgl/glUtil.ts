function getGL(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("webgl2");
  if (context === null) {
    throw new Error("Failed to get webgl2 context.");
  }
  return context;
}

function compileShader(
  gl: WebGL2RenderingContext,
  shaderSource: string,
  shaderType: number
) {
  const shader = gl.createShader(shaderType);
  if (shader === null) {
    throw new Error("Failed to allocate shader.");
  }

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Could not compile shader: ${gl.getShaderInfoLog(shader)}`);
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram {
  const program = gl.createProgram();
  if (program === null) {
    throw new Error("Failed to allocate program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program failed to link: ${gl.getProgramInfoLog(program)}`);
  }

  return program;
}

function resizeCanvasIfNeeded(canvas: HTMLCanvasElement) {
  const { clientWidth, clientHeight } = canvas;
  if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
    (canvas.width = clientWidth), (canvas.height = clientHeight);
  }
}

function getAttributeLocation(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  attributeName: string
) {
  const location = gl.getAttribLocation(program, attributeName);
  if (location < 0) {
    throw new Error(`Attribute name: ${attributeName} not found on program.`);
  }
  return location;
}

function getUniformLocations(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniformNames: string[]
) {
  const locations = uniformNames.map((name) =>
    gl.getUniformLocation(program, name)
  );
  if (locations.some((loc) => loc === null)) {
    throw new Error(
      `Failed to get uniform locations, (${locations
        .map((loc, idx) => `${uniformNames[idx]}=${loc}`)
        .join(", ")})`
    );
  }
  const locationsMap = locations.reduce(
    (acc: { [key: string]: WebGLUniformLocation }, loc, idx) => {
      acc[uniformNames[idx]] = loc!;
      return acc;
    },
    {}
  );
  return locationsMap;
}

export {
  getGL,
  compileShader,
  createProgram,
  resizeCanvasIfNeeded,
  getUniformLocations,
  getAttributeLocation,
};
