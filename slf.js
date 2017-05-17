var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +   

  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +

  'uniform int u_StaticView;\n' +
  'uniform mat4 u_PerspectMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform vec3 u_LightDirection;\n' +
  'uniform vec3 u_LightColor;\n' +

  'varying vec3 v_Coef;\n' +

  'void main() {\n' +
  '  vec3 normal = normalize(a_Normal.xyz);\n' +
  '  float prod = dot(u_LightDirection, normal);\n' +
  '  float nDotL = max(prod, 0.2);\n' +
  '  if(u_StaticView == 1)\n' +
  '    gl_Position = u_PerspectMatrix * a_Position;\n' +
  '  else\n' +
  '    gl_Position = u_PerspectMatrix * u_ViewMatrix * a_Position;\n' +

  '  v_Coef = u_LightColor * nDotL;\n' +
  '  v_Color = a_Color;\n' +

  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +

  'uniform int u_ColorTex;\n' + 

  'varying vec4 v_Color;\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +

  'varying vec3 v_Coef;\n' +

  'void main() {\n' +
  '  if(u_ColorTex == 0)\n' +
  '    gl_FragColor = vec4(v_Color.rgb * v_Coef, v_Color.a);\n' +
  '  else\n' +
  '    gl_FragColor = vec4(texture2D(u_Sampler, v_TexCoord).rgb * v_Coef,' + 
                      'texture2D(u_Sampler, v_TexCoord).a);\n' +
  '}\n';

var canvas = document.getElementById('webgl');
var gl = getWebGLContext(canvas);

var redisp = 0;

