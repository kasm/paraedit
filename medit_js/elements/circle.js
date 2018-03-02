/**
 * Created by Dima on 22.12.2017.
 */


var Circle = function () {
    var gl = require('../geom_links')();
    type = 'circle';
    return {
        nPoints: 2,
        draw: function (cvc, circle) {
            cvc.beginPath();
            cvc.arc(circle[0][0], circle[0][1], circle[1], 0, Math.PI * 2);
            cvc.stroke();
        },
        edit: function (circle, point) {
            circle[1] = Math.sqrt((circle[0][0] - point[0])*(circle[0][0] - point[0]) + (circle[0][1] - point[1])*(circle[0][1] - point[1]));
        },
        editor: function (circle, point) {
            // [func, [rez, params without last point]]
            // point needed to choose right function to process
            // in general case it will return array of solvers, but editor should check editorFuncs[i][0].isFunction
            return [gl.scalar_len_point_point, [[circle, 1], circle[0]]];
        },
        getByPoints: function (circle, pnts) {
            var r = Math.sqrt( (pnts[0][0]-pnts[1][0]) * (pnts[0][0]-pnts[1][0]) + (pnts[0][1]-pnts[1][1]) * (pnts[0][1]-pnts[1][1]));
            circle[0][0] = pnts[0][0];
            circle[0][1] = pnts[0][1];
            circle[1] = r;
            return circle;
        }
    }
}

module.exports = Circle;