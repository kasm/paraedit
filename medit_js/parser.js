

var Parser = function (doc) {
    return {
        obCreateDefault: function () {
            return {type: '', id: '', solved: true, mainIds: [], linkIds: [], mains: [], links: [], query: '', solvers: []};
        },
        obCreateIfNot: function(id) {
            if (doc.objs.hasOwnProperty(id)) {
                return doc.objs[id];
            } else {
                var temp = this.obCreateDefault();
                temp[id] = id;
                doc.objs[id]=temp;
                return doc.objs[id];
            }
        },
        parseLine: function (line) {
            var a1 = line.split('=');
            var a2 = a1[1].split('(');
            var a3 = a2[1].split(')');
            var rez = a1[0];
            var func = a2[0];
            var params = a3[0].split(',');
            switch (func) {
                case 'point': doc.pnts[rez] = [this.parseVal(params[0]), this.parseVal(params[1])];
                    doc.objs[rez] = this.obCreateDefault();
                    doc.objs[rez].ob = doc.pnts[rez];
                    doc.objs[rez].type = 'point';
                    break;
                case 'line': doc.lines[rez] = [];
                    break;
                case 'lineseg': doc.linesegs[rez] = [doc.pnts[params[0]], doc.pnts[params[1]]];
                    doc.objs[rez] = this.obCreateDefault();
                    doc.objs[rez].ob = this.linesegs[rez];
                    doc.objs[rez].type = 'lineseg';
                    break;
                case 'mid':
                    if (doc.objs[rez]) {
                        // if object already exists
                    } else {
                        doc.objs[rez] = this.obCreateDefault();
                    };
                    doc.objs[rez].mainIds[0] = params[0];
                    doc.objs[rez].mains[0] = doc.objs[params[0]].ob;

                    break;
                case 'per':


            }


        },
        parse: function (lines) {

        }
    }
}