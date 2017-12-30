/**
 * Created by Dima on 25.12.2017.
 */


var Geom = function(defPoint) {
    var defaultPoint = defPoint;
    return {

        'eps': 0.000000001,

        //                                                        POINT
        'point_int_line_line': function (rez, lines) {
            var line0 = lines[0]; var line1 = lines[1];
            var d = line1.a * line0.b - line0.a * line1.b;
            d = line0.a*line1.b - line0.b*line1.a;
            if (Math.abs(d) < this.eps) return 'error: lines are parallel';
            var trez = [
                (line1.b* (0 - line0.c) - line0.b * (0 - line1.c)) / d,
                //(line1.a * ( 0 - line0.c) - line0.a* (0 - line1.c)) / d
                (line0.a * ( 0 - line1.c) - line1.a* (0 - line0.c)) / d
            ];
            rez[0] = trez[0]; rez[1] = trez[1];
            return rez;
        },
        'point_coin_line_coin_line': function (rez, lines) {
            return this.point_int_line_line(rez, lines);
        },
        'point_int_lineseg_lineseg': function (rez, linesegs) {
            var lineseg0 = linesegs[0]; var lineseg1 = linesegs[1];
            var l0 = {}; this.line_point_point(l0, [lineseg0.pnts[0], lineseg0.pnts[1]]);
            var l1 = {}; this.line_point_point(l1, [lineseg1.pnts[0], lineseg1.pnts[1]]);

            var trez = this.point_int_line_line(rez, [l0, l1]);
            //throw new Error('point_int_lineseg lineseg', trez);
            rez.a = trez.a; rez.b = trez.b; rez.c = trez.c;
            return rez;
        },
        'point_int_line_lineseg': function (rez, elements) {
            var l0 = elements[0]; var lineseg = elements[1];
            var l1 = this.line_from_point_point(lineseg.pnts[0], lineseg.pnts[1]);
            var rez = this.point_int_line_line(l0, l1);
            return rez;
        },
        'point_int_lineseg_line': function (rez, elements) {
            var l1 = elements[1]; var lineseg  = elements[0];
            var l0 = this.line_from_point_point(lineseg.pnts[0], lineseg.pnts[1]);
            rez = this.point_int_line_line(l0, l1);
            return rez;
        },
        'point_mid_point_point': function (rez, points) {
            var p0 = points[0]; var p1 = points[1];
            console.log('mid from GEOM                      sldfjlsdjflajsdlfjlas');
            rez[0]=333;
            rez[0] = (p0[0] + p1[0]) / 2;
            rez[1] = (p0[1] + p1[1]) / 2;
            return rez;
        },
        'point_mid_lineseg': function (rez, els) {
            rez[0] = 222;
            var ls = els[0];
            console.log('mid rez0', rez, ls);
            this.point_mid_point_point(rez, ls.pnts[0], ls.pnts[1]);
            console.log('mid rez1', rez);
            return rez;
        },
        'point_coin_point_per_line': function (rez, els) { // not needed because of rez point not coin to point
            return this.point_per_point_line(rez, els);
        },
        'point_per_line_coin_point': function (rez, els) {
            return this.point_per_point_line(rez, [els[1], els[0]]);
        },
        'point_per_point_line': function (rez, els) {
            var point = els[0]; var line = els[1];
            var perLine = this.line_per_point_line(point, line);
            var p1 = this.point_int_line_line(rez, perLine, line);
            //rez[0] = p1[0]; rez[1] = p1[0];    uncomment if not passling rez
            return rez
        },
        'point_per_point_lineseg': function (rez, els) {
            var point = els[0]; var lineseg = els[1];
            var line0 = {}; this.line_from_lineseg(line0, [lineseg]);
            var line1 = {}; this.line_coin_point_per_line(line1, [point, line0]);
            console.log('line0, line1', line0, line1);
            return this.point_int_line_line(rez, [line0, line1]);
        },

        'point_coin_line': function (rez, line) {
            // put perpendicular to line
            rez = this.point_per_point_line(rez, point);
            return rez;
        },


        //                                                    LINE
        //                                  1 SNAP
        'line_coin_point': function (rez, points) {
            rez = this.line_coin_point_coin_point(defaultPoint, points[0]);
            return rez;
        },
        'line_per_line': function (rez, lines) {
            rez = this.line_coin_point_per_line(defaultPoint, lines[0]);
            return rez;
        },
        
        
        
        'line_coin_point_coin_point': function (rez, points) {
            p0 = points[0]; p1 = points[1];
            a = p1[1] - p0[1];
            b = p0[0] - p1[0];
            c = p0[0] * p1[1] - p1[0]*p0[1];
            a = p0[1] - p1[1];
            b = p1[0] - p0[0];
            c = p0[0]*p1[1] - p1[0]*p0[1];
            console.log('setfrom points', a, b, c);
            //rez = {a: a, b: b, c: c};
            rez.a = a; rez.b = b; rez.c = c;
        return rez;
        },
        'line_coin_point_per_line': function (rez, els) {
            var point = els[0]; var line = els[1];
            var a = line.b;
            var b = -line.a;
            var c = 0 - (point[0]*a + point[1]*b);
            rez.a = a; rez.b = b; rez.c = c;
            return rez;
        },
        'line_per_line_coin_point': function (rez, els) {
            console.log('line_per_line_coin_point -------------------------------------------------------------------');
            return this.line_coin_point_per_line(rez, [els[1], els[0]]);
        },
        'line_point_point': function (rez, points) {
            //var line = {};
            return this.line_coin_point_coin_point(rez, points);
        },
        
        
        
        
        'line_per_point_lineseg': function (rez, els) {
            var point = els[0]; var linesegs = els[1];
            var line = {}; this.line_from_lineseg(line, [linesegs[0]]);
            return this.point_per_point_line(rez, [point, line]);
        },
        'line_from_lineseg': function (rez, els) {
            var lineseg = els[0];
        //return this.line_from_point_point(lineseg.pnts[0], lineseg.pnts[1]);
            return this.line_coin_point_coin_point(rez, [lineseg.pnts[0], lineseg.pnts[1]]);
        },
        'line_coin_point_parallel_line': function (rez, els) {
            var point = els[0]; var line = els[1];
            rez.a = line.a; rez.b = line.b; rez.c = 0 - (line.a*point[0] + line.b*point[1])
            return rez;
        },
        'line_coin_point_parallel_lineseg': function (rez, els) {
            var point = els[0]; var lineseg = els[1];
            var line = {}; this.line_coin_point_coin_point(line, [lineseg.pnts[0], lineseg.pnts[1]]);
            return this.line_coin_point_parallel_line(rez, [point, line]);
        },


        //                                                     DISTANCE
        'distance_point_line': function (point, line) {
        var d = Math.sqrt(line.a*line.a + line.b*line.b);
        var an = line.a / d;
        var bn = line.b / d;
        var cn = line.c / d;
        return an * point[0] + bn*point[1] + cn;
        },
        'distance_point_point': function (point0, point1) {
            var dx = point1[0] - point0[0];
            var dy = point1[1] - point0[0];
            return Math.sqrt(dx*dx + dy*dy);
        },
        'distance_point_lineseg': function (point, lineseg) {
            var line = this.line_from_lineseg(lineseg);
            return this.distance_point_line(point, line);
        },


        'points_int_line_circle': function (line, circle) {
        // assume a & b normalized
        var d = this.distance_per_point_line(circle.pnts[0], line);
        var ab = line.a*line.a + line.b*line.b;
        var c = line.c - d / ab;
        var sq = circle.r*circle.r * ab - c*c;
        var x0, y0, x1, y1;
        if (Math.abs(sq) < eps) { // 1 point
            x0 = 0 - line.a*c / ab;
            y0 = 0 - line.b*c / ab;
            return [[x0 + circle.pnts[0][0], y + circle.pnts[0][1]]];
        };
        if (sq > 0) {
            x0 = (0 - line.a*c + b*Math.sqrt(sq)) / ab;
            y0 = (0 - line.b*c - a*Math.sqrt(sq)) / ab;
            x1 = (0 - line.a*c - b*Math.sqrt(sq)) / ab;
            y1 = (0 - line.b*c + a*Math.sqrt(sq)) / ab;
            return [
                [x0 + circle.pnts[0][0], y0 + circle.pnts[0][1]],
                [x1 + circle.pnts[0][0], y1 + circle.pnts[0][1]]
            ];
        } else {
            return []
        }
    },
        'points_int_circle_line': function (circle, line) {
        return this.points_int_line_circle(line, circle);
        },



        //                                                            LINES
        'lines_parallel_line_circle': function (line, circle) {
        var sab = Math.sqrt(line.a*line.a + line.b*line.b);
        var an = line.a / sab; var bn = line.b / sab; var c1 = line.c / sab;
        return [
            {a: an, b: bn, c: cn + circle.r},
            {a: an, b: bn, c: cn - circle.r}
        ];
        },
        'line_parallel_circle': function (rez, elements) {
            var c1 = elements[0];
            var c0 = {type: 'circle', pnts: [defaultPoint], r: 0};
            var trez = this.lines_parallel_circle_circle(c0, c1);
            rez.a = trez[0].a;
            rez.b = trez[0].b;
            rez.c = trez[0].c;
            return rez;

        },
        'line_parallel_circle_coin_point': function (rez, elements) {
            var c1 = elements[0];
            var c0 = {type: 'circle', pnts: [elements[1]], r:0};
                var trez = this.lines_parallel_circle_circle(rez, [c0, c1]);
            rez.a = trez[0].a;
            rez.b = trez[0].b;
            rez.c = trez[0].c;
            return rez;

        },
        'lines_parallel_circle_line': function (circle, line) {
        return this.lines_parallel_line_circle(line, circle);
        },
        'line_parallel_circle_parallel_circle': function (rez, els) {
            var trez = this.lines_parallel_circle_circle(rez, els);
            rez.a = trez[0].a;
            rez.b = trez[0].b;
            rez.c = trez[0].c;
            return rez;

        },
        'lines_parallel_circle_circle': function (rez, els) {
            var circle0 = els[0]; var circle1 = els[1];
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
            R = -dr / d;
            k = 1;
            rez.push(dd());
            k = -1;
            rez.push(dd());
            return rez;
        },



        solveGeom: function(task, data) {

        }
    }
}


module.exports = Geom;

