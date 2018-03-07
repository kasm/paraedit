/**
 * Created by Dima on 09.12.2017.
 */
document.getElementById('t1').innerHTML='ddd';
var Doc = require('./doc.js');
//var Line = require('./els/line.js');

var elfuncs = [];

function isSnapPnt(pnt) {
    return (typeof pnt[0] === 'string')
}

function isSnapPntN(el, n) {
    isSnapPnt(el.pnts[n]);
}

function getSnaps(doc) { var rez={};
    for (el_id in doc.els) {

    }
}

var doctext =
    "ls1.0=point(270,130)\n\
ls1.1=point(120, 50)\n\
ls1=lineseg(ls1.0,ls1.1)\n\
ls2.0=point(50,50)\n\
ls2.1=point(100,100)\n\
ls2=lineseg(ls2.0,ls2.1)\n\
\ls7.0=point(400,100)\n\
\ls7.1=point(400,150)\n\
\ls7=lineseg(ls7.1,ls7.0)\n\
\ls7.1=mid(ls2.0,ls2.1)\n\
p0=point(10,120)\n\
p0.0=eq(ls1.1.0)\n\
ls3.0=point(260,40)\n\
\ls3.1=point(100,280)\n\
\ls3=lineseg(ls3.0,ls3.1)\n\
\p1=point(10,10)\n\
\p1=int(ls1,ls3)\n\
\ls4=lineseg(p0,p1)\n\
\ls5.1=point(100,300)\n\
\ls5.1=per(ls3.1,ls1)\n\
\ls5=lineseg(ls3.1,ls5.1)\n\
\c1.c=point(100,100)\n\
\c1=circle(c1.c,50)\n\
\l1=line(ls3.0,c1.c)\n\
\l1=coin(ls3.0,c1.c)\n\
\c2.c=point(100,200)\n\
\c2=circle(c2.c,30)\n\
\l2=line(p0,p1)\n\
\l2=coin(ls3.0,ls3.1)\n\
\c2=circle_TTRS(l1,1,l2,1,30)\n\
ls2.1=mid(ls1.0,ls1.1)\n\
\ls6.0=point(400,20)\n\
\ls6.1=point(400,50)\n\
\ls6=lineseg(ls6.0,ls6.1)\n\
\l8.0=point(0,100)\n\
\l8.1=point(400,150)\n\
\l8=line(l8.0,l8.1)\n\
\ls11.0=point(300,300)\n\
\ls11.1=point(400,300)\n\
\ls11=lineseg(ls11.0,ls11.1)\n\
\ls6.1=mid(ls7.0,ls7.1)";

var splitLines = function (txt) {

}

var docTextArray = doctext.split('\n');
var doc2={objs: {},
pnts: {},
    linesegs: {},
    lines: {},
    circles: {},
    scalars: {},
    docData: [],
    curr: {}
};

