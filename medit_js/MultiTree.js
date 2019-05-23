var MultiTree = function (initRoot) {

    var ret = {
        prefix: 'n',

        currentId: 0,
        nodes: {}, // create with root node
        isRoot: function (id) {
            return this.nodes[id].parentId == '';
        },
        isIdExists: function (id) {
            return id in this.nodes;
        },
        setNodes: function (obj) {
            this.nodes = obj;
        },
        getNewId: function () {
            return this.prefix + this.currentId;
        },
        addNode: function (parentId, nodeBody) {
            if (!this.isIdExists(parentId) && parentId!='') return 0;

            var id = this.getNewId();
            if (parentId === '') {
                if (this.currentId > 0) {
                    debugger;
                    //alert('second root');
                    console.log('second root2');
                } else { // root
                    this.rootId = id;
                }
            }

            this.currentId++;
            var ob = JSON.parse(JSON.stringify(nodeBody));
            this.nodes[id] = {
                id: id,
                parentId: parentId,
                body: ob
            };
            return id;
        },
        addLink: function (parentId, childId) {
            this.setParent(childId, parentId);
        },
        delNodeSimple: function (id) {
            var c = this.getChildren(id);
            for (var i=0; i<c.length; i++) {
                this.nodes[c[i]].parentId = '';
            };
            delete this.nodes[id];
        },
        delNodeRecursive: function (id) {
            var d = this.getDescendants(id);
            for (var i = 0; i<d.length; i++) {
                delete this.nodes[d[i]];
            };
            delete this.nodes[id];
        },
        getChildren: function (id) { // array of Ids
            var d = [];
            for (var k in this.nodes) {
                if (this.getParent(k) === id) d.push(k);
            };
            return d;
        },
        isDescendant: function (checkedId, parentId) {
            var rez = false;
            var id = this.getParent(checkedId);
            while(id != '') {
                if (id === parentId) rez = true;
                id = this.getParent(id);
            };
            return rez;
        },
        getDescendants: function (id) { // array of Ids
            var d = [];
            for (var k in this.nodes) {
                if (this.isDescendant(k, id)) d.push(k);
            };
            return d;
        },
        getParent: function (childId) {
            return this.nodes[childId].parentId;
        },
        getAllParents: function (id) {
            var d = [];
            var node = this.nodes[id];
            while(node.parentId != '') {
                d.push(node.parentId);
                node = this.nodes[node.parentId];
            };
            return d;
        },
        setParent: function (childId, newParent) {
            this.nodes[childId].parentId = newParent;
        },
        delLink: function (childId) {
            this.nodes[childId].parentId = '';
        },
        tttgetAllLinks: function () { // return array[n][2] of node ids NOT USED
            var d = [];
            for (var k in this.nodes) {
                if (this.nodes[k].parentId != '') {
                    d.push([this.nodes[k].parentId, k]);
                }
            };
            return d;
        },
        ttttgetAllLinksInNodes: function () {
            var d = [];
            for (var k in nodes) {
                if (nodes[k].parentId != '') {
                    d.push(nodes[k].link);
                }
            }
        },
        getLvl: function (id) {
            return this.getAllParents(id).length;
        },
        getNodesAtLvl: function (lvl) {
            var r = [];
            for (var k in this.nodes) {
                if (this.getLvl(k) === lvl) r.push(k);
            }
            return r;
        },
        // traverse through all nodes from specified id
        traverseFromNodeOld: function (id, cb) {
            var curr_id = id;
            var curr_lvl = 0; // current depth
            var trar = [[]]; // current children
            var tri = []; // current positions in current children
            var was_here = 0;
            var finished = 0;

            while (!finished) {
                if (!was_here) {
                    //cb(this.nodes[curr_id]);
                    cb(this, curr_id);
                    var chs = this.getChildren(curr_id);
                    if (chs.length) {

                        curr_lvl++;
                        trar[curr_lvl]=chs;
                        tri[curr_lvl] = 0;
                        curr_id = trar[curr_lvl][tri[curr_lvl]];
                        was_here=0; // not obligatory
                    } else {
                        was_here=1;
                    };
                    continue;
                };

                if (tri[curr_lvl] < trar[curr_lvl].length-1) {
                    tri[curr_lvl]++;
                    curr_id = trar[curr_lvl][tri[curr_lvl]];
                    was_here=0;
                } else {
                    // go up
                    was_here=1;
                    curr_lvl--;
                    curr_id = trar[curr_lvl][tri[curr_lvl]];
                    if (curr_lvl == 0) finished =1;
                };
            }; // while
            var r = [];
            for (var k in this.nodes) {
                r.push([k, this.nodes[k].parentId, this.nodes[k].body.i, this.nodes[k].body.j]);
            }
            var t = 3;
            return r;

        }, // traverseFromNode

        traverseFromNode: function (id, cb) {
            var d = {}; // d - traverse data
            d.curr_id = id;
            d.curr_lvl = 0; // current depth
            d.trar = [[]]; // current children
            d.tri = []; // current positions in current children
            d.node = {};
            var was_here = 0;
            var finished = 0;

            while (!finished) {
                if (!was_here) {
                    //cb(this.nodes[curr_id]);
                    d.node = this.nodes[d.curr_id];
                    cb(this, d);
                    var chs = this.getChildren(d.curr_id);
                    if (chs.length) {

                        d.curr_lvl++;
                        d.trar[d.curr_lvl]=chs;
                        d.tri[d.curr_lvl] = 0;
                        d.curr_id = d.trar[d.curr_lvl][d.tri[d.curr_lvl]];  // chs[0]
                        was_here=0; // not obligatory
                    } else {
                        was_here=1;
                    };
                    continue;
                };

                if (d.tri[d.curr_lvl] < d.trar[d.curr_lvl].length-1) {
                    d.tri[d.curr_lvl]++;
                    d.curr_id = d.trar[d.curr_lvl][d.tri[d.curr_lvl]];
                    was_here=0;
                } else {
                    // go up
                    was_here=1;
                    d.curr_lvl--;
                    d.curr_id = d.trar[d.curr_lvl][d.tri[d.curr_lvl]];
                    if (d.curr_lvl == 0) finished =1;
                };
            }; // while
            var r = [];
            for (var k in this.nodes) {
                r.push([k, this.nodes[k].parentId, this.nodes[k].body.value, this.nodes[k].body.i, this.nodes[k].body.j, this.nodes[k].body]);
            }
            var t = 3;
            return r;

        }, // traverseFromNode

        // used to calculate math expressions
        // cb is an object with operators as keys
        traverseFromLeavesToNode: function (id, cb_obj) {
            var myNodesIds = this.getDescendants(id);
            myNodesIds.push(id);
            var myNodes = [];
            for (var i=0; i<myNodesIds.length; i++) {
                myNodes[i] = this.nodes[myNodesIds[i]];
                myNodes[i].processed = false;
                myNodes[i].body.result = 0;
            };

            function getUnsolvedChildren(th, id) {
                var ch = th.getChildren(id);
                var uch = [];
                for (var i = 0; i<ch.length; i++) {
                    if (!th.nodes[ch[i]].processed) uch.push(ch[i]);
                };
                return uch;
            };
            function getVal(s) {
                var r;
                if (cb_obj.vars[s]) {
                    r = cb_obj.vars[s];
                } else {
                    r = parseFloat(s);
                }
                return r;
            }
            var finished;
            finished = false;

            while (!finished) {
                finished = true;
                for (var i=0; i<myNodes.length; i++) {
                    var node = myNodes[i];
                    var uch = getUnsolvedChildren(this, myNodesIds[i]);
                    if ( uch.length === 0 && !node.processed ) {
                        finished = false;
                        var children = this.getChildren(myNodesIds[i]);
                        if (children.length) {
                            //var command = this.node[children[0]].body.val;
                            var command = node.body.val;
                            if (cb_obj[command]) { // if any command exists
                                // get list of args
                                var args = [];
                                for (var k = 0; k<children.length; k++) {
                                    //args.push(this.nodes[children[k]].result);
                                    args.push(children[k]);
                                };
                                //node.result = (cb_obj[command]).call(this, args);
                                //node.result = (cb_obj[command]).bind(args);
                                var f = cb_obj[command];
                                node.body.result = f.call(this, args);
                            } else {
                                console.log('no command for parent node');
                                //node.result = node.body.val;
                            }
                        } else {
                            node.body.result = getVal(node.body.val);
                        };
                        node.processed = true;
                    }; // if uch.length
                }; // for i
            }; // while
            return this.nodes[id].body.result;
        },

        cbPrintTree: function (th, d) {

            if (d.curr_lvl == 0) {
                d.node.try = 0;
                d.node.trx = 0
                d.ymax = 0;
            } else {
                var parentNode = th.nodes[th.getParent(d.curr_id)];



                if (!d.tri[d.curr_lvl]) { // first child
                    d.node.try = d.ymax;
                } else { // not first child
                    d.ymax++;
                    d.node.try = d.ymax;
                }
                var lvlStep = 10;
                d.node.trx = d.curr_lvl * lvlStep;
                //var parentNode = th.nodes[th.getParent(d.curr_id)];
                //d.node.try = parentNode.try + d.tri[d.curr_lvl];
            }


        }, // cbPrintTree
        d2Tree: function () {
            this.traverseFromNode(this.rootId, this.cbPrintTree);
            var a = [];
            var i, j, k;
            var ny = 0;
            var nx = 0;
            for (k in this.nodes) {
                var node = this.nodes[k];
                if (nx < node.trx) nx = node.trx;
                if (ny < node.try) {
                    ny = node.try;
                    node.trey = ny;
                    var ps = this.getAllParents(k);
                    for (i=0; i<ps.length; i++) this.nodes[ps[i]].trey = ny;
                }
            };
            nx+=5; ny++;
            for (i=0; i<ny; i++) {
                a.push([]);
                for (j=0; j<nx; j++) a[i].push('');
            };


            for (var k in this.nodes) {
                var node = this.nodes[k];
                var y = this.nodes[k].try;
                var x = this.nodes[k].trx;
                a[y][x] = k;
                a[y][x+1] = node.parentId;
                a[y][x+2] = node.body.value;
                a[y][x+3] = node.body.i;
                a[y][x+4] = node.body.j;
                a[y][x+5] = node.body.player;
                if (x+2 > nx) nx = x+2;
                if (y > ny) ny = y;
            }
            return a;
        }, // d2 tree


        cbPrintTreeStep: function (lvlStep) {
            var r = function (th, d) {

                    if (d.curr_lvl == 0) {
                        d.node.try = 0;
                        d.node.trx = 0
                        d.ymax = 0;
                    } else {
                        var parentNode = th.nodes[th.getParent(d.curr_id)];



                        if (!d.tri[d.curr_lvl]) { // first child
                            d.node.try = d.ymax;
                        } else { // not first child
                            d.ymax++;
                            d.node.try = d.ymax;
                        }
                        d.node.trx = d.curr_lvl * lvlStep;
                        //var parentNode = th.nodes[th.getParent(d.curr_id)];
                        //d.node.try = parentNode.try + d.tri[d.curr_lvl];
                    }
                };
            return r;
        }, // cbPrintTreeStep


        // create 2d array from THIS tree using callback (it can be 2d for text file or html table
        d2Tree_cb: function (cb) {
            this.traverseFromNode(this.rootId, this.cbPrintTreeStep(1));

            var a = [];
            var i, j, k;
            var ny = 0;
            var nx = 0;

            // get max values from
            for (k in this.nodes) {
                var node = this.nodes[k];
                if (nx < node.trx) nx = node.trx;
                if (ny < node.try) {
                    ny = node.try;
                    node.trey = ny;
                    var ps = this.getAllParents(k);
                    for (i=0; i<ps.length; i++) this.nodes[ps[i]].trey = ny;
                }
            };




            nx+=5; ny++;
            for (i=0; i<ny; i++) {
                a.push([]);
                for (j=0; j<nx; j++) a[i].push('');
            };

            var si = 0;
            for (k in this.nodes) {
                var node = this.nodes[k];
                node.str = cb(node);
                var y = node.try;
                var x = node.trx;
                a[y][x] = cb(node);
                if (si < node.str.length) si = node.str.length;
            };

            var sa = [''];
            for (var i=1; i<30; i++) {
                sa[i] = sa[i-1] + ' ';
            };

            for (var i = 0; i<ny; i++) {
                for (var j=0; j<nx; j++) {
                    var diff = si - a[i][j].length;
                    a[i][j] += sa[diff];
                }
            };


/*

            for (var k in this.nodes) {
                var node = this.nodes[k];
                var y = this.nodes[k].try;
                var x = this.nodes[k].trx;
                a[y][x] = cb(node);
                */
                /*
                a[y][x] = k;
                a[y][x+1] = node.parentId;
                a[y][x+2] = node.body.value;
                a[y][x+3] = node.body.i;
                a[y][x+4] = node.body.j;
                a[y][x+5] = node.body.player;
                if (x+2 > nx) nx = x+2;
                if (y > ny) ny = y;
                */
            //}
            return a;
        }, // d2 tree cb

        lispParser: function (s2, cmds) {
            var s1 = "(aa (+ (aa (+ bb (aa (+ bb cc)  t tt (/ k kjk (+ a b))))  t tt (/ k kjk (+ a b))) (aa (+ bb cc)  t tt (/ k kjk (+ a b))))  t tt (/ k kjk (+ a b)))";
            var s = "(+ 1 2)";
            s = "(+ (setq b (+ 3 5)) (setq c (* 2 (+ 5 4 b))) (setq p1 (list b c)) (setq x1 (car p1)) (setq y1 (* 2 (cadr p1))) (command 'line' p1 b) )";
            s = s2;
            var s5 = s.replace(/\r?\n/g, ' ');
            s = s5;
            //s.replace(/(\r\n|\n|\r)/gm, ' ');
            var saa = s.split('');
            var sa = []; //                a + b / (c - d)
            var prev = ' ';
            var p = '';
            var j = 0;
            function isArg(s) {
                var rez = !((s === ' ') || (s === '(') || (s === ')'));
                return rez;
            }
            for (var i=0; i<saa.length; i++) {

                p = saa[i];
                if ( (saa[i] === '(') || (saa[i] === ')') ) {
                    j++; sa[j] = saa[i];
                }
                else if ( saa[i] === ' ' && prev === ' ') {
                    sa[j] = ' ';
                }
                else if ( saa[i] === ' ' && prev != ' ') {
                    j++; sa[j] = ' ';
                }
                else if ( saa[i] != ' ' && !isArg(prev)) {
                    j++; sa[j] = saa[i];
                }
                else if (saa[i] != ' ' && isArg(prev)) {
                    sa[j] = sa[j] + saa[i];
                } else {
                    console.log('error no case for lisp parser');
                };
                prev = saa[i];
            };

            //var current_id = this.getNodesAtLvl(0)[0];
            //this.nodes[current_id].body = {type: '', cmd: '', args: []};
            //this.nodes[current_id].body = {type: '', val: ''};
            var current_id = '';
            for (var i = 1; i < sa.length; i++) {
                switch (sa[i]) {
                    case '(':
                        var t = this.addNode(current_id, {type: 'node', val: sa[i+1]});
                        //this.nodes[t].body.val = t;
                        //this.nodes[current_id].body.args.push({type: 'node', val: t});
                        current_id = t;
                        i++;
                        break;
                    case ')':
                        current_id = this.getParent(current_id);
                        break;
                    case ' ':
                        break;
                    default:
                        this.addNode(current_id, {type: 'arg', val: sa[i]});
                        /*
                        if (this.nodes[current_id].body.cmd === '') {
                            this.nodes[current_id].body.cmd = sa[i];
                        } else {
                            this.nodes[current_id].body.args.push({type: 'var2', val: sa[i]});
                        }
*/
                }; // switch
            }; // for i
            var t;

            var cbs = ((th)=>{
                var count = 0;
                var vars = {};
                var th = th;
                var commands = {};
                function getVal(id) {
                    var s = th.nodes[id].body.val;
                    var r;
                    if (vars[s]) {
                        r = vars[s];
                    } else {
                        r = th.nodes[id].body.result;
                    }
                    return r;
                }
                return {
                    vars: vars,
                    th: th,
                "+": (a)=>{
                    var s = 0;
                    for (var i=0; i<a.length; i++) s+=getVal(a[i]);
                    //for (var i=0; i<a.length; i++) s+=a[i];
                    return s;
                },
                "/": (a)=>{
                    //return getVal(a[0]) / getVal(a[1]);
                    return getVal(a[0]) / getVal(a[1]);
                },
                "sin": (a)=>{
                    //return Math.sin(getVal(a[0]));
                    return Math.sin(getVal(a[0]));
                },

                "*": (a)=>{
                        var s = 1;
//                        for (var i=0; i<a.length; i++) s*=getVal(a[i]);
                        for (var i=0; i<a.length; i++) s*=getVal(a[i]);
                        return s;
                },
                "list": (a)=>{
                    //return [getVal(a[0]), getVal([1])];
                    return [getVal(a[0]), getVal(a[1])];
                },
                "car": (a)=>{ return(getVal(a[0])[0])},
                "cadr": (a)=>{ return(getVal(a[0])[1])},

                "setq": (a)=>{
                    //vars[a[0]] = getVal(a[1]);
                    //vars[a[0]] = a[1];
                    var rr = getVal(a[1]);
                    var ind = th.nodes[a[0]].body.val;
                    //vars[th.nodes[a[0]].body.val] = getVal(a[1]);
                    vars[ind] = rr;
                    //return vars[a[0]];
                    return vars[ind];
                },
                "command": (a)=>{
                    var acadCommand = th.nodes[a[0]].body.val;
                    var acadVars = [];
                    for (var i =1; i<a.length; i++) {
                        acadVars.push(getVal(a[i]));
                    };
                    var k = 5;
                    cmds.push({cmd: acadCommand, params: acadVars});

                }

            }; })(this);

            //var rez = this.traverseFromLeavesToNode('n0', cbs);
            var rez = this.traverseLisp('n0', cbs);
            var rez1 = this.nodes['n1'].body.result;

            function log(th, cbs) {
                var s = '';
                var a = th.d2Tree_cb(function (n) {
                    return (n.id + ':' + n.body.val + '  ');
                });
                for (var i=0; i<a.length; i++) {
                    for (var j=0; j<a[0].length; j++) {
                        s += a[i][j];
                    };
                    s+='\n';
                };
                var s2 = th.vars2str(cbs);
                s+=s2;
                return s;
            };
            var ss = log(this, cbs);

            console.log(ss);


            debugger;
            t=2;
        }, // lisp parser

        traverseLisp: function(n_id, cbs) {
            var ch = this.getChildren(n_id);
            for (var i=0; i<ch.length; i++) {
                this.traverseFromLeavesToNode(ch[i], cbs);
            }
        },

        printTree: function (tabel) { // tabel - DOM element of the table
            var a = this.d2Tree();
            for (var i=0; i<a.length; i++) {
                var tr = document.createElement('tr');
                var ch = tabel.appendChild(tr);
                for (var j=0; j<a[0].length; j++) {
                    var td = document.createElement('td');
                    var ch = tr.appendChild(td);
                    ch.innerHTML = a[i][j];
                }
            }
        }, // printTree

        vars2str: function (cbs) {
            var s = '';
            for (var vkey in (cbs.vars)) {
                s+= vkey + ' = ' + JSON.stringify(cbs.vars[vkey]) + '\n';
            };
            return s;
        }


    };

    if (initRoot) {
        ret.addNode('', {});
    }

    return ret;
};

///////////  Multitree

module.exports = MultiTree;