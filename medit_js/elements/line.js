/**
 * Created by Dima on 10.12.2017.
 */

var Line = function () {
    var a, b, c;
    var type = 'line';

    return {
        draw: function (cvc, element2) {
            cvc.beginPath();

            var element = this.setFromPoints([0, 300], [10, 250]);
            console.log('element line2', element);

            var lx = this.setFromPoints([0,0], [1,0]);
            console.log('lx', lx);

            var ly = this.setFromPoints([0,0], [0, 1]);
            var p0 = this.getIntersection(element, lx);
            var p1 = this.getIntersection(element, ly);
            console.log('p0, p1 ddd', p0, p1);
            cvc.moveTo(p0[0], p0[1]);
            cvc.lineTo(p1[0], p1[1]);
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
            console.log('setfrom points', a, b, c);
            return {a: a, b: b, c: c};
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
            console.log('get instersectiron', line0, line1);
            var a = line0.a; var b = line0.b; var c = line0.c;
            /*
             http://e-maxx.ru/algo/lines_intersection
             d = a1*b2 - a2*b1; // zero if parallel
             x = c1*b2 - c2*b1
             y = a1*c2 - a2*c1
             */
            var d = a * line1.b - b * line1.a;
            return [
                (c*line1.b - line1.c*b) / d,
                (a * line1.c - line1.a*c) / d
            ]
        },
        getPerpendicularLine: function (pnt) {
            var new_a = b;
            var new_b = a;
            var new_c = new_a * pnt[0] + new_b * pnt[1];
            return [new_a, new_b, new_c]
        },
        getTangentArray: function (circle0, circle1) {
            // method taken from english wiki
            function dd() {
                var a = R*X - k*Y / (1-R*R);
                var b = R*Y + k*X / (1-R*R);
                return {
                    a: a,
                    b: b,
                    c: r0 - (a*c0x + b*c0y)
                }
            }
            var c0x = circle0.center[0];
            var c0y = circle0.center[1];
            var c1x = circle1.center[0];
            var c1y = circle1.center[1];
            var r0 = circle0.r;
            var r1 = circle1.r;
            dr = Math.abs(r0 - r1);
            dx = c1x - c0x;
            dy = c1y - c0y;
            d = Math.sqrt(dx*dx+dy*dy);
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
        getNewCoords: function (pnt) { // use this line as X axe

        },
        getLine: function () {
            return [a, b, c];
        }
    }
}

module.exports = Line;