var Eye = {
  pos:{x:0, y:0, z:10},
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
      this.dir.z = Math.sin(this.ang.phi)*Math.sin(this.ang.theta);
      break;
    case 6:
      this.dir.x = arguments[3];
      this.dir.y = arguments[4];
      this.dir.z = arguments[5];
      this.ang.theta = Math.atan(this.dir.z/this.dir.x);
      this.ang.phi = Math.acos(this.dir.y);
      break;
    case 7:
      this.ang.theta = arguments[3];
      this.ang.phi = arguments[4];
      this.dir.x = Math.sin(this.ang.phi)*Math.cos(this.ang.theta);
      this.dir.y = Math.cos(this.ang.phi);
      this.dir.z = Math.sin(this.ang.phi)*Math.sin(this.ang.theta);
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
      if(this.speed.x==0&&this.speed.y==0&&this.speed.z==0){
        return 0;
      }
      this.pos.x += -this.dir.x*this.speed.z + this.dir.z*this.speed.x;
      this.pos.y += this.speed.y;
      this.pos.z += -this.dir.z*this.speed.z - this.dir.x*this.speed.x;
    }
    else{
      if(fb==0&&lr==0&&ud==0){
        return 0;
      }
      this.pos.x += this.dir.x*fb + this.dir.z*lr;
      this.pos.y += ud;
      this.pos.z += this.dir.z*fb - this.dir.x*lr;
    }
    return 1;
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
var Scene = {
  seqVertex:[],
  seqColor:[],
  seqNormal:[],
  seqSysNormal:[],
  seqTriangleAttrib:[],
  seqLineAttrib:[],
  seqPointAttrib:[],
  insertSeqTriangle:function(v1, v2, v3, c1, c2, c3, n1, n2, n3){
    if(!v1||!v2||!v3)return;

    if(!n1||!n2||!n3){
      var edge1 = {x:this.seqVertex[3*v2] - this.seqVertex[3*v1],
                   y:this.seqVertex[3*v2+1] - this.seqVertex[3*v1+1],
                   z:this.seqVertex[3*v2+2] - this.seqVertex[3*v1+2]};
      var edge2 = {x:this.seqVertex[3*v3] - this.seqVertex[3*v2],
                   y:this.seqVertex[3*v3+1] - this.seqVertex[3*v2+1],
                   z:this.seqVertex[3*v3+2] - this.seqVertex[3*v2+2]};
      var defNormal = {x:edge2.y*edge1.z - edge1.y*edge2.z,
                       y:edge2.z*edge1.x - edge1.z*edge2.x,
                       z:edge2.x*edge1.y - edge1.x*edge2.y};
      this.seqSysNormal.push(defNormal.x, defNormal.y, defNormal.z);
    }

    this.seqTriangleAttrib.push(this.seqVertex[3*v1], this.seqVertex[3*v1+1], this.seqVertex[3*v1+2]);
    if(c1)this.seqTriangleAttrib.push(this.seqColor[3*c1], this.seqColor[3*c1+1], this.seqColor[3*c1+2]);
    else this.seqTriangleAttrib.push(1.0, 1.0, 1.0);
    if(n1)this.seqTriangleAttrib.push(this.seqNormal[3*n1], this.seqNormal[3*n1+1], this.seqNormal[3*n1+2]);
    else this.seqTriangleAttrib.push(this.seqSysNormal[this.seqSysNormal.length-1],
                                     this.seqSysNormal[this.seqSysNormal.length-1],
                                     this.seqSysNormal[this.seqSysNormal.length-1]);
    this.seqTriangleAttrib.push(this.seqVertex[3*v2], this.seqVertex[3*v2+1], this.seqVertex[3*v2+2]);
    if(c2)this.seqTriangleAttrib.push(this.seqColor[3*c2], this.seqColor[3*c2+1], this.seqColor[3*c2+2]);
    else this.seqTriangleAttrib.push(1.0, 1.0, 1.0);
    if(n2)this.seqTriangleAttrib.push(this.seqNormal[3*n2], this.seqNormal[3*n2+1], this.seqNormal[3*n2+2]);
    else this.seqTriangleAttrib.push(this.seqSysNormal[this.seqSysNormal.length-1],
                                     this.seqSysNormal[this.seqSysNormal.length-1],
                                     this.seqSysNormal[this.seqSysNormal.length-1]);
    this.seqTriangleAttrib.push(this.seqVertex[3*v3], this.seqVertex[3*v3+1], this.seqVertex[3*v3+2]);
    if(c3)this.seqTriangleAttrib.push(this.seqColor[3*c3], this.seqColor[3*c3+1], this.seqColor[3*c3+2]);
    else this.seqTriangleAttrib.push(1.0, 1.0, 1.0);
    if(n3)this.seqTriangleAttrib.push(this.seqNormal[3*n3], this.seqNormal[3*n3+1], this.seqNormal[3*n3+2]);
    else this.seqTriangleAttrib.push(this.seqSysNormal[this.seqSysNormal.length-1],
                                     this.seqSysNormal[this.seqSysNormal.length-1],
                                     this.seqSysNormal[this.seqSysNormal.length-1]);
  },

  frameTriangleVertex:[],
  framelineVertex:[],
  framePointVertex:[],
  frameTexVertex:[],

  texVertex:[],
  texElement:[],
  texPic:[],
  insertTex:function(v1, v2, v3, src, n){
    if(!n){
      var edge1 = {x:v2.x-v1.x, y:v2.y-v1.y, z:v2.z-v1.z};
      var edge2 = {x:v3.x-v2.x, y:v3.y-v2.y, z:v3.z-v2.z};
      n = {x:edge2.y*edge1.z - edge1.y*edge2.z,
           y:edge2.z*edge1.x - edge1.z*edge2.x,
           z:edge2.x*edge1.y - edge1.x*edge2.y}
    }
    for(var i = 0; i < this.texPic.length; i++){
      if(this.texPic[i].src == src){
        this.texVertex.push(v1.x, v1.y, v1.z, v1.u, v1.v, n.x, n.y, n.z,
          v2.x, v2.y, v2.z, v2.u, v2.v, n.x, n.y, n.z,
          v3.x, v3.y, v3.z, v3.u, v3.v, n.x, n.y, n.z);
        this.texElement.push(i);
        return;
      }
    }
    this.texPic.push(new Image());
    this.texPic[this.texPic.length - 1].src = src;
    this.texVertex.push(v1.x, v1.y, v1.z, v1.u, v1.v, n.x, n.y, n.z,
      v2.x, v2.y, v2.z, v2.u, v2.v, n.x, n.y, n.z,
      v3.x, v3.y, v3.z, v3.u, v3.v, n.x, n.y, n.z);
    this.texElement.push(this.texPic.length - 1);
  }
}
var Time = {
  milliSec:0,
  date:null
}
var Light = {
  direction:[],
  color:[]
}

