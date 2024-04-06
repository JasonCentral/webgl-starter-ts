import {
  compileShader,
  createProgram,
  getAttributeLocation,
  getUniformLocations,
  resizeCanvasIfNeeded,
} from "./glUtil.js";

type BufferData = {
  buffer: WebGLBuffer;
  attributeLocation: number;
  size: number;
  type: number; // ex. gl.UNSIGNED_BYTE
  normalized?: boolean;
  stride?: number;
  offset?: number;
};

class GLProgram {
  private program: WebGLProgram;
  private buffers: { [key: string]: BufferData } = {};
  private vaos: { [key: string]: WebGLVertexArrayObject } = {};
  private uniforms: { [key: string]: WebGLUniformLocation } = {};
  private attributeLocations: { [attr: string]: number } = {};

  private vaoInProgress: { name: string; vao: WebGLVertexArrayObject } | null =
    null;

  constructor(
    private gl: WebGL2RenderingContext,
    vertexShaderSourceCode: string,
    fragmentShaderSourceCode: string
  ) {
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

    this.program = createProgram(gl, vertexShader, fragmentShader);
  }

  createBuffer(
    bufferName: string,
    bufferContent: ArrayBuffer,
    attributeName: string,
    size: number,
    type: number,
    normalized?: boolean,
    stride?: number,
    offset?: number
  ) {
    const newBuffer = this.gl.createBuffer();
    if (newBuffer === null) {
      throw new Error(`Failed to allocate buffer name=${bufferName}`);
    }

    let attributeLocation = this.attributeLocations[attributeName];
    if (attributeLocation === undefined) {
      attributeLocation = getAttributeLocation(
        this.gl,
        this.program,
        attributeName
      );
      this.attributeLocations[attributeName] = attributeLocation;
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, newBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      bufferContent,
      this.gl.STATIC_DRAW
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    const bufferData: BufferData = {
      buffer: newBuffer,
      attributeLocation,
      size,
      type,
      normalized,
      stride,
      offset,
    };

    this.buffers[bufferName] = bufferData;
  }

  initProgram() {
    resizeCanvasIfNeeded(this.gl.canvas as HTMLCanvasElement);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.useProgram(this.program);
  }

  setAttributePointer(bufferName: string) {
    const bufferData = this.buffers[bufferName];
    if (!bufferData) {
      throw new Error(`bufferName: ${bufferName} was not initialized.`);
    }

    const {
      buffer,
      attributeLocation,
      size,
      type,
      normalized,
      stride,
      offset,
    } = bufferData;
    this.gl.enableVertexAttribArray(attributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(
      attributeLocation,
      size,
      type,
      normalized ?? false,
      stride ?? 0,
      offset ?? 0
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  startVAO(vaoName: string) {
    const vao = this.gl.createVertexArray();
    if (!vao) {
      throw new Error(`Unable to allocate VAO name=${vaoName}`);
    }

    this.gl.bindVertexArray(vao);
    this.vaoInProgress = { name: vaoName, vao };
  }

  endVAO() {
    if (!this.vaoInProgress) {
      throw new Error("VAO creation is not in progress.");
    }
    const { name, vao } = this.vaoInProgress;

    this.vaos[name] = vao;
    this.vaoInProgress = null;
    this.gl.bindVertexArray(null);
  }

  bindVAO(vaoName: string) {
    const vao = this.vaos[vaoName];
    if (!vao) {
      throw new Error(`vaoName: ${vaoName} was not found.`);
    }
    this.gl.bindVertexArray(vao);
  }

  clearVAO() {
    this.gl.bindVertexArray(null);
  }

  drawTriangles() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }

  clear(red: number, blue: number, green: number, alpha: number) {
    this.gl.clearColor(red, blue, green, alpha);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  registerUniforms(uniformNames: string[]) {
    this.uniforms = getUniformLocations(this.gl, this.program, uniformNames);
  }

  setUniform(uniformName: string, ...values: number[]) {
    const uniformLocation = this.uniforms[uniformName];
    if (!uniformLocation) {
      throw new Error(`uniformName: ${uniformName} was not registered.`);
    }

    if (values.length === 0) {
      throw new Error(`Values not provided for uniformName: ${uniformName}`);
    }
    if (values.length === 1) {
      this.gl.uniform1f(uniformLocation, values[0]);
      return;
    }
    if (values.length === 2) {
      this.gl.uniform2f(uniformLocation, values[0], values[1]);
      return;
    }
    throw new Error(
      `Unexpected values for uniformName: ${uniformName} - ${values}`
    );
  }
}

export default GLProgram;
