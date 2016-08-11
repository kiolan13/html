var Vx = function() {

    var that = this,
        parameters = [],
        rectcanvas = null;





    this.context = null;
    this.x = 0;
    this.y = 0;
    this.mousex = 0;
    this.mousey = 0;
    this.width = 0;
    this.height = 0;
    this.r;
    this.mousedown = false;

    parameters["that"] = that;

    that.init(parameters);


}

Vx.prototype.init = function(parameters) {

    var that = parameters["that"],
        canvas = document.getElementById("myCanvas"),
        requestAnimationFrame = null,
        cinput = document.getElementById("canvasinput"),
        label = document.getElementById("intoplabel");

    that.rectcanvas = canvas.getBoundingClientRect();

    cinput.innerHTML = JSON.stringify(parameters["that"]);

    if (canvas.getContext) {
        context = canvas.getContext("2d");

    }


    that.width = canvas.width;
    that.height = canvas.height;
    that.r = new Rectangle(100, 100, 100, 100);


    canvas.addEventListener("mousemove", function(e) {

        that.mousex = e.clientX - that.rectcanvas.left;
        that.mousey = e.clientY - that.rectcanvas.top;


    });

    canvas.addEventListener("mousedown", function(e) {
        that.mousedown = true;

    });
    canvas.addEventListener("mouseup", function(e) {
        that.mousedown = false;
        that.r.isdrag = false;

    });

    requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;

    that.animate();

}

Vx.prototype.animate = function() {

    var that = this,
        parameters = [],
        fps = 30;



    setInterval(function() {
        requestAnimationFrame(function() {
            that.draw();
        });

    }, 1000 / fps);




}

Vx.prototype.draw = function() {

    var that = this,
        parameters = [],
        cinput = document.getElementById("canvasinput"),
        label = document.getElementById("intoplabel");


    parameters["mousex"] = that.mousex;
    parameters["mousey"] = that.mousey;

    that.r.over(parameters);


    if (that.r.isover && that.mousedown || that.r.isdrag) {
        that.r.drag(parameters);
        cinput.style.left = that.r.x + that.rectcanvas.left + "px";
        cinput.style.top = that.r.y + that.rectcanvas.top + "px";
        cinput.style.display = "none";
    } else {
        cinput.style.display = "block";
    }


    context.clearRect(0, 0, that.width, that.height);
    context.beginPath();
    context.rect(that.r.x, that.r.y, that.r.width, that.r.height);
    //that.x += 1;
    context.stroke();
    context.closePath();



}


var Rectangle = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isover = false;
    this.isdrag = false;
    this.xprev = 0;
    this.yprev = 0;

}

Rectangle.prototype.over = function(parameters) {

    var mousex = parameters["mousex"],
        mousey = parameters["mousey"],
        x = this.x,
        y = this.y,
        xe = this.x + this.width,
        ye = this.y + this.height,
        label = document.getElementById("intoplabel");


    if (mousex < x || mousex > xe || mousey < y || mousey > ye) {
        //label.innerHTML = "";
        this.isover = false;
    } else {
        this.isover = true;
    }

}

Rectangle.prototype.drag = function(parameters) {

    var x = parameters["mousex"],
        y = parameters["mousey"],
        dx = 0,
        dy = 0;

    if (this.isdrag === false) {
        this.xprev = x;
        this.yprev = y;
        this.isdrag = true;
    } else {

        dx = x - this.xprev;
        dy = y - this.yprev;
        this.x += dx;
        this.y += dy;
        this.xprev = x;
        this.yprev = y;
    }




}





var x = new Vx();