function main() {
  initModel();
  initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  
  canvas.onmousemove = function(e){ mouseMove(e); };
  canvas.onmouseover = function(e){ mouseIn(e); };
  canvas.onmouseout = function(e){ mouseOut(e); };

  canvas.onclick = function(e){ mouseClick(e); };
  canvas.onmousedown = function(e){ mouseDown(e); };
  canvas.onmouseup = function(e){ mouseUp(e); };

  document.onkeypress = function(e){ keyPress(e); };
  document.onkeydown = function(e){ keyDown(e); };
  document.onkeyup = function(e){ keyUp(e); };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  setInterval(display, 20);
  setInterval(idle, 20);
}

function display(){
  if(!redisp) return;
  redisp = 0;
  
  var u_PerspectMatrix = gl.getUniformLocation(gl.program, 'u_PerspectMatrix');
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');

  var perspectMatrix = new Matrix4();
  var viewMatrix = new Matrix4();
  perspectMatrix.setPerspective(30, canvas.width/canvas.height, 0.1, 10000);
  gl.uniformMatrix4fv(u_PerspectMatrix, false, perspectMatrix.elements);
  viewMatrix.setLookAt(Eye.pos.x, Eye.pos.y, Eye.pos.z,
    Eye.pos.x+Eye.dir.x, Eye.pos.y+Eye.dir.y, Eye.pos.z+Eye.dir.z,
    Eye.up.x, Eye.up.y, Eye.up.z);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  var lightDirection = new Vector3(Light.direction);
  lightDirection.normalize();
  gl.uniform3fv(u_LightDirection, lightDirection.elements);
  var lightColor = new Vector3(Light.color);
  gl.uniform3fv(u_LightColor, lightColor.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  putElement();
  putTexture();
  //putFrame();
}
function putElement(){
  var vertices = new Float32Array(Scene.seqTriangleAttrib);
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var FSIZE = vertices.BYTES_PER_ELEMENT;

  var u_ColorTex = gl.getUniformLocation(gl.program, 'u_ColorTex');
  gl.uniform1i(u_ColorTex, 0);
  var u_StaticView = gl.getUniformLocation(gl.program, 'u_StaticView');
  gl.uniform1i(u_StaticView, 0);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 9, 0);
  gl.enableVertexAttribArray(a_Position);
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);
  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 6);
  gl.enableVertexAttribArray(a_Normal);

  gl.drawArrays(gl.TRIANGLES, 0, Scene.seqTriangleAttrib.length / 9);
}
function putTexture(){
  var vertices = new Float32Array(Scene.texVertex);

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var FSIZE = vertices.BYTES_PER_ELEMENT;

  var u_ColorTex = gl.getUniformLocation(gl.program, 'u_ColorTex');
  gl.uniform1i(u_ColorTex, 1);
  var u_StaticView = gl.getUniformLocation(gl.program, 'u_StaticView');
  gl.uniform1i(u_StaticView, 0);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
  gl.enableVertexAttribArray(a_Position);
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
  gl.enableVertexAttribArray(a_TexCoord);
  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
  gl.enableVertexAttribArray(a_Normal);

  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  gl.uniform1i(u_Sampler, 0);

  var texture = gl.createTexture();
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); 
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  for(var i = 0; i < Scene.texElement.length; i++){
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, Scene.texPic[Scene.texElement[i]]);
    gl.drawArrays(gl.TRIANGLES, i*3, 3); 
  }
}
function putFrame(){

}

function idle(){
  if(Eye.moveEye())
    redisp = 1;
  Time.milliSec = new Date().getTime();
}

