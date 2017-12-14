/**
 * Created by Dima on 09.12.2017.
 */

var Doc = require('./doc.js');
//var Line = require('./els/line.js');

var elfuncs = [];


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

var doc_obj2 = {
    pnts: {'p1': [10, 20], 'p2': [150, 50],
        'p3': [40,190], 'p4': [10,403],
        'p5': [100, 100], 'p6': [200,500],
        'p7': [200, 150], 'p8': [200,500],
        'p9': [300, 350], 'p10': [300,400],
        'p11': [400, 350], 'p12': [400,400],
        'p13': [200, 400], 'p14': [400, 250],
        'p15': [200, 400], 'p16': [400, 250]
    },
    els: {
        'e1': {type: 'line', pntids: ['p1', 'p2']},
        'e2': {type: 'line', pntids: ['p4', 'p3']},
        'e3': {type: 'line', pntids: ['p5', 'p6']},
        'e4': {type: 'line', pntids: ['p7', 'p8']},
        'e5': {type: 'line', pntids: ['p9', 'p10']},
        'e6': {type: 'line', pntids: ['p11', 'p12']},
        'e7': {type: 'line', pntids: ['p13', 'p14']},
        'e8': {type: 'line', pntids: ['p15', 'p16']}
    },
    links: {
        'k1': {type: 'mid', linked: 'e2', pnti: 1, main: 'e1'},
        'k2': {type: 'mid', linked: 'e3', pnti: 1, main: 'e2'},
        'k3': {type: 'per', linked: 'e4', pnti: 1, main: 'e2'},
        'k4': {type: 'int', linked: 'e5', pnti: 1, e0: 'e3', e1: 'e4'},
        'k5': {type: 'mid', linked: 'e6', pnti: 0, main: 'e5'},
        'k6': {type: 'mid', linked: 'e6', pnti: 1, main: 'e4'},
        'k7': {type: 'int', linked: 'e8', pnti: 0, e0: 'e1', e1: 'e3'},
        'k8': {type: 'int', linked: 'e8', pnti: 1, e0: 'e5', e1: 'e7'}
    }
}
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

var Editor = function (cvc_par) {
    var doc = Doc(elfuncs, doc_obj2);
    var cvc = cvc_par;
    elfuncs['line'] = require('./elements/line.js')(doc.getEls());
    console.log('Edi');
    cvc.fillStyle = "#FFFFFF";
    cvc.strokeStyle = "#000000";
    cvc.strokeStyle='green';
    cvc.lineWidth = 1;
    /*
    //cvc.fillRect(0,0,c1var.width,c1var.height);
    cvc.beginPath();
    cvc.fillStyle = "rgba($0,$0,$0,0.5)";
    cvc.strokeStyle='red';
    cvc.lineWidth = 2;
    cvc.fill();
    cvc.fillRect(10, 10, 20, 20); cvc.fill();
-*/
    return {
        getdoc: function () {
            return doc;
        },
        redraw: function () { var els = doc.getEls(); var pnts = doc.getPnts();
            var k = 5;
            for (el_id in els) {
                console.log('el_id', el_id);

                elfuncs[els[el_id].type].draw(cvc, els[el_id]);

                //doc.els[el_id].draw(cvc);
            }
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

};

var editor = Editor(document.getElementById('c1').getContext('2d'));
//editor.recalc();
editor.getdoc().fillElPnts();
editor.getdoc().recalcAllEls();
editor.redraw();