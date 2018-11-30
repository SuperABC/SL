var canvas = document.getElementById('webgl');
var gl = getWebGLContext(canvas);

var Shader = {
  SHADOW_VERTEX_SHADER:
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '}\n',
  SHADOW_FRAGMENT_SHADER:
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'void main() {\n' +
    '  gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);\n' +
    '}\n',

  ELEMENT_VERTEX_SHADER:
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Normal;\n' +

    'varying vec4 v_Position;\n' +
    'varying vec4 v_Color;\n' +
    'varying vec4 v_Normal;\n' +
    'varying vec4 v_PositionFromLight;\n' +

    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_MvpMatrixFromLight;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    
    '  v_Position = a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '  v_Normal = a_Normal;\n' +
    '  v_PositionFromLight = u_MvpMatrixFromLight * a_Position;\n' +
    '}\n',
  ELEMENT_FRAGMENT_SHADER:
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    
    'varying vec4 v_Position;\n' +
    'varying vec4 v_Color;\n' +
    'varying vec4 v_Normal;\n' +
    'varying vec4 v_PositionFromLight;\n' +

    'uniform vec3 u_LightPos;\n' +
    'uniform vec3 u_EyePos;\n' +
    'uniform sampler2D u_ShadowMap;\n' +

    'vec3 reflectant(float visibility) {' +
    '  vec3 fragColor = v_Color.rgb;' +
    '  vec3 fragNormal = normalize(v_Normal.xyz);' +
    '  vec3 lightColor = vec3(1.0, 1.0, 1.0);' +

    '  vec3 ambient = vec3(0.3, 0.3, 0.3);' +

    '  vec3 lightDir = normalize(u_LightPos - v_Position.xyz);' +
    '  vec3 diffuse = lightColor * max(dot(lightDir, fragNormal), 0.0);' +
    
    '  vec3 viewDir = normalize(u_EyePos - v_Position.xyz);' +
    '  vec3 halfwayDir = normalize(lightDir + viewDir);' +
    '  float spec;' +
    '  if(dot(lightDir, fragNormal) > 0.0)' +
    '    spec = pow(max(dot(fragNormal, halfwayDir), 0.0), 1.0);' +
    '  else' +
    '    spec = 0.0;' +
    '  vec3 specular = lightColor * spec * vec3(0.3, 0.3, 0.3);' +

    '  vec3 lighting = (ambient + (diffuse + specular)*visibility) * fragColor;' +
	  '  return lighting;' +
    '}' +

    'void main() {\n' +
    '  vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;\n' +
    '  vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);\n' +
    '  float depth = rgbaDepth.r;\n' +
    '  float visibility = (shadowCoord.z > depth + 0.005) ? 0.4 : 1.0;\n' +

    '  gl_FragColor = vec4(reflectant(visibility), 1.0);\n' +
    '}\n',

  TEXTURE_VERTEX_SHADER:
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_Coord;\n' +
    'attribute vec4 a_Normal;\n' +

    'varying vec4 v_Position;\n' +
    'varying vec2 v_Coord;\n' +
    'varying vec4 v_Normal;\n' +
    'varying vec4 v_PositionFromLight;\n' +

    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_MvpMatrixFromLight;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    
    '  v_Position = a_Position;\n' +
    '  v_Coord = a_Coord;\n' +
    '  v_Normal = a_Normal;\n' +
    '  v_PositionFromLight = u_MvpMatrixFromLight * a_Position;\n' +
    '}\n',
  TEXTURE_FRAGMENT_SHADER:
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    
    'varying vec4 v_Position;\n' +
    'varying vec2 v_Coord;\n' +
    'varying vec4 v_Normal;\n' +
    'varying vec4 v_PositionFromLight;\n' +

    'uniform vec3 u_LightPos;\n' +
    'uniform vec3 u_EyePos;\n' +
    'uniform sampler2D u_ShadowMap;\n' +
    'uniform sampler2D u_TextureMap;\n' +

    'vec3 reflect(float visibility) {' +
    '  vec3 fragColor = texture2D(u_TextureMap, v_Coord).rgb;' +
    '  vec3 fragNormal = normalize(v_Normal.xyz);' +
    '  vec3 lightColor = vec3(1.0, 1.0, 1.0);' +

    '  vec3 ambient = vec3(0.3, 0.3, 0.3);' +

    '  vec3 lightDir = normalize(u_LightPos - v_Position.xyz);' +
    '  vec3 diffuse = lightColor * max(dot(lightDir, fragNormal), 0.0);' +
    
    '  vec3 viewDir = normalize(u_EyePos - v_Position.xyz);' +
    '  vec3 halfwayDir = normalize(lightDir + viewDir);' +
    '  float spec;' +
    '  if(dot(lightDir, fragNormal) > 0.0)' +
    '    spec = pow(max(dot(fragNormal, halfwayDir), 0.0), 1.0);' +
    '  else' +
    '    spec = 0.0;' +
    '  vec3 specular = lightColor * spec * vec3(0.8, 0.8, 0.8);' +

    '  vec3 lighting = (ambient + (diffuse + specular)*visibility) * fragColor;' +
	  '  return lighting;' +
    '}' +

    'void main() {\n' +
    '  vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;\n' +
    '  vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);\n' +
    '  float depth = rgbaDepth.r;\n' +
    '  float visibility = (shadowCoord.z > depth + 0.005) ? 0.4 : 1.0;\n' +

    '  gl_FragColor = vec4(reflect(visibility), 1.0);\n' +
    '}\n',


  shadowProgram:null,
  elementProgram:null,
  textureProgram:null,

  setup:function(){
    this.shadowProgram = createProgram(gl, this.SHADOW_VERTEX_SHADER, this.SHADOW_FRAGMENT_SHADER);
    this.shadowProgram.a_Position = gl.getAttribLocation(this.shadowProgram, 'a_Position');
    this.shadowProgram.u_MvpMatrix = gl.getUniformLocation(this.shadowProgram, 'u_MvpMatrix');
  
    this.elementProgram = createProgram(gl, this.ELEMENT_VERTEX_SHADER, this.ELEMENT_FRAGMENT_SHADER);
    this.elementProgram.a_Position = gl.getAttribLocation(this.elementProgram, 'a_Position');
    this.elementProgram.a_Color = gl.getAttribLocation(this.elementProgram, 'a_Color');
    this.elementProgram.a_Normal = gl.getAttribLocation(this.elementProgram, 'a_Normal');
    this.elementProgram.u_MvpMatrix = gl.getUniformLocation(this.elementProgram, 'u_MvpMatrix');
    this.elementProgram.u_MvpMatrixFromLight = gl.getUniformLocation(this.elementProgram, 'u_MvpMatrixFromLight');
    this.elementProgram.u_LightPos = gl.getUniformLocation(this.elementProgram, 'u_LightPos');
    this.elementProgram.u_EyePos = gl.getUniformLocation(this.elementProgram, 'u_EyePos');
    this.elementProgram.u_ShadowMap = gl.getUniformLocation(this.elementProgram, 'u_ShadowMap');
  
    this.textureProgram = createProgram(gl, this.TEXTURE_VERTEX_SHADER, this.TEXTURE_FRAGMENT_SHADER);
    this.textureProgram.a_Position = gl.getAttribLocation(this.textureProgram, 'a_Position');
    this.textureProgram.a_Coord = gl.getAttribLocation(this.textureProgram, 'a_Coord');
    this.textureProgram.a_Normal = gl.getAttribLocation(this.textureProgram, 'a_Normal');
    this.textureProgram.u_MvpMatrix = gl.getUniformLocation(this.textureProgram, 'u_MvpMatrix');
    this.textureProgram.u_MvpMatrixFromLight = gl.getUniformLocation(this.textureProgram, 'u_MvpMatrixFromLight');
    this.textureProgram.u_LightPos = gl.getUniformLocation(this.textureProgram, 'u_LightPos');
    this.textureProgram.u_EyePos = gl.getUniformLocation(this.textureProgram, 'u_EyePos');
    this.textureProgram.u_ShadowMap = gl.getUniformLocation(this.textureProgram, 'u_ShadowMap');
    this.textureProgram.u_TextureMap = gl.getUniformLocation(this.textureProgram, 'u_TextureMap');
  }
}

