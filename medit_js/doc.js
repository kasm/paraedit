/**
 * Created by Dima on 10.12.2017.
 *
 */

/*
pnts = {'p1': [0,0], 'p2': [10,20]}
els = {'e1': {type: 'line', pnts[pnts['p1'], pnts['p2']]} ... }
links = {'s1': {'linked': 'e1', 'main': 'e2', type: 'mid'},
's2': {type: 'hor', p0: 'p5', p1: 'p9'},
's3': {type: 'int', e0: 'e5', e1: 'e8'}
 */

var Doc = function (elfuncs, doc_obj) {
    var pnts = doc_obj.pnts;
    var els = doc_obj.els;
    var links = doc_obj.links;
    console.log('els', els);
    return {
        fillElPnts: function () { var rez = {}; var i; var el;
            for (id in els) {
                els[id].pnts = []; el = els[id];
                //for (pid in els[id].pntids) {
                for (i=0; i<el.pntids.length; i++) {
                    el.pnts.push(pnts[el.pntids[i]]);
                }
            }
        },
        getPnts: function () { return pnts; },
        getEls: function () { return els; },
        getLinks: function() {
            return links;
        },
        getElPnts: function (el_id) {
            els[el_id].pnts;
        },
        getLinkedEls: function (el_id_main) { var rez = [];
            for (el_id in els) {
                if (els[el_id].main === el_id_main) rez.push(els[el_id]);
            }
        },
        getLinkedIdAll: function () { var rez = [];
            for (linkid in links) if (links[linkid].linked) rez.push(linkid);
        },
        getStaticIds: function () { var rez = {};
            for (elid in els) rez[elid]=5;
            for (linkid in links) rez[links[linkid].linked] = undefined;
            return rez;
        },
        solveLink: function(id) {
            var linkedEl = els[links[id].linked];
            var mainEl = els[links[id].main];
            var pnt = elfuncs[mainEl.type](links[id]);
            return pnt;
        },
        recalcAll: function () { var done=false; var linkCalced = {}; var elsSolved = [];
            for (linkid in links) linkCalced[linkid] = false;
            var solvedIds = this.getStaticIds();
            while(!done) {
                console.log('while');
                done = true;
                for (linkid in links) {
                    console.log('linkid', linkid, links[linkid]);
                    if (typeof solvedIds[links[linkid].main] != undefined) {
                        elfuncs['line'].getLinkPnt(links[linkid], pnts, els);
                        //elfuncs[els[links[linkid].main].type].getLinkPnt(links[linkid], pnts);
                        //solveLink(linkid);
                        solvedIds[linkid]=5;
                    }
// TODO make array of main (to what linked) elements in link object to iterate
                    // are they solved
                };
                unsolvedLink = 0;
                for (id in solvedIds) if (typeof solvedIds[id] === undefined) unsolvedLink++;
                if (unsolvedLink > 0) done = false;
            }
        }


    }
}

module.exports = Doc;
