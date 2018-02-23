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
    "ls1.0=point(20,30)\n\
ls1.1=point(120, 50)\n\
ls1=lineseg(ls1.0,ls1.1)\n\
ls2.0=point(50,50)\n\
ls2.1=point(100,100)\n\
ls2=lineseg(ls2.0,ls2.1)\n\
p0=point(10,120)\n\
p0.0=eq(ls1.1.0)\n\
ls2.1=mid(ls1.0,ls1.1)";
var doc2={objs: {},
pnts: {},
    linesegs: {}
};

var Editor = function (canvasElement) {
    document.getElementById('t1').innerHTML='ddd';
    var Parser = require('./parser.js');
    parser = Parser(doc2);
    parser.parseText(doctext);
    document.getElementById('t1').innerHTML='ddd';



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

    var mouseClick = function (e) {
        if (editorMode === 'moving') {
            editorMode = ''; return 0;
        }
        var x = parseInt(e.clientX - coords.left);
        var y = parseInt(e.clientY - coords.top);
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
        if (editorMode === 'moving') {
            var x = parseInt(e.clientX - coords.left);
            var y = parseInt(e.clientY - coords.top);
            var pnts = doc.getPnts();
            pnts[selectedPoint][0] = x;
            pnts[selectedPoint][1] = y;
            ret.getdoc().recalcAllObjs();
            ret.redraw();
        }
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
        getdoc: function () {
            return doc;
        },
        redraw: function () { var els = doc.getToRedraw(); var pnts = doc.getPnts();
            var k = 5;
            cvc.fillStyle = "#FFFFFF";
            cvc.strokeStyle = "#000000";
            cvc.strokeStyle='green';
            cvc.lineWidth = 1;
            cvc.fillRect(0,0,c1var.width,c1var.height);
            var elrec;
            for (i=0; i<els.length; i++) {
                elrec = els[i];
                elfuncs[elrec.type].draw(cvc, elrec.ob);
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
        },
        recalc: function () { var el; var i; var tpnt; var els = doc.getEls();
        }
    }
return ret;
};

var editor = Editor(document.getElementById('c1'));
//editor.recalc();
editor.getdoc().fillElPnts();
console.log('fillElpnits');
editor.getdoc().recalcAllObjs();
editor.redraw();