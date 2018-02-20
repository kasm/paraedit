/**
 * Created by Dima on 09.12.2017.
 */
document.getElementById('t1').innerHTML='ddd';
var Doc = require('./doc.js');
//var Line = require('./els/line.js');

var elfuncs = [];

/*
var doc_obj = {
    els: {
        'e1': {
            type: 'line',
            pnts: [[10,20], [50, 70]]
        },
        'e2': {
            type: 'line',
            pnts: [[100, 20], ['mid', 'e1']]
        }
        ,
        'e3': {
            type: 'line',
            pnts: [[100, 20], ['mid', 'e1']]
        }
    }
};
*/


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
ls1=lineseg(ls1.0,ls1.1)";
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
    var signs = [1, 1];

    /*
    for (i=0; i<2; i++) for (j=0; j<2; j++) {
        signs[0] = 2*i - 1;
        signs[1] = 2*j - 1;
        circle1 = geom['circle_blank']();
        geom.circle_parallel_line_parallel_line_radius_distance_signs(circle1, [els['l3'], els['le5'], 10], signs);
        console.log('add circle:', circle1);
        doc.addObjs([circle1]);
    };
*/

    for (i=0; i<2; i++) for (j=0; j<2; j++) {
        signs[0] = 2*i - 1;
        signs[1] = 2*j - 1;
        //circle1 = geom['circle_blank']();
        //console.log('added circle, :', circle1);

        //geom.circle_parallel_line_parallel_line_signs_radius_distance(circle1, [els['l3'], els['le5'], signs, 10]);
        //tid = doc.addObjs([circle1]);
     //   doc.addLink({type: 'parallel_line_parallel_line_signs', linked: tid, main: ['l3', 'le5', [1-2*i, 1-2*j]]});
    };

    /*
    var circles = [];
    geom.circles_parallel_line_parallel_line_radius_distance(circles, [els['l3'], els['le5'], 10]);
    doc.addObjs(circles);
    */
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
    /*
    //cvc.fillRect(0,0,c1var.width,c1var.height);
    cvc.beginPath();
    cvc.fillStyle = "rgba($0,$0,$0,0.5)";
    cvc.strokeStyle='red';
    cvc.lineWidth = 2;
    cvc.fill();
    cvc.fillRect(10, 10, 20, 20); cvc.fill();
-*/
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
            //var elrecs = doc.getElsToRedraw();
            console.log('general redraw');
            console.log(JSON.stringify(els));
            var elrec;
            for (i=0; i<els.length; i++) {
                elrec = els[i];
                elfuncs[elrec.type].draw(cvc, elrec.ob);
            };
/*
            for (elrecId in els) {
                elrec = doc.docObjs[elrecId];
                elfuncs[elrec.type].draw(cvc, elrec.ob);
            };
*/


/*
            for (el_id in els) {
                console.log('el_id', el_id);
                var dd = els[el_id];
                var ddt = dd.type;

                elfuncs[els[el_id].type].draw(cvc, els[el_id]);

                //doc.els[el_id].draw(cvc);
            }
            */
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
       /*
            for (el_id in els) { el = els[el_id];
                //for (pnt in doc.els[el_id].pnts) {
                for (i = 0; i< els[el_id].pnts.length; i++) { //} in doc.els[el_id].pnts) {
                    pnt = els[el_id].pnts[i];
                    console.log('pnt:', pnt);
                    if (isSnap(pnt)) {
                        console.log('snap', pnt);
                        snapType = pnt[0];
                        toElement = els[pnt[1]];
                        tpnt = elfuncs[toElement.type].snap(el, toElement, snapType);
                        el.pntsCalc[i][0] = tpnt[0];
                        el.pntsCalc[i][1] = tpnt[1];
                        //elfuncs[el.type].snap;
                    } else {
                        el.pntsCalc = [];
                        el.pntsCalc[0] = [];
                        el.pntsCalc[1] = [];
                        el.pntsCalc[0][0] = el.pnts[0][0];
                        el.pntsCalc[0][1] = el.pnts[0][1];
                        el.pntsCalc[1][0] = el.pnts[1][0];
                        el.pntsCalc[1][1] = el.pnts[1][1];
                    }
                }
            } // for el_id
            */
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