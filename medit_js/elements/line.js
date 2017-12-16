/**
 * Created by Dima on 10.12.2017.
 */

var Line = function () {
    var a, b, c;
    var type = 'line';
    return {
        setFromPoints: function(p0, p1) {
            /*
             X[0] = a = c * (y1-y0) / (x0*y1 - x1*y0)
             X[1] = b = c * (x0 - x1) / (x0*y1 - x1*y0)
             */
            a = p1[1] - p0[1];
            b = p0[0] - p1[0];
            c = p0[0] * p1[1] - p1[0]*p0[1];
        },
        setFromCoefs: function (a1, b1, c1) {
            a = a1; b = b1, c = c1;
        },
        setFromLineAndPoint: function (line, point) {

        },
        getABC: function () {
            return [a, b, c];
        },
        getIntersection: function (line) {
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
             */
            var d = a * line.b - b * line.a;
            return [
                c * (line.b - b) / d,
                line.c * (a - line.a) / d
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

        }
    }
}

module.exports = Line;