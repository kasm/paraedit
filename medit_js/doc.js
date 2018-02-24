/**
 * Created by Dima on 10.12.2017.
 *
 */

/*
pnts = {'p1': [0,0], 'p2': [10,20]}
els = {'e1': {type: 'line', pnts[pnts['p1'], pnts['p2']]} ... }
lines = {'i1': {a: 1, b: 1, c:1}}
links = {'s1': {'linked': 'e1', pnti: 0, main: 'e2', type: 'mid'},
's2': {type: 'hor', p0: 'p5', p1: 'p9'},
's3': {linked: 'e2', type: 'int', e0: 'e5', e1: 'e8'}
'k4': {linked: 'e4', type: 'coincidence', main: 'e15'} // for instance to line


API:
lineseg.draw(context, element)
line = lineseg.getLine(element)

element = {'e1': {type: 'line', pnts
elfuncs['lineseg'].draw(context, element)
elfuncs['lineseg+line'].intersection(element, element]
elfuncs['linkedto'](element) -> rez = [] for each link if


doc.addElement
doc.addLink(element, linkData) {
    newId = linkPrefix + currentId;
    currentId ++;
    links[newid, linkData);
    element.links.push(newid); };

    /*************************
doc.isNewLinkCorrect(element, linkData) {
    for (i = 0; i<element.linkids.length; i++) {
        if linkData.type == links[element.links[i].type &&
            linkData.pnti == links[element.links[i].pnti return ('error: same link')
        if constraintsQuantity['linkData.type'] + element.getCurrentConstraints > element.getMaxConstraints return ('error: too many constr')
        if solveLink(element, linkData == 'error' return 'error: cant solve link'

delete vs splice:
 https://stackoverflow.com/questions/500606/deleting-array-elements-in-javascript-delete-vs-splice

link types:
distance (with side) - coinsindence, distance, tangent to specific circle
orientation (parallel, perp)

snap types:
point = mid (toEl, point)
point = per (point, line)
line = per (point, line)
line = parallel(point, line)
lineseg = tangent(point, circle+ side)
line = tangent(circle+side, circle+side)
line = point, point
lineseg = point, point
lineseg = line, relCoord0, relCoord1
circle = point, radius
circle = TTR(line+side, line+side, radius)

distance between line ax+by = c and point px, py
from here:
 http://2000clicks.com/mathhelp/GeometryPointsAndLines2.aspx
 d = (a * py + b * px - c) / sqrt(a*a+b*b)      (5)
 more squtable:
 and canonical Ax+By+C  = 0
 d*sqrt(a*a+b*b) = a*py + b*px + c


conjugation of perpenducular and circle:
perpendicular got specific a and b in equation ax+by = c
thats why we can change only c in this equation to make like at distance
So, we have a problem which requires finding the distance from a point to a plane
we got a problem of get C such that line is at specific range from point
from equation (5)
c = d * sqrt(a*a+b*b) - a*py - b*px

conjugation of line from specific point and circle:
system:
a*p0x + b*p0y + c = 0
d*sqrt(a*a+b*b) = a*p1y + b*p1x + c
line can have any cofficients (a, b, c) , but it pass through specific point p0x, p0y and from distance d from pcx, pcy
more common problem: line from d0 from p0 and d1 from p1
lets take a*a+b*b = 1
so b = sqrt(1-a*a)
d0 = a*p0y + sqrt(1-a*a)*p0x - c
d1 = a*p1y + sqrt(1-a*a)*p1x - c
d0 - a*p0y - sqrt(1-a*a)*p0x -d1 + a*p1y + p1x*sqrt(1-a*a) = 0
d0-d1 + a*(p1y - p0y) + sqrt(1-a*a)* (p1x - p1y) = 0


parametric form of line (luch)
x = x0 + xt*t
y = y0 + yt*t
a * (x0 + xt*t) + b*(y0+yt*t) + c = 0

 http://e-maxx.ru/algo/circle_tangents
 https://en.wikipedia.org/wiki/Tangent_lines_to_circles#Tangent_lines_to_two_circles
 http://www.mathelp.spb.ru/book1/line_on_plane.htm
 http://www.math.com.ua/mathdir/uravneniya_pryamoy_rasstoyanie.html

 */



