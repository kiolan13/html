var Tree = function(parameters) {

    this.that = this;
    this.parameters = [];
    this.url = parameters["url"];
    this.id = parameters["id"];
    this.infunc = parameters["infunc"];
    this.outfunc = parameters["outfunc"];
    this.data = parameters["data"];
    this.type = parameters["type"];
    this.inId = null;

    this.nodes = [];
    this.xmlhttp = null;


    this.init(parameters);

}

Tree.prototype.init = function(parameters) {

    if (window.XMLHttpRequest) {
        this.xmlhttp = new XMLHttpRequest();
    } else {
        this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    parameters["that"] = this;
    this.parameters = parameters;
}

Tree.prototype.xhr = function(parameters) {
    var xmlhttp = this.xmlhttp,
        response = parameters["infunc"];
    if (response !== null) {
        xmlhttp.onreadystatechange = function(e) {
            response(parameters);
        }
    }
    this.open(parameters);
}

Tree.prototype.open = function(parameters) {
    var that = parameters["that"],
        xmlhttp = this.xmlhttp,
        url = parameters["url"],
        data = parameters["data"];
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(data);
}

Tree.prototype.response = function(parameters) {
    var that = parameters["that"],
        xmlhttp = that.xmlhttp,
        outfunc = parameters["outfunc"],
        result = "";
    if (!that.stateIsOk(xmlhttp)) {
        return;
    }
    result = xmlhttp.responseText;
    document.getElementById(that.id).innerHTML = result;

    if (outfunc != null && outfunc != "undefined") {
        outfunc(parameters);
    }
}

Tree.prototype.stateIsOk = function(xmlhttp) {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        return true;
    } else {
        return false;
    }
}

Tree.prototype.bind = function(parameters) {
    var element = parameters["element"],
        response = parameters["infunc"];
    element.addEventListener(parameters["event"], function(e) {
        parameters["e"] = e;
        response(parameters);
    });
}

Tree.prototype.load = function() {

    this.xhr(this.parameters);
}

Tree.prototype.split = function(parameters) {
    this.nodes.push(new Tree(parameters));
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Tree.prototype.innewbutton = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        chd = document.getElementById("inchbox"),
        formname = null,
        outfunc = null,
        v = "";
    parameters["that"] = that;
    parameters["url"] = "index/drawform";
    parameters["id"] = "_in";
    parameters["response"] = that.response;
    parameters["type"] = that.type;
    v = that.checkboxget();
    if (v === "en") {
        formname = "entity";
        outfunc = that.outeNtt;
    } else if (v === "at") {
        formname = "attribute";
        outfunc = that.outaTtr;
    }
    parameters["infunc"] = that.response;
    parameters["outfunc"] = outfunc;
    parameters["data"] = "formname=" + formname;

    that.nodes[0] = new Tree(parameters);
    that.nodes[0].load();
    //that.nodes[0].parent = that;

}

Tree.prototype.inopb = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        cb = 0,
        v = "";

    parameters["that"] = that;
    parameters["url"] = "index/drawform";
    parameters["id"] = "_in";
    parameters["infunc"] = that.response;
    parameters["outfunc"] = that.outlistEd;
    parameters["type"] = that.type;
    parameters["data"] = "formname=listEd";

    that.nodes[0] = new Tree(parameters);
    that.nodes[0].load();
    that.nodes[0].parent = that;

}

Tree.prototype.inBox = function(inparameters) {
    var that = inparameters["that"],
        e = inparameters["e"],
        id = inparameters["id"],
        v = "";
    that.checkboxclear(id);
    e.target.checked = true;
    v = that.checkboxget();;
    that.type = v;
    document.getElementById("_in").innerHTML = "";
}

