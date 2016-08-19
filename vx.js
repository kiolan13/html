var Vx = function() {


    this.that = this;
    this.parameters = [];
    this.mousex = 0;
    this.mousey = 0;
    this.mousedown = false;
    this.objects = [];

    this.rectcanvas = null;
    this.context = null;
    this.label = null;

    this.qt = null;
    this.app = null;

    this.indrag = false;
    this.activeelement = null;
    this.px = null;
    this.py = null;
    

    this.node = {
        "name": "init",
        "in": "parameters",
        "var": {
            "posx": null,
            "posy": null
        },
        "assign": {
            "posx": 10,
            "posy": 10

        },
        "parameters": {

            "x": 0,
            "y": 1
        },
        "out": "parameters"
    }



    this.parameters["that"] = this;
    this.init(this.parameters);


}


Vx.prototype.init = function(parameters) {

    var that = parameters["that"],
        canvas = document.getElementById("myCanvas"),
        requestAnimationFrame = null,
        parameters = [],
        ne = null;

    if (canvas.getContext) {
        this.context = canvas.getContext("2d");
    }

    //pattern = /var([\s\S]+?);/g,

    that.qt = new Qt(0, 0, 1024, 768, 1, 4, this.context);
    that.app = new App();
    that.app.init();

    that.rectcanvas = canvas.getBoundingClientRect();

    that.label = document.getElementById("intoplabel");

    /*
    parameters["x"] = 50;
    parameters["y"] = 50;
    parameters["width"] = 150;
    parameters["height"] = 200;
    parameters["context"] = this.context;

    ne = new Nodeelement(parameters);
    that.objects.push(ne);
    
    parameters["x"] = 250;
    parameters["y"] = 50;
    parameters["width"] = 150;
    parameters["height"] = 200;
    parameters["context"] = this.context;

    ne = new Nodeelement(parameters);
    that.objects.push(ne);

    */

    //that.qt.insert();


    that.width = canvas.width;
    that.height = canvas.height;
    that.r = new Rectangle(100, 100, 200, 200);
    canvas.addEventListener("mousemove", function(e) {
        that.mousex = e.clientX - that.rectcanvas.left;
        that.mousey = e.clientY - that.rectcanvas.top;
    });
    canvas.addEventListener("mousedown", function(e) {
        that.mousedown = true;
        that.createrectdrag();
    });
    canvas.addEventListener("mouseup", function(e) {
        that.mousedown = false;
        that.indrag = false;
        that.activeelement = null;
    });



    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    that.animate();

}


Vx.prototype.animate = function() {

    var that = this,
        parameters = [],
        fps = 30;
    setInterval(function() {
        requestAnimationFrame(function() {
            that.frame();
        });
    }, 1000 / fps);

}



Vx.prototype.frame = function() {


    var that = this,
        parameters = [],
        cinput = document.getElementById("canvasinput"),
        label = document.getElementById("intoplabel");

    if (this.mousedown) {
        this.resizelast();
    }

    //that.collisionNodes();
    that.draw();


}


Vx.prototype.draw = function() {

    var that = this,
        i = 0,
        l = 0,
        r = null,
        context = this.context,
        rm = false,
        rs = false,
        dx = false,
        dy = false;

    //that.label.innerHTML = "";

    context.clearRect(0, 0, that.width, that.height);
    //context.beginPath();

    //that.qt.insertPoint(that.mousex, that.mousey);


    //context.stroke();
    //context.closePath();
    l = this.objects.length;


    for (i = 0; i < l; i++) {

        r = this.objects[i];
        //r.draw();

        context.beginPath();
        context.rect(r.x, r.y, r.width, r.height);
        context.closePath();
        context.stroke();
        that.qt.insertRectangle(that.objects[i]);
    }


}

