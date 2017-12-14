/**
 * Created by Dima on 10.12.2017.
 */


var Line = function (els1) {
    var els = els1;
    return {
    draw: function (cvc, element) {
        cvc.beginPath();
        if (element.hasOwnProperty('pntsCalc')) {
            pnts=element.pntsCalc;
        } else {
            pnts = element.pnts;
        }
        //cvc.moveTo(element.pntsCalc[0][0], element.pntsCalc[0][1]);
        //cvc.lineTo(element.pntsCalc[1][0], element.pntsCalc[1][1]);
        cvc.moveTo(element.pnts[0][0], element.pnts[0][1]);
        cvc.lineTo(element.pnts[1][0], element.pnts[1][1]);
        cvc.stroke();
    },
    getLinkPnt: function (link, pnts, els) { var rez;
        console.log('getLinkPoint', link);
        var t=22;
        linkedElement = els[link.linked];
        toElement = els[link.main];
        snapType = link.type;
    //snap: function (linkedElement, toElement, snapType) { var rez;        TODO: point number of linked element to snap
        if (snapType === 'mid') { rez = [
            linkedElement.pnts[link.pnti][0] = (toElement.pnts[0][0] + toElement.pnts[1][0]) / 2,
            linkedElement.pnts[link.pnti][1] = (toElement.pnts[0][1] + toElement.pnts[1][1]) / 2];
        }
        if (snapType === 'per') {
            // linkedElement.pnts[link.pnti-1]  - perpendicular from prev point
            var x0 = linkedElement.pnts[link.pnti-1][0];
            var y0 = linkedElement.pnts[link.pnti-1][1];
            var x1 = toElement.pnts[0][0]; var y1 = toElement.pnts[0][1];
            var x2 = toElement.pnts[1][0]; var y2 = toElement.pnts[1][1];
            var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
            var cx1 = (x2-x1)/length; var cy1 = (y2-y1)/length;
            rez = [
            linkedElement.pnts[link.pnti][0] = (cx1*cy1*(y0-y1)+x1*cy1*cy1+x0*cx1*cx1),
            linkedElement.pnts[link.pnti][1] = (cx1*cy1*(x0-x1)+y0*cy1*cy1+y1*cx1*cx1)
        ]

        }
        if (snapType === 'int') {
            // assume both elements are lines
            var e0 = els[link.e0]; var e1 = els[link.e1];
            var e0x0 = e0.pnts[0][0]; var e0y0 = e0.pnts[0][1];
            var e0x1 = e0.pnts[1][0]; var e0y1 = e0.pnts[1][1];
            var e1x0 = e1.pnts[0][0]; var e1y0 = e1.pnts[0][1];
            var e1x1 = e1.pnts[1][0]; var e1y1 = e1.pnts[1][1];
            var dx0 = e0x1-e0x0; var dy0= e0y1-e0y0;
            var dx1 = e1x1-e1x0; var dy1= e1y1-e1y0;

            var x_int = ((e1y0 - e0y0)*dx0*dx1 + e0x0*dy0*dx1 - e1x0*dy1*dx0) / (dy0*dx1 - dy1*dx0);
            var y_int = (dy0/dx0)*x_int + e0y0 - dy0/dx0 * e0x0;
            rez = []; linkedElement.pnts[link.pnti] = [];
                linkedElement.pnts[link.pnti][0] = x_int;
                linkedElement.pnts[link.pnti][1] = y_int;
                var t = 5;
            /*
            k0 = dy0 / dx0; k1 = dy1 / dx1;
            y= kx + b
            b0 = e0y0 - k0 * e0x0
            b1 = e1y0 - k1 * e1x0
            equation to find x_int:
            k0*x_int + b0 = k1*x_int + b1
            dy0/dx0 * x_int + e0y0 - dy0/dx0*e0x0 = dy1/dx1* x_int + e1y0 - dy1/dx1*e1x0
            mul all by dx0*dx1:
            x_int * (dy0*dx1 - dy1*dx0) = (e1y0 - e0y0)*dx0*dx1 + e0x0*dy0*dx1 - e1x0*dy1*dx0;



            k0 = (e0y1-e0y0)/(e0x1-e0x0);
            k1 = (e1y1-e1y0)/(e1x1-e1x0);
            y = kx + b
            b0 = e0y0 - k0* e0x0
            b1 = e1y0 - k1*e1x0
            k0*x_int + b0 = k1*x_int + b1
             (e0y1-e0y0)/(e0x1-e0x0)*x_int + e0y0 - (e0y1-e0y0)/(e0x1-e0x0)*e0x0 =
                = (e1y1-e1y0)/(e1x1-e1x0) * x_int + e1y0 - (e1y1-e1y0)/(e1x1-e1x0)*e1x0
             x_int* ((e0y1-e0y0)/(e0x1-e0x0) - (e1y1-e1y0)/(e1x1-e1x0)) =
                = e1y0-e0y0 + (e0y1-e0y0)/(e0x1-e0x0)*e0x0 + - (e1y1-e1y0)/(e1x1-e1x0)*e1x0
             mul all by (e1x1-e1x0)* (e0x1-e0x0)
             x_int ((e0y1-e0y0)*(e1x1-e1x0) - (e1y1-e1y0)*(e0x1-e0x1) =
                 (e1y0-e0y0)*(e1x1-e1x0)* (e0x1-e0x0) + e
             */


        }
        return rez;
    }
    }
};

module.exports = Line;