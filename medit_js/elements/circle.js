/**
 * Created by Dima on 22.12.2017.
 */


var Circle = function () {
    var gl = require('../geom_links')();
    type = 'circle';
    return {
        nRulers: 2,
        rulerNames: ['c', 'rp'],
        params: ['c', 10],
        draw: function (cvc, circle) {
            cvc.beginPath();
            cvc.arc(circle[0][0], circle[0][1], circle[1], 0, Math.PI * 2);
            cvc.stroke();
        },
        isOver: function (circle, pnt) {

        },
        edit: function (circle, point) {
            circle[1] = Math.sqrt((circle[0][0] - point[0])*(circle[0][0] - point[0]) + (circle[0][1] - point[1])*(circle[0][1] - point[1]));
        },
        // editor array is function which returns array of editors of element
        // editors will be called at mousemove event and take current mouse point
        // and then modify element
        // these functions called from 0 to n at creation time OR
        // can be called at edit time
        editorArray: function (circle) {
            return ([
                [gl.point_copy_point, [circle[0]]], // copy from mouse [x,y] to circle[0]
                [gl.scalar_len_point_point, [[circle, 1], circle[0]]]
                ]);
        },
        editor: function (circle, point) {
            // [func, [rez, params without last point]]
            // point needed to choose right function to process
            // in general case it will return array of solvers, but editor should check editorFuncs[i][0].isFunction
            //return [gl.scalar_len_point_point, [[circle, 1], circle[0]]];
            return this.editorArray(circle)[1];
                //[gl.scalar_len_point_point, [[circle, 1], circle[0]]];
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