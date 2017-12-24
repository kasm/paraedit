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
    console.log('c1 r:', els['c1']['r']);
    var c1 = {type: 'circle', r: 30, pntids: ['pc1'], pnts: [[100, 100]]};
    var c2 = {type: 'circle', r: 120, pntids: ['pc2'], pnts: [[200, 300]]};
    var ltest = elfuncs['line'].setFromPoints([1, 2355], [22,1]);
    console.log('ltest--------------------------------------------------------', ltest);
    var lines = elfuncs['line'].getTangentArray(c1, c2);
    console.log('tangent lines:', lines);
    lines[0].pnts = []; lines[0].pntids = []; lines[0].type = 'line';
    lines[1].pnts = []; lines[1].pntids = []; lines[1].type = 'line';
    els['e10'] = c1; els['e11'] = c2;
    els['l1'] = lines[0]; els['l2'] = lines[1];
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
        recalcAll: function () { var done=false; var linkCalced = {}; var elsSolved = [];
            for (linkid in links) linkCalced[linkid] = false;
            var solvedIds = this.getStaticIds();
            while(!done) {
                console.log('while');
                done = true;
                for (linkid in links) {
                    console.log('linkid', linkid, links[linkid]);
                    if (typeof solvedIds[links[linkid].main] != undefined) {
                        elfuncs['lineseg'].getLinkPnt(links[linkid], pnts, els);
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
        recalcAllEls: function () { // current !!!!!!!!!!!!!!!
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
        }


    }
}

module.exports = Doc;
