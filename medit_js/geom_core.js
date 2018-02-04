/**
 * Created by Dima on 04.01.2018.
 */



var GeomCore = function() {

    return {
        'eps': 0.000000001,

        //                                                                  POINT
        'point_int_line_line': function (rez, line0, line1) {
            var a0 = line0[0]; var b0=line0[1]; var c0=line0[2];
            var a1 = line1[0]; var b1=line0[1]; var c1=line0[2];
            var d = a0*b1 - b0*a1;
            if (Math.abs(d) < this.eps) return 'error: lines are parallel';
            rez[0] = (b1*(0-c0) - b0*(0-c1))/d;
            rez[1] = (a0*(0-c1) - a1*(0-c0))/d;
            return rez;
        },
        'point_mid_point_point': function(rez, p0, p1) {
            rez[0] = (p0[0]+p1[0])/2;
            rez[1] = (p0[1]+p1[1])/2;
            return rez;
        },
        'point_per_point_line': function(rez, point, line) {
            var line1 = []; this.line_per_point_line(line1, point, line);
            return this.point_int_line_line(rez, line, line1);
        },

        //                                                                      LINE
        'line_per_point_line': function(rez, point, line) {
            var a = line[0]; var b = line[1]; var c = line[2];
            rez[0] = b; rez[1] = -a;
            rez[2] = 0 - (point[0]*a + point[1]*b);
            return rez;
        },
        'line_parallel_point_line': function(rez, point, line) {
            rez[0] = line[0]; rez[1] = line[1];
            // c = 0 - (a*x + b*y)
            rez[2] = 0 - (line[0] * point[0] + line[1]*point[1]);
            return rez;
        },
        'line_parallel_lsd': function(rez, line, side, distance) {
            rez[0] = line[0]; rez[1] = line[1];
            rez[2] = line[2] + side * distance;
            return rez;
        },
        'line_point_point': function(rez, p0, p1) {
            var a = p0[1] - p1[1];
            var b = p1[0] - p0[0];
            var d = Math.sqrt(a*a + b*b);
            var c = (p0[0]*p1[1] - p1[0]*p0[1]) / d;
            a = a/d; b = b/d;
            rez[0] = a; rez[1] = b; rez[2] = c;
            return rez;
        },
        'line_lineseg': function (rez, ls) {
            return this.line_point_point(rez, ls.pnts[0], ls.pnts[1]);
        },
        
        
        'get_points': function (type, ob) {
            switch (type) {
                case 'lineseg': return ob; break;
                case 'line': return []; break;
                case 'circle': return [ob[0]]; break;
                default: return []; break;
            }
        },
        'get_lens': function (type, ob) {
            switch (type) {
                case 'lineseg': return []; break;
                case 'line': return []; break;
                case 'circle': return ob[1]; break;
                default: return []; break;
            }
        },
        'apply_matrix3': function (point_rez, matrix, point) {
            // points can be same thats why using temp vars
            // https://www.youtube.com/watch?v=DWNWLF5Hxcs
            var x, y;
            x = point[0]*matrix[0][0] + point[1]*matrix[1][0] + 1 * matrix[2][0];
            y = point[0]*matrix[0][1] + point[1]*matrix[1][1] + 1 * matrix[2][1];
            point_rez[0] = x;
            point_rez[1] = y;
            return point_rez;
        },



        'rotate_point': function (point_rez, base, point, angleOrDir) { // maybe to store angles as [cos, sin]
            var co, si;
            if (Array.isArray(angleOrDir)) {
                co = angleOrDir[0];
                si = angleOrDir[1];
            } else {
                co = Math.cos(angleOrDir);
                si = Math.sin(angleOrDir);
            };
            var d0 = point[0] - base[0];
            var d1 = point[1] = base[1];
            point[0] = base[0] + d0*co - d1*si;
            point[1] = base[1] + d0*si + d1*co;
        },
        'rotate_common': function (base, ob, angleOrDir) {
            var co, si;
            if (Array.isArray(angleOrDir)) {
                co = angleOrDir[0];
                si = angleOrDir[1];
            } else {
                co = Math.cos(angleOrDir);
                si = Math.sin(angleOrDir);
            };
            for (i=0; i<ob.pnts.length; i++) {
                this.rotate_point(ob.pnts[i], base, ob.pnts[i], [co, si])
            };
        },
        'scale_point': function (point_rez, base, point, koef) {
            var dx = point[0] - base[0]; var dy = point[1] - base[1];
            point_rez[0] = base[0] + koef* dx;
            point_rez[1] = base[1] + koef * dy;
            return point_rez;
        },
        'scale_circle': function (ob_rez, base, ob, koef) {  // specific object OR ob.ob ???
            this.scale_point(ob_rez[0], base, ob[0], koef);
            ob_rez[1] = ob[1] * koef;
            return ob_rez;
        },
        'scale_common': function(ob_rez, base, ob, koef) {
            for (i=0; i<ob.pnts.length; i++) {
                this.scale_point(ob_rez.pnts[i], base, ob.pnts[i], koef);
            }
            return ob_rez;
        },
        'scale_lineseg': function (base, ob, koef) {

        }




//                                                              END of GEOM CORE




}
}


module.exports = GeomCore;