var Editor = function (canvasElement) {
    document.getElementById('t1').innerHTML='ddd';
    var Parser = require('./parser.js');
    parser = Parser(doc2);
    parser.splitter(doctext);
    //parser.parseSplitted();
    //parser.parseText(doctext);


    //doc2.docData = parser.splitter(doctext);
    var gl = require('./geom_links')();

    document.getElementById('t1').innerHTML='ddd';
    var curr = {toRedraw: true, data: []};
    var boldIds = [];

    elfuncs['line'] = require('./elements/line.js')();
    elfuncs['lineseg'] = require('./elements/lineseg.js')();
    elfuncs['circle'] = require('./elements/circle.js')();

    var linkParams = { // not used
        mid: ['point', 'element'],
        int: ['point', 'element', 'element'],
        per: ['point', 'point', 'element'], // result point = source point per element
        circle_TTRS: ['element', 'element', '']
    };


    var geom = require('./geom.js')([300, 300]);
    var gc = require('./geom_core.js')();
    var gl = require('./geom_links.js')();

    var doc = Doc(elfuncs, doc2);
    var els = doc.getEls();

    var cvc = canvasElement.getContext('2d');
    var coords = canvasElement.getBoundingClientRect();
    var holderSize = 5;
    var selectedPoint;
    var editorMode = '';
    var editorLookFor = '';
    var editorFuncs = []; // [[func, data], ....]
    var objectUnder = function(x, y) {
        var id_rez = '';
        for (id in doc.circles) {
            var r_current = Math.sqrt((doc.circles[id][0][0]-x)*(doc.circles[id][0][0]-x) + (doc.circles[id][0][1]-y)*(doc.circles[id][0][1]-y));
            var e = Math.abs(r_current - doc.circles[id][1]);
            if (e < 5) {
                id_rez = id;
            }
        }
        return id_rez;
        };

    var createEmptyElementWithRulersAndTrackerFunctions = function (id, type) { var i;
        var el = parser.createElementAndPoints(curr.id, curr.type, elfuncs[curr.type].params);
        curr.rulers = elfuncs[curr.type].getRulers(curr.rulers, el.ob);
        for (i=0; i<curr.rulers.length; i++) {
            var pntid = id + '.' + elfuncs[curr.type].rulerNames[i];
            doc.pnts[pntid] = curr.rulers[i];
            /*
            doc.docObjs[pntid] = {
                id: id,
                type: 'point',
                main: [],
                mainIds: [],
                query: '',
                ob: doc.pnts[pntid]
            }
            */
        }

        curr.funcs = elfuncs[curr.type].editorArray(el.ob, curr.rulers);
        var i=5;

    };

    var getSelectedRuler = function (x, y) { var rez = {selected: false, iRuler: 0};
        for (i=0; i<curr.rulers.length; i++) {
            diffx = Math.abs(curr.rulers[i][0] - x);
            diffy = Math.abs(curr.rulers[i][1] - y);
            if (diffx < holderSize && diffy < holderSize) {
                curr.iRuler = i;
                rez.iRuler = i;
                rez.selected = true;
                return rez;
            }
        };
        return rez;
    } // waitRuler

    var getSelectedEl = function (x, y) { rez = {selected: false, id: 0};
        for (id in doc.docObjs) {
            var el = doc.docObjs[id];
            if (el.type != 'point') {
                if (elfuncs[el.type].isOver(el.ob, x, y)) {
                    rez.selected = true;
                    rez.id = el.id;
                }
            }
        }
        return rez;
    };



    var getSelectedPointId = function (x, y) { rez = '';
        var i;
        for (id in doc.pnts) {
            diffx = Math.abs(doc.pnts[id][0] -x);
            diffy = Math.abs(doc.pnts[id][1] -y);
            if (diffx < holderSize && diffy < holderSize) {
                return id;
            }
        }
        return rez;
    }


    var mouseClick2 = function (e) {

        var x = parseInt(e.clientX - coords.left);
        var y = parseInt(e.clientY - coords.top);
        if (y<0) return 0;
        if (editorMode == 'entering') {
            curr.stage++;
            if (elfuncs[curr.type].ways[0].length == curr.stage) {
                editorMode = '';
                curr.funcs = [];
                curr.rulers = [];
                return 0;
            };
        } // if entering

        if (editorMode == 'waitRuler') {
            //selectedPoint = '';
            for (i=0; i<curr.rulers.length; i++) {
                diffx = Math.abs(curr.rulers[i][0] - x);
                diffy = Math.abs(curr.rulers[i][1] - y);
                if (diffx < holderSize && diffy < holderSize) {
                    curr.iRuler = i;
                    editorMode = 'editing';
                    return 0;
                }
            };
        } // waitRuler

        if (editorMode == 'editing') {
            editorMode = '';
            curr.funcs = [];
            curr.rulers = [];
        }

        if (editorMode == 'enteringLink') {
            if (curr.type == 'mid') {
                if (curr.stage ==0) {
                    var id1 = getSelectedPointId(x, y); // dirty hack we showing only rulers of selected element but cycle over all points of document
                    // this is because we cant get Ids of element's points linked to rulers
                    // because we not passing element's id to gerRulers function
                    // and we not storing points ids in element at all !!!
                    if (id1.length > 0) {
                        curr.data.rezid = id1;
                        curr.stage++;
                        return 0;
                    };
                };
                if (curr.stage == 1) {
                    var r = getSelectedEl(x, y);
                    if (r.selected) {
                        debugger;
                        var line = {rez: curr.data.rezid, func: 'mid', params: r.id,
                            params2: {query: '_lineseg', main: [doc.docObjs[r.id].ob], ids: [r.id]}};
                        parser.parseLine(line);
                        editorMode = '';
                        curr.rulers = [];
                        curr.stage = 0;
                    }
                }
            } // mid

            if (curr.type == 'int') {
                if (curr.stage == 0) {
                    var id1 = getSelectedPointId(x, y);
                    if (id1.length>0) {
                        curr.data.rezid = id1;
                        curr.stage++;
                        return 0;
                    }
                };
                if (curr.stage == 1){
                    var r = getSelectedEl(x,y);

                    if (r.selected) {
                        curr.data.click1 = [x, y];
                        curr.data.el1id = r.id;
                        curr.stage++;
                        curr.dob1 = doc.docObjs[r.id];
                        curr.q0 = '_' + doc.docObjs[r.id].type;
                        return 0;
                    }
                };
                if (curr.stage == 2) {
                    var r = getSelectedEl(x, y);
                    if (r.selected) {
                        curr.q1 = '_' + doc.docObjs[r.id].type;
                        var dob2 = doc.docObjs[r.id];
                        if (dob2.type == 'circle') {
                            curr.data.click1 = [x, y];
                        };

                        var isCircle = (dob2.type == 'circle') || (doc.docObjs[curr.data.el1id].type == 'circle');
                        if (isCircle) {
                            var q = 'points_int' + curr.q0 + curr.q1;
                            var ps =gl[q](curr.dob1.ob, dob2.ob);
                            var d1 = gc.scalar_len_point_point(ps[0], curr.data.click1);
                            var d2 = gc.scalar_len_point_point(ps[1], curr.data.click1);
                            if (d1 < d2) { s = 0} else {s=1;}
                        } else {
                            //var q = ''
                            s = '';
                        }

                        var line = {rez: curr.data.rezid, func: 'int', params: [curr.data.el1id, r.id],
                            params2: {
                                query: '_' + doc.docObjs[curr.data.el1id].type + '_' + doc.docObjs[r.id].type,
                                main: [doc.docObjs[curr.data.el1id].ob, doc.docObjs[r.id].ob, s], ids: [curr.data.el1id, r.id]}};
                        parser.parseLine(line);
                        editorMode = '';
                        curr.stage = 0;
                        curr.rulers = [];
                        return 0;
                    }
                } // stage 2
            } // int

            if (curr.type == 'tan2') {
                if (curr.stage == 0) {
                    debugger;
                    var r = getSelectedEl(x,y);
                    if (r.id.length > 0) {
                        curr.data.rezid = r.id;
                        curr.stage++;
                        return 0;
                    }
                };
                if (curr.stage == 1) {
                    var r = getSelectedEl(x,y);
                    if (r.selected) {
                        //curr.data.click1 = [x, y];
                        curr.data.el0id = r.id;
                        curr.stage++;
                        curr.dob0 = doc.docObjs[r.id];
                        curr.q0 = '_' + doc.docObjs[r.id].type;
                        return 0;
                    }
                }; // stage 1
                if (curr.stage == 2) {
                    var r = getSelectedEl(x,y);

                    if (r.selected) {
                        //curr.data.click1 = [x, y];
                        curr.data.el1id = r.id;
                        curr.stage++;
                        curr.dob1 = doc.docObjs[r.id];
                        curr.q1 = '_' + doc.docObjs[r.id].type;
                        return 0;
                    }
                }; // stage 2
                if (curr.stage == 3) {
                    var qq = '_' + doc.docObjs[curr.data.el0id].type + '_' + doc.docObjs[curr.data.el1id].type;
                    var query = qq;
                    //var query = doc.docObjs[curr.data.rezid].type + '_tan2' + qq;

                    var cs = gl['circles_tan2' + qq + '_radius'](doc.docObjs[curr.data.el0id].ob, doc.docObjs[curr.data.el1id].ob, doc.docObjs[curr.data.rezid].ob[1]);
                    var dd = 100000000; var di;
                    for (i = 0; i<cs.length; i++) {
                        var d = gc.distance_point_point(cs[i][0], [x,y]);
                        if (d < dd) {
                            dd = d;
                            di = i;
                        }
                    }; // i
                    var m = [doc.docObjs[curr.data.el0id].ob, doc.docObjs[curr.data.el1id].ob, di];


                    var line = {rez: curr.data.rezid, func: 'tan2', params: [curr.data.el0id, curr.data.el1id],
                        params2: {
                            query: query, //'_' + doc.docObjs[curr.data.el1id].type + '_' + doc.docObjs[r.id].type,
                            main: m, //[doc.docObjs[curr.data.el1id].ob, doc.docObjs[r.id].ob, s], ids: [curr.data.el1id, r.id]
                            ids: [curr.data.el0id, curr.data.el1id]
                            }};
                    parser.parseLine(line);
                    editorMode = '';
                    curr.stage = 0;
                    curr.rulers = [];
                    return 0;





                }; // stage 3, last



            } // tan2


        } // entering Link

    }; // mouse click2


    var mouseMove = function (e) {
        var x = parseInt(e.clientX - coords.left);
        var y = parseInt(e.clientY - coords.top);
        curr.x = x; curr.y = y;

        var tt = document.getElementById('t1'); var s='<font size="2">';
        var k = Object.keys(doc.docObjs);
        s+='curr' + JSON.stringify(curr) + "<br>";
        s+='editorMode:'+editorMode+'<br>';
        s+='editorStage:'+editorStage+'<br>';

        if (editorMode == 'entering') {
            var ef = elfuncs[curr.type];
            var iRuler = ef.ways[0][curr.stage];
            curr.rulers[iRuler][0] = x;
            curr.rulers[iRuler][1] = y;
            curr.funcs[iRuler][0].apply(this, curr.funcs[iRuler][1]);
        };

        var isover0 = '';

        if (editorMode == 'enteringLink') {
            for (id in doc.docObjs) {
                var el = doc.docObjs[id];
                if (el.type != 'point') {
                    if (elfuncs[el.type].isOver(el.ob, x, y)) {
                        isover0 = el.id;
                        curr.rulers = [];
                        curr.id = el.id;
                        elfuncs[el.type].getRulers(curr.rulers, el.ob);
                    }
                }
            }
        }

        if (editorMode == '') {
            for (id in doc.docObjs) {
                var el = doc.docObjs[id];
                if (el.type != 'point') {
                    if (elfuncs[el.type].isOver(el.ob, x, y)) {
                        isover0 = el.id;
                        curr.rulers = [];
                        curr.id = el.id;
                        elfuncs[el.type].getRulers(curr.rulers, el.ob);
                        curr.funcs = elfuncs[el.type].editorArray(el.ob, curr.rulers);
                        editorMode = 'waitRuler';
                        break;
                    }
                }
            }
        };

        var isover1 = '';

        if (editorMode == 'waitRuler' || editorMode == 'enteringLink') {
            for (id in doc.docObjs) {
                var el = doc.docObjs[id];
                if (el.type != 'point') {
                    if (elfuncs[el.type].isOver(el.ob, x, y)) {
                        isover1 = el.id; break;
                    };
                }
            }
        };

        if (editorMode == 'waitRuler' && isover1 != curr.id) {
            curr.rulers = [];
            curr.funcs = [];
            editorMode = '';
        };
        if (editorMode == 'enteringLink' && isover1 != curr.id) {
            curr.rulers = [];
            curr.funcs = [];
        };


        if (editorMode == 'editing') {
            var ef = elfuncs[curr.type];
            var f = curr.funcs[curr.iRuler][0];
            curr.rulers[curr.iRuler][0] = x;
            curr.rulers[curr.iRuler][1] = y;
            var params = curr.funcs[curr.iRuler][1];
            f.apply(this, params);
        }
        doc.recalcAllObjs();
        if (curr.toRedraw) ret.redraw();
    } // mouse move

    window.addEventListener('click', mouseClick2, false);
    window.addEventListener('mousemove', mouseMove, false);
    console.log('Edi');
    cvc.fillStyle = "#FFFFFF";
    cvc.strokeStyle = "#000000";
    cvc.strokeStyle='green';
    cvc.lineWidth = 1;
    var c1var = canvasElement.getBoundingClientRect();
    var editorStage = 0;

    var ret = {
        test: function () {
            alert('ttest');
        },
        lineseg: function() {
            curr.rulers = [];
            curr.type = 'lineseg';
            curr.stage = 0;
            editorMode = 'entering';
            curr.id = 'ls00' + Object.keys(doc.linesegs).length;
            createEmptyElementWithRulersAndTrackerFunctions(curr.id, curr.type);
        },
        circle_old: function () {
            //editorMode = 'circle0';
            editorMode = 'circle0b';
            editorStage = 0;
        },
        circle: function () {
            curr.rulers = [];
            curr.type = 'circle';
            curr.stage = 0;
            editorMode = 'entering';
            curr.id = 'c100' + Object.keys(doc.circles).length;
            createEmptyElementWithRulersAndTrackerFunctions(curr.id, curr.type);
        },
        line: function () {
            curr.rulers = [];
            curr.type = 'line';
            curr.stage = 0;
            editorMode = 'entering';
            curr.id = 'ln00' + Object.keys(doc.lines).length;
            createEmptyElementWithRulersAndTrackerFunctions(curr.id, curr.type);

        },
        mid: function () {
            curr.data = {};
            curr.type = 'mid';
            curr.stage = 0; // first stage - result point, second stage - lineseg
            editorMode = 'enteringLink';
        },
        int: function () {
            curr.data = {};
            curr.type = 'int';
            curr.stage = 0; // first stage - result point, second stage - lineseg
            editorMode = 'enteringLink';
        },
        tan2: function () {
            curr.data = {};
            curr.type = 'tan2';
            curr.stage = 0; // first stage - result point, second stage - lineseg
            editorMode = 'enteringLink';
        },

        getdoc: function () {
            return doc;
        },
        redraw: function () { var els = doc.getToRedraw(); var pnts = doc.getPnts();
            var i;
            var tt = document.getElementById('t1'); var s='<font size="2">';
            var k = Object.keys(doc.docObjs);
            s+='curr' + JSON.stringify(curr) + "<br>";
            s+='editorMode:'+editorMode+'<br>';
            s+='editorStage:'+editorStage+'<br>';
            for (i=0; i<k.length; i++) {
                s+= JSON.stringify(doc.docObjs[k[i]]) + '<br>';
            };
            tt.innerHTML=s+'</>';

            var k = 5;
            cvc.fillStyle = "#FFFFFF";
            cvc.strokeStyle = "#000000";
            cvc.strokeStyle='green';
            cvc.lineWidth = 1;
            cvc.fillRect(0,0,c1var.width,c1var.height);
            var elrec;
            for (i=0; i<els.length; i++) {
                elrec = els[i];
                if (elrec.id == boldIds[0]) {
                    cvc.lineWidth = 3;
                }
                elfuncs[elrec.type].draw(cvc, elrec.ob);
                cvc.lineWidth = 1;
            };

            cvc.beginPath();
            cvc.fillStyle = '#00f';
            for (pntid in pnts) {
                p = pnts[pntid];
                cvc.fillText(pntid+'('+p[0]+','+p[1]+')', p[0], p[1]);
            };
            for (elid in els) {
                el = els[elid]; x=0; y=0; count = 0;
                for (p in el.pnts) {
                    count++;
                    x += el.pnts[p][0];
                    y += el.pnts[p][1];
                };
                x = x/count - 15;
                y = y/count;
                cvc.fillText(elid, x, y);
            }


            //var ps = doc.getPnts();
            var ps = curr.rulers;
            for (i in ps) {
                cvc.moveTo(ps[i][0] - holderSize, ps[i][1] - holderSize);
                cvc.lineTo(ps[i][0] + holderSize, ps[i][1] - holderSize);
                cvc.lineTo(ps[i][0] + holderSize, ps[i][1] + holderSize);
                cvc.lineTo(ps[i][0] - holderSize, ps[i][1] + holderSize);
                cvc.lineTo(ps[i][0] - holderSize, ps[i][1] - holderSize);
            }
            cvc.stroke();
        }, // redraw
        recalc: function () { var el; var i; var tpnt; var els = doc.getEls();
        }
    }
return ret;
};

var editor = Editor(document.getElementById('c1'));
//editor.recalc();
editor.getdoc().fillElPnts();
editor.getdoc().recalcAllObjs();
editor.redraw();
window.editor = editor;