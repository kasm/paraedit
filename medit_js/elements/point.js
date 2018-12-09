/**
 * Created by Dima on 09.03.2018.
 */

var Point = function () {
    var gl = require('../geom_links')();
    type = 'point';
    return {
        nRulers: 1,
        rulerNames: ['p'],
        params: ['p'],
        paramTypes: ['val', 'val'], // id, val, array
        ob: [[0, 0]],
        draw: function (cvc, circle) {
            cvc.beginPath();
            var el0 = gc.point_model2view(circle[0]);
            debugger;
            cvc.arc(el0[0], el0[1], circle[1], 0, Math.PI * 2);
            cvc.stroke();
        }

    }; // ret
}; // Point

module.exports = Point;