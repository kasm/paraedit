/**
 * Created by Dima on 25.12.2017.
 */


var geom = {
    'point_int_line_line': function (line0, line1) {
        var d = line1.a * line0.b - line0.a * line1.b;
        d = line0.a*line1.b - line0.b*line1.a;
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
    'point_mid_point_point': function (p0, p1) {
        var x = (p0[0] + p1[0]) / 2;
        var y = (p0[1] + p1[1]) / 2;
        return [x, y];
    },



    solveGeom: function(task, data) {

    }
};