Tree.prototype.insSev = function(inparameters) {
    var that = inparameters["that"],
        parameters = [],
        e = inparameters["e"],
        parent = e.target.parentNode,
        searchfield = document.getElementById("listEdsearchfield"),
        searchstring = "";
    
    searchstring = searchfield.value;
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["url"] = "index/assumption";
    parameters["data"] = "searchstring=" + searchstring + "&type=" + parameters["type"] + "&formname=loop";
    parameters["infunc"] = that.response;
    parameters["id"] = "_in_sT";
    //parameters["outfunc"] = null;
    that.xhr(parameters);
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Tree.prototype.outindexform = function(inparameters) {
    var parameters = [],
        that = inparameters["that"];
    parameters["that"] = that;
    parameters["id"] = "inchbox";
    that.checkboxevents(parameters);
    parameters["type"] = "en";
    parameters["inEl"] = document.getElementById("_in");
    parameters["event"] = "click";
    parameters["infunc"] = that.innewbutton;
    parameters["element"] = document.getElementById("innewb");
    that.bind(parameters);
    parameters["infunc"] = that.inopb;
    parameters["element"] = document.getElementById("inopb");
    that.bind(parameters);

}
Tree.prototype.outeNtt = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        id = inparameters["id"];
    if (!that.stateIsOk(xmlhttp)) {
        return;
    }
    document.getElementById(id).innerHTML = xmlhttp.responseText;
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["event"] = "click";
    parameters["element"] = document.getElementById("eNlistaTed");
    parameters["infunc"] = null;
    that.bind(parameters);
    parameters["element"] = document.getElementById("eNsave");
    parameters["infunc"] = that.inSave;
    that.bind(parameters);
}
Tree.prototype.outaTtr = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        id = inparameters["id"];
    if (!that.stateIsOk(xmlhttp)) {
        return;
    }
    document.getElementById(id).innerHTML = xmlhttp.responseText;
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["element"] = document.getElementById("aTsave");
    parameters["event"] = "click";
    parameters["infunc"] = that.inSave;
    that.bind(parameters);
}
Tree.prototype.outlistEd = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        result = "";
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["element"] = document.getElementById("listEdsearchfield");
    parameters["event"] = "keyup";
    parameters["infunc"] = that.insSev;
    that.bind(parameters);
    document.getElementById("listEdattraddbutton").style.display = "none";
    parameters["element"] = document.getElementById("listEdeditbutton");
    parameters["event"] = "click";
    parameters["infunc"] = that.inEdit;
    that.bind(parameters);
    parameters["element"] = document.getElementById("listEdattrdeletebutton");
    parameters["infunc"] = that.inDelete;
    that.bind(parameters);

    parameters["url"] = "index/drawparseform";
    parameters["id"] = "_in_sT";
    parameters["data"] = "formname=loop&type=" + parameters["type"];
    parameters["infunc"] = that.response;
    parameters["outfunc"] = null;
    


    that.nodes[0] = new Tree(parameters);
    that.nodes[0].load();
    that.nodes[0].parent = that;
    
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Tree.prototype.checkboxevents = function(inparameters) {
    var i = 0,
        that = inparameters["that"],
        id = inparameters["id"],
        chboxes = document.getElementById(id).children,
        l = chboxes.length,
        parameters = [];
    parameters["that"] = that;
    parameters["event"] = "click";
    parameters["infunc"] = that.inBox;
    parameters["id"] = inparameters["id"];
    for (i = 0; i < l; i++) {
        if (chboxes[i].type === "checkbox") {
            parameters["element"] = chboxes[i];
            that.bind(parameters);
        }
    }
}

Tree.prototype.checkboxclear = function(id) {
    var i = 0,
        chboxes = document.getElementById(id).children,
        l = chboxes.length;
    for (i = 0; i < l; i++) {
        if (chboxes[i].type === "checkbox") {
            chboxes[i].checked = true ? false : false;
        }
    }
}
Tree.prototype.checkboxget = function() {
    var i = 0,
        chboxes = document.getElementById("inchbox").children,
        l = chboxes.length;
    for (i = 0; i < l; i++) {
        if (chboxes[i].type === "checkbox") {
            if (chboxes[i].checked === true) {
                return chboxes[i].id;
            }
        }
    }
    return -1;
}

Tree.prototype.checkboxgetAll = function(chboxes) {
    var i = 0,
        l = chboxes.length,
        result = [];
    for (i = 0; i < l; i++) {
        if (chboxes[i].children[0].type === "checkbox") {
            if (chboxes[i].children[0].checked === true) {
                result.push(chboxes[i].title);
            }
        }
    }
    return result;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var parameters = [];
parameters["url"] = "index/drawform";
parameters["id"] = "root";
parameters["infunc"] = null;
parameters["outfunc"] = null;
parameters["data"] = "formname=start";
parameters["type"] = "en";
var t = new Tree(parameters);
t.parameters["infunc"] = t.response;
t.parameters["outfunc"] = t.outindexform;
t.load();