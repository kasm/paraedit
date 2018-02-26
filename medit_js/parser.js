

var Parser = function (doc) {
    console.log('parser doc', doc);
    var GL0 = require('./geom_links.js');
    var GC = require('./geom_core.js');
    var gl = GL0();
    var gc = GC();
    return {
        obCreateDefault: function () {
            return {type: '', id: '', solved: true, mainIds: [], linkIds: [], mains: [], links: [], query: '', solvers: []};
        },
        obCreateIfNot: function(id) {
            if (doc.objs.hasOwnProperty(id)) {
                return doc.objs[id];
            } else {
                var temp = this.obCreateDefault();
                temp['id'] = id;
                doc.objs[id]=temp;
                return doc.objs[id];
            }
        },
        // get string like: '_point_line'
        paramTypesString: function (parIds) { var rez = '';
            for (i=0; i<parIds.length; i++) {
                rez += '_' + doc.objs[parIds[i].id].type;
            };
            return rez;
        },
        // return ref or [parentRef, index] // old
        // ret - {id: id, ref: ref, index: index or -1}
        parseParam: function (paramString) { var rez = {};
            var t = paramString.split('.');
            var ts = '';
            var i;
            for (i=0; i<t.length-1; i++) {
                ts+=t[i];
                if (i<t.length-2) ts+='.';
            };
            if (doc.objs.hasOwnProperty(paramString)) {
                rez.ref = doc.objs[paramString].ob;
                rez.id=paramString;
            } else if (doc.objs.hasOwnProperty(ts)) {
                var index = parseInt(t[t.length-1]);
                rez.ref = [doc.objs[ts].ob, index];
                rez.id = ts;
                rez.index=parseInt(t[t.length-1]);
            } else if (isNaN(parseInt(paramString))) { // from here not using for some time
                s='';
                rez.ref = this.obCreateIfNot(paramString);
                rez.id = paramString;
                for (j=0; j<t.length-1; j++) { s+=t[j]; if (j<t.length-2) s+='.'};
                this.obCreateIfNot(s);
                //rez=[doc.objs[s].ob, parseInt(t[t.length-1])];
            } else {
                rez=parseInt(paramString);
            };
            return rez;
            document.getElementById('t1').innerHTML=JSON.parse(rez);

        },
        parseText: function(text) {
            var i;
            var lines = text.match(/[^\r\n]+/g);
            for (i=0; i<lines.length; i++) {
                this.parseLine(lines[i]);
            }
        },

        parseLine: function (line) { // creating objects (elements, points, etc) and/or setting links
            var i;
            //console.log('------------- parsing LINE:' + JSON.stringify(line));
            var a1 = line.split('=');
            var a2 = a1[1].split('(');
            var a3 = a2[1].split(')');
            var rezText = a1[0];
            var func = a2[0];
            var paramsText = a3[0].split(',');
            var params = [];

            var r = {};
            //alert('params:', JSON.stringify(params));
            for (i=0; i<paramsText.length; i++) {
                params[i] = this.parseParam(paramsText[i]);
            }; // params
            //var rez = this.parseParam(a1[0]);


            //var queryParams = this.paramTypesString(doc.objs[rez].mainIds);
            switch (func) {
                case 'point': doc.pnts[rezText] = [params[0], params[1]];
                    doc.objs[rezText] = this.obCreateIfNot(rezText);
                    doc.objs[rezText].ob = doc.pnts[rezText];
                    doc.objs[rezText].type = 'point';
                    break;
                case 'line':
                    doc.lines[rezText] = []; gc.line_point_point(doc.lines[rezText], doc.objs[params[0].id].ob, doc.objs[params[1].id].ob);
                    doc.objs[rezText] = this.obCreateIfNot(rezText);
                    doc.objs[rezText].ob = doc.lines[rezText];
                    doc.objs[rezText].type = 'line';
                    break;
                case 'lineseg': doc.linesegs[rezText] = [doc.pnts[params[0].id], doc.pnts[params[1].id]]; // parseParam in future
                    this.obCreateIfNot(rezText);
                    doc.objs[rezText].ob = doc.linesegs[rezText];
                    doc.objs[rezText].type = 'lineseg';
                    break;
                case 'circle': doc.circles[rezText] = [doc.pnts[params[0].id],params[1]];
                    this.obCreateIfNot(rezText);
                    doc.objs[rezText].ob = doc.circles[rezText];
                    doc.objs[rezText].type = 'circle';
                    break;
                case 'mid':
                    if (doc.objs[rezText]) {
                        // if object already exists
                    } else {
                        doc.objs[rezText] = this.obCreateIfNot();
                        //doc.objs[rez] = this.obCreateDefault();
                    };
                    var queryParams = this.paramTypesString(params);
                    var query = 'point_mid' + queryParams;
                    doc.objs[rezText].ob.query = query;
                    doc.objs[rezText].mainIds[0] = params[0].id;
                    doc.objs[rezText].mainIds[1] = params[1].id;
                    doc.objs[rezText].mains[0] = doc.objs[rezText].ob;
                    doc.objs[rezText].mains[1] = doc.objs[params[0].id].ob;
                    doc.objs[rezText].mains[2] = doc.objs[params[1].id].ob;
                    doc.objs[rezText].func = gl[query];
                    break;
                case 'add':
                    doc.objs[rez] = this.obCreateIfNot(id);
                    break;
                case 'eq':
                    //this.obCreateIfNot(rez);
                    var r;
                    r = this.parseParam(rezText);
                    doc.objs[r.id].query='scalar_eq_scalar';
                    doc.objs[r.id].mainIds[0]=params[0].id;
                    doc.objs[r.id].mains[1]=params[0].ref; //doc.objs[params[0]].ob;
                    doc.objs[r.id].mains[0] = r.ref;
                    doc.objs[r.id].func = gl[doc.objs[r.id].query];
                    break;
                case 'per':
                    var qparams = this.paramTypesString(params);
                    var query = 'point_per' + qparams;
                    doc.objs[rezText].query = query;
                    doc.objs[rezText].mainIds[0] = params[0].id;
                    doc.objs[rezText].mainIds[1] = params[1].id;
                    doc.objs[rezText].mains[0] = doc.objs[rezText].ob;
                    doc.objs[rezText].mains[1] = doc.objs[params[0].id].ob;
                    doc.objs[rezText].mains[2] = doc.objs[params[1].id].ob;
                    doc.objs[rezText].func = gl[query];

                    break;
                case 'int':
                    var qparams = this.paramTypesString(params);
                    var query = 'point_int'+ qparams;
                    doc.objs[rezText].query = query;
                    doc.objs[rezText].mainIds[0] = params[0].id;
                    doc.objs[rezText].mainIds[1] = params[1].id;
                    doc.objs[rezText].mains[0] = doc.objs[rezText].ob;
                    doc.objs[rezText].mains[1] = doc.objs[params[0].id].ob;
                    doc.objs[rezText].mains[2] = doc.objs[params[1].id].ob;
                    doc.objs[rezText].func = gl[query];
                    break;
                case 'coin':
                    var qparams = this.paramTypesString(params);
                    var query = 'line_coin' + qparams;
                    doc.objs[rezText].query = query;
                    doc.objs[rezText].mainIds[0] = params[0].id;
                    doc.objs[rezText].mainIds[1] = params[1].id;
                    doc.objs[rezText].mains[0] = doc.objs[rezText].ob;
                    doc.objs[rezText].mains[1] = doc.objs[params[0].id].ob;
                    doc.objs[rezText].mains[2] = doc.objs[params[1].id].ob;
                    doc.objs[rezText].func = gl[query];
                    break;




            }

        }, // parseLine
        parse: function (lines) {

        }
    }
};

module.exports=Parser;