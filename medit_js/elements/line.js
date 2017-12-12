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
    getLinkPoint: function (link) { var rez;
        linkedElement = els[link.linked];
        toElement = els[link.main];
        snapType = link.type;
    //snap: function (linkedElement, toElement, snapType) { var rez;        TODO: point number of linked element to snap
        if (snapType === 'mid') { rez = [
            (toElement.pnts[0][0] + toElement.pnts[1][0]) / 2,
            (toElement.pnts[0][1] + toElement.pnts[1][1]) / 2];
        }
        if (snapType === 'per') { rez = [

        ]

        }
        return rez;
    }
    }
};

module.exports = Line;