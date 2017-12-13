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
    getLinkPnt: function (link, pnts) { var rez;
        console.log('getLinkPoint', link);
        var t=22;
        linkedElement = els[link.linked];
        toElement = els[link.main];
        snapType = link.type;
    //snap: function (linkedElement, toElement, snapType) { var rez;        TODO: point number of linked element to snap
        if (snapType === 'mid') { rez = [
            linkedElement.pnts[1][0] = (toElement.pnts[0][0] + toElement.pnts[1][0]) / 2,
            linkedElement.pnts[1][1] = (toElement.pnts[0][1] + toElement.pnts[1][1]) / 2];
        }
        if (snapType === 'per') {
            var x0 = linkedElement.pnts[0][0]; var y0 = linkedElement.pnts[0][1];
            var x1 = toElement.pnts[0][0]; var y1 = toElement.pnts[0][1];
            var x2 = toElement.pnts[1][0]; var y2 = toElement.pnts[1][1];
            var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
            var cx1 = (x2-x1)/length; var cy1 = (y2-y1)/length;
            rez = [
            linkedElement.pnts[1][0] = (cx1*cy1*(y0-y1)+x1*cy1*cy1+x0*cx1*cx1),
            linkedElement.pnts[1][1] = (cx1*cy1*(x0-x1)+y0*cy1*cy1+y1*cx1*cx1)
        ]

        }
        return rez;
    }
    }
};

module.exports = Line;