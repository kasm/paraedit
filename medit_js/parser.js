

var Parser = function (doc) {
    console.log('parser doc', doc);
    var GL0 = require('./geom_links.js');
    var GC = require('./geom_core.js');
    var gl = GL0();
    var gc = GC();
    var lines;
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

        // takes ID of parent el and array 'params' from 'circle.js'
        createPointsAndFillParams: function (id, paramsStrArray) { var i;
            var paramsOb = {str: [], ob: []}; var fullId;
            for (i = 0; i<paramsStrArray.length; i++) {
                if (isNaN(parseInt(paramsStrArray[i]))) {
                    fullId = id+'.'+paramsStrArray[i]
                    doc.pnts[fullId] = [0, 0];
                    doc.objs[fullId] = {
                        id: fullId,
                        type: 'point',
                        mains: [],
                        mainIds: [],
                        solved: true,
                        ob: doc.pnts[fullId]
                    };
                    paramsOb.str[i] = fullId;
                    doc.doclines.push({rez: fullId, func: 'point', params: ['0', '0']});
                    paramsOb.ob[i] = doc.pnts[fullId];
                } else {
                    paramsOb.ob[i] = parseInt(paramsStrArray[i]);
                    paramsOb.str[i] = paramsStrArray[i];
                }
            };
            return paramsOb;
        },
        createElementAndPoints: function (id, type, params) {
            var strAndOb = this.createPointsAndFillParams(id, params);
            //var params3 = this.parseParam2(params2);
            var i;
            var line = {};
            line.params = strAndOb.str;
            line.params2 = {};
            line.params2.main = strAndOb.ob;
            line.params2.parts = strAndOb.str;
            line.rez = id;
            line.func = type;
            line.type = type;
            doc.doclines.push({rez: id, func: type, params: line.params});
            var r = this.parseLine(line, '');
            return r;

/*
            doc.objs[id] = this.obCreateIfNot(id);
            doc.objs[id].type = type;
            doc.objs[id].ob = rez.main;
            doc.objs[id].parts = params;
            return doc.objs[id];
            */
        },

        // return main array (for solver) and part of query and optional - ref array
        // main examples:
        // lineseg: [pointref, pointref]
        // circle [pointref, radius]
        // TTRS:
        // main: [line, side, line, side, radius]
        // refs: [line, [main, 1], line1, [main, 3], [main, 4]]
        // query: '_line_scalar_line_scalar_scalar'
        // ids: ['l1',,'l2',,]
        // types: ['line' ....]
        parseParam2: function (parT) { var rez= {main: [], refs: [], query: '', ids: [], types: [], idns: [], parts: []}; var i;
            rez.parts = parT;
            for (i=0; i<parT.length; i++) {
                /*

                                SHOULD BE '[' check here   OR   JSON.parse('[' + part[i] + ']')
                if (Array.isArray(JSON.parse(parT[i]))) {
                    rez.main[i] = JSON.parse(parT[i]);
                    rez.refs[i] = rez.main[i];
                    rez.types[i] = 'array';
                    rez.query+= '_' + rez.types[i];
                    continue;
                }
                */
                var jt0 = '[' + parT[i] + ']';
                //var jt = JSON.parse(jt0);
                t=parT[i].split('.');
                ts = '';
                for (j=0; j<t.length-1; j++) {
                    ts+=t[j];
                    if (j<t.length-2) ts+='.';
                };
                if (doc.objs.hasOwnProperty(parT[i])) { // ID
                    rez.refs[i] = doc.objs[parT[i]].ob;
                    rez.main[i] = doc.objs[parT[i]].ob;
                    rez.ids.push(doc.objs[parT[i]].id);
                    //rez.ids[i] = doc.objs[parT[i]].id;
                    rez.types[i] = doc.objs[parT[i]].type;
                    rez.idns.push(i);
                } else if (doc.objs.hasOwnProperty(ts)) { // [parent, number]
                    rez.refs[i] = [doc.objs[ts].ob, parseInt(t[t.length-1])];
                    //rez.refs[i] = [doc.objs[ts].ob, i];
                    rez.main[i] = rez.refs[i];
                    rez.ids.push(doc.objs[ts].id);
                    rez.types[i] = 'scalar';
                    rez.idns.push(i);
                }
                /*
                else if (Array.isArray(jt[0])) {             // array
                    rez.main[i] = jt[0];
                    rez.refs[i] = rez.main[i];
                    rez.types[i] = 'array';
                }
                */
                else if (isNaN(parseFloat(parT[i]))) { // error - no ID and parent and no number
                    rez.main[i] = parT[i];
                    rez.refs[i] = rez.main[i];
                    rez.types[i] = 'string';
                    //alert('parse param error');
                } else { //                             number
                    var k = parseInt(parT[i]);
                    rez.main[i] = k;
                    rez.refs[i] = [rez.main[i], i];
                    //rez.ids[i] = '';
                    rez.types[i] = 'scalar';
                }
            rez.query+= '_' + rez.types[i];
            }// i
            return rez;
        },
/*
       parseSplitted: function () {
            var i;

            for (i=0; i<lines.length; i++) {
                var params2 = this.parseParam2(lines[i].params);
                this.parseLine(lines[i], false);
            } // false meain not by points
        },
        */
        split1: function (text) {
            var rez = {};
            rez.raw = text;
            var a1 = text.split('=');
            rez.rez = a1[0];
            var a2 = a1.split('(');
            rez.func = a2[0];
            var a3 = a2[1].split(')');
            rez.params = a3[0].split(',');
        },
        splitter: function (text) {
            doc.jsonlines = {};
            this.JSONparserAll(doc.doclines, text);
            return 0;
            var i; var a1, a2, a3, a4, rezText;
            lines = []; doc.doclines.length = 0;
            var lines1 = text.match(/[^\r\n]+/g);
            if (!(lines1 === null)) {
                for (i=0; i<lines1.length; i++) {
                    lines[i] = {};
                    lines[i].raw = lines1[i];
                    a1 = lines[i].raw.split('=');
                    lines[i].rez = a1[0];
                    a2 = a1[1].split('(');
                    lines[i].func=a2[0];
                    a3 = a2[1].split(')');
                    a4 = a3[0].split(',');
                    lines[i].params = a3[0].split(',');
                    doc.doclines[i] = lines[i];
                };
            }
            return lines;
        },

        JSONparserAll: function (rez, text) {
            rez.length = 0;
            var lines1 = text.match(/[^\r\n]+/g);
            if (!(lines1 === null)) {
                for (i=0; i<lines1.length; i++) {
                    rez[i] = this.JSONparserLine(lines1[i]);
                }
            }
            return rez;
        },
        JSONparserLineOld: function (text) {
            console.log(text);
            var rez = {};
            var a1 = text.split('=');
            rez.rez = a1[0];
            var a2 = a1[1].split('(');
            rez.func = a2[0];
            var a3 = a2[1].split(')');
            var a3a = '['+a3[0] + ']';
            // "["ls11","c1002","["-1","1","1"]"]"
            // "[ls11,c1002,[-1,1,1]]"
            // "["ls11","c1002",["-1","1","1"]]"
            var bbb = a3a.replace(/[\[]([A-Za-z0-9\.\-]+),/g, '["$1",');
            var bbb2 = bbb.replace(/[,]([A-Za-z0-9\.\-]+),/g, ',"$1",');
            var bbb3 = bbb2.replace(/[,]([A-Za-z0-9\.\-]+)\]/g, ',"$1"]');

            var bbb21 = bbb3.replace(/[,]([A-Za-z0-9\.\-]+),/g, ',"$1",');
            var bbb31 = bbb21.replace(/[,]([A-Za-z0-9\.\-]+)\]/g, ',"$1"]');

            var bbb4 = bbb31.replace(/[\[]([A-Za-z0-9\.\-]+)\]/g, '["$1"]');
            rez.params = JSON.parse(bbb4);
            console.log(JSON.stringify(rez));
            return rez;
        },
        JSONparserLine: function (text) {
            console.log(text);
            var rez = {};
            var a1 = text.split('=');
            rez.rez = a1[0];
            var a2 = a1[1].split('(');
            rez.func = a2[0];
            var a3 = a2[1].split(')');
            var a3a = '[' + a3[0] + ']';
            rez.params = JSON.parse(a3a);
            return rez;
        },


            parser: function () { // from doc.doclines
            var i;
            //doc.objs = {};
            for (i=0; i<doc.doclines.length; i++) {
                doc.doclines[i].params2 = this.parseParam2(doc.doclines[i].params);
                this.parseLine(doc.doclines[i])
            }
            return doc.doclines;
        },

        isElem: function (t) {
            return (t === 'line' || t === 'circle' || t === 'lineseg');
        },
        isElemAll: function (t) {
            return (t === 'line' || t === 'circle' || t === 'lineseg' || t === 'point');
        },

        isLink: function (t) {
            return (t === 'mid' || t === 'int' || t === 'per' || t === 'eq' || t === 'tan2' || t ==='tan3');
        },
        // line format:
        //
        parseLine: function (line, byPoints) { // creating objects (elements, points, etc) and/or setting links
            var i;
            //var params2 = this.parseParam2(line.params);
            if (this.isElem(line.func)) {
                doc.objs[line.rez] = this.obCreateIfNot(line.rez);
                doc.objs[line.rez].raw = line.raw;
                doc.objs[line.rez].ids = line.params2.ids;
                doc.objs[line.rez].parts = line.params2.parts;
            }
            switch (line.func) {
                case 'point': doc.pnts[line.rez] = line.params2.main;
                    doc.objs[line.rez] = this.obCreateIfNot(line.rez);
                    doc.objs[line.rez].ob = doc.pnts[line.rez];
                    doc.objs[line.rez].type = 'point';
                    break;
                case 'line':
                    doc.lines[line.rez] = [];
                    if (line.params.length == 2) {
                        gc.line_point_point(doc.lines[line.rez], doc.objs[line.params2.ids[0]].ob, doc.objs[line.params2.ids[1]].ob);
                    } else {
                        doc.lines[line.rez][0] = line.params[0];
                        doc.lines[line.rez][1] = line.params[1];
                        doc.lines[line.rez][2] = line.params[2];
                    }
                    doc.objs[line.rez] = this.obCreateIfNot(line.rez);
                    doc.objs[line.rez].ob = doc.lines[line.rez];
                    doc.objs[line.rez].type = 'line';
                    break;
                case 'lineseg':
                    doc.linesegs[line.rez] = line.params2.main;
                    this.obCreateIfNot(line.rez);
                    doc.objs[line.rez].ob = doc.linesegs[line.rez];
                    doc.objs[line.rez].type = 'lineseg';
                    break;
                case 'circle': doc.circles[line.rez] = line.params2.main; //[doc.pnts[params[0].id],params[1]];
                    this.obCreateIfNot(line.rez);
                    doc.objs[line.rez].ob = doc.circles[line.rez];
                    doc.objs[line.rez].type = 'circle';
                    break;
                case 'mid':
                    doc.objs[line.rez].query = 'point_mid' + line.params2.query;
                    doc.objs[line.rez].mainIds = line.params2.ids;
                    doc.objs[line.rez].mains = [doc.objs[line.rez].ob].concat(line.params2.main);
                    doc.objs[line.rez].func = gl['point_mid' + line.params2.query];
                    break;
                case 'add':
                    doc.objs[rez] = this.obCreateIfNot(id);
                    break;
                case 'eq':
                    r = this.parseParam2([line.rez]);
                    doc.objs[r.ids[0]].query = 'scalar_eq_scalar';
                    doc.objs[r.ids[0]].mainIds = line.params2.ids;
                    doc.objs[r.ids[0]].mains[0] = r.refs[0];
                    doc.objs[r.ids[0]].mains[1] = line.params2.refs[0];
                    doc.objs[r.ids[0]].func = gl[doc.objs[r.ids[0]].query];

                    break;
                case 'per':
                    doc.objs[line.rez].query = 'point_per' + line.params2.query;
                    doc.objs[line.rez].mainIds = line.params2.ids;
                    doc.objs[line.rez].mains = [doc.objs[line.rez].ob].concat(line.params2.main);
                    doc.objs[line.rez].func = gl['point_per' + line.params2.query];

                    break;
                case 'per_ls':
                    doc.objs[line.rez].query = 'lineseg_per_lineseg';
                    doc.objs[line.rez].mainIds = line.params2.ids;
                    doc.objs[line.rez].mains = [doc.objs[line.rez].ob].concat(line.params2.main);
                    doc.objs[line.rez].func = gl['lineseg_per_lineseg'];
                    break;
                case 'int':
                    doc.objs[line.rez].query = 'point_int' + line.params2.query;
                    console.log(doc.objs[line.rez].query + ':' + JSON.stringify(line.params2.ids));
                    doc.objs[line.rez].mainIds = line.params2.ids;
                    doc.objs[line.rez].mains = [doc.objs[line.rez].ob].concat(line.params2.main);
                    doc.objs[line.rez].func = gl['point_int' + line.params2.query];
                    break;
                case 'coin':
                    //doc.objs[line.rez].query = 'line_coin' + line.params2.query;
                    doc.objs[line.rez].query = doc.objs[line.rez].type + '_coin' + line.params2.query;
                    doc.objs[line.rez].mainIds=line.params2.ids;
                    doc.objs[line.rez].mains=[doc.objs[line.rez].ob].concat(line.params2.main);
                    doc.objs[line.rez].func=gl[doc.objs[line.rez].query];
                    break;
                case 'circle_TTRS':
                    doc.objs[line.rez].query = 'circle_TTRS'; //r.query;
                    doc.objs[line.rez].mainIds = line.params2.ids;
                    doc.objs[line.rez].mains = [doc.objs[line.rez].ob].concat(line.params2.main);
                    doc.objs[line.rez].func  = gl['circle_TTRS'];
                    break;
                case 'tan2':
                    doc.objs[line.rez].query = doc.objs[line.rez].type + '_' + 'tan2' + line.params2.query;
                    doc.objs[line.rez].mainIds = line.params2.ids;
                    doc.objs[line.rez].mains = [doc.objs[line.rez].ob].concat(line.params2.main);
                    doc.objs[line.rez].func  = gl[doc.objs[line.rez].query];
                    break;
                case 'tan21':
                    doc.objs[line.rez].query = 'circle_univers';
                    var id0 = line.params[0];
                    var id1 = line.params[1];
                    var qq = '_' + doc.objs[id0].type + '_' + doc.objs[id1].type;
                    var m = [line.params2.main[0], line.params2.main[1], qq, line.params2.main[2], line.params2.main[3]];
                    doc.objs[line.rez].mainIds = line.params2.ids;
                    doc.objs[line.rez].mains = [doc.objs[line.rez].ob].concat(m);
                    doc.objs[line.rez].func  = gl[doc.objs[line.rez].query];
                    break;
                case 'len':
                    doc.objs[line.rez].query = 'point_len_point_lineseg';
                    doc.objs[line.rez].mainIds = line.params2.ids;
                    doc.objs[line.rez].mains = [doc.objs[line.rez].ob].concat(line.params2.main);
                    doc.objs[line.rez].func = gl[doc.objs[line.rez].query];
                    break;

            }
            return doc.objs[line.rez];
        }, // parseLine
        parse: function (lines) {

        }
    }
};

module.exports=Parser;