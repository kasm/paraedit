/**
 * Created by Dima on 14.02.2018.
 */

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
        'l1': [3, 1, - 500]
        //,        'l2': els['l2'].data
    },
    linesegs: {
        ls0: [[20, 30], [100, 30]],
        ls1: [[20, 100], [100, 110]],
        ls2: [this.pnts.p3, this.pnts.p4]  // seems best variant also could be els['ls2'].adata  or  els['ls2'].pnts
    },
    circles: {
        c0: [[20,30], [40]],
        c1: [pnts['pc1'], dist['d1']], // simply place links to the circle structure is weak, because we are loosing 'pc1' name
        c2: [els['c2'].adata],      // weak because here will be link to COPY of data['pc1', 20] >>> adata[pnts['pc1'], 20]
        c21: [],// also data[pnts['pc1'], 20] is weak because of we lose name of 'pc1'
        c3: [pnts['pc3'], els['c3'].data[2]]  // data[2] === [20]
    },

    /*
     maybe it should be API to element, like
     circleGetR(c1) {
     return c1[1][0]
     }

     */

    els: {
        'e1': {type: 'lineseg', data: ['p1', 'p2']},
        'le5': {type: 'line', data: [0.5, 1, -100]},
        'c1': {type: 'circle', data: ['pc1', 'd20']}, // convert d20 to dist['d20']=[20]
        'c2': {type: 'circle', data: ['pc1', 20]}, // put it to circles array
        'c3': {type: 'circle', data: ['pc1', [20]]},
        'r1': {type: 'rectang', data: ['pc1', [20, 30]]}   // left corner and [width, height]
        // circles and other elements are created by
    },

    links: {
        'l1': {type: 'data', data: ['c0', 1, 'dist15']},   // set raidus of circle 'c1' to 'dist15'
    },

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