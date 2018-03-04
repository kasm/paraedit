/**
 * Created by Dima on 10.12.2017.
 */

var medit = {};
medit.eps = 0.00000001;


var Line = function () {
    var gc = require('../geom_core')();
    var a, b, c;
    var type = 'line';
    var holderSize = 5;
    var centerX = 200;
    var centerY = 200;
    var spaceBetweenRulers = 100;

    function sort(tosort) {
        var sorted = false;
        while (!sorted) {
            sorted = true;
            for (i = 0; i<tosort.length-1; i++) {
                if (parseFloat(tosort[i]) > parseFloat(tosort[i+1])) {
                    t = tosort[i];
                    tosort[i] = tosort[i+1];
                    tosort[i+1] = t;
                    sorted = false;
                }
            }
        }
    };

    return {
        nRulers: 2,
        rulerNames: ['p0', 'p1'],
        params: [0, 1, 100],
        ob: [[0,0], [10, 0]],

        isOver: function (line, x, y) {
            var dist = gc.scalar_len_point_line([x,y], line);
            if (Math.abs(dist) < holderSize) {
                return true;
            } else {
                return false;
            }
        },
        getRulers: function (rulers, line) {
            var p0 = []; var p1 = [];
            var pp = [];
            gc.point_per_point_line(pp, [centerX, centerY], line);
            var a = line[0]; var b = line[1];
            p0[0] = pp[0] - b*spaceBetweenRulers;
            p0[1] = pp[1] + a* spaceBetweenRulers;
            p1[0] = pp[0] + b*spaceBetweenRulers;
            p1[1] = pp[1]  -a*spaceBetweenRulers;
            rulers[0] = p0;
            rulers[1] = p1;
            return rulers;
        },
        ways: [ // numbers of rulers used while creation
            // ways can be different, for instance ways for creating arc
            [0, 1]
        ],

        editorArray: function (line, rulers) {
            return [
                [gc.line_point_point, [line, rulers[0], rulers[1]]],
                [gc.line_point_point, [line, rulers[0], rulers[1]]]
            ]
        },

        getLineBounds: function(line, bounds) {
         //   console.log('line bounds:::::::::::::', line, bounds);
            // bounds: left, right, top, bottom
            var lines = []; var i;
            lines.push(this.setFromPoints([bounds.left, bounds.top], [bounds.right, bounds.top]));
            lines.push(this.setFromPoints([bounds.left, bounds.top], [bounds.left, bounds.bottom]));
            lines.push(this.setFromPoints([bounds.right, bounds.top], [bounds.right, bounds.bottom]));
            lines.push(this.setFromPoints([bounds.right, bounds.bottom], [bounds.left, bounds.bottom]));
            var points = [];

            for (i=0 ; i<lines.length; i++) {
                points[i] = [];

                t = gc.point_int_line_line(points[i], line, lines[i]);
                //t = this.getIntersection(line, lines[i]);
                points[i][0] = t[0];
                points[i][1] = t[1];
            };
            xmid = (bounds.left + bounds.right) / 2.;
            ymid = (bounds.top + bounds.bottom) / 2.;
            sortedPoints = {};
            sortedDistances = [];
            for (i=0; i<points.length; i++) {
                distd = (xmid - points[i][0])*(xmid - points[i][0]) + (ymid - points[i][1])*(ymid - points[i][1]);
                if (isNaN(distd)) distd = 999999999;
                dist = '' + (distd + i / 10);
                sortedDistances.push(dist);
                sortedPoints[dist] = points[i];
            };
            sort(sortedDistances);
            var rez = [sortedPoints[sortedDistances[0].toString()], sortedPoints[sortedDistances[1].toString()]];
            line = [];
            line[0] = rez[0];
            line[1] = rez[1];
            return(rez);
        },
        draw: function (cvc, element) {
            cvc.beginPath();
            bpnts = this.getLineBounds(element, {left: 0, top: 0, right: 450, bottom: 550});
            var lx = this.setFromPoints([0,0], [1,0]);
            var ly = this.setFromPoints([0,0], [0, 1]);
            cvc.moveTo(bpnts[0][0], bpnts[0][1]);
            cvc.lineTo(bpnts[1][0], bpnts[1][1]);
            cvc.stroke();
        },
        setFromPoints: function(p0, p1) {
            /*
             X[0] = a = c * (y1-y0) / (x0*y1 - x1*y0)
             X[1] = b = c * (x0 - x1) / (x0*y1 - x1*y0)
             */
            a = p1[1] - p0[1];
            b = p0[0] - p1[0];
            c = p0[0] * p1[1] - p1[0]*p0[1];
            a = p0[1] - p1[1];
            b = p1[0] - p0[0];
            c = p0[0]*p1[1] - p1[0]*p0[1];
            return [a, b, c];
            //return {a: a, b: b, c: c};
        },
        setFromCoefs: function (a1, b1, c1) {
            a = a1; b = b1, c = c1;
        },
        setFromLineAndPoint: function (line, point) {

        },
        getLinkPnt: function (link, pnts, els) {
            linkedElement = els[link.linked];
            toElement = els[link.main];
            snapType = link.type;

        },
        getABC: function () {
            return [a, b, c];
        },

        getIntersection: function (line0, line1) {
            //console.log('get instersectiron', line0, line1);
            var a = line0[0]; var b = line0[1]; var c = line0[2];

            // http://e-maxx.ru/algo/lines_intersection
            // d = a1*b2 - a2*b1; // zero if parallel
            // x = c1*b2 - c2*b1
            // y = a1*c2 - a2*c1

            //var d = a * line1.b - b * line1.a;
            var d = line1[0] * line0[1] - line0[0] * line1[1];
            d = line0[0]*line1[1] - line0[1]*line1[0];
            return [
                (line1[1]* (0 - line0[2]) - line0[1] * (0 - line1[2])) / d,
                //(line1.a * ( 0 - line0.c) - line0.a* (0 - line1.c)) / d
                (line0[0] * ( 0 - line1[2]) - line1[0]* (0 - line0[2])) / d
            ]
        },
            /*
        getPerpendicularLine: function (pnt) {
            var new_a = b;
            var new_b = a;
            var new_c = new_a * pnt[0] + new_b * pnt[1];
            return [new_a, new_b, new_c]
        },
        getTangentArray: function (circle0, circle1) {
            console.log('get tangent array::::::::::::::', circle0, circle1);
            // method taken from english wiki
            function dd() {
                console.log('R, X, k, Y', R, X, k, Y);
                var a2 = R*X - k*Y * Math.sqrt(1-R*R);
                var b2 = R*Y + k*X * Math.sqrt(1-R*R);
                return {
                    a: a2,
                    b: b2,
                    c: r0 - (a2*c0x + b2*c0y)
                }
            }
            var c0x = circle0.pnts[0][0];
            var c0y = circle0.pnts[0][1];
            var c1x = circle1.pnts[0][0];
            var c1y = circle1.pnts[0][1];
            var r0 = circle0.r;
            var r1 = circle1.r;
            var dr = Math.abs(r0 - r1);
            var dx = c1x - c0x;
            var dy = c1y - c0y;
            var d = Math.sqrt(dx*dx+dy*dy);
            console.log('dx, dy, dr, d', dx, dy, dr, d);
            var X = dx / d; var Y = dy / d;
            var R = dr / d;
            var rez= [];
            var k = 1;
            rez.push(dd());
            k = -1;
            rez.push(dd());
            return rez;
        },
        getPerpendicularPoint: function (pnt) {
            return this.getIntersection(this.getPerpendicularLine(pnt));
        },
        getParallelLine: function (pnt) {
            var new_a = a;
            var new_b = b;
            var new_c = new_a * pnt[0] + new_b * pnt[1];
            return [new_a, new_b, new_c]
        },
    */
        getNewCoords: function (pnt) { // use this line as X axe

        },
        getLine: function () {
            return [a, b, c];
        }
    }
}

module.exports = Line;