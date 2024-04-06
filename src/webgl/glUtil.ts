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

function initProgram(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  vertexAttributeName: string,
  dimension: number
) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const vertexAttributeLocation = gl.getAttribLocation(
    program,
    vertexAttributeName
  );
  if (vertexAttributeLocation < 0) {
    throw new Error(
      `Attribute name: ${vertexAttributeName} not found on program.`
    );
  }
  resizeCanvasIfNeeded(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);
  gl.enableVertexAttribArray(vertexAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(
    vertexAttributeLocation,
    dimension,
    gl.FLOAT,
    false,
    0,
    0
  );
}

export {
  getGL,
  compileShader,
  createProgram,
  resizeCanvasIfNeeded,
  initProgram,
};
