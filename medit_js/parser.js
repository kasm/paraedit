

var Parser = function (doc) {
    var gl = require('/geom_links.js')();
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
        paramTypesString: function (parIds) { var rez = '';
            for (i=0; i<parIds.length; i++) {
                rez += '_' + doc.obsj[parIds[i]].type;
            };
            return rez;
        },
        parseLine: function (line) {
            var a1 = line.split('=');
            var a2 = a1[1].split('(');
            var a3 = a2[1].split(')');
            var rez = a1[0];
            var func = a2[0];
            var params = a3[0].split(',');
            var paramsids = []; // 2d array to store parent line for each of params
            var paramsrefs = [];
            for (i=0; i<params.length; i++) {
                paramsids[i] = [];
                var t = params[i].split('.');
                for (j=0; j<t.length; j++) {
                    // if digit then convert to integer
                    paramsids[i][j] = t[j];
                };
                var ref = doc.objs; // actually should consider .ob
                for (j=0; j<t.length-1; j++) {
                    ref = ref[t[j]];
                };
                // do not foget case when no children, must be something to manage it
                paramsrefs[i] = [ref, paramsids[i][paramsids[i].length]];
            }
            var queryParams = this.paramTypesString(doc.objs[rez].mainIds);
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
                        doc.objs[rez] = this.obCreateIfNot();
                        //doc.objs[rez] = this.obCreateDefault();
                    };
                    var query = 'point_mid' + queryParams;
                    doc.objs[rez].mainIds[0] = params[0];
                    doc.objs[rez].mainIds[1] = params[1];
                    doc.objs[rez].mains[0] = doc.objs[params[0]].ob;
                    doc.objs[rez].mains[1] = doc.objs[params[1]].ob;
                    doc.objs[rez].func = gl.query;
                    break;
                case 'add':
                    doc.objs[rez] = this.obCreateIfNot(id);

                case 'per':


            }


        },
        parse: function (lines) {

        }
    }
}