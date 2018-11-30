function initArrayBufferForLaterUse(gl, data, num, type) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.num = num;
  buffer.type = type;

  return buffer;
}
function initElementArrayBufferForLaterUse(gl, data, type) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}

function Element(){
  return this;
}
Element.prototype = {
  constructor:Element,

  vertexBuffer:null,
  colorBuffer:null,
  normalBuffer:null,
  indexBuffer:null,

  numIndices:null,

  test:function(gl){
    var vertices = new Float32Array([-0.8, 1.0, 0.0, 0.8, 1.0, 0.0, 0.0, 1.0, 1.8,
      3.0, -1.7, 2.5, -3.0, -1.7, 2.5, -3.0, -1.7, -2.5, 3.0, -1.7, -2.5]);
    var colors = new Float32Array([1.0, 0.5, 0.0, 1.0, 0.5, 0.0, 1.0, 0.0, 0.0,
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
    var normals = new Float32Array([0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);
    var indices = new Uint8Array([0, 1, 2, 3, 4, 5, 3, 5, 6]);
  
    this.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    this.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
    this.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    this.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    this.numIndices = indices.length;
  
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  
    return this;
  },

  load:function(gl, filename){
    var request = new XMLHttpRequest();
  
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status !== 404) {
        var text = request.responseText;
        var lines = text.split('\n');
        lines.push(null);

        var vertices = [];
        var colors = [];
        var normals = [];

        var vertexArray = [];
        var colorArray = [];
        var normalArray = [];
        var indices = [];
        var model = new Element();

        var index = 0, faces = 0;
        var line;
        while ((line = lines[index++]) != null) {
          var value = line.split(' ');
          switch(value[0]){
          case '#':
            continue;
          case 'v':
            vertices.push([value[1], value[2], value[3]]);
            break;
          case 'vc':
            colors.push([value[1], value[2], value[3]]);
            break;
          case 'vn':
            normals.push([value[1], value[2], value[3]]);
            break;
          case 'f':
            vertexArray.push(vertices[value[1] - 1][0], vertices[value[1] - 1][1], vertices[value[1] - 1][2],
              vertices[value[2] - 1][0], vertices[value[2] - 1][1], vertices[value[2] - 1][2],
              vertices[value[3] - 1][0], vertices[value[3] - 1][1], vertices[value[3] - 1][2]);
            colorArray.push(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
            var edge1 = [vertices[value[2] - 1][0] - vertices[value[1] - 1][0],
              vertices[value[2] - 1][1] - vertices[value[1] - 1][1],
              vertices[value[2] - 1][2] - vertices[value[1] - 1][2]];
            var edge2 = [vertices[value[3] - 1][0] - vertices[value[2] - 1][0],
              vertices[value[3] - 1][1] - vertices[value[2] - 1][1],
              vertices[value[3] - 1][2] - vertices[value[2] - 1][2]];
            normalArray.push(edge2[1] * edge1[2] - edge1[1] * edge2[2],
              edge2[2] * edge1[0] - edge1[2] * edge2[0],
              edge2[0] * edge1[1] - edge1[0] * edge2[1],
              edge2[1] * edge1[2] - edge1[1] * edge2[2],
              edge2[2] * edge1[0] - edge1[2] * edge2[0],
              edge2[0] * edge1[1] - edge1[0] * edge2[1],
              edge2[1] * edge1[2] - edge1[1] * edge2[2],
              edge2[2] * edge1[0] - edge1[2] * edge2[0],
              edge2[0] * edge1[1] - edge1[0] * edge2[1]);
            
            indices.push(faces * 3, faces * 3 + 1, faces * 3 + 2);
            faces++;
            break;
          case 'mtllib':
            break;
          case 'usemtl':
            break;
          }
        }
        
        model.vertexBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertexArray), 3, gl.FLOAT);
        model.colorBuffer = initArrayBufferForLaterUse(gl, new Float32Array(colorArray), 3, gl.FLOAT);
        model.normalBuffer = initArrayBufferForLaterUse(gl, new Float32Array(normalArray), 3, gl.FLOAT);
        model.indexBuffer = initElementArrayBufferForLaterUse(gl, new Uint8Array(indices), gl.UNSIGNED_BYTE);
        model.numIndices = indices.length;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        Scene.Element.push(model);
      }
    }
    request.open('GET', filename, true);
    request.send();
  }
}
function Texture(){
  return this;
}
Texture.prototype = {
  constructor:Texture,

  vertexBuffer:null,
  coordBuffer:null,
  normalBuffer:null,
  indexBuffer:null,

  texture:null,

  numIndices:null,

  test:function(gl){
    var initTexture = function(){
      var texture = gl.createTexture();
      var image = new Image();
      image.onload = function(){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      };
      image.src = 'resource/sky.jpg';
      return image;
    }

    var vertices = new Float32Array([3.0, -1.0, 2.5, -3.0, -1.0, 2.5, -3.0, -1.0, -2.5, 3.0, -1.0, -2.5]);
    var coords = new Float32Array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);
    var normals = new Float32Array([0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);
    var indices = new Uint8Array([0, 1, 2, 0, 2, 3]);
  
    this.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    this.coordBuffer = initArrayBufferForLaterUse(gl, coords, 2, gl.FLOAT);
    this.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    this.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    this.numIndices = indices.length;
  
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  
    this.texture = initTexture();
  
    return this;
  },

  load:function(gl, filename){

  }
}

var Scene = {
  Element:[],
  Texture:[],

  Init:function(){
    //this.Element.push(new Element().test(gl));
    //this.Texture.push(new Texture().test(gl));
    new Element().load(gl, 'resource/castle.obj');
  }
}