Vx.prototype.collisionNodes = function() {
    var that = this,
        i = 0,
        lengthI = 0,
        j = 0,
        lengthJ = 0,
        dx = 0,
        dy = 0,
        r = null,
        ir = null,
        inhit = false,
        label = document.getElementById("intoplabel");
        

    lengthI = this.objects.length;
    for (i = 0; i < lengthI; i++) {
        r = this.objects[i];
        lengthJ = r.activeelements.length;
        for (j = 0; j < lengthJ; j++) {
            ir = r.activeelements[j];
            inhit = this.collisionPR(this.mousex, this.mousey, ir);
            if (inhit) {
                this.activeelement = {
                    "name": ir.name,
                    "i": i,
                    "j": j
                }

                break;

            }
        }

    }

    if (this.activeelement !== null && this.mousedown) {



        if (!this.indrag) {
            this.px = this.mousex;
            this.py = this.mousey;
            this.indrag = true;
        }

    }

    if (this.indrag) {
        
        r = this.objects[this.activeelement.i];
        ir = r.activeelements[this.activeelement.j];
        label.innerHTML = ir.name;
        dx = this.mousex - this.px;
        dy = this.mousey - this.py;
        ir.x += dx;
        ir.y += dy;
        this.px = this.mousex;
        this.py = this.mousey;
        r.refresh();
    }

   
}

Vx.prototype.collisionPR = function(x, y, r) {
    if (x < r.x || x > r.x + r.width || y < r.y || y > r.y + r.height) {
        return false;
    }
    return true;
}



Vx.prototype.drawNode = function(node) {
    var context = this.context,
        r;


    context.beginPath();
    r = node.rectmove;
    context.rect(r.x, r.y, r.width, r.height);
    r = node.rectcontent;
    context.rect(r.x, r.y, r.width, r.height);
    r = node.rectsize;
    context.rect(r.x, r.y, r.width, r.height);

    context.stroke();
    context.closePath();

}









Vx.prototype.nodeparse = function(node) {

    var parameters = null,
        result = null;


    for (var k in node.var) {
        if (node.var.hasOwnProperty(k)) {
            //alert(k);
        }
    }



    if (node.in) {
        parameters = node.parameters;
    }

    if (node.out) {
        result = node[node.out];
    }

    return result;

}

Vx.prototype.bind = function(parameters) {
    var event = parameters["event"],
        element = parameters["element"],
        response = parameters["response"];


    element.addEventListener(event, function(e) {
        parameters["e"] = e;
        response(parameters);
    });

};



Vx.prototype.createrectdrag = function() {
    var r = new Rectangle(this.mousex, this.mousey, 0, 0);
    this.objects.push(r);
}

Vx.prototype.resizelast = function() {
    var l = this.objects.length,
        r = this.objects[l - 1];
    r.width = this.mousex - r.x;
    r.height = this.mousey - r.y;

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







var Rectangle = function(x, y, width, height) {


    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.name = "";

}






var Nodeelement = function(parameters) {

    this.name;
    this.x;
    this.y;
    this.width;
    this.height;
    this.rectmove;
    this.rectcontent;
    this.rectsize;
    this.activeelements = [];

    this.init(parameters);

}

Nodeelement.prototype.init = function(parameters) {

    this.name = parameters["name"];
    this.x = parameters["x"];
    this.y = parameters["y"];
    this.width = parameters["width"];
    this.height = parameters["height"];
    this.context = parameters["context"];
    this.rectmove = new Rectangle(this.x - 20, this.y - 20, 20, 20);
    this.rectmove.name = "move";
    this.rectcontent = new Rectangle(this.x, this.y, this.width, this.height);
    this.rectsize = new Rectangle(this.x + this.width, this.y + this.height, 20, 20);
    this.rectsize.name = "size";

    this.activeelements.push(this.rectmove, this.rectsize);
}

Nodeelement.prototype.move = function() {

    this.rectcontent.x = this.rectmove.x + 20;
    this.rectcontent.y = this.rectmove.y + 20;
    this.rectsize.x = this.rectcontent.x + this.rectcontent.width;
    this.rectsize.y = this.rectcontent.y + this.rectcontent.height;
}
Nodeelement.prototype.size = function() {

    this.rectcontent.width = this.rectsize.x - this.rectcontent.x;
    this.rectcontent.height = this.rectsize.y - this.rectcontent.y;

}
Nodeelement.prototype.draw = function() {

    var context = this.context;
    context.beginPath();
    context.rect(this.rectmove.x, this.rectmove.y, this.rectmove.width, this.rectmove.height);
    context.rect(this.rectcontent.x, this.rectcontent.y, this.rectcontent.width, this.rectcontent.height);
    context.rect(this.rectsize.x, this.rectsize.y, this.rectsize.width, this.rectsize.height);
    context.closePath();
    context.stroke();
}
Nodeelement.prototype.refresh = function() {
    this.size();
    this.move();
}



var x = new Vx();