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

var doctext1 =
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

var doctext = '';
var splitLines = function (txt) {

}

var docTextArray = doctext.split('\n');
var doc2={objs: {},
    pnts: {},
    linesegs: {},
    plines: {},
    lines: {},
    circles: {},
    scalars: {},
    docData: [],
    curr: {},
    doctext: doctext,
    doclines: [],
    docTest2: []
};

var Editor = function (canvasElement) {
    document.getElementById('t1').innerHTML='ddd';


    var Parser = require('./parser.js');
    var doc = Doc(elfuncs, doc2);
    parser = Parser(doc);
    parser.splitter(doctext);
    //parser.parseSplitted();
    //parser.parseText(doctext);
    var status = {
        drawPointNames: true
    }


    //doc2.docData = parser.splitter(doctext);
    var gl = require('./geom_links')();

    document.getElementById('t1').innerHTML='ddd';
    var curr = {toRedraw: true, data: [], tpnts: []};
    var boldIds = [];

    elfuncs['line'] = require('./elements/line.js')();
    elfuncs['lineseg'] = require('./elements/lineseg.js')();
    elfuncs['circle'] = require('./elements/circle.js')();
    elfuncs['point'] = require('./elements/point.js')();
    elfuncs['pline'] = require('./elements/MultiLineSeg')();

    var linkParams = { // not used
        mid: ['point', 'element'],
        int: ['point', 'element', 'element'],
        per: ['point', 'point', 'element'], // result point = source point per element
        circle_TTRS: ['element', 'element', '']
    };


    var geom = require('./geom.js')([300, 300]);
    var gc = require('./geom_core.js')();
    var gl = require('./geom_links.js')();



    var cvc = canvasElement.getContext('2d');
    var coords = canvasElement.getBoundingClientRect();
    var holderSize = 5;
    var editorMode = 'wait';
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

    var enteringMouseClick = function (e) {
        curr.stage++;
        if (elfuncs[curr.type].ways[0].length == curr.stage) {
            editorMode = 'wait';
            curr.funcs = [];
            curr.rulers = [];
            curr.stage = 0;
            return 0;
        };
    }

    var enteringMouseMove = function(x, y) {
        var ef = elfuncs[curr.type];
        var iRuler = ef.ways[0][curr.stage];
        curr.rulers[iRuler][0] = x;
        curr.rulers[iRuler][1] = y;
        curr.funcs[iRuler][0].apply(this, curr.funcs[iRuler][1]);
    }


    var mouseClick2 = function (e) {

        var x = parseInt(e.clientX - coords.left);
        var y = parseInt(e.clientY - coords.top);
        if (y<0 || x>600) return 0;
        if (editorMode == 'entering') {
            enteringMouseClick(e);
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
            editorMode = 'wait';
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
                        var line = {rez: curr.data.rezid, func: 'mid', params: r.id,
                            params2: {query: '_lineseg', main: [doc.docObjs[r.id].ob], ids: [r.id]}};
                        parser.parseLine(line);
                        editorMode = 'wait';
                        curr.rulers = [];
                        curr.stage = 0;
                        doc.doclines.push({rez: curr.data.rezid, func: 'mid', params: [r.id]})

                        doc.recalcAllObjs();
                        ret.redraw();
                        return 0;
                    }
                } // stage 1
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
                    curr.data.el2id = r.id;
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
                                query: '_' + doc.docObjs[curr.data.el1id].type + '_' + doc.docObjs[r.id].type + '_scalar',
                                main: [doc.docObjs[curr.data.el1id].ob, doc.docObjs[r.id].ob, s.toString(10)],
                                ids: [curr.data.el1id, r.id]}};
                        parser.parseLine(line);
                        editorMode = 'wait';
                        curr.stage = 0;
                        curr.rulers = [];
                        debugger;
                        doc.doclines.push({rez: curr.data.rezid, func: 'int', params: [curr.data.el1id, curr.data.el2id, s.toString(10)]});

                        doc.recalcAllObjs();
                        ret.redraw();

                        return 0;
                    }

                } // stage 2
            } // int

            if (curr.type == 'tan21') {
                if (curr.stage == 0) {
                    var r = getSelectedEl(x,y);
                    if (r.id.length > 0) {
                        curr.data.rezid = r.id;
                        curr.rezob = doc.docObjs[id];
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

                        curr.qq = '_' + curr.dob0.type + '_' + curr.dob1.type;
                        var r = curr.rezob.ob[1];
                        var tpnts = gc.points_univers(curr.dob0.ob, curr.dob1.ob, r, curr.qq, 'tan');
                        curr.tpnts = tpnts;
                        curr.r = curr.rezob.ob[1];

                        doc.recalcAllObjs();
                        ret.redraw();
                        return 0;
                    }
                }; // stage 2
                if (curr.stage == 3) {
                    /*                                      TRYED TO CREATE LINK IN ONE PLACE
                                but it still must be parsed, because there is text input

                    var d = 100000000; di = 0;
                    for (i = 0; i<curr.tpnts.length; i++) {
                        var dt = gc.distance_point_point(curr.tpnts[i], [x, y]);
                        if (dt < d) { d = dt; di = i; };
                    };
                    // will pass to circle_universe - no need to pass radius
                    var q2 = '_' + doc.docObjs[curr.data.el0id].type + '_' + doc.docObjs[curr.data.el1id].type;
                    var m = [doc.docObjs[curr.data.rezid].ob, doc.docObjs[curr.data.el0id].ob, doc.docObjs[curr.data.el1id].ob, q2, di, 'tan'];
                    doc.docObjs[curr.data.rezid].mainIds = [curr.data.el0id, curr.data.el1id];
                    doc.docObjs[curr.data.rezid].query = 'circle_univers';
                    doc.docObjs[curr.data.rezid].mains = m;
                    doc.docObjs[curr.data.rezid].func = gl['circle_univers'];
                    editorMode = 'wait';
                    curr.stage = 0;
                    curr.rulers = [];
                    curr.tpnts = []
                    doc.doclines.push({rez: curr.data.rezid, func: 'tan21', params: [curr.data.el0id, curr.data.el1id, di]});
                    //doc.doclines.push({rez: curr.data.rezid, func: 'tan2', params: [curr.data.el0id, curr.data.el1id, gc.selectors3.tan[di]]});
                    //doc.doclines.push({rez: curr.data.rezid, func: 'tan2', params: [curr.data.el0id, curr.data.el1id, JSON.stringify(gc.selectors3.tan[di])]});
                    return 0;
*/





                    var d = 100000000; di = 0;
                    for (i = 0; i<curr.tpnts.length; i++) {
                        var dt = gc.distance_point_point(curr.tpnts[i], [x, y]);
                        if (dt < d) { d = dt; di = i; };
                    };
                        // will pass to circle_universe - no need to pass radius
                    var m = [doc.docObjs[curr.data.el0id].ob, doc.docObjs[curr.data.el1id].ob, di, 'tan'];
                    var q2 = '_' + doc.docObjs[curr.data.el0id].type + '_' + doc.docObjs[curr.data.el1id].type


                    var line = {rez: curr.data.rezid, func: 'tan21',
                        params: [curr.data.el0id, curr.data.el1id],
                        params2: {
                            query: 'query', //'_' + doc.docObjs[curr.data.el1id].type + '_' + doc.docObjs[r.id].type,
                            main: m, //[doc.docObjs[curr.data.el1id].ob, doc.docObjs[r.id].ob, s], ids: [curr.data.el1id, r.id]
                            ids: [curr.data.el0id, curr.data.el1id]
                        }};
                    parser.parseLine(line);
                    editorMode = 'wait';
                    curr.stage = 0;
                    curr.rulers = [];
                    curr.tpnts = []
                    doc.doclines.push({rez: curr.data.rezid, func: 'tan21', params: [curr.data.el0id, curr.data.el1id, di]});
                    //doc.doclines.push({rez: curr.data.rezid, func: 'tan2', params: [curr.data.el0id, curr.data.el1id, gc.selectors3.tan[di]]});
                    //doc.doclines.push({rez: curr.data.rezid, func: 'tan2', params: [curr.data.el0id, curr.data.el1id, JSON.stringify(gc.selectors3.tan[di])]});
                    doc.recalcAllObjs();
                    ret.redraw();

                    return 0;



                } // stage 3
            } // tan21
            if (curr.type=='per_ls') {
                if (curr.stage == 0) {
                    var r = getSelectedEl(x,y);
                    if (r.id.length > 0) {
                        curr.data.rezid = r.id;
                        curr.rezob = doc.docObjs[r.id];
                        curr.stage++;
                        return 0;
                    }
                }
                if (curr.stage == 1) {
                    var r = getSelectedEl(x, y);
                    if (r.id.length > 0) {
                        curr.data.el0id = r.id;
                        curr.ob = doc.docObjs[r.id];
                        var m = [curr.ob];
                        var line = {rez: curr.data.rezid, func: 'per_ls', params: [curr.ob.id]};
                        line.params2 = parser.parseParam2(line.params);
                        parser.parseLine(line);
                        editorMode = 'wait';
                        curr.stage = 0;
                        curr.rulers = [];
                        doc.doclines.push(line);

                        doc.recalcAllObjs();
                        ret.redraw();
                        return 0;
                    } // if r.id.lenght > 0
                } // stage 1

            } // per ls
        } // entering Link
    }; // mouse click2


    var mouseMove = function (e) {
        var x = parseInt(e.clientX - coords.left);
        var y = parseInt(e.clientY - coords.top);
        if (x>620 || y<0) return 0;
        curr.x = x; curr.y = y;

        var tt = document.getElementById('t1'); var s='<font size="2">';
        var k = Object.keys(doc.docObjs);
        s+='curr' + JSON.stringify(curr) + "<br>";
        s+='editorMode:'+editorMode+'<br>';
        s+='editorStage:'+editorStage+'<br>';
        s+='x='+x+'; y='+y;

        if (editorMode == 'entering') {
            enteringMouseMove(x, y);
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

        if (editorMode == 'wait') {
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
            editorMode = 'wait';
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
    var textAreaChanged = false;

    var ret = {
        showPointTextsToggle: function () {
            var t = document.getElementById('showPointTextsToggle');
            if (status.drawPointNames) {
                t.style = 'border: 2px; border-color: black; border-style: solid;'
            } else {
                t.style = 'border: 0px'
            }
            status.drawPointNames = !status.drawPointNames;
            this.redraw();
        },
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
            curr.type = 'tan21';
            curr.stage = 0; // first stage - result point, second stage - lineseg
            editorMode = 'enteringLink';
        },
        per_ls: function () {
            curr.data = {};
            curr.type = 'per_ls';
            curr.stage = 0;
            editorMode = 'enteringLink';
        },
        clearOb: function (ob) {
            for (id in ob) {
                if (ob.hasOwnProperty(id)) {
                    delete ob[id];
                }
            }
        },
        textAreaChanged: function () {
            textAreaChanged = true;
        },
        textAreaLeave: function () {
            if (textAreaChanged) this.save();
            textAreaChanged = false;
        },
        save: function () {
            var s = document.getElementById('t1').value;
            for (var id in doc.docObjs){
                if (doc.docObjs.hasOwnProperty(id)){
                    delete doc.docObjs[id];
                }
            };
            this.clearOb(doc.pnts);
            this.clearOb(doc.lines);
            this.clearOb(doc.linesegs);
            this.clearOb(doc.plines);
            this.clearOb(doc.circles);
            this.clearOb(doc.scalars);
            this.clearOb(doc.curr);
            this.clearOb(doc.pnts);
            doc.doclines.length = 0;
            doc.doctext = s;
            editorMode = 'wait';
            parser.splitter(s);
            parser.parser();
        },
        'showHelp': function () {
            var help = document.getElementById('helpModal');
            help.style.display = 'block';
        },
        'closeHelp': function () {
            var help = document.getElementById('helpModal');
            help.style.display = 'none';
        },

        getdoc: function () {
            return doc;
        },
        redraw: function () { var els = doc.getToRedraw(); var pnts = doc.getPnts();
            var i;
            var tt = document.getElementById('status'); var s='<font size="2">';
            var k = Object.keys(doc.docObjs);
            s+='curr' + JSON.stringify(curr) + "<br>";
            s = '';
            s+='editorMode:'+editorMode+'<br>';
            s+='editorStage:'+curr.stage+'<br>';
            for (i=0; i<k.length; i++) {
                //s+= JSON.stringify(doc.docObjs[k[i]]) + '<br>';
            };
            tt.innerHTML=s; //+'</>';
            /*
            s = '';
            var as = doc.toTextEls();
            var as2 = doc.toTextLinks();
            for (i=0; i<as.length; i++) { s+=as[i]+'\n'; };
            for (i=0; i<as2.length; i++) { s+=as2[i]+'\n'; };
            */
            s = '';
            var tt = document.getElementById('t1');// var s='<font size="2">';

            var as = doc.toText();
            for (i=0; i<as.length; i++) { s+=as[i]+'\n'; };
            tt.value=s;

            var k = 5;
            cvc.fillStyle = "#FFFFFF";
            cvc.strokeStyle = "#000000";
            cvc.strokeStyle='green';
            cvc.lineWidth = 1;
            cvc.fillRect(0,0,c1var.width,c1var.height);
            var elrec;

            /*
            for (i=0; i<els.length; i++) {
                elrec = els[i];
                if (elrec.id == boldIds[0]) {
                    cvc.lineWidth = 3;
                }

                elfuncs[elrec.type].draw(cvc, elrec.ob);
                cvc.lineWidth = 1;
            };
            */
            cvc.fillStyle = '#00f';
            for (obId in doc.docObjs) {
                var dob = doc.docObjs[obId];
                if (dob.layer == 'f') continue;
                if (dob.type == 'point') {
                    if (status.drawPointNames) {
                        var p = dob.ob;
                        cvc.fillText(obId+'('+Math.round(p[0])+','+Math.round(p[1])+')', p[0], p[1]);
                    }
                };


                if (!parser.isElem(doc.docObjs[obId].type)) continue;
                elrec = doc.docObjs[obId];
                elfuncs[doc.docObjs[obId].type].draw(cvc, elrec.ob);
                el = dob.ob; x=0; y=0; count = 0;
                for (p in el.pnts) {
                    count++;
                    x += el.pnts[p][0];
                    y += el.pnts[p][1];
                };
                x = x/count - 15;
                y = y/count;
                cvc.fillText(obId, x, y);
            };



            if (editorMode == 'enteringLink' && curr.type == 'tan21' && curr.stage == 3){
                var i; var di;
                var d = 100000000; di = 0;
                for (i = 0; i<curr.tpnts.length; i++) {
                    var dt = gc.distance_point_point(curr.tpnts[i], [curr.x, curr.y]);
                    if (dt < d) { d = dt; di = i; };
                };
                for (i=0; i<curr.tpnts.length; i++){
                    cvc.strokeStyle='green';
                    cvc.lineWidth = 1;


                    if (i == di) {
                        cvc.strokeStyle = 'blue';
                        cvc.lineWidth = 3;

                    }
                    elfuncs['circle'].draw(cvc, [curr.tpnts[i], curr.r]);

                };


            }

            cvc.beginPath();
            cvc.fillStyle = '#00f';

            /*
            if (status.drawPointNames) {


                for (pntid in pnts) {
                    p = pnts[pntid];
                    cvc.fillText(pntid+'('+Math.round(p[0])+','+Math.round(p[1])+')', p[0], p[1]);
                };
            }
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
            */


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

//editor.getdoc().fillElPnts();
//editor.getdoc().recalcAllObjs();
//editor.redraw();
window.editor = editor;