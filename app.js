"use strict";

var App = function() {


    var that = this;


    that.xmlhttp;

    if (window.XMLHttpRequest) {

        that.xmlhttp = new XMLHttpRequest();
    } else {

        that.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }





    that.incbindexform(that);

}



App.prototype.init = function() {

};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

App.prototype.incbindexform = function(that) {

    var parameters = [];
    parameters["that"] = that;
    parameters["id"] = "inchbox";
    that.checkboxevents(parameters);


    parameters["type"] = "cb";
    parameters["inEl"] = document.getElementById("_in");
    parameters["event"] = "click";
    parameters["response"] = that.respnewbutton;
    parameters["element"] = document.getElementById("innewb");

    this.bind(parameters);

    parameters["response"] = that.respopb;
    parameters["element"] = document.getElementById("inopb");

    this.bind(parameters);

}


App.prototype.respnewbutton = function(inparameters) {

    var parameters = [],
        chd = document.getElementById("inchbox"),
        v = inparameters["type"],
        cb = 0,
        that = inparameters["that"];

    parameters["url"] = "index/drawform";
    parameters["response"] = that.response;
    parameters["inEl"] = inparameters["inEl"];
    
    parameters["that"] = inparameters["that"];

    cb = that.checkboxget();
    if (cb === 1 || v === "en") {
        parameters["data"] = "formname=entity";
        parameters["incbfunc"] = that.oneNtt;
    } else if (cb === 3 || v === "at") {
        parameters["data"] = "formname=attribute";
        parameters["incbfunc"] = that.onaTtr;
    }


    that.xht(parameters);


}


App.prototype.respopb = function(inparameters) {


    var parameters = [],
        cb = 0,
        that = inparameters["that"];

    parameters["inEl"] = document.getElementById("_in");
    parameters["that"] = that;

    cb = that.checkboxget();

    if (cb === 1) {
        parameters["incbfunc"] = that.incbentity;
        

    } else if (cb === 3) {
        parameters["incbfunc"] = that.incbattribute;
        
    }

    that.listEd(parameters);

}

App.prototype.evsFchenge = function(that, parameters, e) {
    var parent = e.target.parentNode;
    that.sSev(that, parent, parameters, e);
}

App.prototype.evsFadd = function(that, inparameters, e) {

    var url = "",
        parameters = "",
        response = null,
        inEl = null,
        rprocc = null,
        incbfunc = null,
        v = [],
        prdivs = [],
        avids = [],
        sorted = [],
        result = [],
        toadd = [],
        presented = [];


    prdivs = that.getchildById("_eNatpr", "_in_sT").children;
    avids = that.getchildById("_eNatav", "_in_sT").children;

    toadd = that.checkboxgetAll(that, avids);
    presented = that.getpresented(prdivs);


    sorted = that.sortIsThere(toadd, presented);
    result = that.addarrtoarr(sorted, presented);


    url = "index/eNaddtopr";
    parameters = "addids=" + result.join();
    response = that.response;
    inEl = that.getchildById("_eNatpr", "_in_sT");
    rprocc = that.parseandgenerate;




    if (result.length !== 0) {

        that.xht(url, parameters, response, inEl, rprocc, incbfunc);

    }


}



App.prototype.evsFdel = function(that, inparameters, e) {

    var url = "",
        parameters = "",
        response = null,
        inEl = null,
        rprocc = null,
        incbfunc = null,
        elements = null,
        result = [],
        parent = e.target.parentNode,
        v = "";


    elements = that.getchildById(parent.id, "_in_sT").children;
    result = that.checkboxgetAll(that, elements);

    v = inparameters["type"];

    if (v === "en") {

        url = "index/deletefromEn";
    } else if (v === "at") {

        url = "index/deletefromAt";
    }

    parameters = "";
    response = that.response;
    inEl = null;



    parameters = "deleteids=" + result.join();

    if (result.length !== 0) {

        that.xht(url, parameters, response, inEl, rprocc, incbfunc);
        that.sSev(that, parent, inparameters);

    }


}

App.prototype.evsEdit = function(that, inparameters, e) {

    var url = "",
        parameters = "",
        response = that.response,
        inEl = document.getElementById("_in"),
        rprocc = null,
        incbfunc = null,
        divarray = null,
        outparameters = null,
        result = [],
        parent = e.target.parentNode,
        v = "";

    divarray = that.getchildById(parent.id, "_in_sT").children;
    result = that.checkboxgetAll(that, divarray);
    parameters = "ids=" + result.join();


    v = inparameters["type"];
    if (v === "en") {
        url = "index/generateeditlistEn";
    } else if (v === "at") {
        url = "index/generateeditlistAt"
    }


    that.xht(url, parameters, response, inEl, rprocc, incbfunc);


}


