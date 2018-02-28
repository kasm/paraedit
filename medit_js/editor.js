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
    parser.parseSplitted();
    //parser.parseText(doctext);
    doc2.docData = parser.splitter(doctext);
    document.getElementById('t1').innerHTML='ddd';
    var curr = {toRedraw: true, data: []};
    var boldIds = [];

    elfuncs['line'] = require('./elements/line.js')();
    elfuncs['lineseg'] = require('./elements/lineseg.js')();
    elfuncs['circle'] = require('./elements/circle.js')();
    var geom = require('./geom.js')([300, 300]);

    var doc = Doc(elfuncs, doc2);
    var els = doc.getEls();

    var cvc = canvasElement.getContext('2d');
    var coords = canvasElement.getBoundingClientRect();
    var holderSize = 5;
    var selectedPoint;
    var editorMode = '';
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

    var mouseClick = function (e) {
        var x = parseInt(e.clientX - coords.left);
        var y = parseInt(e.clientY - coords.top);
        var o1 = objectUnder(x,y);
        var justset = false;
        if (o1.length>0 && editorMode=='') {
            editorMode = 'editing';
            justset = true;
            curr.data = o1;
            //doc.currfuncs = [elfuncs['circle'].editRadius, [doc.circles[o1], [x, y]]];
        };
        if (editorMode === 'editing' && (!justset)) {
            doc.currfuncs = [];
            editorMode = '';
        };
        if (y<0) return 0;
        if (editorMode === 'moving') {
            editorMode = ''; return 0;
        };
        if (editorMode === 'enterLineseg0') {
            debugger;
            var line = {
                rez: 'p100' + Object.keys(doc.pnts).length,
                func: 'point',
                params: [x.toString(), y.toString()]
            };
            parser.parseLine(line);
            curr.data = line;
            editorMode = 'enterLineseg1';
        };
        if (editorMode === 'enterLineseg1') {
            debugger;
            var line = {
                rez: 'p100' + Object.keys(doc.pnts).length,
                func: 'point',
                params: [x.toString(), y.toString()]
            };
            debugger;
            parser.parseLine(line);
            var t = line.rez;
            line = {
                rez: 'ls100' + Object.keys(doc.linesegs).length,
                func: 'lineseg',
                params: [curr.data.rez, t]
            };
            parser.parseLine(line);
            editorMode = '';

        }; // enter lineseg1

        var pnts = doc.getPnts();
        selectedPoint = '';
        for (pid in pnts) {
            diffx = Math.abs(pnts[pid][0]-x);
            diffy = Math.abs(pnts[pid][1]-y);
            if (diffx < holderSize && diffy < holderSize) {
                selectedPoint = pid;
                editorMode = 'moving';
            }
        }
    };

    var mouseMove = function (e) {
        var x = parseInt(e.clientX - coords.left);
        var y = parseInt(e.clientY - coords.top);
        boldIds[0] = 'jkjkew';
        var o1 = objectUnder(x, y);
        if (o1.length>0) {
            boldIds[0] = o1;
            curr.toRedraw = true;
        }

        if (editorMode === 'editing') {
            elfuncs['circle'].editRadius(doc.docObjs[curr.data].ob, [x,y]);
            ret.getdoc().recalcAllObjs();
            ret.redraw();
        };
        if (editorMode === 'moving') {
            var pnts = doc.getPnts();
            pnts[selectedPoint][0] = x;
            pnts[selectedPoint][1] = y;
            ret.getdoc().recalcAllObjs();
            ret.redraw();
        };
        if (curr.toRedraw) ret.redraw();
    }

    window.addEventListener('click', mouseClick, false);
    window.addEventListener('mousemove', mouseMove, false);
    console.log('Edi');
    cvc.fillStyle = "#FFFFFF";
    cvc.strokeStyle = "#000000";
    cvc.strokeStyle='green';
    cvc.lineWidth = 1;
    var c1var = canvasElement.getBoundingClientRect();

    var ret = {
        test: function () {
            alert('ttest');
        },
        lineseg: function() {
            editorMode = 'enterLineseg0';
        },
        getdoc: function () {
            return doc;
        },
        redraw: function () { var els = doc.getToRedraw(); var pnts = doc.getPnts();
            var i;
            var tt = document.getElementById('t1'); var s='<font size="2">';
            var k = Object.keys(doc.docObjs);
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
            var ps = doc.getPnts();
            for (i in ps) {
                cvc.moveTo(pnts[i][0] - holderSize, pnts[i][1] - holderSize);
                cvc.lineTo(pnts[i][0] + holderSize, pnts[i][1] - holderSize);
                cvc.lineTo(pnts[i][0] + holderSize, pnts[i][1] + holderSize);
                cvc.lineTo(pnts[i][0] - holderSize, pnts[i][1] + holderSize);
                cvc.lineTo(pnts[i][0] - holderSize, pnts[i][1] - holderSize);
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