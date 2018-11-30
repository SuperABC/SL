var Mouse = {
  prePos:{x:0, y:0},
  drag:0,

  setup:function(){
    canvas.onmousemove = function(e){ Mouse.mouseMove(e); };
    canvas.onmouseover = function(e){ Mouse.mouseIn(e); };
    canvas.onmouseout = function(e){ Mouse.mouseOut(e); };
  
    canvas.onclick = function(e){ Mouse.mouseClick(e); };
    canvas.onmousedown = function(e){ Mouse.mouseDown(e); };
    canvas.onmouseup = function(e){ Mouse.mouseUp(e); };
  },

  mouseMove:function(e){
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect();

    if(this.drag){
      x -= rect.left;
      y -= rect.top;
      Eye.rotateEye((x-this.prePos.x)/200, (y-this.prePos.y)/200);
      this.prePos.x = x;
      this.prePos.y = y;
      redisp = 1;
    }
  },
  mouseIn:function(e){
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect() ;

    x -= rect.left;
    y -= rect.top;
  },
  mouseOut:function(e){
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect() ;

    x -= rect.left;
    y -= rect.top;
  },

  mouseClick:function(e){
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect() ;

    x -= rect.left;
    y -= rect.top;
  },
  mouseDown:function(e){
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect() ;

    x -= rect.left;
    y -= rect.top;
    this.prePos.x = x;
    this.prePos.y = y;
    this.drag = 1;
  },
  mouseUp:function(e){
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect() ;

    x -= rect.left;
    y -= rect.top;
    this.drag = 0;
  }
}
var Key = {
  setup:function(){
    document.onkeypress = function(e){ Key.keyPress(e); };
    document.onkeydown = function(e){ Key.keyDown(e); };
    document.onkeyup = function(e){ Key.keyUp(e); };
  },

  keyPress:function(e){
    switch(e.keyCode){
    default:
      break;
    }
  },
  keyDown:function(e){
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
  },
  keyUp:function(e){
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
}
