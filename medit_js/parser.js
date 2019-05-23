

var Parser = function (doc) {
    console.log('parser doc', doc);
    var GL0 = require('./geom_links.js');
    var GC = require('./geom_core.js');
    var gl = GL0();
    var gc = GC();
    var lines;
    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
    return {

        obCreateDefault: function () {
            return {type: '', id: '', solved: true, mainIds: [], linkIds: [], mains: [],
                links: [], query: '', solvers: [], props: clone(doc.doc.currentProps)};
        },
        obCreateIfNot: function(id) {
            if (doc.docObjs.hasOwnProperty(id)) {
                return doc.docObjs[id];
            } else {
                var temp = this.obCreateDefault();
                temp['id'] = id;
                doc.docObjs[id]=temp;
                return doc.docObjs[id];
            }
        },
        // get string like: '_point_line'
        paramTypesString: function (parIds) { var rez = '';
            for (i=0; i<parIds.length; i++) {
                rez += '_' + doc.docObjs[parIds[i].id].type;
            };
            return rez;
        },

        // takes ID of parent el and array 'params' from 'circle.js'
        createPointsAndFillParams: function (id, paramsStrArray) { var i;
            var paramsOb = {str: [], ob: []}; var fullId;
            for (i = 0; i<paramsStrArray.length; i++) {
                if (isNaN(parseInt(paramsStrArray[i]))) {
                    fullId = id + '.' + paramsStrArray[i]
                    doc.pnts[fullId] = [0, 0];
                    doc.docObjs[fullId] = {
                        id: fullId,
                        type: 'point',
                        mains: [],
                        mainIds: [],
                        solved: true,
                        ob: doc.pnts[fullId],
                    };
                    paramsOb.str[i] = fullId;
                    doc.doclines.push({rez: fullId, func: 'point', params: ['0', '0']});
                    paramsOb.ob[i] = doc.pnts[fullId];
                } else if (Array.isArray(paramsStrArray[i])) {
                    // passed array as param
                    fullId = id + '.' + i;
                    doc.pnts[fullId] = paramsStrArray[i];
                    doc.docObjs[fullId] = {
                        id: fullId,
                        type: 'point',
                        mains: [],
                        mainIds: [],
                        solved: true,
                        ob: doc.pnts[fullId]
                    };
                    paramsOb.str[i] = fullId;
                    doc.doclines.push({rez: fullId, func: 'point', params: doc.pnts[fullId]});
                    paramsOb.ob[i] = doc.pnts[fullId];

                } else {
                    paramsOb.ob[i] = parseInt(paramsStrArray[i]);
                    paramsOb.str[i] = paramsStrArray[i];
                }
            };
            return paramsOb;
        },
        createMultiLineSeg: function (id, paramValues) {

        },

        //  id - name of el (c1), type - circle, params - c, r
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
            doc.docObjs[id] = this.obCreateIfNot(id);
            doc.docObjs[id].type = type;
            doc.docObjs[id].ob = rez.main;
            doc.docObjs[id].parts = params;
            return doc.docObjs[id];
            */
        },

        // create element and generate ID
        createElementAndGenereateID: function (type, params) {
            var elobs = {
                'lineseg': doc.linesegs,
                'circle': doc.circles
            };
            var obar = elobs[type];
            var id = type + '00' + obar.length;
            this.createElementAndPoints(id, type, params);

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
                if (doc.docObjs.hasOwnProperty(parT[i])) { // ID
                    rez.refs[i] = doc.docObjs[parT[i]].ob;
                    rez.main[i] = doc.docObjs[parT[i]].ob;
                    rez.ids.push(doc.docObjs[parT[i]].id);
                    //rez.ids[i] = doc.docObjs[parT[i]].id;
                    rez.types[i] = doc.docObjs[parT[i]].type;
                    rez.idns.push(i);
                } else if (doc.docObjs.hasOwnProperty(ts)) { // [parent, number]
                    rez.refs[i] = [doc.docObjs[ts].ob, parseInt(t[t.length-1])];
                    //rez.refs[i] = [doc.docObjs[ts].ob, i];
                    rez.main[i] = rez.refs[i];
                    rez.ids.push(doc.docObjs[ts].id);
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

        // rez, func, params
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

        CNCRegexSplitter: function (t) {
            var r = t.match(/([A-Z]{1}[\-0-9]+\.?[0-9]*)/g);
            return r;
        },

        // text to array of objects {gmode:'01', 'X':undefined, 'Y':'22.8'}
        CNCsplitter: function (CNCText) {
            function getCNCparam(p) {
                return [p[0], p.substr(1, p.length-1)];
            }
            var GMode = '01'; // G01, G02, G03
            // gmode = (g - 1) * 2 - (g>1) * 3    // 0 for G01, 1 for G02, -1 for G03
            var lines = [];
            var lines1 = CNCText.match(/[^\r\n]+/g);
            if (!(lines1 === null)) {
                for (i=0; i<lines1.length; i++) {
                    lines[i] = {};
                    lines[i].raw = lines1[i];
                    lines[i].splitted = this.CNCRegexSplitter(lines[i].raw);
                    for (j=0; j<lines[i].splitted.length; j++) {
                        var par1 = getCNCparam(lines[i].splitted[j]);
                        if (par1[0] === 'G') {
                            GMode = par1[2];
                        };
                        lines[i].gmode = GMode;
                        lines[i][par1[0]] = par1[1];
                    };
                    //if (lines[i]['X'] === undefined) lines[i]['X']=0;
                }
            }
            return lines;
        },
        CNCsplitted2pointsArray: function (CNClines) {
            var pa = [];
            var GMode = '01';
            for (i =0; i<CNClines.length; i++) {
                li = CNClines[i];
                if (li.G) GMode = li.G;
                li.G = GMode;
                if (li.X === undefined && li.Y === undefined) continue;
                pa_current = pa[pa.length-1];
                /*
                if (li.X === undefined) li.X = pa_current[0];
                if (li.Y === undefined) li.Y = pa_current[0];
                */
                var p1 = [Number(li.X), Number(li.Y)];
                if (li.G === '01') {
                    pa.push(p1);
                } else { /// 02 or 03
                    var sign1 = -1;
                    var c0 = [Number(li.I), Number(li.J)]
                    if (li.G === '02') sign1 = 1;
                    gc.get_points_from_arc(pa, pa_current, p1, c0, 11, sign1);
                };
            };
            return pa;
        },

        // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

        makeid: function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        },

        textCircle: function (data) {
            var id = this.makeid();
            var s = '';
            var point_id = 'point_'+id+'.c';
            s+=point_id+'=point("'+data[0][0].toString()+'","'+data[0][1].toString() +'")\n';
            s+='circle_'+id + '=circle("'+point_id+'","'+data[1].toString()+'")\n';
            return s;
        },

        pointsArray2PlineText: function (id, pa) {
            var s = ""; var i;
            var pl_string = 'plineCNC'+id+'=pline(';
            for (i=0; i<pa.length; i++) {
                var pname = 'plineCNC'+id + i;
                var pa13 = pa[i];
                var pa130 = pa13[0];
                var pa131 = pa13[1];
                var pa132 = 5.3; pa132 = pa[i][1];

                s+=pname +'=point("'+pa[i][0].toString() + '","' +
                    pa[i][1].toString() + '")\n';
                pl_string+='"'+pname +'"';
                if (i < pa.length-1) pl_string+= ',';
            };
            s+=pl_string + `)\n`;
            return s;
        },

        CNCpointsArray2paraeditText: function (CNCid, pa, isInterval) {
            var s = ""; var i;
            var pl_string = 'plineCNC'+CNCid+'=pline(';
            for (i=0; i<pa.length; i++) {
                var pname = 'plineCNC'+CNCid + i;
                var pa13 = pa[i];
                var pa130 = pa13[0];
                var pa131 = pa13[1];
                var pa132 = 5.3; pa132 = pa[i][1];

                s+=pname +'=point("'+pa[i][0].toString() + '","' +
                    pa[i][1].toString() + '")\n';
                pl_string+='"'+pname +'"';
                if (i < pa.length-1) pl_string+= ',';
            };
            s+=pl_string + `)\n`;
            if (isInterval) s+=`pCNC${CNCid}=point("0","10")\npmCNC${CNCid}=point("0","0")\n
pmCNC${CNCid}=plineMove("plineCNC${CNCid}","pCNC${CNCid}","0")\n
tCNC${CNCid}=setInterval("10","pCNC${CNCid}","0","myinc2","3")\n
cCNC${CNCid}=circle("pmCNC${CNCid}","12")\n`;

                  //  ')\npCNC=point("0","0")\n'+



            /*
                ')\npCNC=point("0","10")\npmCNC=point("0","0")\n'+
            'pmCNC=plineMove("plineCNC","pCNC","0")\n'+

            'tCNC=setInterval("10","pCNC","0","myinc2","1")\n';
            s+='cCNC=circle("pmCNC","12")\n';
            */
            return s;
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
            //doc.docObjs = {};
            for (i=0; i<doc.doclines.length; i++) {
                doc.doclines[i].params2 = this.parseParam2(doc.doclines[i].params);
                if (doc.doclines[i].func == 'layer') {
                    doc.currentLayer = doc.doclines[i].params2.main[0];
                    continue;
                };
                if (doc.doclines[i].func == 'props') {
                    doc.doc.currentProps[doc.doclines[i].params2.main[0]] =
                        doc.doclines[i].params2.main[1];


//                    var propsChanges = JSON.parse(doc.doclines[i].params2.main[0]);
  //                  for (pid in propsChanges) {
    //                    doc.doc.currentProps[pid] = propsChanges[pid];
      //              };

                    continue;
                };
                this.parseLine(doc.doclines[i])
            }
            return doc.doclines;
        },

        isElem: function (t) {
            return (t === 'line' || t === 'circle' || t === 'lineseg' ||
            t === 'pline' || t === 'image'
            );
        },
        isElemAll: function (t) {
            return (t === 'line' || t === 'circle' || t === 'lineseg' || t === 'pline'
            || t === 'point' || t === 'image'
            );
        },

        isLink: function (t) {
            return (t === 'mid' || t === 'int' || t === 'per' || t === 'eq' ||
            t === 'tan2' || t ==='tan3');
        },
        // line format:
        //
        parseLine: function (line, byPoints) { // creating objects (elements, points, etc) and/or setting links
            var i;
            function clone(obj) {
                if (null == obj || "object" != typeof obj) return obj;
                var copy = obj.constructor();
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
                }
                return copy;
            }

            var dd0 = {};

            //var params2 = this.parseParam2(line.params);
            if (this.isElem(line.func)) {
                doc.docObjs[line.rez] = this.obCreateIfNot(line.rez);
                doc.docObjs[line.rez].layer = doc.currentLayer;
                doc.docObjs[line.rez].props = clone(doc.doc.currentProps);
                doc.docObjs[line.rez].raw = line.raw;
                doc.docObjs[line.rez].ids = line.params2.ids;
                doc.docObjs[line.rez].parts = line.params2.parts;
            }

            switch (line.func) {
                /*
                case 'setInterval_old':
                    dd0.p = line.params;
                    dd0.ob = doc.docObjs[dd0.p[1]].ob;
                    debugger;

                    // timeInterval, object, index, value
                    function f2(dd) {
                        var k = 5;
                        k = parseInt(dd.ob[dd.p[2]]);
                        dd.ob[dd.p[2]]= k + parseInt(dd.p[3]);
                        console.log(dd);
                    };
                    var bb = window.setInterval(function () {
                        f2(dd0);
                        doc.editor.recalcAndRedraw();
                        console.log('ssdfsd');

                        //if (dd[0][dd[1]]> 100) window.clearInterval(bb);
                    }, dd0.p[0]);
                    break;
                    */
                case 'setInterval':
                    console.log('parse setinterval');
                    doc.intervals[line.rez] = line.params2.main;
                    break;
                case 'pline': doc.plines[line.rez] = line.params2.main;
                    doc.docObjs[line.rez] = this.obCreateIfNot(line.rez);
                    doc.docObjs[line.rez].ob = doc.plines[line.rez];
                    doc.docObjs[line.rez].type = 'pline';
                    break;
                case 'point': doc.pnts[line.rez] = line.params2.main;
                    doc.docObjs[line.rez] = this.obCreateIfNot(line.rez);
                    doc.docObjs[line.rez].ob = doc.pnts[line.rez];
                    doc.docObjs[line.rez].type = 'point';
                    break;
                case 'line':
                    doc.lines[line.rez] = [];
                    if (line.params.length == 2) {
                        gc.line_point_point(doc.lines[line.rez], doc.docObjs[line.params2.ids[0]].ob, doc.docObjs[line.params2.ids[1]].ob);
                    } else {
                        doc.lines[line.rez][0] = line.params[0];
                        doc.lines[line.rez][1] = line.params[1];
                        doc.lines[line.rez][2] = line.params[2];
                    }
                    doc.docObjs[line.rez] = this.obCreateIfNot(line.rez);
                    doc.docObjs[line.rez].ob = doc.lines[line.rez];
                    doc.docObjs[line.rez].type = 'line';
                    break;
                case 'lineseg':
                    doc.linesegs[line.rez] = line.params2.main;
                    this.obCreateIfNot(line.rez);
                    doc.docObjs[line.rez].ob = doc.linesegs[line.rez];
                    doc.docObjs[line.rez].type = 'lineseg';
                    break;
                case 'circle': doc.circles[line.rez] = line.params2.main; //[doc.pnts[params[0].id],params[1]];
                    this.obCreateIfNot(line.rez);
                    doc.docObjs[line.rez].ob = doc.circles[line.rez];
                    doc.docObjs[line.rez].type = 'circle';
                    break;
                case 'mid':
                    doc.docObjs[line.rez].query = 'point_mid' + line.params2.query;
                    doc.docObjs[line.rez].mainIds = line.params2.ids;
                    doc.docObjs[line.rez].mains = [doc.docObjs[line.rez].ob].concat(line.params2.main);
                    doc.docObjs[line.rez].func = gl['point_mid' + line.params2.query];
                    break;
                case 'add':
                    doc.docObjs[rez] = this.obCreateIfNot(id);
                    break;
                case 'eq':
                    r = this.parseParam2([line.rez]);
                    doc.docObjs[r.ids[0]].query = 'scalar_eq_scalar';
                    doc.docObjs[r.ids[0]].mainIds = line.params2.ids;
                    doc.docObjs[r.ids[0]].mains[0] = r.refs[0];
                    doc.docObjs[r.ids[0]].mains[1] = line.params2.refs[0];
                    doc.docObjs[r.ids[0]].func = gl[doc.docObjs[r.ids[0]].query];

                    break;
                case 'per':
                    doc.docObjs[line.rez].query = 'point_per' + line.params2.query;
                    doc.docObjs[line.rez].mainIds = line.params2.ids;
                    doc.docObjs[line.rez].mains = [doc.docObjs[line.rez].ob].concat(line.params2.main);
                    doc.docObjs[line.rez].func = gl['point_per' + line.params2.query];

                    break;
                case 'per_ls':
                    doc.docObjs[line.rez].query = 'lineseg_per_lineseg';
                    doc.docObjs[line.rez].mainIds = line.params2.ids;
                    doc.docObjs[line.rez].mains = [doc.docObjs[line.rez].ob].concat(line.params2.main);
                    doc.docObjs[line.rez].func = gl['lineseg_per_lineseg'];
                    break;
                case 'int':
                    doc.docObjs[line.rez].query = 'point_int' + line.params2.query;
                    console.log(doc.docObjs[line.rez].query + ':' + JSON.stringify(line.params2.ids));
                    doc.docObjs[line.rez].mainIds = line.params2.ids;
                    doc.docObjs[line.rez].mains = [doc.docObjs[line.rez].ob].concat(line.params2.main);
                    doc.docObjs[line.rez].func = gl['point_int' + line.params2.query];
                    break;
                case 'coin':
                    //doc.docObjs[line.rez].query = 'line_coin' + line.params2.query;
                    doc.docObjs[line.rez].query = doc.docObjs[line.rez].type + '_coin' + line.params2.query;
                    doc.docObjs[line.rez].mainIds=line.params2.ids;
                    doc.docObjs[line.rez].mains=[doc.docObjs[line.rez].ob].concat(line.params2.main);
                    doc.docObjs[line.rez].func=gl[doc.docObjs[line.rez].query];
                    break;
                case 'circle_TTRS':
                    doc.docObjs[line.rez].query = 'circle_TTRS'; //r.query;
                    doc.docObjs[line.rez].mainIds = line.params2.ids;
                    doc.docObjs[line.rez].mains = [doc.docObjs[line.rez].ob].concat(line.params2.main);
                    doc.docObjs[line.rez].func  = gl['circle_TTRS'];
                    break;
                case 'tan2':
                    doc.docObjs[line.rez].query = doc.docObjs[line.rez].type + '_' + 'tan2' + line.params2.query;
                    doc.docObjs[line.rez].mainIds = line.params2.ids;
                    doc.docObjs[line.rez].mains = [doc.docObjs[line.rez].ob].concat(line.params2.main);
                    doc.docObjs[line.rez].func  = gl[doc.docObjs[line.rez].query];
                    break;
                case 'tan21':
                    doc.docObjs[line.rez].query = 'circle_univers';
                    var id0 = line.params[0];
                    var id1 = line.params[1];
                    var qq = '_' + doc.docObjs[id0].type + '_' + doc.docObjs[id1].type;
                    var m = [line.params2.main[0], line.params2.main[1], qq, line.params2.main[2], line.params2.main[3]];
                    doc.docObjs[line.rez].mainIds = line.params2.ids;
                    doc.docObjs[line.rez].mains = [doc.docObjs[line.rez].ob].concat(m);
                    doc.docObjs[line.rez].func  = gl[doc.docObjs[line.rez].query];
                    break;
                case 'len':
                    doc.docObjs[line.rez].query = 'point_len_point_lineseg';
                    doc.docObjs[line.rez].mainIds = line.params2.ids;
                    doc.docObjs[line.rez].mains = [doc.docObjs[line.rez].ob].concat(line.params2.main);
                    doc.docObjs[line.rez].func = gl[doc.docObjs[line.rez].query];
                    break;
                case 'plineMove':
                    // right now no scalar, but one of coords of point
                    doc.docObjs[line.rez].query = 'point_plineMove_pline_scalar';
                    doc.docObjs[line.rez].mainIds = line.params2.ids;
                    // mains - array to pass to query function (conains rez ref and data)
                    doc.docObjs[line.rez].mains = [doc.docObjs[line.rez].ob].concat(line.params2.main);
                    doc.docObjs[line.rez].func = gl[doc.docObjs[line.rez].query];
                    break;
                case 'image':
                    doc.images[line.rez] = line.params2.main;
                    this.obCreateIfNot(line.rez);
                    doc.docObjs[line.rez].ob = doc.images[line.rez];
                    doc.docObjs[line.rez].type = 'image';
                    break;

                case 'setVar':


            }
            return doc.docObjs[line.rez];
        }, // parseLine
        parse: function (lines) {

        }
    }
};

module.exports=Parser;