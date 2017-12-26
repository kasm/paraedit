/**
 * Created by Dima on 25.12.2017.
 */


var geom = {
    'eps': 0.000000001,
    'point_int_line_line': function (line0, line1) {
        var d = line1.a * line0.b - line0.a * line1.b;
        d = line0.a*line1.b - line0.b*line1.a;
        if (d < this.eps) return 'error: lines are parallel';
        return [
            (line1.b* (0 - line0.c) - line0.b * (0 - line1.c)) / d,
            //(line1.a * ( 0 - line0.c) - line0.a* (0 - line1.c)) / d
            (line0.a * ( 0 - line1.c) - line1.a* (0 - line0.c)) / d
        ]
    },
    'point_int_lineseg_lineseg': function (lineseg0, lineseg1) {
        var l0 = this.line_from_point_point(lineseg0.pnts[0], lineseg0.pnts[1]);
        var l1 = this.line_from_point_point(lineseg1.pnts[0], lineseg1.pnts[1]);
        var p = this.point_int_line_line(l0, l1);
        return p;
    },
    'point_int_line_lineseg': function (l0, lineseg) {
        var l1 = this.line_from_point_point(lineseg.pnts[0], lineseg.pnts[1]);
        var p = this.point_int_line_line(l0, l1);
        return p;
    },
    'point_int_lineseg_line': function (lineseg, l1) {
        var l0 = this.line_from_point_point(lineseg.pnts[0], lineseg.pnts[1]);
        var p = this.point_int_line_line(l0, l1);
        return p;
    },
    'point_mid_point_point': function (p0, p1) {
        var x = (p0[0] + p1[0]) / 2;
        var y = (p0[1] + p1[1]) / 2;
        return [x, y];
    },
    'point_per_point_line': function (point, line) {
        var perLine = this.line_per_point_line(point, line);
        var p1 = this.point_int_line_line(perLine, line);
        return p1;
    },
    'point_per_point_lineseg': function (point, lineseg) {
        var line0 = this.line_from_lineseg(lineseg);
        var line1 = this.line_per_point_line(point, line0);
        return this.point_int_line_line(line0, line1);
    },
    'line_from_point_point': function (p0, p1) {
        a = p1[1] - p0[1];
        b = p0[0] - p1[0];
        c = p0[0] * p1[1] - p1[0]*p0[1];
        a = p0[1] - p1[1];
        b = p1[0] - p0[0];
        c = p0[0]*p1[1] - p1[0]*p0[1];
        console.log('setfrom points', a, b, c);
        return {a: a, b: b, c: c};
    },
    'line_per_point_line': function (point, line) {
        var a = line.b;
        var b = line.a;
        var c = 0 - (point[0]*a + point[1]*b);
        return {a: a, b: b, c: c}
    },
    'line_per_point_lineseg': function (point, lineseg) {
        var line = this.line_from_lineseg(lineseg);
        return this.point_per_point_line(point, line);
    },
    'line_from_lineseg': function (lineseg) {
        return this.line_from_point_point(lineseg.pnts[0], lineseg.pnts[1]);
    },
    'line_parallel_point_line': function (point, line) {
        //
        return {a: line.a, b: line.b, c: 0 - (line.a*point[0] + line.b*point[1])}
    },
    'line_parallel_point_lineseg': function (point, lineseg) {
        var line = this.line_from_point_point(lineseg.pnts[0], lineseg.pnts[1]);
        return this.line_parallel_point_line(point, line);
    },
    'distance_per_point_line': function (point, line) {
        var d = Math.sqrt(line.a*line.a + line.b*line.b);
        var an = line.a / d;
        var bn = line.b / d;
        var cn = line.c / d;
        return an * point[0] + bn*point[1] + cn;
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
    'lines_parallel_line_circle': function (line, circle) {
        var sab = Math.sqrt(line.a*line.a + line.b*line.b);
        var an = line.a / sab; var bn = line.b / sab; var c1 = line.c / sab;
        return [
            {a: an, b: bn, c: cn + circle.r},
            {a: an, b: bn, c: cn - circle.r}
        ];
    },



    solveGeom: function(task, data) {

    }
};
