var Vx = function() {
    var that = this,
        context = null,
        parameters = [];

    parameters["that"] = that;

    that.init(parameters);


}

Vx.prototype.init = function(parameters) {

    var that = parameters["that"],
        canvas = document.getElementById("myCanvas"),
        requestAnimationFrame = null;

    if (canvas.getContext) {
        that.context = canvas.getContext("2d");

    }

    canvas.addEventListener("mousemove", function(e) {
    	var label = document.getElementById("intoplabel");
    	var rect = canvas.getBoundingClientRect();
        label.innerHTML = e.clientY-rect.top;



    });

    requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;

    that.animate(parameters);

}

Vx.prototype.animate = function(parameters) {

    var that = parameters["that"],
        fps = 30;

    setTimeout(function() {
        requestAnimationFrame(function() {
            that.draw(parameters);
        });
    }, 1000 / fps);

}

Vx.prototype.draw = function(parameters) {

    var that = parameters["that"],
        context = that.context;
        


    context.rect(50, 50, 100, 100);
    context.stroke();

}

var x = new Vx();