App.prototype.evsEnAtdel = function(that, inparameters, e) {

    var i = 0,
        l = 0,
        url = "",
        response = null,
        inEl = null,
        rprocc = null,
        incbfunc = null,
        result = "",
        checkedids = [],
        parent = that.getchildById("_eNatpr", "_in_sT");



    checkedids = that.checkboxgetAll(that, parent.children);


    that.removenodesBychildId(parent, checkedids);



}

App.prototype.evsEnAtEdit = function(inparameters) {



}

App.prototype.evsChbox = function(inparameters) {

    var e = inparameters["e"],
        that = inparameters["that"],
        id = inparameters["id"];


    that.checkboxclear(that, id);
    e.target.checked = true;

    document.getElementById("_in").innerHTML = "";

}




App.prototype.evEnttsave = function(inparameters) {
    
    var that = inparameters["that"];
    that.saveEn(inparameters);
}

App.prototype.evAttrsave = function(inparameters) {

    var that = inparameters["that"];
    that.saveAttrb(inparameters);

}





App.prototype.bind = function(parameters) {

    var element = parameters["element"],
        response = parameters["response"];

    element.addEventListener(parameters["event"], function(e) {
        parameters["e"] = e;
        response(parameters);
    });
}






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






App.prototype.stateIsOk = function(xmlhttp) {

    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

        return true;
    } else {

        return false;
    }

}

App.prototype.incbentity = function(inparameters) {

    var parameters = [],
        that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        result = "";

    parameters["that"] = that;
    parameters["element"] = document.getElementById("listEdsearchfield");
    parameters["event"] = "keyup";
    parameters["response"] = that.evsFchenge;
    parameters["type"] = "en";


    that.bind(parameters);
    document.getElementById("listEdattraddbutton").style.display = "none";


    parameters["element"] = document.getElementById("listEdeditbutton");
    parameters["event"] = "click";
    parameters["response"] = that.evsEdit;

    that.bind(parameters);

    parameters["element"] = document.getElementById("listEdattrdeletebutton");
    parameters["response"] = that.evsFdel;

    that.bind(parameters);


    parameters["url"] = "index/drawparseform";
    parameters["data"] = "formname=loop";
    parameters["response"] = that.response;
    parameters["inEl"] = document.getElementById("_in_sT");
    parameters["incbfunc"] = null;


    that.xht(parameters);

}

App.prototype.incbattribute = function(inparameters) {

    var parameters = [],
        that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        result = "";

    parameters["that"] = that;
    parameters["element"] = document.getElementById("listEdsearchfield");
    parameters["event"] = "keyup";
    parameters["response"] = that.evsFchenge;
    parameters["type"] = "at";


    that.bind(parameters);
    document.getElementById("listEdattraddbutton").style.display = "none";
    //that.bind(that, document.getElementById("listEdattraddbutton"), "click", that.evsFadd, "");

    parameters["element"] = document.getElementById("listEdeditbutton");
    parameters["event"] = "click";
    parameters["response"] = that.evsEdit;

    that.bind(parameters);

    parameters["element"] = document.getElementById("listEdattrdeletebutton");
    parameters["response"] = that.evsFdel;

    that.bind(parameters);

    parameters["url"] = "index/drawparseform";
    parameters["data"] = "formname=loop";
    parameters["response"] = that.response;
    parameters["inEl"] = document.getElementById("_in_sT");
    parameters["incbfunc"] = null;

    that.xht(parameters);

}

App.prototype.incbeNat = function(that, inId) {

    var xmlhttp = that.xmlhttp,
        url = "index/listEd",
        parameters = "",
        response = that.response,
        inEl = document.getElementById("_eNatav"),
        rprocc = null,
        incbfunc = that.incbeNatav;



    that.xht(url, parameters, response, inEl, rprocc, incbfunc);




    that.getchildById("_eNatpr", "listEdsearchfield").style.display = "none";
    //that.bind(that, document.getElementById("listEdsearchfield"), "keyup", that.evsFchenge, "");
    that.getchildById("_eNatpr", "listEdeditbutton").style.display = "none";
    that.getchildById("_eNatpr", "listEdattraddbutton").style.display = "none";
    that.getchildById("_in", "eNlistaTed").style.display = "none";
    //that.bind(that, document.getElementById("listEdattraddbutton"), "click", that.evsFadd, "");
    that.bind(that, that.getchildById("_eNatpr", "listEdattrdeletebutton"), "click", that.evsEnAtdel, {
        type: "at"
    });





}

