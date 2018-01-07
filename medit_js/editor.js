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
    curid: 100,

    pnts: { 'defPoint': [50,50],
        'p1': [10, 20], 'p2': [350, 150],
        'p3': [40,190], 'p4': [10,403],
        'p5': [100, 10], 'p6': [200,500],
        'p7': [200, 150], 'p8': [200,500],
        'p9': [300, 350], 'p10': [300,400],
        'p11': [400, 350], 'p12': [400,400],
        'p13': [200, 400], 'p14': [450, 250],
        'p15': [200, 400], 'p16': [400, 250],
        'p17': [200, 400], 'p18': [400, 250],
        'pc1': [100, 100], 'pc2': [200, 300],
        'pc3': [200, 360]

    },
    lines: {
        //'l0': [0.5, 1, -100, x0, y0, x1, y1], // TODO for faster drawing
        'l0': [0.5, 1, -100],
        'l1': [3, 1, - 500],
        'l2': els['l2'].data
    },
    linesegs: {
        ls0: [[20, 30], [100, 30]],
        ls1: [[20, 100], [100, 110]],
        ls2: [pnts['p3'], pnts['p4']]
    },
    circles: {
        c0: [[20,30], [40]],
        c1: [pnts['pc1'], dist['d1']]
        c2: [els['c2'].adata]      // weak because here will be link to COPY of data['pc1', 20] >>> adata[pnts['pc1'], 20]
        c21: // also data[pnts['pc1'], 20] is weak because of we lose name of 'pc1'
        c3: [pnts['pc3'], els['c3'].data[2]]  // data[2] === [20]
    },

    els: {
        'e1': {type: 'lineseg', data: ['p1', 'p2']},
        'le5': {type: 'line', data: [0.5, 1, -100]},
        'c1': {type: 'circle', data: ['pc1', 'd20']}, // convert d20 to dist['d20']=[20]
        'c2': {type: 'circle', data: ['pc1', 20]}, // put it to circles array
        'c3': {type: 'circle', data: ['pc1', [20]]}
        'r1': {type: 'rectang', data: ['pc1', [20, 30]]}   // left corner and [width, height]
        // circles and other elements are created by
    },

    links: {
        'l1': {type: 'data', data: ['c0', 1, 'dist15']},   // set raidus of circle 'c1' to 'dist15'
    }

    els_old: {
        'e1': {type: 'lineseg', pntids: ['p1', 'p2']},
        'e2': {type: 'lineseg', pntids: ['p3', 'p4']},
        'e3': {type: 'lineseg', pntids: ['p5', 'p6']},
        'e4': {type: 'lineseg', pntids: ['p7', 'p8']},
        'le5': {type: 'line', data: [0.5, 1, -100]},
        //'le5': {type: 'line', a: 0.5, b: 1, c: -100, pntids: []},
        'c1': {type: 'circle', pntids: ['pc1'], r: 30},
        'e6': {type: 'line', a: 0.5, b: 1.5, c: -100, pntids: []},
        'c2': {type: 'circle', pntids: ['pc2'], r: 20},
        'c5': {type: 'circle', pntids: ['pc3'], pnts: [[20, 30]], r: 8},
        'l3': {type: 'line', a: 1, b: 1, c: -200, pntids: []},
        'l4': {type: 'line', a: 1, b: 1, c: -200, pntids: []},
        's7': {type: 'lineseg', pntids: ['p17', 'p18']}
    },



        /*
        'e1': {type: 'lineseg', pntids: ['p1', 'p2']},
        'e2': {type: 'lineseg', pntids: ['p4', 'p3']},
        'e3': {type: 'lineseg', pntids: ['p5', 'p6']},
        'e4': {type: 'lineseg', pntids: ['p7', 'p8']},
        'e5': {type: 'lineseg', pntids: ['p9', 'p10']},
        'e6': {type: 'lineseg', pntids: ['p11', 'p12']},
        'e7': {type: 'lineseg', pntids: ['p13', 'p14']},
        'e8': {type: 'lineseg', pntids: ['p15', 'p16']}
    //    'e9': {type: 'line', a: -50, b: -20, c: -3000, pnts: [], pntids: []},
   //     'e10': {type: 'line', a: 10, b: 10, c: -500, pnts: [], pntids: []},
  //      'c0': {type: 'circle', pntids: ['pc1'], r: 30},
  //      'c1': {type: 'circle', pntids: ['pc2'], r: 120}
  */

    /*
    links: {
        'k1': {type: 'mid', linked: 'e2', pnti: 1, main: ['e1']},
        'k2': {type: 'mid', linked: 'e3', pnti: 1, main: ['e2']},
        'k3': {type: 'per', linked: 'e4', pnti: 1, main: ['e2']},
        'k4': {type: 'int', linked: 'e5', pnti: 1, main: ['e3', 'e4']},
        'k5': {type: 'mid', linked: 'e6', pnti: 0, main: ['e5']},
        'k6': {type: 'mid', linked: 'e6', pnti: 1, main: ['e4']},
        'k7': {type: 'int', linked: 'e8', pnti: 0, main: ['e1', 'e3']},
        'k8': {type: 'int', linked: 'e8', pnti: 1, main: ['e5', 'e7']},
        'k9': {type: 'tangent', linked: 'e10', main: ['c0', 'c1'], ang0: 1, ang1: 1}
    },
    */
    links: {
        'k1': {type: 'mid', linked: 'p3', main: ['e1']},
        'k2': {type: 'int', linked: 'p8', main: ['e1', 'e3']},
        'k3': {type: 'parallel', linked: 'e6', main: ['c1']},
        'k4': {type: 'coin', linked: 'e6', main: ['p15']},
        'k5': {type: 'parallel', linked: 'l3', main: ['c2']},
        'k6': {type: 'parallel', linked: 'l3', main: ['c1']},

        'k8': {type: 'coin', linked: 'l4', main: ['pc2']},
        'k7': {type: 'per', linked: 'l4', main: ['l3']},
        'k9': {type: 'int', linked: 'p17', main: ['l3', 'e6']},
        'k10': {type: 'per', linked: 'p18', main: ['p17', 'e3']}

        ,
        'k11': {type: 'parallel', linked: 'c5', main: ['l3']},
        'k12': {type: 'parallel', linked: 'c5', main: ['e6']},
        'k13': {type: 'radius', linked: 'c5', main: ['d3']},

        // 'k15': {linked: 'c5', type: parallelLineSideDistance, mainid: ['l6', -1, 'd12']}
        // 'ak15': {linked: c5obj, type: parallelLineSideDistance, main: [lineObjRef, side, distanceRef]}



        // 'k101: {type: 'ttrs', linked: 'c8', main: ['l1', 'l2', 'd3', [0, 0]]}


    //    'k2': {type: 'mid', linked: 'p6', main: ['e2']},
  //      'k3': {type: 'per', linked: 'p8', main: ['e2']},
    //    'k4': {type: 'int', linked: 'p10', main: ['e3', 'e4']},
      //  'k5': {type: 'mid', linked: 'p11', main: ['e5']},
      //  'k6': {type: 'mid', linked: 'p12', main: ['e4']},
      //  'k7': {type: 'int', linked: 'p15', main: ['e1', 'e3']},
      //  'k8': {type: 'int', linked: 'p16', main: ['e5', 'e7']}
        //'k9': {type: 'tangent', linked: 'e10', main: ['c0', 'c1'], ang0: 1, ang1: 1}
    },

    dist: {
        'd1': 20,
        'd2': {type: 'per', ids: ['p13', 'e5']},
        'd3': 45
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

var Editor = function (canvasElement) {
    elfuncs['line'] = require('./elements/line.js')();
    elfuncs['lineseg'] = require('./elements/lineseg.js')();
    elfuncs['circle'] = require('./elements/circle.js')();
    var geom = require('./geom.js')([300, 300]);

    var doc = Doc(elfuncs, doc_obj2);
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
        circle1 = geom['circle_blank']();
        console.log('added circle, :', circle1);

        geom.circle_parallel_line_parallel_line_signs_radius_distance(circle1, [els['l3'], els['le5'], signs, 10]);
        tid = doc.addObjs([circle1]);
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
        redraw: function () { var els = doc.getEls(); var pnts = doc.getPnts();
            var k = 5;
            cvc.fillStyle = "#FFFFFF";
            cvc.strokeStyle = "#000000";
            cvc.strokeStyle='green';
            cvc.lineWidth = 1;
            cvc.fillRect(0,0,c1var.width,c1var.height);




            for (el_id in els) {
                console.log('el_id', el_id);
                var dd = els[el_id];
                var ddt = dd.type;

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