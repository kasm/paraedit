/**
 * Created by Dima on 22.12.2017.
 */


var Circle = function () {
    type = 'circle';
    return {
        draw: function (cvc, circle) {
            cvc.beginPath();
            cvc.arc(circle.pnts[0][0], circle.pnts[0][1], circle.r, 0, Math.PI * 2);
            cvc.stroke();
        }
    }
}

module.exports = Circle;