App.prototype.incbeNatav = function(that, inId) {

    var xmlhttp = that.xmlhttp,
        url = "index/openlistAt",
        parameters = "",
        response = that.response,
        inEl = that.getchildById("_eNatav", "_in_sT"),
        rprocc = that.parseandgenerate,
        incbfunc = null;



    that.xht(url, parameters, response, inEl, rprocc, incbfunc);




    //document.getElementById("listEdsearchfield").style.display = "none";
    that.bind(that, that.getchildById("_eNatav", "listEdsearchfield"), "keyup", that.evsFchenge, {
        type: "at"
    });
    //document.getElementById("listEdattraddbutton").style.display = "none";
    that.bind(that, that.getchildById("_eNatav", "listEdattraddbutton"), "click", that.evsFadd, {
        type: "at"
    });
    that.bind(that, that.getchildById("_eNatav", "listEdattrdeletebutton"), "click", that.evsFdel, {
        type: "at"
    });








}




App.prototype.oneNtt = function(inparameters) {

    var parameters = [],
        that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        inEl = inparameters["inEl"];


    if (!that.stateIsOk(xmlhttp)) {
        return;
    }

    inEl.innerHTML = xmlhttp.responseText;
    
    parameters["that"] = that;
    parameters["event"] = "click";
    parameters["element"] = document.getElementById("eNlistaTed");
    parameters["response"] = that.evsEnAtEdit;
    
    that.bind(parameters);

    parameters["element"] = document.getElementById("eNsave");
    parameters["response"] = that.evEnttsave;

    that.bind(parameters);

}

App.prototype.onaTtr = function(inparameters) {

     var parameters = [],
        that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        inEl = inparameters["inEl"];


    if (!that.stateIsOk(xmlhttp)) {
        return;
    }

    inEl.innerHTML = xmlhttp.responseText;

    parameters["that"] = that;
    parameters["element"] = document.getElementById("aTsave");
    parameters["event"] = "click";
    parameters["response"] = that.evAttrsave;

    that.bind(parameters);


}

App.prototype.onEnttSave = function(that, inId) {

    document.getElementById("eNname").value = "";
    document.getElementById("eNtext").value = "";
    that.getchildById("_eNatpr", "_in_sT").innerHTML = "";

}

App.prototype.onAttrSave = function(that, inId) {

    document.getElementById("aTname").value = "";
    document.getElementById("aTtext").value = "";
}





App.prototype.response = function(parameters) {


    var that = parameters["that"],
        xmlhttp = that.xmlhttp,
        result = "",
        inEl = null,
        incbfunc = null;

    if (!that.stateIsOk(xmlhttp)) {
        return;
    }

    result = xmlhttp.responseText;


    inEl = parameters["inEl"];
    inEl.innerHTML = result;

    incbfunc = parameters["incbfunc"];

    if (incbfunc !== null) {

        incbfunc(parameters);
    }

}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



App.prototype.listEd = function(inparameters) {

    var parameters = [],
        that = inparameters["that"];


    parameters["url"] = "index/drawform";
    parameters["data"] = "formname=listEd";
    parameters["response"] = that.response;
    parameters["inEl"] = inparameters["inEl"];
    parameters["incbfunc"] = inparameters["incbfunc"];
    parameters["that"] = that;

    that.xht(parameters);

}


App.prototype.sSev = function(that, parent, inparameters, e) {

    var url = "",
        parameters = "",
        response = null,
        idEl = null,
        rprocc = null,
        incbfunc = null,
        searchfield = this.getchildById(parent.id, "listEdsearchfield"),
        searchstring = "",
        parentid = parent.id,
        v = "",
        that = this;


    searchstring = searchfield.value;
    v = inparameters["type"];


    if (v === "en") {
        url = "index/assumptionEn";
    } else if (v === "at") {
        url = "index/assumptionAt";
    }

    parameters = "searchstring=" + searchstring;
    response = that.response;
    idEl = that.getchildById(parentid, "_in_sT");
    rprocc = that.parseandgenerate;
    incbfunc = null;

    that.xht(url, parameters, response, idEl, rprocc, incbfunc);




}


App.prototype.getpresented = function(presented) {

    var i = 0,
        l = presented.length,
        result = [];

    for (i = 0; i < l; i++) {

        result.push(presented[i].title);

    }

    return result;
}

App.prototype.sortIsThere = function(toadd, presented) {

    var i = 0,
        j = 0,
        l = 0,
        l2 = 0,
        found = false,
        result = [];


    l = toadd.length;
    l2 = presented.length;



    for (i = 0; i < l; i++) {


        for (j = 0; j < l2; j++) {

            if (toadd[i] === presented[j]) {

                found = true;
                break;

            }

        }

        if (!found) {
            result.push(toadd[i]);

        } else {
            found = false;
        }

    }

    return result;

}