var Light = {
  pos:{x:1.0, y:3.0, z:2.0}
};
var Eye = {
  pos:{x:0.0, y:7.0, z:9.0},
  speed:{x:0, y:0, z:0},

  dir:{x:0.0, y:0.0, z:-1},
  ang:{theta:Math.PI/2, phi:Math.PI/2},

  up:{x:0, y:1, z:0},

  setEye:function(){
    this.pos.x = arguments[0];
    this.pos.y = arguments[1];
    this.pos.z = arguments[2];
    switch(arguments.length){
    case 5:
      this.ang.theta = arguments[3];
      this.ang.phi = arguments[4];
      this.dir.x = Math.sin(this.ang.phi)*Math.cos(this.ang.theta);
      this.dir.y = Math.cos(this.ang.phi);
      this.dir.z = -Math.sin(this.ang.phi)*Math.sin(this.ang.theta);
      break;
    case 6:
      this.dir.x = arguments[3];
      this.dir.y = arguments[4];
      this.dir.z = arguments[5];
      this.ang.theta = Math.atan(-this.dir.z/this.dir.x);
      this.ang.phi = Math.acos(this.dir.y);
      break;
    case 7:
      this.ang.theta = arguments[3];
      this.ang.phi = arguments[4];
      this.dir.x = Math.sin(this.ang.phi)*Math.cos(this.ang.theta);
      this.dir.y = Math.cos(this.ang.phi);
      this.dir.z = -Math.sin(this.ang.phi)*Math.sin(this.ang.theta);
      this.up.x = Math.sin(arguments[6])*Math.cos(arguments[5]);
      this.up.y = Math.cos(arguments[6]);
      this.up.z = Math.sin(arguments[6])*Math.sin(arguments[5]);
      break;
    case 9:
      this.dir.x = arguments[3];
      this.dir.y = arguments[4];
      this.dir.z = arguments[5];
      this.ang.theta = Math.atan(this.dir.z/this.dir.x);
      this.ang.phi = Math.acos(this.dir.y);
      this.up.x = arguments[6];
      this.up.y = arguments[7];
      this.up.z = arguments[8];
      break;
    default:
      break;
    }
  },
  moveEye:function(fb, lr, ud){
    if(arguments.length==0){
      this.pos.x += -this.dir.x*this.speed.z + this.dir.z*this.speed.x;
      this.pos.y += this.speed.y;
      this.pos.z += -this.dir.z*this.speed.z - this.dir.x*this.speed.x;
    }
    else{
      this.pos.x += this.dir.x*fb + this.dir.z*lr;
      this.pos.y += ud;
      this.pos.z += this.dir.z*fb - this.dir.x*lr;
    }
  },
  rotateEye:function(theta, phi){
    this.ang.theta-=theta;
    while(this.ang.theta > 2*Math.PI)this.ang.theta -= 2*Math.PI;
    while(this.ang.theta < 0)this.ang.theta += 2*Math.PI;
    this.ang.phi+=phi;
    if(this.ang.phi>Math.PI*0.99)this.ang.phi = Math.PI*0.99;
    if(this.ang.phi<Math.PI*0.01)this.ang.phi = Math.PI*0.01;
    this.dir.x = Math.sin(this.ang.phi)*Math.cos(this.ang.theta);
    this.dir.y = Math.cos(this.ang.phi);
    this.dir.z = -Math.sin(this.ang.phi)*Math.sin(this.ang.theta);
  }
}

