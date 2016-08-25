var Tree = function(parameters) {

    this.that = this;
    this.parameters = [];
    this.url = parameters["url"];
    this.id = parameters["id"];
    this.infunc = parameters["infunc"];
    this.outfunc = parameters["outfunc"];
    this.data = parameters["data"];
    this.type = parameters["type"];
    this.inids = [];
    this.html = null;
    this.contenthtml = null;

    this.nodes = [];
    this.activeelements = [];
    this.xmlhttp = null;


    this.init(parameters);

}

Tree.prototype.init = function(parameters) {

    if (parameters["xmlhttp"] == "undefined" || parameters["xmlhttp"] == null) {
        if (window.XMLHttpRequest) {
            this.xmlhttp = new XMLHttpRequest();
        } else {
            this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    } else {
        this.xmlhttp = parameters["xmlhttp"];
    }

    parameters["that"] = this;
    parameters["response"] = this.response;
    parameters["replace"] = true;
    this.parameters = parameters;
}

Tree.prototype.xhr = function(parameters) {
    var xmlhttp = this.xmlhttp,
        response = parameters["response"];
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
    parameters["result"] = result;

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
    var that = parameters["that"],
        id = parameters["id"],
        infunc = parameters["infunc"],
        el = document.getElementById(id);
    that.activeelements.push(el);
    el.addEventListener(parameters["event"], function(e) {
        parameters["e"] = e;
        infunc(parameters);
    });
}



Tree.prototype.load = function(parameters) {
    if (parameters == null) {
        this.xhr(this.parameters);
    } else {
        this.xhr(parameters);
    }

}

Tree.prototype.split = function(parameters) {
    this.nodes.push(new Tree(parameters));
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Tree.prototype.innewbutton = function(parameters) {
    var that = parameters["that"],
        chd = document.getElementById("inchbox"),
        formname = null,
        outfunc = null,
        v = "";

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

    parameters["outfunc"] = outfunc;
    parameters["data"] = "formname=" + formname;

    that.nodes[0] = new Tree(parameters);
    that.nodes[0].load();
    that.nodes[0].parent = that;

}

Tree.prototype.inopb = function(parameters) {
    var that = parameters["that"],
        cb = 0,
        v = "";

    parameters["url"] = "index/drawformwithsettings";
    parameters["id"] = "_in";
    parameters["response"] = that.response;
    parameters["outfunc"] = that.outlistEd;
    parameters["type"] = that.type;
    parameters["data"] = "formname=listEd";

    that.nodes[0] = new Tree(parameters);
    that.nodes[0].load();
    that.nodes[0].parent = that;

}

Tree.prototype.inBox = function(parameters) {
    var that = parameters["that"],
        e = parameters["e"],
        id = e.target.parentNode.id,
        v = "";
    that.checkboxclear(id);
    e.target.checked = true;
    v = that.checkboxget();;
    that.type = v;
    document.getElementById("_in").innerHTML = "";
}

Tree.prototype.insSev = function(parameters) {
    var that = parameters["that"],
        e = parameters["e"],
        parent = e.target.parentNode,
        searchfield = that.activeelements[0],
        searchstring = "";

    searchstring = searchfield.value;
    parameters["url"] = "index/assumption";
    parameters["data"] = "searchstring=" + searchstring + "&type=" + parameters["type"] + "&formname=loop";
    parameters["response"] = that.response;
    parameters["id"] = that.inids[0]["id"];

    that.load(parameters);
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Tree.prototype.out = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"],
        id = parameters["id"];
    document.getElementById(id).innerHTML = result;

}



Tree.prototype.outindexform = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"],
        id = parameters["id"];


    document.getElementById(id).innerHTML = result;

    parameters["id"] = "inchbox";
    that.checkboxevents(parameters);
    parameters["type"] = "en";
    parameters["event"] = "click";
    parameters["infunc"] = that.innewbutton;
    parameters["id"] = "innewb";
    that.bind(parameters);
    parameters["infunc"] = that.inopb;
    parameters["id"] = "inopb";
    that.bind(parameters);

}
Tree.prototype.outeNtt = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"],
        id = parameters["id"];

    document.getElementById(id).innerHTML = result;

    parameters["event"] = "click";
    parameters["id"] = "eNlistaTed";
    parameters["infunc"] = null;
    that.bind(parameters);
    parameters["id"] = "eNsave";
    parameters["infunc"] = that.inSave;
    that.bind(parameters);
}

Tree.prototype.outaTtr = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"],
        id = parameters["id"];

    document.getElementById(id).innerHTML = result;
    parameters["id"] = "aTsave";
    parameters["event"] = "click";
    parameters["infunc"] = that.inSave;
    that.bind(parameters);
}

Tree.prototype.outlistEd = function(parameters) {
    var that = parameters["that"],
        data = parameters["result"],
        id = that.id,
        i = 0,
        l = 0,
        v = null;

    result = JSON.parse(data);
    that.html = result["html"];


    document.getElementById(id).innerHTML = that.html;


    that.inids = result["inids"];
    l = result["activeelements"].length;
    for (i = 0; i < l; i++) {
        v = result["activeelements"][i];
        parameters["event"] = v["event"];
        parameters["id"] = v["id"];
        parameters["infunc"] = that[v["infunc"]];
        that.bind(parameters);
    }


    parameters["url"] = "index/drawparseform";
    parameters["id"] = that.inids[0]["id"];
    parameters["data"] = "formname=loop&type=" + parameters["type"];
    parameters["outfunc"] = that.out;



    that.load(parameters);

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Tree.prototype.checkboxevents = function(parameters) {
    var i = 0,
        that = parameters["that"],
        id = parameters["id"],
        chboxes = document.getElementById(id).children,
        l = chboxes.length;

    parameters["that"] = that;
    parameters["event"] = "click";
    parameters["infunc"] = that.inBox;
    for (i = 0; i < l; i++) {
        if (chboxes[i].type === "checkbox") {
            parameters["element"] = chboxes[i];
            that.bind(parameters);
        }
    }
}

Tree.prototype.checkboxclear = function(id) {
    var i = 0,
        chboxes = document.getElementById("inchbox").children,
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
t.parameters["outfunc"] = t.outindexform;
t.load(parameters);