App.prototype.addarrtoarr = function(a, b) {

    var i = 0,
        l = b.length;

    for (i = 0; i < l; i++) {
        a.push(b[i]);
    }

    return a;
}

App.prototype.getchildById = function(parentid, childrenid) {

    var i = 0,
        v = document.getElementById(parentid).children,
        l = v.length;
    for (i = 0; i < l; i++) {
        if (v[i].id === childrenid) {
            return v[i];
        }
    }

    return null;
}

App.prototype.removenodesBychildId = function(parent, childids) {

    var i = 0,
        j = 0,
        l = parent.children.length,
        l2 = childids.length;

    for (i = 0; i < l; i++) {

        for (j = 0; j < l2; j++) {

            if (parent.children[i].title === childids[j]) {

                parent.removeChild(parent.children[i]);

                l--;
                continue;

            }
        }

    }


}



App.prototype.remove = function() {

}


App.prototype.saveEn = function(inparameters) {

    var parameters = [],
        that = inparameters["that"],
        inEl = that.getchildById("_eNatpr", "_in_sT"),
        n = document.getElementById("eNname").value,
        t = document.getElementById("eNtext").value,
        attr = that.getpresented(that.getchildById("_eNatpr", "_in_sT").children);

 
    parameters["that"] = that;
    parameters["url"] = "index/eNttInsert";
    parameters["response"] = that.response;
    parameters["inEl"] = inEl;
    parameters["incbfunc"] = that.onEnttSave;

    parameters["data"] = "name=" + n + " &text=" + t + "&attributes=" + attr.join();

    that.xht(parameters);


}


App.prototype.saveAttrb = function(inparameters) {

    var parameters = [],
        that = inparameters["that"],
        n = document.getElementById("aTname").value,
        t = document.getElementById("aTtext").value;

    parameters["data"] = "name=" + n + " &text=" + t;
    parameters["that"] = that;
    parameters["url"] = "index/aTtrInsert";
    parameters["response"] = that.onAttrSave;
    parameters["incbfunc"] = null;


    this.xht(parameters);


}

App.prototype.parseandgenerate = function(that, rt) {

    var v = {},
        result = "";

    if (rt.length !== 0) {
        v = JSON.parse(rt);
    } else {
        alert("no response");
    }

    result = that.generateselectlist(v);
    return result;


}

App.prototype.generateselectlist = function(v) {

    var i = 0,
        l = 0,
        result = "";


    l = v.length;

    for (i = 0; i < l; i++) {
        result += "<div title='" + v[i].id + "'><input type='checkbox'><label>" + v[i].name + "</label></input></div>";
    }

    return result;
}



App.prototype.open = function(url, parameters) {

    this.xmlhttp.open("POST", url, true);
    this.xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    this.xmlhttp.send(parameters);


}







App.prototype.xht = function(parameters) {

    var that = parameters["that"],
        response = parameters["response"];

    if (parameters["response"] !== null) {

        that.xmlhttp.onreadystatechange = function(e) {

            response(parameters);
        }
    }

    this.open(parameters["url"], parameters["data"]);


}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




App.prototype.checkboxevents = function(inparameters) {

    var i = 0,
        id = inparameters["id"],
        chboxes = document.getElementById(id).children,
        l = chboxes.length,
        parameters = [],
        that = inparameters["that"];


    parameters["that"] = that;
    parameters["event"] = "click";
    parameters["response"] = that.evsChbox;
    parameters["id"] = inparameters["id"];

    for (i = 0; i < l; i++) {

        if (chboxes[i].type === "checkbox") {

            parameters["element"] = chboxes[i];
            that.bind(parameters);

        }
    }
}

App.prototype.checkboxclear = function(that, id) {

    var i = 0,
        chboxes = document.getElementById(id).children,
        l = chboxes.length;


    for (i = 0; i < l; i++) {
        if (chboxes[i].type === "checkbox") {

            chboxes[i].checked = true ? false : false;


        }
    }
}

App.prototype.checkboxget = function(that) {

    var i = 0,
        chboxes = document.getElementById("inchbox").children,
        l = chboxes.length;


    for (i = 0; i < l; i++) {

        if (chboxes[i].type === "checkbox") {

            if (chboxes[i].checked === true) {

                return i;
            }
        }

    }
    return -1;

}

App.prototype.checkboxgetAll = function(that, chboxes) {

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









var b = new App();