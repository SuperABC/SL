var SHADOW_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_MatrixFromLight;\n' +
  'void main() {\n' +
  '  gl_Position = u_MatrixFromLight * a_Position;\n' +
  '}\n';
var SHADOW_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);\n' + // Write the z-value in R
  '}\n';
  
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

  'uniform int u_Light;\n' +
  'uniform int u_LightPower0;\n' +
  'uniform vec3 u_LightPos0;\n' +
  'uniform vec3 u_LightDirection0;\n' +
  'uniform vec4 u_LightColor0;\n' +
  'uniform vec4 u_AmbientColor0;\n' +
  'uniform mat4 u_MatrixFromLight0;\n' +
  'varying vec4 v_PosFromLight0;\n' +
  'uniform int u_LightPower1;\n' +
  'uniform vec3 u_LightPos1;\n' +
  'uniform vec3 u_LightDirection1;\n' +
  'uniform vec4 u_LightColor1;\n' +
  'uniform vec4 u_AmbientColor1;\n' +
  'uniform mat4 u_MatrixFromLight1;\n' +
  'varying vec4 v_PosFromLight1;\n' +
  'uniform int u_LightPower2;\n' +
  'uniform vec3 u_LightPos2;\n' +
  'uniform vec3 u_LightDirection2;\n' +
  'uniform vec4 u_LightColor2;\n' +
  'uniform vec4 u_AmbientColor2;\n' +
  'uniform mat4 u_MatrixFromLight2;\n' +
  'varying vec4 v_PosFromLight2;\n' +
  'uniform int u_LightPower3;\n' +
  'uniform vec3 u_LightPos3;\n' +
  'uniform vec3 u_LightDirection3;\n' +
  'uniform vec4 u_LightColor3;\n' +
  'uniform vec4 u_AmbientColor3;\n' +
  'uniform mat4 u_MatrixFromLight3;\n' +
  'varying vec4 v_PosFromLight3;\n' +

  'varying vec3 v_CoefDiffuse;\n' +
  'varying vec3 v_CoefAmbient;\n' +

  'void main() {\n' +
  '  vec3 normal = normalize(a_Normal.xyz);\n' +

  '  v_CoefDiffuse = vec3(1.0, 1.0, 1.0);\n' +
  '  v_CoefAmbient = vec3(0.0, 0.0, 0.0);\n' +
  '  int power = 0;\n' +
  '  float prod = 0.0;\n' +

  '  if(u_Light == 1 && u_LightPower0 == 1) {\n' +
  '    if(power == 0) {\n' +
  '      v_CoefDiffuse = vec3(0.0, 0.0, 0.0);\n' +
  '      power = 1;\n' +
  '    }\n' +
  '    prod = max(dot(u_LightDirection0, normal), 0.0);\n' +
  '    v_CoefDiffuse += u_LightColor0.rgb * prod;\n' +
  '    v_CoefAmbient += u_AmbientColor0.rgb;\n' +
  '    v_PosFromLight0 = u_MatrixFromLight0 * a_Position;\n' +
  '  }\n' +
  '  else if(u_Light == 1 && u_LightPower0 == 2) {\n' +
  '    if(power == 0) {\n' +
  '      v_CoefDiffuse = vec3(0.0, 0.0, 0.0);\n' +
  '      power = 1;\n' +
  '    }\n' +
  '    vec3 LightDirection0 = normalize(a_Position.xyz - u_LightPos0); \n' +
  '    prod = max(dot(LightDirection0, normal), 0.0);\n' +
  '    v_CoefDiffuse += u_LightColor0.rgb * prod;\n' +
  '    v_CoefAmbient += u_AmbientColor0.rgb;\n' +
  '    v_PosFromLight0 = u_MatrixFromLight0 * a_Position;\n' +
  '  }\n' +
  '  if(u_Light == 1 && u_LightPower1 == 1) {\n' +
  '    if(power == 0) {\n' +
  '      v_CoefDiffuse = vec3(0.0, 0.0, 0.0);\n' +
  '      power = 1;\n' +
  '    }\n' +
  '    prod = max(dot(u_LightDirection1, normal), 0.0);\n' +
  '    v_CoefDiffuse += u_LightColor1.rgb * prod;\n' +
  '    v_CoefAmbient += u_AmbientColor1.rgb;\n' +
  '    v_PosFromLight1 = u_MatrixFromLight1 * a_Position;\n' +
  '  }\n' +
  '  else if(u_Light == 1 && u_LightPower1 == 2) {\n' +
  '    if(power == 0) {\n' +
  '      v_CoefDiffuse = vec3(0.0, 0.0, 0.0);\n' +
  '      power = 1;\n' +
  '    }\n' +
  '    vec3 LightDirection1 = normalize(a_Position.xyz - u_LightPos1); \n' +
  '    prod = max(dot(LightDirection1, normal), 0.0);\n' +
  '    v_CoefDiffuse += u_LightColor1.rgb * prod;\n' +
  '    v_CoefAmbient += u_AmbientColor1.rgb;\n' +
  '    v_PosFromLight1 = u_MatrixFromLight1 * a_Position;\n' +
  '  }\n' +
  '  if(u_Light == 1 && u_LightPower2 == 1) {\n' +
  '    if(power == 0) {\n' +
  '      v_CoefDiffuse = vec3(0.0, 0.0, 0.0);\n' +
  '      power = 1;\n' +
  '    }\n' +
  '    prod = max(dot(u_LightDirection2, normal), 0.0);\n' +
  '    v_CoefDiffuse += u_LightColor2.rgb * prod;\n' +
  '    v_CoefAmbient += u_AmbientColor2.rgb;\n' +
  '    v_PosFromLight2 = u_MatrixFromLight2 * a_Position;\n' +
  '  }\n' +
  '  else if(u_Light == 1 && u_LightPower2 == 2) {\n' +
  '    if(power == 0) {\n' +
  '      v_CoefDiffuse = vec3(0.0, 0.0, 0.0);\n' +
  '      power = 1;\n' +
  '    }\n' +
  '    vec3 LightDirection2 = normalize(a_Position.xyz - u_LightPos2); \n' +
  '    prod = max(dot(LightDirection2, normal), 0.0);\n' +
  '    v_CoefDiffuse += u_LightColor2.rgb * prod;\n' +
  '    v_CoefAmbient += u_AmbientColor2.rgb;\n' +
  '    v_PosFromLight2 = u_MatrixFromLight2 * a_Position;\n' +
  '  }\n' +
  '  if(u_Light == 1 && u_LightPower3 == 1) {\n' +
  '    if(power == 0) {\n' +
  '      v_CoefDiffuse = vec3(0.0, 0.0, 0.0);\n' +
  '      power = 1;\n' +
  '    }\n' +
  '    prod = max(dot(u_LightDirection3, normal), 0.0);\n' +
  '    v_CoefDiffuse += u_LightColor3.rgb * prod;\n' +
  '    v_CoefAmbient += u_AmbientColor3.rgb;\n' +
  '    v_PosFromLight3 = u_MatrixFromLight3 * a_Position;\n' +
  '  }\n' +
  '  else if(u_Light == 1 && u_LightPower3 == 2) {\n' +
  '    if(power == 0) {\n' +
  '      v_CoefDiffuse = vec3(0.0, 0.0, 0.0);\n' +
  '      power = 1;\n' +
  '    }\n' +
  '    vec3 LightDirection3 = normalize(a_Position.xyz - u_LightPos3); \n' +
  '    prod = max(dot(LightDirection3, normal), 0.0);\n' +
  '    v_CoefDiffuse += u_LightColor3.rgb * prod;\n' +
  '    v_CoefAmbient += u_AmbientColor3.rgb;\n' +
  '    v_PosFromLight3 = u_MatrixFromLight3 * a_Position;\n' +
  '  }\n' +

  '  if(u_StaticView == 1)\n' +
  '    gl_Position = u_PerspectMatrix * a_Position;\n' +
  '  else\n' +
  '    gl_Position = u_PerspectMatrix * u_ViewMatrix * a_Position;\n' +

  '  v_Color = a_Color;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +

  'uniform int u_ColorTex;\n' +

  'uniform int u_EnShadow;\n' +
  'uniform sampler2D u_ShadowMap;\n' +

  'varying vec4 v_Color;\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +

  'varying vec4 v_PosFromLight0;\n' +
  'varying vec4 v_PosFromLight1;\n' +
  'varying vec4 v_PosFromLight2;\n' +
  'varying vec4 v_PosFromLight3;\n' +

  'varying vec3 v_CoefDiffuse;\n' +
  'varying vec3 v_CoefAmbient;\n' +

  'void main() {\n' +
  '  float visibility = 1.0;\n' +
  '  if(u_EnShadow == 1){\n' +
  '    vec3 shadowCoord = (v_PosFromLight0.xyz/v_PosFromLight0.w)/2.0 + 0.5;\n' +
  '    vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);\n' +
  '    float depth = rgbaDepth.r;\n' +
  '    if(shadowCoord.x <= 0.01 || shadowCoord.x >= 0.99 ||\n' +
  '      shadowCoord.y <= 0.01 || shadowCoord.y >= 0.99)\n' +
  '      visibility = 1.0;\n' +
  '    else\n' +
  '      visibility = (shadowCoord.z > depth + 0.005) ? 0.2 : 1.0;\n' +
  '  }\n' +
  '  if(u_ColorTex == 0)\n' +
  '    gl_FragColor = vec4(v_Color.rgb * v_CoefDiffuse * visibility +' +
                      'v_Color.rgb * v_CoefAmbient, v_Color.a);\n' +
  '  else\n' +
  '    gl_FragColor = vec4(texture2D(u_Sampler, v_TexCoord).rgb * v_CoefDiffuse * visibility +' +
                      'texture2D(u_Sampler, v_TexCoord).rgb * v_CoefAmbient,' +
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
  insertSeqTriangle:function(v1, v2, v3, c1, c2, c3, n1, n2, n3){
    if(v1!=v1||v2!=v2||v3!=v3)return;

    if(n1!=n1||n2!=n2||n3!=n3){
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

    this.seqTriangleAttrib.push(this.seqVertex[3*v1], this.seqVertex[3*v1+2], this.seqVertex[3*v1+1]);
    if(c1==c1)this.seqTriangleAttrib.push(this.seqColor[3*c1], this.seqColor[3*c1+2], this.seqColor[3*c1+1]);
    else if(Material.temp==Material.temp)
      this.seqTriangleAttrib.push(Material.kd[3*Material.temp], 
        Material.kd[3*Material.temp + 1], 
        Material.kd[3*Material.temp + 2]);
    else this.seqTriangleAttrib.push(1.0, 1.0, 1.0);
    if(n1==n1)this.seqTriangleAttrib.push(this.seqNormal[3*n1], this.seqNormal[3*n1+2], this.seqNormal[3*n1+1]);
    else this.seqTriangleAttrib.push(this.seqSysNormal[this.seqSysNormal.length-3],
                                     this.seqSysNormal[this.seqSysNormal.length-1],
                                     this.seqSysNormal[this.seqSysNormal.length-2]);
    this.seqTriangleAttrib.push(this.seqVertex[3*v2], this.seqVertex[3*v2+2], this.seqVertex[3*v2+1]);
    if(c2==c2)this.seqTriangleAttrib.push(this.seqColor[3*c2], this.seqColor[3*c2+2], this.seqColor[3*c2+1]);
    else if(Material.temp==Material.temp)
      this.seqTriangleAttrib.push(Material.kd[3*Material.temp], 
        Material.kd[3*Material.temp + 1], 
        Material.kd[3*Material.temp + 2]);
    else this.seqTriangleAttrib.push(1.0, 1.0, 1.0);
    if(n2==n2)this.seqTriangleAttrib.push(this.seqNormal[3*n2], this.seqNormal[3*n2+2], this.seqNormal[3*n2+1]);
    else this.seqTriangleAttrib.push(this.seqSysNormal[this.seqSysNormal.length-3],
                                     this.seqSysNormal[this.seqSysNormal.length-1],
                                     this.seqSysNormal[this.seqSysNormal.length-2]);
    this.seqTriangleAttrib.push(this.seqVertex[3*v3], this.seqVertex[3*v3+2], this.seqVertex[3*v3+1]);
    if(c3==c3)this.seqTriangleAttrib.push(this.seqColor[3*c3], this.seqColor[3*c3+2], this.seqColor[3*c3+1]);
    else if(Material.temp==Material.temp)
      this.seqTriangleAttrib.push(Material.kd[3*Material.temp], 
        Material.kd[3*Material.temp + 1], 
        Material.kd[3*Material.temp + 2]);
    else this.seqTriangleAttrib.push(1.0, 1.0, 1.0);
    if(n3==n3)this.seqTriangleAttrib.push(this.seqNormal[3*n3], this.seqNormal[3*n3+2], this.seqNormal[3*n3+1]);
    else this.seqTriangleAttrib.push(this.seqSysNormal[this.seqSysNormal.length-3],
                                     this.seqSysNormal[this.seqSysNormal.length-1],
                                     this.seqSysNormal[this.seqSysNormal.length-2]);
  },
  insertSeqLine:function(v1, v2, c1, c2){
    if(v1!=v1||v2!=v2)return;

    this.seqLineAttrib.push(this.seqVertex[3*v1], this.seqVertex[3*v1+1], this.seqVertex[3*v1+2]);
    if(c1==c1)this.seqLineAttrib.push(this.seqColor[3*c1], this.seqColor[3*c1+1], this.seqColor[3*c1+2]);
    else this.seqLineAttrib.push(1.0, 1.0, 1.0);
    this.seqLineAttrib.push(0.0, 0.0, 0.0);
    this.seqLineAttrib.push(this.seqVertex[3*v2], this.seqVertex[3*v2+1], this.seqVertex[3*v2+2]);
    if(c2==c2)this.seqLineAttrib.push(this.seqColor[3*c2], this.seqColor[3*c2+1], this.seqColor[3*c2+2]);
    else this.seqLineAttrib.push(1.0, 1.0, 1.0);
    this.seqLineAttrib.push(0.0, 0.0, 0.0);
  },
  texCoord:[],
  texAttrib:[],
  texElement:[],
  texPic:[],
  insertTex:function(v1, v2, v3, t1, t2, t3, n1, n2, n3, src){
    if(v1!=v1||v2!=v2||v3!=v3||
      t1!=t1||t2!=t2||t3!=t3||src!=src)return;

    if(n1!=n1||n2!=n2||n3!=n3){
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

    this.texAttrib.push(this.seqVertex[3*v1], this.seqVertex[3*v1+1], this.seqVertex[3*v1+2]);
    this.texAttrib.push(this.texCoord[2*t1], this.texCoord[2*t1+1]);
    if(n1==n1)this.texAttrib.push(this.seqNormal[3*n1], this.seqNormal[3*n1+1], this.seqNormal[3*n1+2]);
    else this.texAttrib.push(this.seqSysNormal[this.seqSysNormal.length-3],
                             this.seqSysNormal[this.seqSysNormal.length-2],
                             this.seqSysNormal[this.seqSysNormal.length-1]);
    this.texAttrib.push(this.seqVertex[3*v2], this.seqVertex[3*v2+1], this.seqVertex[3*v2+2]);
    this.texAttrib.push(this.texCoord[2*t2], this.texCoord[2*t2+1]);
    if(n2==n2)this.texAttrib.push(this.seqNormal[3*n2], this.seqNormal[3*n2+1], this.seqNormal[3*n2+2]);
    else this.texAttrib.push(this.seqSysNormal[this.seqSysNormal.length-3],
                             this.seqSysNormal[this.seqSysNormal.length-2],
                             this.seqSysNormal[this.seqSysNormal.length-1]);
    this.texAttrib.push(this.seqVertex[3*v3], this.seqVertex[3*v3+1], this.seqVertex[3*v3+2]);
    this.texAttrib.push(this.texCoord[2*t3], this.texCoord[2*t3+1]);
    if(n3==n3)this.texAttrib.push(this.seqNormal[3*n3], this.seqNormal[3*n3+1], this.seqNormal[3*n3+2]);
    else this.texAttrib.push(this.seqSysNormal[this.seqSysNormal.length-3],
                             this.seqSysNormal[this.seqSysNormal.length-2],
                             this.seqSysNormal[this.seqSysNormal.length-1]);

    for(var i = 0; i < this.texPic.length; i++){
      if(this.texPic[i].src.includes(src)){
        this.texElement.push(i);
        return;
      }
    }
    this.texPic.push(new Image());
    this.texPic[this.texPic.length - 1].src = src;
    this.texElement.push(this.texPic.length - 1);
  },

  motVertex:[],
  motColor:[],
  motNormal:[],
  motSysNormal:[],
  motTriangleAttrib:[],
  motLineAttrib:[],
  motPointAttrib:[],
  insertMotTriangle:function(v1, v2, v3, c1, c2, c3, n1, n2, n3){
    if(v1!=v1||v2!=v2||v3!=v3)return;

    if(n1!=n1||n2!=n2||n3!=n3){
      var edge1 = {x:this.motVertex[3*v2] - this.motVertex[3*v1],
                   y:this.motVertex[3*v2+1] - this.motVertex[3*v1+1],
                   z:this.motVertex[3*v2+2] - this.motVertex[3*v1+2]};
      var edge2 = {x:this.motVertex[3*v3] - this.motVertex[3*v2],
                   y:this.motVertex[3*v3+1] - this.motVertex[3*v2+1],
                   z:this.motVertex[3*v3+2] - this.motVertex[3*v2+2]};
      var defNormal = {x:edge2.y*edge1.z - edge1.y*edge2.z,
                       y:edge2.z*edge1.x - edge1.z*edge2.x,
                       z:edge2.x*edge1.y - edge1.x*edge2.y};
      this.motSysNormal.push(defNormal.x, defNormal.y, defNormal.z);
    }

    this.motTriangleAttrib.push(this.motVertex[3*v1], this.motVertex[3*v1+1], this.motVertex[3*v1+2]);
    if(c1==c1)this.motTriangleAttrib.push(this.motColor[3*c1], this.motColor[3*c1+1], this.motColor[3*c1+2]);
    else this.motTriangleAttrib.push(1.0, 1.0, 1.0);
    if(n1==n1)this.motTriangleAttrib.push(this.motNormal[3*n1], this.motNormal[3*n1+1], this.motNormal[3*n1+2]);
    else this.motTriangleAttrib.push(this.motSysNormal[this.motSysNormal.length-3],
                                     this.motSysNormal[this.motSysNormal.length-2],
                                     this.motSysNormal[this.motSysNormal.length-1]);
    this.motTriangleAttrib.push(this.motVertex[3*v2], this.motVertex[3*v2+1], this.motVertex[3*v2+2]);
    if(c2==c2)this.motTriangleAttrib.push(this.motColor[3*c2], this.motColor[3*c2+1], this.motColor[3*c2+2]);
    else this.motTriangleAttrib.push(1.0, 1.0, 1.0);
    if(n2==n2)this.motTriangleAttrib.push(this.motNormal[3*n2], this.motNormal[3*n2+1], this.motNormal[3*n2+2]);
    else this.motTriangleAttrib.push(this.motSysNormal[this.motSysNormal.length-3],
                                     this.motSysNormal[this.motSysNormal.length-2],
                                     this.motSysNormal[this.motSysNormal.length-1]);
    this.motTriangleAttrib.push(this.motVertex[3*v3], this.motVertex[3*v3+1], this.motVertex[3*v3+2]);
    if(c3==c3)this.motTriangleAttrib.push(this.motColor[3*c3], this.motColor[3*c3+1], this.motColor[3*c3+2]);
    else this.motTriangleAttrib.push(1.0, 1.0, 1.0);
    if(n3==n3)this.motTriangleAttrib.push(this.motNormal[3*n3], this.motNormal[3*n3+1], this.motNormal[3*n3+2]);
    else this.motTriangleAttrib.push(this.motSysNormal[this.motSysNormal.length-3],
                                     this.motSysNormal[this.motSysNormal.length-2],
                                     this.motSysNormal[this.motSysNormal.length-1]);
  }
}
var Time = {
  milliSec:0,
  date:null
}
var Light = {
  mode:[],
  pos:[],
  direction:[],
  color:[],
  ambient:[]
}
var Material = {
  tmp:undefined,
  name:[],
  ka:[],
  kd:[],
  ks:[],
}
var Program = {
  shadowProgram:null,
  normalProgram:null,
  Program:function(){
    this.shadowProgram = createProgram(gl, SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE);
    this.shadowProgram.a_Position = gl.getAttribLocation(this.shadowProgram, 'a_Position');
    this.shadowProgram.u_MatrixFromLight = gl.getUniformLocation(this.shadowProgram, 'u_MatrixFromLight');

    this.normalProgram = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    this.normalProgram.a_Position = gl.getAttribLocation(this.normalProgram, 'a_Position');
    this.normalProgram.a_Color = gl.getAttribLocation(this.normalProgram, 'a_Color');
    this.normalProgram.a_TexCoord = gl.getAttribLocation(this.normalProgram, 'a_TexCoord');
    this.normalProgram.a_Normal = gl.getAttribLocation(this.normalProgram, 'a_Normal');
    this.normalProgram.u_EnShadow = gl.getUniformLocation(this.normalProgram, 'u_EnShadow');
    this.normalProgram.u_ShadowMap = gl.getUniformLocation(this.normalProgram, 'u_ShadowMap');
    this.normalProgram.u_Sampler = gl.getUniformLocation(this.normalProgram, 'u_Sampler');
    this.normalProgram.u_PerspectMatrix = gl.getUniformLocation(this.normalProgram, 'u_PerspectMatrix');
    this.normalProgram.u_ViewMatrix = gl.getUniformLocation(this.normalProgram, 'u_ViewMatrix');
    this.normalProgram.u_ColorTex = gl.getUniformLocation(this.normalProgram, 'u_ColorTex');
    this.normalProgram.u_StaticView = gl.getUniformLocation(this.normalProgram, 'u_StaticView');
    this.normalProgram.u_Light = gl.getUniformLocation(this.normalProgram, 'u_Light');

    this.normalProgram.u_LightPower0 = gl.getUniformLocation(this.normalProgram, 'u_LightPower0');
    this.normalProgram.u_LightPos0 = gl.getUniformLocation(this.normalProgram, 'u_LightPos0');
    this.normalProgram.u_LightDirection0 = gl.getUniformLocation(this.normalProgram, 'u_LightDirection0');
    this.normalProgram.u_LightColor0 = gl.getUniformLocation(this.normalProgram, 'u_LightColor0');
    this.normalProgram.u_AmbientColor0 = gl.getUniformLocation(this.normalProgram, 'u_AmbientColor0');
    this.normalProgram.u_MatrixFromLight0 = gl.getUniformLocation(this.normalProgram, 'u_MatrixFromLight0');
    this.normalProgram.u_LightPower1 = gl.getUniformLocation(this.normalProgram, 'u_LightPower1');
    this.normalProgram.u_LightPos1 = gl.getUniformLocation(this.normalProgram, 'u_LightPos1');
    this.normalProgram.u_LightDirection1 = gl.getUniformLocation(this.normalProgram, 'u_LightDirection1');
    this.normalProgram.u_LightColor1 = gl.getUniformLocation(this.normalProgram, 'u_LightColor1');
    this.normalProgram.u_AmbientColor1 = gl.getUniformLocation(this.normalProgram, 'u_AmbientColor1');
    this.normalProgram.u_MatrixFromLight1 = gl.getUniformLocation(this.normalProgram, 'u_MatrixFromLight1');
    this.normalProgram.u_LightPower2 = gl.getUniformLocation(this.normalProgram, 'u_LightPower2');
    this.normalProgram.u_LightPos2 = gl.getUniformLocation(this.normalProgram, 'u_LightPos2');
    this.normalProgram.u_LightDirection2 = gl.getUniformLocation(this.normalProgram, 'u_LightDirection2');
    this.normalProgram.u_LightColor2 = gl.getUniformLocation(this.normalProgram, 'u_LightColor2');
    this.normalProgram.u_AmbientColor2 = gl.getUniformLocation(this.normalProgram, 'u_AmbientColor2');
    this.normalProgram.u_MatrixFromLight2 = gl.getUniformLocation(this.normalProgram, 'u_MatrixFromLight2');
    this.normalProgram.u_LightPower3 = gl.getUniformLocation(this.normalProgram, 'u_LightPower3');
    this.normalProgram.u_LightPos3 = gl.getUniformLocation(this.normalProgram, 'u_LightPos3');
    this.normalProgram.u_LightDirection3 = gl.getUniformLocation(this.normalProgram, 'u_LightDirection3');
    this.normalProgram.u_LightColor3 = gl.getUniformLocation(this.normalProgram, 'u_LightColor3');
    this.normalProgram.u_AmbientColor3 = gl.getUniformLocation(this.normalProgram, 'u_AmbientColor3');
    this.normalProgram.u_MatrixFromLight3 = gl.getUniformLocation(this.normalProgram, 'u_MatrixFromLight3');
    return this;
  }
}
var pro = Program.Program();
var Cache = {
  renew:1,
  elementVertices:null
}

function main() {
  initModel();
  gl.useProgram(pro.normalProgram);
  
  canvas.onmousemove = function(e){ mouseMove(e); };
  canvas.onmouseover = function(e){ mouseIn(e); };
  canvas.onmouseout = function(e){ mouseOut(e); };

  canvas.onclick = function(e){ mouseClick(e); };
  canvas.onmousedown = function(e){ mouseDown(e); };
  canvas.onmouseup = function(e){ mouseUp(e); };

  document.onkeypress = function(e){ keyPress(e); };
  document.onkeydown = function(e){ keyDown(e); };
  document.onkeyup = function(e){ keyUp(e); };

  gl.clearColor(0.6, 0.6, 0.6, 1.0);
  gl.enable(gl.DEPTH_TEST);
  setInterval(display, 25);
  setInterval(idle, 25);
}

function display(){
  if(!redisp) return;
  redisp = 0;
  
  var perspectMatrix = new Matrix4();
  var viewMatrix = new Matrix4();
  perspectMatrix.setPerspective(30, canvas.width/canvas.height, 0.1, 10000);
  gl.uniformMatrix4fv(pro.normalProgram.u_PerspectMatrix, false, perspectMatrix.elements);
  viewMatrix.setLookAt(Eye.pos.x, Eye.pos.y, Eye.pos.z,
    Eye.pos.x+Eye.dir.x, Eye.pos.y+Eye.dir.y, Eye.pos.z+Eye.dir.z,
    Eye.up.x, Eye.up.y, Eye.up.z);
  gl.uniformMatrix4fv(pro.normalProgram.u_ViewMatrix, false, viewMatrix.elements);
  gl.uniform1i(pro.normalProgram.u_Light, 1);

  if(Light.mode[0]==undefined)gl.uniform1i(pro.normalProgram.u_LightPower0, 0);
  else{
    if(Light.mode[0] == 1){
      gl.uniform1i(pro.normalProgram.u_LightPower0, 1);
      var lightDirection0 = new Vector3(Light.direction[0]);
      lightDirection0.normalize();
      gl.uniform3fv(pro.normalProgram.u_LightDirection0, lightDirection0.elements);
    }
    else if(Light.mode[0] == 2){
      gl.uniform1i(pro.normalProgram.u_LightPower0, 2);
      var lightPos0 = new Vector3(Light.pos[0]);
      gl.uniform3fv(pro.normalProgram.u_LightPos0, lightPos0.elements);
    }
    var lightColor0 = new Vector4(Light.color[0]);
    gl.uniform4fv(pro.normalProgram.u_LightColor0, lightColor0.elements);
    var ambientColor0 = new Vector4(Light.ambient[0]);
    gl.uniform4fv(pro.normalProgram.u_AmbientColor0, ambientColor0.elements);
  }

  if(Light.mode[1]==undefined)gl.uniform1i(pro.normalProgram.u_LightPower1, 0);
  else {
    if(Light.mode[1] == 1){
      gl.uniform1i(pro.normalProgram.u_LightPower1, 1);
      var lightDirection1 = new Vector3(Light.direction[1]);
      lightDirection1.normalize();
      gl.uniform3fv(pro.normalProgram.u_LightDirection1, lightDirection1.elements);
    }
    else if(Light.mode[1] == 2){
      gl.uniform1i(pro.normalProgram.u_LightPower1, 2);
      var lightPos1 = new Vector3(Light.pos[1]);
      gl.uniform3fv(pro.normalProgram.u_LightPos1, lightPos1.elements);
    }
    var lightColor1 = new Vector4(Light.color[1]);
    gl.uniform4fv(pro.normalProgram.u_LightColor1, lightColor1.elements);
    var ambientColor1 = new Vector4(Light.ambient[1]);
    gl.uniform4fv(pro.normalProgram.u_AmbientColor1, ambientColor1.elements);
  }

  if(Light.mode[2]==undefined)gl.uniform1i(pro.normalProgram.u_LightPower2, 0);
  else {
    if(Light.mode[2] == 1){
      gl.uniform1i(pro.normalProgram.u_LightPower2, 1);
      var lightDirection2 = new Vector3(Light.direction[2]);
      lightDirection2.normalize();
      gl.uniform3fv(pro.normalProgram.u_LightDirection2, lightDirection2.elements);
    }
    else if(Light.mode[2] == 2){
      gl.uniform1i(pro.normalProgram.u_LightPower2, 2);
      var lightPos2 = new Vector3(Light.pos[2]);
      gl.uniform3fv(pro.normalProgram.u_LightPos2, lightPos2.elements);
    }
    var lightColor2 = new Vector4(Light.color[2]);
    gl.uniform4fv(pro.normalProgram.u_LightColor2, lightColor2.elements);
    var ambientColor2 = new Vector4(Light.ambient[2]);
    gl.uniform4fv(pro.normalProgram.u_AmbientColor2, ambientColor2.elements);
  }

  if(Light.mode[3]==undefined)gl.uniform1i(pro.normalProgram.u_LightPower3, 0);
  else {
    if(Light.mode[3] == 1){
      gl.uniform1i(pro.normalProgram.u_LightPower3, 1);
      var lightDirection3 = new Vector3(Light.direction[3]);
      lightDirection4.normalize();
      gl.uniform3fv(pro.normalProgram.u_LightDirection3, lightDirection3.elements);
    }
    else if(Light.mode[3] == 2){
      gl.uniform1i(pro.normalProgram.u_LightPower3, 2);
      var lightPos3 = new Vector3(Light.pos[3]);
      gl.uniform3fv(pro.normalProgram.u_LightPos3, lightPos3.elements);
    }
    var lightColor3 = new Vector4(Light.color[3]);
    gl.uniform4fv(pro.normalProgram.u_LightColor3, lightColor3.elements);
    var ambientColor3 = new Vector4(Light.ambient[3]);
    gl.uniform4fv(pro.normalProgram.u_AmbientColor3, ambientColor3.elements);
  }

  if(Light.mode[0]==2)genShadow();
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  putElement();
  putTexture();
}
function genShadow(){
  var framebuffer, texture, depthBuffer;

  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2048, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 2048, 2048);

  framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
  framebuffer.texture = texture;

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  var matrixFromLight = new Matrix4();
  matrixFromLight.setPerspective(70.0, 1.0, 1.0, 100.0);
  matrixFromLight.lookAt(Light.pos[0][0], Light.pos[0][1], Light.pos[0][2],
    0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.viewport(0, 0, 2048, 2048);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(pro.shadowProgram);

  gl.uniformMatrix4fv(pro.shadowProgram.u_MatrixFromLight, false, matrixFromLight.elements);
  putElement(true);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.useProgram(pro.normalProgram);
  gl.clearColor(0.6, 0.6, 0.6, 1.0);
}
function putElement(shadow){
  if(Cache.renew == 1){
    Cache.renew = 0;
    redisp = 1;
    Cache.elementVertices = new Float32Array(Scene.seqTriangleAttrib);
  }
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, Cache.elementVertices, gl.STATIC_DRAW);

  var FSIZE = Cache.elementVertices.BYTES_PER_ELEMENT;

  if(shadow==undefined){
    if(Light.mode[0]==2)
      gl.uniform1i(pro.normalProgram.u_EnShadow, 1);
    else
      gl.uniform1i(pro.normalProgram.u_EnShadow, 0);
    
    gl.uniform1i(pro.normalProgram.u_ColorTex, 0);
    gl.uniform1i(pro.normalProgram.u_StaticView, 0);

    if(Light.mode[0]==2){
      var lightMatrix0 = new Matrix4();
      lightMatrix0.setPerspective(70.0, 1.0, 1.0, 100.0);
      lightMatrix0.lookAt(Light.pos[0][0], Light.pos[0][1], Light.pos[0][2],
        0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
      gl.uniformMatrix4fv(pro.normalProgram.u_MatrixFromLight0, false, lightMatrix0.elements);
      gl.uniform1i(pro.normalProgram.u_ShadowMap, 0);
    }
    if(Light.mode[1]==2){

    }
    if(Light.mode[2]==2){
      
    }
    if(Light.mode[3]==2){
      
    }
  }

  gl.vertexAttribPointer(pro.normalProgram.a_Position, 3, gl.FLOAT, false, FSIZE * 9, 0);
  gl.enableVertexAttribArray(pro.normalProgram.a_Position);
  if(shadow==undefined){
    gl.vertexAttribPointer(pro.normalProgram.a_Color, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 3);
    gl.enableVertexAttribArray(pro.normalProgram.a_Color);
    gl.vertexAttribPointer(pro.normalProgram.a_Normal, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 6);
    gl.enableVertexAttribArray(pro.normalProgram.a_Normal);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.drawArrays(gl.TRIANGLES, 0, Scene.seqTriangleAttrib.length / 9);

  gl.disableVertexAttribArray(pro.normalProgram.a_Position);
  gl.disableVertexAttribArray(pro.normalProgram.a_Color);
  gl.disableVertexAttribArray(pro.normalProgram.a_Normal);
}
function putTexture(){
  var vertices = new Float32Array(Scene.texAttrib);

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var FSIZE = vertices.BYTES_PER_ELEMENT;

  gl.uniform1i(pro.normalProgram.u_ColorTex, 1);
  gl.uniform1i(pro.normalProgram.u_StaticView, 0);

  gl.vertexAttribPointer(pro.normalProgram.a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
  gl.enableVertexAttribArray(pro.normalProgram.a_Position);
  gl.vertexAttribPointer(pro.normalProgram.a_TexCoord, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
  gl.enableVertexAttribArray(pro.normalProgram.a_TexCoord);
  gl.vertexAttribPointer(pro.normalProgram.a_Normal, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
  gl.enableVertexAttribArray(pro.normalProgram.a_Normal);

  gl.uniform1i(pro.normalProgram.u_Sampler, 1);

  var texture = gl.createTexture();
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); 
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  for(var i = 0; i < Scene.texElement.length; i++){
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, Scene.texPic[Scene.texElement[i]]);
    gl.drawArrays(gl.TRIANGLES, i*3, 3); 
  }

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(pro.normalProgram.a_Position);
  gl.disableVertexAttribArray(pro.normalProgram.a_TexCoord);
  gl.disableVertexAttribArray(pro.normalProgram.a_Normal);
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
  case macro.KEY_LEFT:
  case macro.KEY_A:
    Eye.speed.x = 0.1;
    break;
  case macro.KEY_UP:
  case macro.KEY_W:
    Eye.speed.z = -0.1;
    break;
  case macro.KEY_RIGHT:
  case macro.KEY_D:
    Eye.speed.x = -0.1;
    break;
  case macro.KEY_DOWN:
  case macro.KEY_S:
    Eye.speed.z = 0.1;
    break;
  case macro.KEY_SPACE:
    Eye.speed.y = 0.1;
    break;
  case macro.KEY_X:
    Eye.speed.y = -0.1;
    break;
  default:
    break;
  }
}
function keyUp(e){
  switch(e.keyCode){
  case macro.KEY_LEFT:
  case macro.KEY_A:
    Eye.speed.x = 0;
    break;
  case macro.KEY_UP:
  case macro.KEY_W:
    Eye.speed.z = 0;
    break;
  case macro.KEY_RIGHT:
  case macro.KEY_D:
    Eye.speed.x = 0;
    break;
  case macro.KEY_DOWN:
  case macro.KEY_S:
    Eye.speed.z = 0;
    break;
  case macro.KEY_SPACE:
    Eye.speed.y = 0;
    break;
  case macro.KEY_X:
    Eye.speed.y = 0;
    break;
  default:
    break;
  }
}

function handleFiles(files) {
  for(var i = 0; i < files.length - 1; i++){
    for(var j = files.length - 1; j > i; j--){
      if(files[j].name.includes('.mtl')){
        var tmp = files[j];
        files[j] = files[j-1];
        file[j-1]= tmp;
      }
    }
  }
  for(var f = 0; f < files.length; f++) {
    var file = files[f];
    var reader = new FileReader();
    reader.files = files;
    reader.no = f;
    reader.onload = function() {
      var mode = document.getElementById('ls').selectedIndex;
      if(mode == macro.PURE_COLOR){
        if(this.files[this.no].name.includes('.obj')){
          Cache.renew = 1;
          var content = this.result.split('\r\n');
          if(content == this.result)
            content = this.result.split('\n');
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
              Scene.insertSeqTriangle(
                index1[0]-1, index2[0]-1, index3[0]-1,
                index1[1]-1, index2[1]-1, index3[1]-1,
                index1[2]-1, index2[2]-1, index3[2]-1);
              break;
            case 'mtllib':
              for(var j = 0; j < this.files.length; j++){
                if(this.files[j].name==value[1])break;
                if(j==this.files.length - 1)
                  alert('未包含文件' + value[1]);
              }
              break;
            case 'usemtl':
              for(var j = 0; j < Material.name.length; j++){
                if(Material.name[j]==value[1]){
                  Material.temp = j;
                  break;
                }
                if(j==Material.name.length - 1)
                  alert('找不到材质' + value[1]);
              }
              break;
            }
          }
          while(Scene.seqVertex.length > 0)Scene.seqVertex.pop();
          while(Scene.seqColor.length > 0)Scene.seqColor.pop();
          while(Scene.seqNormal.length > 0)Scene.seqNormal.pop();
          while(Scene.seqSysNormal.length > 0)Scene.seqSysNormal.pop();
        }
        else if(this.files[this.no].name.includes('.mtl')){
          var content = this.result.split('\r\n');
          if(content == this.result)
            content = this.result.split('\n');
          var status = [1, 1, 1, 1];
          for(var i = 0; i < content.length; i++){
            var value = content[i].split(' ');
            switch(value[0]){
            case 'newmtl':
              if(status[1]==0)Material.ka.push(1.0, 1.0, 1.0);
              if(status[2]==0)Material.kd.push(1.0, 1.0, 1.0);
              if(status[3]==0)Material.ks.push(1.0, 1.0, 1.0);
              status = [0, 0, 0, 0];
              Material.name.push(value[1]);
              status[0] = 1;
              break;
            case 'Ka':
              if(status[1])break;
              Material.ka.push(value[1], value[2], value[3]);
              status[1] = 1;
              break;
            case 'Kd':
              if(status[2])break;
              Material.kd.push(value[1], value[2], value[3]);
              status[2] = 1;
              break;
            case 'Ks':
              if(status[3])break;
              Material.ks.push(value[1], value[2], value[3]);
              status[3] = 1;
              break;
            }
          }
          if(status[1]==0)Material.ka.push(1.0, 1.0, 1.0);
          if(status[2]==0)Material.kd.push(1.0, 1.0, 1.0);
          if(status[3]==0)Material.ks.push(1.0, 1.0, 1.0);
        }
        else {
          alert('文件格式错误！');
          return;
        }
      }
      if(mode == macro.TEXTURE_MAP){
        if(this.files[this.no].name.includes('.mtl')==false){
          alert('文件格式错误！');
          return;
        }
        var content = this.result.split('\r\n');
        if(content == this.result)
          content = this.result.split('\n');
        var material = undefined;
        for(var i = 0; i < content.length; i++){
          var value = content[i].split(' ');
          switch(value[0]){
          case 'v':
            Scene.seqVertex.push(value[1], value[2], value[3]);
            break;
          case 'vt':
            Scene.texCoord.push(value[1], value[2]);
            break;
          case 'vn':
            Scene.seqNormal.push(value[1], value[2], value[3]);
            break;
          case 'mtlsrc':
            material = value[1];
            break;
          case 'f':
            var index1 = value[1].split('/');
            var index2 = value[2].split('/');
            var index3 = value[3].split('/');
            Scene.insertTex(index1[0]-1, index2[0]-1, index3[0]-1,
                            index1[1]-1, index2[1]-1, index3[1]-1,
                            index1[2]-1, index2[2]-1, index3[2]-1, material);
            break;
          }
        }
        while(Scene.seqVertex.length > 0)Scene.seqVertex.pop();
        while(Scene.texCoord.length > 0)Scene.texCoord.pop();
        while(Scene.seqNormal.length > 0)Scene.seqNormal.pop();
        while(Scene.seqSysNormal.length > 0)Scene.seqSysNormal.pop();
      }
      if(mode == macro.LIGHT_MOD){
        if(this.files[this.no].name.includes('.lit')==false){
          alert('文件格式错误！');
          return;
        }
        var content = this.result.split('\r\n');
        if(content == this.result)
          content = this.result.split('\n');
        for(var i = 0; i < content.length; i++){
          var value = content[i].split(' ');
          switch(value[0]){
          case 'm':
            Light.mode.push(parseInt(value[1]));
            break;
          case 'p':
            Light.pos.push([
              parseFloat(value[1]), parseFloat(value[2]), parseFloat(value[3])]);
            break;
          case 'd':
            Light.direction.push([
              parseFloat(value[1]), parseFloat(value[2]), parseFloat(value[3])]);
            break;
          case 'c':
            Light.color.push([
              parseFloat(value[1]), parseFloat(value[2]), parseFloat(value[3])]);
            break;
          case 'a':
            Light.ambient.push([
              parseFloat(value[1]), parseFloat(value[2]), parseFloat(value[3])]);
            break;
          }
        }
      }
      redisp = 1;
    }
    reader.readAsText(file);
  }
}
function initModel(){

  redisp = 1;
}