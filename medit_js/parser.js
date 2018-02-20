

var Parser = function (doc) {
    var GL0 = require('./geom_links.js');
    var gl = GL0();
    return {
        obCreateDefault: function () {
            return {type: '', id: '', solved: true, mainIds: [], linkIds: [], mains: [], links: [], query: '', solvers: []};
        },
        obCreateIfNot: function(id) {
            if (doc.objs.hasOwnProperty(id)) {
                return doc.objs[id];
            } else {
                console.log('create if not: ------------' + id);
                var temp = this.obCreateDefault();
                temp['id'] = id;
                doc.objs[id]=temp;
                return doc.objs[id];
            }
        },
        // get string like: '_point_line'
        paramTypesString: function (parIds) { var rez = '';
            for (i=0; i<parIds.length; i++) {
                rez += '_' + doc.obsj[parIds[i]].type;
            };
            return rez;
        },
        // return ref or [parentRef, index]
        parseParam: function (paramString) { var rez;
            var t = paramString.split('.');
            if (doc.objs.hasOwnProperty(paramString)) {
                rez = doc.objs[paramString].ob;
            } else if (isNaN(parseInt(paramString))) {
                s='';
                this.obCreateIfNot(paramString);
                for (j=0; j<t.length-1; j++) { s+=t[j]; if (j<t.length-2) s+='.'};
                this.obCreateIfNot(s);
                rez=[doc.objs[s].ob, parseInt(t[t.length-1])];
            } else {
                rez=parseInt(paramString);
            };
            return rez;
            document.getElementById('t1').innerHTML=JSON.parse(rez);
            console.log('parseParam', rez);
        },
        parseText: function(text) {
            var i;
            var lines = text.match(/[^\r\n]+/g);
            console.log(JSON.stringify(lines));
            console.log('parseTest lines:', lines);
            for (i=0; i<lines.length; i++) {
                this.parseLine(lines[i]);
            }
        },
        parseLine: function (line) { // creating objects (elements, points, etc) and/or setting links
            var i;
            console.log('------------- parsing LINE:' + JSON.stringify(line));
            var a1 = line.split('=');
            var a2 = a1[1].split('(');
            var a3 = a2[1].split(')');
            var rez = a1[0];
            var func = a2[0];
            console.log('a3 0:', JSON.stringify(a3[0]));
            var params = a3[0].split(',');
            var paramsids = []; // 2d array to store parent line for each of params
            var paramsrefs = [];
            //alert('params:', JSON.stringify(params));
            console.log('a1:'+ JSON.stringify(a1)+ 'a2:'+ JSON.stringify(a2)+ 'tt a3:'+ JSON.stringify(a3));
            console.log('params:', JSON.stringify(params));
            for (i=0; i<params.length; i++) {
                paramsids[i] = [];
                paramsrefs[i]=this.parseParam(params[i]);


/*
OLD
                for (j=0; j<t.length; j++) {
                    // if digit then convert to integer
                    if (parseInt(t[j].charAt(0))==NaN) {
                        paramsids[i][j] = t[j];
                    } else {
                        paramsids[i][j] = parseInt(t[j]);
                    }
                };
                var ref = doc.objs[t[0]].ob; // actually should consider .ob
                for (j=0; j<t.length-1; j++) {
                    ref = ref[paramsids[i][j]];
                };
                // do not foget case when no children, must be something to manage it
                paramsrefs[i] = [ref, paramsids[i][paramsids[i].length]];
                */
            }; // params
            var rezref = this.parseParam(a1[0]);

            var queryParams = this.paramTypesString(doc.objs[rez].mainIds);
            switch (func) {
                case 'point': doc.pnts[rez] = [this.parseParam(params[0]), this.parseParam(params[1])];
                    doc.objs[rez] = this.obCreateIfNot(rez);
                    doc.objs[rez].ob = doc.pnts[rez];
                    doc.objs[rez].type = 'point';
                    break;
                case 'line': doc.lines[rez] = [];
                    break;
                case 'lineseg': doc.linesegs[rez] = [doc.pnts[params[0]], doc.pnts[params[1]]]; // parseParam in future
                    this.obCreateIfNot(rez);
                    doc.objs[rez].ob = doc.linesegs[rez];
                    doc.objs[rez].type = 'lineseg';
                    break;
                case 'mid':
                    if (doc.objs[rez]) {
                        // if object already exists
                    } else {
                        doc.objs[rez] = this.obCreateIfNot();
                        //doc.objs[rez] = this.obCreateDefault();
                    };
                    var queryParams = this.paramTypesString(params);
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
        console.log('parseLine', JSON.stringify(doc));

        }, // parseLine
        parse: function (lines) {

        }
    }
};

module.exports=Parser;