var Tree = function(parameters) {

    this.parameters = parameters;
    this.id = parameters["id"];
    this.parent = parameters["parent"];
    this.index = parameters["index"];
    this.nodes = [];
    this.activeelements = [];
    this.ids = [];
    this.init(this.parameters);
    this.label = document.getElementById("intoplabel");

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
    this.parameters = parameters;
    parameters["rid"] = Math.floor(Math.random() * 1000);
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

    result = JSON.parse(xmlhttp.responseText);
    parameters["result"] = result;

    if (result["ids"] != "undefined") {
        that.ids = result["ids"];
    }


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
        event = parameters["event"],
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


Tree.prototype.parentscount = function(tree) {
    var count = 0,
        ntree = null;
    if (tree.parent) {
        ntree = tree.parent;
        ntree.parentscount(ntree);
        count++;
    }
    return count;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Tree.prototype.innewbutton = function(parameters) {
    var that = parameters["that"],
        v = "";

    that.label.innerHTML = that.name;
    parameters["url"] = "index/drawformwithsettings";
    parameters["id"] = that.ids[0]["id"];
    parameters["outfunc"] = that.outnew;
    parameters["data"] = "formname=" + parameters["type"];
    parameters["parent"] = that;
    

    that.nodes[0] = new Tree(parameters);
    that.nodes[0].name = "new";
    that.nodes[0].load();


}


Tree.prototype.inopb = function(parameters) {
    var that = parameters["that"],
        v = "";

    that.label.innerHTML = that.name;
    parameters["url"] = "index/drawformwithsettings";
    parameters["id"] = that.ids[0]["id"];
    parameters["outfunc"] = that.outlistEd;
    parameters["data"] = "formname=listEd";
    parameters["parent"] = that;


    that.nodes[0] = new Tree(parameters);
    that.nodes[0].name = "open";
    that.nodes[0].load();


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

Tree.prototype.outprepare = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"];

    if (result["activeelements"] !== "undefined") {
        l = result["activeelements"].length;
        for (i = 0; i < l; i++) {
            v = result["activeelements"][i];
            parameters["event"] = v["event"];
            parameters["id"] = v["id"];
            parameters["infunc"] = that[v["infunc"]];
            that.bind(parameters);
        }
    }
}

Tree.prototype.out = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"],
        id = parameters["id"];

    that.html = result["html"];
    document.getElementById(id).innerHTML = that.html;

}



Tree.prototype.outmenuform = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"],
        id = parameters["id"];

    if (result["html"] !== "undefined") {
        that.html = result["html"];
        document.getElementById(id).innerHTML = that.html;
        that.outprepare(parameters);
    }

}

Tree.prototype.outnew = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"],
        id = parameters["id"];

    that.html = result["html"];
    document.getElementById(id).innerHTML = that.html;
    that.outprepare(parameters);
}

Tree.prototype.outlistEd = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"],
        id = parameters["id"];


    that.html = result["html"];
    document.getElementById(id).innerHTML = that.html;


    that.outprepare(parameters);

    parameters["url"] = "index/drawparseform";
    parameters["id"] = parameters["result"]["ids"][0]["id"];
    parameters["data"] = "formname=loop&type=" + parameters["type"];
    parameters["outfunc"] = that.out;

    that.load(parameters);

}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



var parameters = [];
parameters["url"] = "index/drawformwithsettings";
parameters["id"] = "root";
parameters["infunc"] = null;
parameters["outfunc"] = null;
parameters["data"] = "formname=menu";
parameters["type"] = "en";
parameters["parent"] = null;
var tree = new Tree(parameters);
tree.name = "menu";
tree.parameters["outfunc"] = tree.outmenuform;
tree.load(parameters);