function draw(program, o, mvpMatrix) {
  var initAttributeVariable = function(gl, attribute, buffer){
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(attribute);
  }
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
  if (program.a_Color != undefined){
    initAttributeVariable(gl, program.a_Color, o.colorBuffer);
    initAttributeVariable(gl, program.a_Normal, o.normalBuffer);
  }
  if (program.a_Coord != undefined){
    initAttributeVariable(gl, program.a_Coord, o.coordBuffer);
    initAttributeVariable(gl, program.a_Normal, o.normalBuffer);
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);
  gl.drawElements(gl.TRIANGLES, o.numIndices, gl.UNSIGNED_BYTE, 0);
}
function main() {
  var initFramebufferObject = function() {
    var framebuffer, texture, depthBuffer;
  
    framebuffer = gl.createFramebuffer();
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, macro.SHADOW_WIDTH, macro.SHADOW_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
    depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, macro.SHADOW_WIDTH, macro.SHADOW_HEIGHT);
  
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
  
    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    framebuffer.texture = texture;
  
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  
    return framebuffer;
  }

  Shader.setup();
  Mouse.setup();
  Key.setup();

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  var fbo = initFramebufferObject(gl);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

  Scene.Init();
  var tick = function() {
    var viewProjMatrixFromLight = new Matrix4();
    viewProjMatrixFromLight.setPerspective(150.0, macro.SHADOW_WIDTH/macro.SHADOW_HEIGHT, 1.0, 10000.0);
    viewProjMatrixFromLight.lookAt(Light.pos.x, Light.pos.y, Light.pos.z, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0);
  
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, macro.SHADOW_WIDTH, macro.SHADOW_HEIGHT);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(Shader.shadowProgram);
    var mvpMatrixFromLight = viewProjMatrixFromLight;
    for(var i = 0; i < Scene.Element.length; i++)
      draw(Shader.shadowProgram, Scene.Element[i], mvpMatrixFromLight);
    for(var i = 0; i < Scene.Texture.length; i++)
      draw(Shader.shadowProgram, Scene.Texture[i], mvpMatrixFromLight);

    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(45, canvas.width/canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(Eye.pos.x, Eye.pos.y, Eye.pos.z, 
      Eye.pos.x + Eye.dir.x, Eye.pos.y + Eye.dir.y, Eye.pos.z + Eye.dir.z, 0.0, 1.0, 0.0);
  
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(Shader.elementProgram);
    gl.uniformMatrix4fv(Shader.elementProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight.elements);
    gl.uniform3f(Shader.elementProgram.u_LightPos, Light.pos.x, Light.pos.y, Light.pos.z);
    gl.uniform3f(Shader.elementProgram.u_EyePos, Eye.pos.x, Eye.pos.y, Eye.pos.z);
    gl.uniform1i(Shader.elementProgram.u_ShadowMap, 0);
    var mvpMatrix = viewProjMatrix;
    for(var i = 0; i < Scene.Element.length; i++)
      draw(Shader.elementProgram, Scene.Element[i], mvpMatrix);
    gl.useProgram(Shader.textureProgram);
    gl.uniformMatrix4fv(Shader.textureProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight.elements);
    gl.uniform3f(Shader.textureProgram.u_LightPos, Light.pos.x, Light.pos.y, Light.pos.z);
    gl.uniform3f(Shader.textureProgram.u_EyePos, Eye.pos.x, Eye.pos.y, Eye.pos.z);
    gl.uniform1i(Shader.textureProgram.u_ShadowMap, 0);
    var mvpMatrix = viewProjMatrix;
    gl.uniform1i(Shader.textureProgram.u_TextureMap, 1);
    for(var i = 0; i < Scene.Texture.length; i++)
      draw(Shader.textureProgram, Scene.Texture[i], mvpMatrix);

    Eye.moveEye();
    window.requestAnimationFrame(tick, canvas);
  };
  tick(); 
}

