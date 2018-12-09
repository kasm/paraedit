/**
 * Created by Dima on 05.01.2018.
 */


var GeomLinks = function(DefPoint) {
    var gc = require('./geom_core')();
    var DefaultPoint = DefPoint;
    return {
        selectionRange: 5,
        'point_plineMove_pline_scalar': function (rez, pline, vala, ind) {
            return gc.get_pline_para_point(rez, pline, vala[ind]);
        },
        'pline_points': function (rez, points) {

        },

        'getElementFromPath': function (elRef, path) {
            // for instance lineseg1.p1.x
            var rootEl = doc_objs;
            elRef = rootEl;
            var pathArray = path.split('.');
            for (i=0; i<pathArray.length; i++) {
                elRef = elRef[pathArray[i]];
            }
        },
        'add': function (rez, val0, val1) {
            rez[0][rez[1]] = val0[0][val0[1]] + val1[0][val1[1]];
            return rez;
        },
        'scalar_eq_scalar': function (rez, val) {
            rez[0][rez[1]] = val[0][val[1]];
        },
        'scalar_len_point_point': function (rez, pnts0, pnts1) {
            var r = Math.sqrt( (pnts0[0]-pnts1[0]) * (pnts0[0]-pnts1[0]) + (pnts0[1]-pnts1[1]) * (pnts0[1]-pnts1[1]));
            rez[0][rez[1]] = r;
            return rez;
        },
        'point_copy_point': function (rez, pnt) {
            rez[0] = pnt[0]; rez[1] = pnt[1];
            return rez;
        },



        //                                                                          POINT
        'point_mid_point_point': function (rez, p0, p1) {
            rez[0] = (p0[0]+p1[0])/2;
            rez[1] = (p0[1]+p1[1])/2;
            return rez;
        },

        'point_mid_lineseg': function (rez, ls) {
            return gc.point_mid_point_point(rez, ls[0], ls[1]);
        },

        'point_int_line_line': function (rez, line0, line1) {
            return gc.point_int_line_line(rez, line0, line1);
        },
        'point_int_lineseg_lineseg': function (rez, ls0, ls1) {
            var line0 = []; gc.line_point_point(line0, ls0[0], ls0[1]);
            var line1 = []; gc.line_point_point(line1, ls1[0], ls1[1]);
            var r = gc.point_int_line_line(rez, line0, line1);
            return rez;
        },
        'point_int_lineseg_lineseg_scalar': function (rez, ls0, ls1, n) {
            return this.point_int_lineseg_lineseg(rez, ls0, ls1);
        },
        'point_int_line_lineseg': function (rez, line0, ls) {
            var line1 = []; gc.line_point_point(line1, ls[0], ls[1]);
            var r = gc.point_int_line_line(rez, line0, line1);
            return rez;
        },
        'point_int_line_lineseg_scalar': function (rez, line, lineseg, scalar) {
            return this.point_int_line_lineseg(rez, line, lineseg);
        },
        'point_int_lineseg_line_scalar': function (rez, lineseg, line, scalar) {
            return this.point_int_line_lineseg(rez, line, lineseg);
        },
        'point_int_lineseg_line': function (rez, ls, line1) {
            var line0 = []; gc.line_point_point(line0, ls[0], ls[1]);
            var r = gc.point_int_line_line(rez, line0, line1);
            return rez;
        },
        'point_per_point_lineseg': function (rez, point, lineseg) {
            var l = []; gc.line_lineseg(l, lineseg);
            return gc.point_per_point_line(rez, point, l);
        },

        'lineseg_per_lineseg': function (rez, lineseg) {
            this.point_per_point_lineseg(rez[1], rez[0], lineseg);
        },
        'point_len_point_line': function (rez, len, point, line) {
            return gc.point_len_point_line(rez, len, point, line);
        },
        'point_len_point_lineseg': function (rez, len, point, lineseg) {
            var l = []; l = gc.line_lineseg(l, lineseg);
            return gc.point_len_point_line(rez, len, point, l);
        },
        'point_coin_point': function (rez, p) {
            rez[0] = p[0];
            rez[1] = p[1];

            return rez;
        },



        //                                                              POINTS
        'points_int_line_circle': function (line, circle) {
            var rez = gc.points_int_line_circle(line, circle);
            return rez;
        },
        'points_int_circle_line': function (circle, line) {
            return this.points_int_line_circle(line, circle);
        },
        'points_int_lineseg_circle': function (lineseg, circle) {
            var l0 = []; gc.line_lineseg(l0, lineseg);
            return this.points_int_line_circle(l0, circle);
        },
        'point_int_lineseg_circle_scalar': function (rez, ls, c, n) {
            var l0 = []; gc.line_lineseg(l0, ls);
            return this.point_int_line_circle_scalar(rez, l0, c, n);
        },
        'points_int_circle_lineseg': function (circle, lineseg) {
            var l0 = []; gc.line_lineseg(l0, lineseg);
            return this.points_int_line_circle(l0, circle);
        },

        'point_int_circle_lineseg_scalar': function (rez, c, ls, n) {
            var l0 = []; gc.line_lineseg(l0, ls);
            return this.point_int_line_circle_scalar(rez, l0, c, n);
        },

        'points_int_line_line': function (l0, l1) {
            var trez = [[], []];
            gc.point_int_line_line(trez[0], l0, l1);
            trez[1][0] = trez[0][0];
            trez[1][1] = trez[0][1];
            return trez;
        },
        'point_int_line_line_scalar': function (rez, l0, l1, n) {
            var trez;
            trez = this.points_int_line_line(l0, l1);
            rez[0] = trez[0][0];
            rez[1] = trez[0][1];
            return rez;
        },

        'point_int_line_circle_scalar': function (rez, line, circle, n) {
            var trez = [];
            trez = gc.points_int_line_circle(line, circle);
            rez[0] = trez[n][0];
            rez[1] = trez[n][1];
            return rez;
        },
        'point_int_circle_line_scalar': function (rez, circle, line, n) {
            return this.point_int_line_circle_scalar(rez, line, circle, n);
        },

        'points_int_circle_circle': function (c0, c1) {
            return gc.points_int_circle_circle(c0, c1);
        },
        'point_int_circle_circle_scalar': function (rez, c0, c1, n) {
            var trez = []
            trez = gc.points_int_circle_circle(c0, c1);
            rez[0] = trez[n][0];
            rez[1] = trez[n][1];
        },





        'point_links_coin_line_coin_lineseg': function (rez, links) {
            var line0 = links[0].main[0];
            var ls1 = links[1].main[0];
            var line1 = []; gc.line_point_point(line1, ls1.pnts[0], ls1.pnts[1]);
            return gc.point_int_line_line(rez, line0, line1);
        },
        'point_links_coin_lineseg_coin_line': function (rez, links) {
            var ls0 = links[0].main[0];
            var line0 = []; gc.line_point_point(line0, ls0.pnts[0], ls0.pnts[1]);
            var line1 = links[1].main[0];
            return gc.point_int_line_line(rez, line0, line1);
        },
        'point_links_mid_lineseg': function (rez, links) {
            var ls = links[0].main[0];
            return gc.point_mid_point_point(rez, ls.pnts[0], ls.pnts[1]);
        },
        'point_links_per_point_line': function (rez, links) {
            var p = links[0].main[0]; var l = links[1].main[0];
            return gc.point_per_point_line(rez, p, l);
        },




        //                                                                      LINES
        'line_coin_point_point': function (rez, p0, p1) {
            return gc.line_point_point(rez, p0, p1);
        },
        'line_links_2points': function (rez, links) {
            var p0 = links[0].main[0];
            var p1 = links[0].main[1];
            return gc.line_point_point(rez, p0, p1);
        },
        'line_links_coin_point_per_line': function (rez, links) {
            var p = links[0].main[0];
            var l = links[1].main[0];
            return gc.line_per_point_line(rez, p, l);
        },
        'line_links_coin_point_per_lineseg': function (rez, links) {
            var p = links[0].main[0];
            var l = []; gc.line_lineseg(l, links[1].main[0]);
            return gc.line_per_point_line(rez, p, l);
        },
        'line_links_coin_lineseg': function (rez, links) {
            return gc.line_lineseg(rez, links[0].main[0]);
        },
        'line_links_parallelPointLine': function (rez, links) {
            var p = links[0].main[0]; var l = links[0].main[1];
            return gc.line_parallel_point_line(rez, p, l);
        },

        //                                                                  LINESEG
        // make 1st line segment perpendicular to the 2nd (change ls0.pnts[1] position)
        'lineseg_links_per_lineseg_lineseg': function (rez, links) {
            var ls0 = links[0].main[0]; var ls1 = links[0].main[1];
            var l1 = []; gc.line_lineseg(l1, ls1);
            gc.point_per_point_line(rez.pnts[1], rez.pnts[0], l1);
            return rez; // return reference to the changed line segment
        },

        //                                                                      CIRCLE
        'circle_TTRS': function (rez, line0, side0, line1, side1) {
            return gc.circle_TTRS(rez, line0, side0, line1, side1);
            /*
            var r = rez[1]; //var signs = els[2];
            var tline0 = [line0[0], line0[1], line0[2] + side0*r];
            var tline1 = [line1[0], line1[1], line1[2] + side1*r];
            //var r = els[2];
            //var line0 = {a: els[0].a, b: els[0].b, c: els[0].c + signs[0]*r};
            //var line1 = {a: els[1].a, b: els[1].b, c: els[1].c + signs[1]*r};
            var center = []; this.point_int_line_line(center, tline0, tline1);
            rez[0][0] = center[0];
            rez[0][1] = center[1];
            //rez.r = r;
            return rez;
            */
        },

        'circles_tan2_line_line_radius': function (l0, l1, r) {
            return gc.circles_tan2_line_line_radius(l0, l1, r);
        },
        'circle_tan2_line_line': function (rez, l0, l1, n) {
            var trez = this.circles_tan2_line_line_radius(l0, l1, rez[1]);
            rez[0][0] = trez[n][0][0];
            rez[0][1] = trez[n][0][1];
            rez[1] = trez[n][1];
            return rez;
        },

        'circles_tan2_lineseg_lineseg_radius': function (ls0, ls1, r) {
            var l0 = []; gc.line_lineseg(l0, ls0);
            var l1 = []; gc.line_lineseg(l1, ls1);
            return this.circles_tan2_line_line_radius(l0, l1, r);
        },
        'circles_tan2_line_lineseg_radius': function (l0, ls1, r) {
            //var l0 = []; gc.line_lineseg(l0, ls0);
            var l1 = []; gc.line_lineseg(l1, ls1);
            return this.circles_tan2_line_line_radius(l0, l1, r);
        },
        'circles_tan2_lineseg_line_radius': function (ls0, l1, r) {
            var l0 = []; gc.line_lineseg(l0, ls0);
            //var l1 = []; gc.line_lineseg(l1, ls1);
            return this.circles_tan2_line_line_radius(l0, l1, r);
        },

        'circle_tan2_lineseg_lineseg': function (rez, ls0, ls1, n) {
            var l0 = []; gc.line_lineseg(l0, ls0);
            var l1 = []; gc.line_lineseg(l1, ls1);
            return this.circle_tan2_line_line(rez, l0, l1, n);
        },
        'circle_tan2_line_lineseg': function (rez, l0, ls1, n) {
            //var l0 = []; gc.line_lineseg(l0, ls0);
            var l1 = []; gc.line_lineseg(l1, ls1);
            return this.circle_tan2_line_line(rez, l0, l1, n);
        },
        'circle_tan2_lineseg_line': function (rez, ls0, l1, n) {
            var l0 = []; gc.line_lineseg(l0, ls0);
            //var l1 = []; gc.line_lineseg(l1, ls1);
            return this.circle_tan2_line_line(rez, l0, l1, n);
        },
        'circle_univers': function(rez, el0, el1, types, selector) {
            return gc.circle_univers(rez, el0, el1, types, selector);
        }




    } // return
} // GeomLinks

module.exports=GeomLinks;