var prePos = {x:0, y:0};
var drag = 0;
function mouseMove(e){
  var x = e.clientX;
  var y = e.clientY;
  var rect = e.target.getBoundingClientRect();

  if(drag){
    x -= rect.left;
    y -= rect.top;
    Eye.rotateEye((x-prePos.x)/200, (y-prePos.y)/200);
    prePos.x = x;
    prePos.y = y;
    redisp = 1;
  }
}
function mouseIn(e){
  var x = e.clientX;
  var y = e.clientY;
  var rect = e.target.getBoundingClientRect() ;

  x -= rect.left;
  y -= rect.top;
}
function mouseOut(e){
  var x = e.clientX;
  var y = e.clientY;
  var rect = e.target.getBoundingClientRect() ;

  x -= rect.left;
  y -= rect.top;
}

function mouseClick(e){
  var x = e.clientX;
  var y = e.clientY;
  var rect = e.target.getBoundingClientRect() ;

  x -= rect.left;
  y -= rect.top;
}
function mouseDown(e){
  var x = e.clientX;
  var y = e.clientY;
  var rect = e.target.getBoundingClientRect() ;

  x -= rect.left;
  y -= rect.top;
  prePos.x = x;
  prePos.y = y;
  drag = 1;
}
function mouseUp(e){
  var x = e.clientX;
  var y = e.clientY;
  var rect = e.target.getBoundingClientRect() ;

  x -= rect.left;
  y -= rect.top;
  drag = 0;
}

function keyPress(e){
  switch(e.keyCode){
  default:
    break;
  }
}
function keyDown(e){
  switch(e.keyCode){
  case 37:
  case 65:
    Eye.speed.x = 0.1;
    break;
  case 38:
  case 87:
    Eye.speed.z = -0.1;
    break;
  case 39:
  case 68:
    Eye.speed.x = -0.1;
    break;
  case 40:
  case 83:
    Eye.speed.z = 0.1;
    break;
  case 32:
    Eye.speed.y = 0.1;
    break;
  case 88:
    Eye.speed.y = -0.1;
    break;
  default:
    break;
  }
}
function keyUp(e){
  switch(e.keyCode){
  case 37:
  case 65:
    Eye.speed.x = 0;
    break;
  case 38:
  case 87:
    Eye.speed.z = 0;
    break;
  case 39:
  case 68:
    Eye.speed.x = 0;
    break;
  case 40:
  case 83:
    Eye.speed.z = 0;
    break;
  case 32:
    Eye.speed.y = 0;
    break;
  case 88:
    Eye.speed.y = 0;
    break;
  default:
    break;
  }
}

function handleFiles(files) {
    if (files.length) {
      var file = files[0];
      var reader = new FileReader();
      reader.onload = function() {
        var content = this.result.split('\r\n');
        for(var i = 0; i < content.length; i++){
          var value = content[i].split(' ');
          switch(value[0]){
          case 'v':
            Scene.seqVertex.push(value[1], value[2], value[3]);
            break;
          case 'vc':
            Scene.seqColor.push(value[1], value[2], value[3]);
            break;
          case 'vn':
            Scene.seqNormal.push(value[1], value[2], value[3]);
            break;
          case 'f':
            var index1 = value[1].split('/');
            var index2 = value[2].split('/');
            var index3 = value[3].split('/');
            Scene.insertSeqTriangle(index1[0], index2[0], index3[0],
                                    index1[1], index2[1], index3[1],
                                    index1[2], index2[2], index3[2]);
            break;
          }
          redisp = 1;
        }
      }
      reader.readAsText(file);
    }
}

function initModel(){
  Scene.insertTex(
    {x:1.0, y:3.0, z:-1.0, u:1.0, v:1.0},
    {x:-1.0, y:3.0, z:-1.0, u:0.0, v:1.0},
    {x:-1.0, y:1.0, z:-1.0, u:0.0, v:0.0},
    "src/test.jpg",
    {x:0.0, y:0.0, z:-1.0});
  Scene.insertTex(
    {x:1.0, y:3.0, z:-1.0, u:1.0, v:1.0},
    {x:-1.0, y:1.0, z:-1.0, u:0.0, v:0.0},
    {x:1.0, y:1.0, z:-1.0, u:1.0, v:0.0},
    "src/test.jpg",
    {x:0.0, y:0.0, z:-1.0});

  Light.direction.push(-2, 1, -3);
  Light.color.push(1.0, 1.0, 1.0);

  redisp = 1;
}