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
            lets solve system of 2 equations:
            A*X = B
            using matrix formula:
            X = A-1 * B
            [a11 a12] -1            1             [a22   - a12  ]
            [a21 a22]     =   a11*a22 - a12*a21  [ -a21    + a11 ]

            x1 = B1 * (a22 - a12) / D
            x2 = B2 * (a11 - a21) / D

            a0 * x + b0* y = c0
            a1*x + b1*y = c1
            d = a0*b1 - b0*a1;
            x =  c0 * (b1 - b0) / d
             y = c1 * (a0 - a1) / d

             new decision here:
             http://e-maxx.ru/algo/lines_intersection
             d = a1*b2 - a2*b1
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