var Doc = function (elfuncs, doc_obj) {
    var pnts = doc_obj.pnts;
    var els = doc_obj.els;
    var links = doc_obj.links;
    var dists = doc_obj.dist;
    var Geom = require('./geom.js');
    var geom = Geom(pnts['defPoint']);
    var tid = 1000;
    var docObjs = doc_obj.objs;  // this is current, not parameter !!
    var pntid = 1000;
    var elid = 1000;
    var distid = 1000;
    var lineid = 1000;
    var linesegid = 1000;
    console.log('els', els);
    return {
        docObjs: docObjs,
        addObj: function (type, obj) {
            if (type == 'point') {
                pnts['pnt'+pntid] = obj;
                pntid++;
            } else if (type =='distance') {
                dists['dist'+distid] = obj;
                distid++;
            } else {
                els['el'+elid] = {type: type, data: obj}
            }
        },

        addObjs: function (objs) { var ob; var rez = [];
        console.log('addObjs', objs);
            for (i=0; i<objs.length; i++) {
                ob = objs[i];
                if (ob.type == 'point') { rez.push('ap'+i); pnts['ap'+i] = objs[i]}
                else if (ob.type == 'distance') {rez.push('ad'+i); dists['ad' + i] = ob[i]}
                else { rez.push('ae'+i); els['ae'+i] = objs[i] };
            }
            return rez;
        },

        addLink: function (link) {
            links[tid] = link;
            tid++;
        },
        fillElPnts: function () { var rez = {}; var i; var el;
            for (id in els) {
                if (els[id].pnts === undefined) els[id].pnts = [];
                if (els[id].pntids === undefined) els[id].pntids = [];
                //if (!els[id].pnts.isArray()) els[id].pnts = [];
                el = els[id];
                //for (pid in els[id].pntids) {
                for (i=0; i<el.pntids.length; i++) {
                    el.pnts[i] = pnts[el.pntids[i]];
                    //el.pnts.push(pnts[el.pntids[i]]);
                }
            }
        },
        getPnts: function () { return pnts; },
        getEls: function () { return els; },
        getToRedraw: function () { var rez = [];
        var obrec, obrec_id;
            //console.log('getTo redraw --------------------------------------');
            //console.log(JSON.stringify(docObjs, null, 10));
            for (obrec_id in docObjs) {
                obrec = docObjs[obrec_id];
                //if (obrec.type != 'dist') rez.push(obrec);
                if (obrec.type != 'point' && obrec.type != 'dist') rez.push(obrec);
            }
            console.log('rez'+ JSON.stringify(rez));
            return rez;
        },
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
        getStaticPntIds: function () {


        },
        solveLink: function(id) {
            var linkedEl = els[links[id].linked];
            var mainEl = els[links[id].main];
            var pnt = elfuncs[mainEl.type](links[id]);
            return pnt;
        },
        isLinkReadyToSolveId: function (id, solvedElIds) {
            var solved = true;
            var type = links[id].type;
            //if (type == 'per' || type === 'mid')

        },
        isLinkSolvedById: function (id) {
            return
        },
        linkGetMainElIds2: function (link) { var rez = [];
            if (link.type === 'mid' || link.type === 'per') rez.push(link.main);
            if (link.type === 'int') {
                rez.push(link.e0); rez.push(link.e1); };
            return rez;
        },
        linkGetMainElIds: function (link) {
            return link.main;
        },
        linkGetLinkedElIds: function (link) {
            var rez = []; rez.push(link.linked); return rez;
        },

        recalcAllPnt: function () {
            var done = false;
            for (pntid in pnts) pnts[pntid].solved = true;
            for (linkid in links) {

            }
        },
        solveLink2: function (linkid) {
            elfuncs['lineseg'].getLinkPnt(links[linkid], pnts, els);
        },
        solveLink3: function (linkid, docObjs) {
            var query = links[linkid].type + '_'
            var linked = links[linkid].linked;
            var ob = docObjs[linked];
            var mainArray = [];
            for (i=0; i<ob.main.length; i++) {
                if (typeof ob.main[i] == 'string') {
                    mainArray.push(docObjs[ob.main[i]].ob);
                } else {
                    mainArray.push(ob.main[i]);
                }
            }
            console.log('query', linkid, ob.query, mainArray, '================================================================================');

            var rez = geom[ob.query](docObjs[linked].ob, mainArray);
            var linkedObjectType = ob.type;
            var linkType = links[linkid].type;
            console.log('solveLink', rez);

        },

        solveObject: function (ob) {
            var rez = geom[ob.query](ob.links);
        },



        fillLinksData: function () { // current
            for (id in links) {
                link = links[id];
                link.main = [];
                mainids = link.mainids;
                linked = docObjs[link.linked];
                linked.mainids = [];
                linked.links = [];
                linked.main = [];
                for (i = 0; i< mainids.length; i++) {
                    linked.links.push(link);
                    if (typeof mainids[i] == 'string') {
                        link.main.push(docObjs[mainids[i]].ob);
                        linked.mainids.push(mainids[i]);  // for use to scan dependencies
                        linked.solved = false;
                    } else {
                        link.main.push(mainids[i]);
                    }
                }
            }
        },
        fillDocObjs: function () { // current, fill without calculation
            var docObjs = {};
            for (id in pnts) {
                docObjs[id] = {type: 'point', ob: pnts[id], id: id, solved: true, mainids: [], linkids: [], links: [], query: 'point_links'};
            };
            for (id in els) {
                docObjs[id] = {type: els[id].type, ob: els[id], id: id, solved: true, mainids: [], linkids: [], links: [], query: els[id].type+'_links'};
            };
            for (id in dists) {
                docObjs[id] = {type: 'distance', ob: dists[id], id: id, solved: true, mainids: [], linkids: [], links: [], query: 'distance_links'};
            };
            this.fillLinksData();

            // make query string
            for (id in docObjs) {
                ob = docObjs[id];
                for (linkid in ob.links) ob.query += '_' + links[linkid]
            };
        },
        recalcAllObjs: function () { // current !!!!!!!!!!!!!!!
            /*
            changed link format to specify DETAILED link type
            to simplify processing, because of too complex analisys
             and generating query of links like
             'line_parallelLineSideDistance'.
             So I decided to just store
              type: parallelLineSideDistance
              in link body

              Also had to change geom engine API format to
              geom.func1(rez, arrayOfLinks)
              because of complex structure of links data (for instance distance and side)

             */
            this.fillElPnts();
            this.fillDocObjs();
            var done = false;
            var rez;
            var mains;
            while (!done) {
                for (id in docObjs) {
                    isObjectReadyToSolve = true;
                    ob = docObjs[id];
                    rez = ob.ob;  // will be [array, index] at scalar values
                    mains = [rez];
                    for (mi in ob.mainIds) {
                        mid = ob.mainIds[mi];
                        //mains.push(docObjs[mid].ob);
                        if (!docObjs[mid].solved) isObjectReadyToSolve = false;
                    };
                    if (ob.mainIds.length > 0 && isObjectReadyToSolve) {
                        //rez = geom[ob.query](ob.links);
                        rez = ob.func.apply(this, ob.mains);
                        ob.solved = true;
                    }
                };
                done = true;
                for (id in docObjs) if (!docObjs[id].solved) done = false;
            }
        },


























        recalcAllObjsOld1: function () {
            this.fillElPnts();
            var linkQuery;
            function addLinkToQuery(link) {

            }
            var docObjs = {};
            for (id in pnts) {
                docObjs[id] = {type: 'point', ob: pnts[id], id: id, solved: true, main: [], linkids: [], query: 'point'};
            };
            for (id in els) {
                docObjs[id] = {type: els[id].type, ob: els[id], id: id, solved: true, main: [], linkids: [], query: els[id].type};
            };
            for (id in dists) {
                docObjs[id] = {type: 'distance', ob: dists[id], id: id, solved: true, main: [], linkids: [], query: 'distance'};
            };
            var done = false;
            var link;
            var ob;
            var obt;
            for (linkid in links) {
                link = links[linkid];
                ob = docObjs[link.linked];
                ob.solved = false;
                ob.query += '_'+link.type;
                for (i=0; i<link.main.length; i++) {
                    obt = docObjs[link.main[i]];
                    ob.query+='_' + obt.type;
                }
                ob.linkids.push(linkid);
                for (i=0; i<link.main.length; i++) {
                    ob.main.push(link.main[i]);
                };
                //linkedIds = this.linkGetLinkedElIds(links[linkid]);
                //for (id in linkedIds) docObjs[linkedIds[id]].solved = false;
            };
            console.log('DDDDDDDDDDD', docObjs);
            while (!done) {
                for (linkid in links) {
                    var link = links[linkid];
                    ob = docObjs[link.linked];
                    isLinkReadyToSolve = true;
                    mainIds = this.linkGetMainElIds(links[linkid]);
                    for (id in mainIds) {
                        if (!docObjs[mainIds[id]].solved) isLinkReadyToSolve = false;
                    };

                if (isLinkReadyToSolve) {
                    this.solveLink3(linkid, docObjs);
                    //throw new Error('link solved', linkid);
                    ob.solved = true;
                };
                //debugger;
                };
                done = true;
                for (id in docObjs) if (!docObjs[id].solved) done = false;
            }

/*
            var done = false;
            for (elid in els) els[elid].solved = true;
            for (linkid in links) { // mark all linked els as not solved yet
                linkedEls = this.linkGetLinkedElIds(links[linkid]);
                for (id in linkedEls) els[linkedEls[id]].solved = false;
            };
            while (!done) {
                for (linkid in links) { isLinkReadyToSolve = true;
                    mainEls = this.linkGetMainElIds(links[linkid]);
                    for (elid in mainEls) {
                        if (!els[mainEls[elid]].solved) isLinkReadyToSolve = false;
                    };

                if (isLinkReadyToSolve) {
                    this.solveLink2(linkid);
                    linkedEls= this.linkGetLinkedElIds(links[linkid]);
                    for (elid in linkedEls) els[linkedEls[elid]].solved = true;
                };
                };
                done = true;
                for (id in els) if (!els[id].solved) done = false;
            } // while
            */


        }


    }
}

module.exports = Doc;
