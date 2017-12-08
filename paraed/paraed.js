var a=[ [10, 10, 20, 34], [31,32, 40, 50], [60,60, 70, 90]];
// common data
// constants
/*
general format
pic - array of elements
element:
elid : [Type, Data, status];
data if type:
HLine - y
VLine - x
Rect - [left line id, top line id, right, bottom]
Bound - [Rect id, side id]
Load - [rect id, side id, load x, load y]


2015-11-02
deformed return format 
its a simple array of several polylines
{
    [
    [[x0, y0], [x1, y1], [x2, y2] ],
    [[x0, y0], [x1, y1], [x2, y2] ]
    ]
}

*/

function onSendPic() {
   //alert(JSON.stringify(pico));
    var x = new XMLHttpRequest();
    x.open('POST', 'backend.php?op=send', false);
 //   x.setRequestHeader("Content-Type", 
//        "application/x-www-form-urlencoded; charset=UTF-8");
    //  x.setRequestHeader('Content-Type', 'multipart/form-data');
    delete pico[PIC_STATIC_NAME];
    x.send(JSON.stringify(pico));
    var tt = x.responseText;
   alert(tt);
   pico[PIC_STATIC_NAME]=JSON.parse(tt);
   alert(JSON.stringify(pico));
    /*
    x.onreadystatechange = function() {
        if (x.status === 200) {
           alert(x.responseText);
        }
    } // onreadystatechange
     */ 
}

function onFileJSON() {
    var x = new XMLHttpRequest();
    delete pico[PIC_STATIC_NAME];

    x.open('POST', 'backend.php?op=filejson', false);
    x.send(JSON.stringify(pico));
    var tt = x.responseText;
   // alert(tt);
    pico[PIC_STATIC_NAME] = JSON.parse(tt);
    redraw();
}

var 
PIC_ID_PREFIX = 'e',
PIC_STATIC_NAME = 'static',
PIC_STATUS_ENTERING = 1,
PIC_STATUS_SELECTED = 2,
PIC_STATUS_EDITING = 3,
PIC_STATUS_MOUSE_OVER = 8,
PIC_STATUS_DONE = 4,
PIC_NOT_SELECTED = '0';


// indexes of element array
// pic id is a key of associate array
PIC_ID = 0,
PIC_TYPE = 0, // HLine VLine Rect Fix Load
// Fix - [rect id, ]
PIC_DATA = 1,
PIC_STATUS =2,
PIC_LAYER = 3,
PIC_BLOCK = 4;
// format: id(sting), type(int), [data],  status(int)
var pic = [];
var pico = {};
var isPicEditing;
var isPicEntering;
var isPicEnteringSeveral = false;
var picEnteringNumber;
var picEditingNumber;
var isSelected = false;
var selectedElId = PIC_NOT_SELECTED;
var SelectedNode=0;
var r=7;
var s1;
var selectRadius = 5;
var picoCounter = 0; 


var mode;

function getData(id) { return pico[id][PIC_DATA]; };
function getPicoElById(id) { return pico[id]; }; 
function setPicoElById(id, el) { pico[id] = el; };
function addPicoEl(el) { var id = PIC_ID_PREFIX + getPicoLength(); incPicoLength(); pico[id] = el; return (id); };
function doneSelectedpico() { 
    console.log('doneSelectedpico');
    pico[selectedElId][PIC_STATUS] = PIC_STATUS_DONE; isSelected = false; selectedElId = 'PIC_NOT_SELECTED'
    //if (!isPicEnteringSeveral) {isPicEntering= false; isSelected=false; }; 
    };
function stopEnteringpico() { doneSelectedpico(); };
function cancelEnteringpico() { delete pico[selectedElId]; isSelected=false; isPicEntering= false; selectedElId = 'PIC_NOT_SELECTED'

};

function getPicoLength() { return(pico['0']); };
function incPicoLength() { return(pico['0']++); };
function setPicoLength(n) { pico['0'] = n; };

// add element and continue to enter 
// former edited element overrided
function addElemEnter(type, data) {
if (isPicEntering) pic.length--;
pic.push([PIC_ID_PREFIX + pic.length, type, data, PIC_STATUS_ENTERING]); 
isPicEntering = true; picEnteringNumber = pic.length - 1; };

function renewElemEnter(type, data) {
if (isPicEntering) { pic.length--;
pic.push([PIC_ID_PREFIX + pic.length, type, data, PIC_STATUS_ENTERING]); 
isPicEntering = true; picEnteringNumber = pic.length - 1; }; };

//------------------------------------------------------------------------
 
function findSelected(e) {
};

// return adday with keys of elemnts of surrounding rect
function getRectDatapico(x, y) {
  var xh, yh;
  var t=1111, l=-1111, r=1111, b=-1111; 
  var it, il, ir, ib, v; v=true;
  var kl, kt, kr, kb; kl = kt = kr = kb = false;
  for (var k in pico) { pe = getPicoElById(k);
    if (pe[PIC_TYPE] == 'HLine') {
	  yh = pe[PIC_DATA]; 
	  if (yh < t && yh > y) { t=yh; kt = k; };
	  if (yh > b && yh < y) { b=yh; kb= k; };
	  };
	if (pe[PIC_TYPE] == 'VLine' ) {
	  xh = pe[PIC_DATA];
	  if (xh > l && xh < x) { l = xh; kl = k; };
	  if (xh < r && xh > x) { r = xh; kr = k; };
	  };
  };
  if (kl && kt && kr && kb) { 
     // return ([kl, kt, kr, kb]); 
      return ([kr, kt, kl, kb]); 
      
  }
  else {
      return(null);
  }
};
/*
// old JS 
var PIC_SIDE_LEFT = 1;
var PIC_SIDE_TOP = 2;
var PIC_SIDE_RIGHT = 3;
var PIC_SIDE_BOTTOM = 4;
*/
/*
commented 2015-10-14
var PIC_SIDE_LEFT = 8;
var PIC_SIDE_TOP = 4;
var PIC_SIDE_RIGHT = 2;
var PIC_SIDE_BOTTOM = 1;
*/
var PIC_SIDE_RIGHT = 0;
var PIC_SIDE_TOP = 1;
var PIC_SIDE_LEFT = 2;
var PIC_SIDE_BOTTOM = 3;

var dx, dy;
// get array [RectID, SideID] or null 
function getBoundData(x, y) { var pd, pe; var l, t, r, b;
    for (k in pico) { 
        if (pico[k][PIC_TYPE] === 'Rect') {
        pd = pico[k][PIC_DATA];
        if (pd ) {
            r = getData(getData(k)[PIC_SIDE_RIGHT]); t=getData(getData(k)[PIC_SIDE_TOP]); 
            l = getData(getData(k)[PIC_SIDE_LEFT]); b = getData(getData(k)[PIC_SIDE_BOTTOM]);
        if ( (x>l) && (y<t) && (x<r) && (y>b) ) {
            console.log('in bound');
            xc = (r + l) / 2; yc = (b + t) / 2;
            dx = x - xc;  dy = y - yc;
            ul = dy - dx; ur = dy + dx; // upper-left half plane and upper-right
            if ( (ul < 0) && (ur < 0)) return [k, PIC_SIDE_BOTTOM];
            if ( (ul > 0) && (ur < 0)) return [k, PIC_SIDE_LEFT];
            if ( (ul < 0) && (ur > 0)) return [k, PIC_SIDE_RIGHT];
            if ( (ul > 0) && (ur > 0)) return [k, PIC_SIDE_TOP];
        } // if in k
        }; // if pd
          
        }; // if rect
    } // k
    return null;  
} // getBoundData

//function isInArea(x, y) { return( (x>0) && (x<coords.right) && (y>0) && (y<coords.bottom))
function isInArea(e, rect) { 
    return( (e.clientX>rect.left) &&
        (e.clientX < rect.right) &&
        (e.clientY > rect.top) &&
        (e.clientY < rect.bottom)); };

function mouseMoveListener(e) { var pe, pd; // WAS NO 'pd' !!!!!!
var x=parseInt(e.clientX - coords.left), y=getRealY(parseInt(e.clientY - coords.top));

// is outside
if ( (x>0) && (e.clientX < coords.right) && (y>0) && (e.clientY > coords.top) ) {
if (selectedElId != 'PIC_NOT_SELECTED') {
    if (pico[selectedElId] === null) {
        pico[selectedElId] = [];
    } // null
 //   console.log('move selected id:' + selectedElId);
 if (isSelected) { pe= pico[selectedElId]; pd = pe[PIC_DATA]; 
     
 }; // remove to select and drag
  if (mode == 'HLine') { pe[PIC_DATA]=y; }; 
 // if (mode == 'HLine1') { pico[selectedElId][PIC_DATA] = y; };
  if (mode == 'VLine') { pe[PIC_DATA] = x; };
  if (mode == 'Rect') { pe[PIC_DATA] = getRectDatapico(x, y); };
  if (mode == 'Bound') { pe[PIC_DATA] = getBoundData(x, y); };
  if (mode == 'Load') { pe[PIC_DATA] = getBoundData(x, y); };
  if (mode == 'Load2') {
      rect = getData(pd[0]); 
      r = getData(rect[0]); 
      t = getData(rect[1]); 
      l = getData(rect[2]); 
      b = getData(rect[3]); 
      side = pd[1];
      if (side === PIC_SIDE_LEFT) { xs = l; ys = (t+b) /2; };
      if (side === PIC_SIDE_TOP) { xs = (l+r) / 2; ys = t; };
      if (side === PIC_SIDE_RIGHT) { xs = r;  ys = (t+b) /2; };
      if (side === PIC_SIDE_BOTTOM) { xs = (l+r) / 2; ys = b; };
      pd[2] = [xs, ys, x-xs, y-ys];
  }; // Load2
  
}; // selected
}; // in area
redraw();
};

function getBoundCoords(pd1) {
    rect = getData(pd1[0]);
    r = getData(rect[0]); 
    t = getData(rect[1]); 
    l = getData(rect[2]); 
    b = getData(rect[3]); 
    side = pd1[1];
    switch(side) {
        case PIC_SIDE_LEFT: x1 = l; y1 = b; x2 = l; y2 = t; break;
        case PIC_SIDE_RIGHT: x1 = r; x2 = r; y1 = b; y2 = t; break;
        case PIC_SIDE_TOP: y1 = t; y2 = t; x1 = l; x2 = r; break;
        case PIC_SIDE_BOTTOM: y1 = b; y2 = b; x1 = l; x2 = r; break;
    }
    return[x1, y1, x2, y2];
}

function elClickedpico(x, y) { var i; var pe, pd;
console.log('clicked y:'+y);
    for (k in pico) {
        pe = getPicoElById(k); pd = pe[PIC_DATA];
        if (!Array.isArray(pe)) continue;
        switch(pe[PIC_TYPE]) {
            case 'HLine': 
                console.log('jkj');
                if (Math.abs(pd-y) <= selectRadius) return k; break;
            case 'VLine':
                if (Math.abs(pd-x) <= selectRadius) return k; break;
            case 'Bound':
                break;
            default: return(null);
        } // switch
    } // i
} // elClicked

function doneNcont() {
    pico[selectedElId][PIC_STATUS] = PIC_STATUS_DONE; 
   
    if (isPicEnteringSeveral) {
        addNullElem2(pico[selectedElId][PIC_TYPE]);
    } else {
        isSelected = false; selectedElId = 'PIC_NOT_SELECTED';
    }
}
 
function mouseDownListener(e) { var el, x, y;
console.log('clicked down '+ 'isSelected = '+isSelected);
if (isInArea(e, coords) ) {
x=parseInt(e.clientX - coords.left), y=getRealY(parseInt(e.clientY - coords.top));
if (isSelected) el=getPicoElById(selectedElId);
//if (x > 0 && y > 0 && x < coords.right && e.clientY > coords.top) {
    if (isSelected) {
        console.log('mouseDownListener: selected ' + selectedElId + ' count'+getPicoLength());
        if (el[PIC_TYPE] === 'HLine') { el[PIC_DATA] = y; doneNcont(); };
        if (el[PIC_TYPE] === 'VLine') { el[PIC_DATA] = x; doneNcont(); };
        if (el[PIC_TYPE] === 'Rect') { el[PIC_DATA] = getRectDatapico(x, y); doneNcont(); };
        if (el[PIC_TYPE] === 'Bound') { doneNcont(); };
        if (el[PIC_TYPE] === 'Load') {
            if ( mode === 'Load') { // finish load stage 1
            mode = 'Load2';
        } else { mode = 'Load'; 
            doneNcont(); 
        };
        
        }; // main load
        
    } // isSelected
    else { // !isSelected
        if (el = elClickedpico(x, y)) {
            console.log('mouseDownListener: Clicked OOOOOOOOOOOon '+el);
            isSelected = true; selectedElId = el;
            mode = pico[el][PIC_TYPE];
            isPicEnteringSeveral = false;
        } // elClicked
    } // !is sel
}; // in area
}

function addNullElem() { isSelected=true; 
    selectedElId = PIC_ID_PREFIX+getPicoLength(); incPicoLength();
    pico[selectedElId] = null; };

function addNullElem2(t) { isSelected=true; 
    selectedElId = PIC_ID_PREFIX+getPicoLength(); incPicoLength();
    pico[selectedElId] = ['jkj', 'ddd']; pico[selectedElId][PIC_TYPE]=t;
    console.log('addNullElem2: picoCounter'+ getPicoLength()+ ' Pico :' + JSON.stringify(pico));
};

function onAddHLine() { 
    addNullElem2('HLine'); 
    isPicEnteringSeveral = true;
    mode='HLine'; };

function onAddVLine() { mode = 'VLine'; 
    addNullElem2('VLine'); 
    isPicEnteringSeveral = true;};
    
function onAddRect() { mode='Rect'; 
    addNullElem2('Rect'); 
    isPicEnteringSeveral = true; };
    
function onAddBound() {mode='Bound'; 
    addNullElem2('Bound'); 
    isPicEnteringSeveral = true;};
    
    // Load is same as Bound, but with load property
function onAddLoad() { mode = 'Load';
    addNullElem2('Load');
    isPicEnteringSeveral = true;};

function getRealY(compY) {
    return areaHeight - compY;
}

function getCompY(realY) {
    return areaHeight - realY;
}

function getSideCoords(pd) {
    
}

// ON LOAD 
var c1var = document.getElementById('c1'),
coords = c1var.getBoundingClientRect();
var areaHeight;
window.addEventListener("mousemove", mouseMoveListener, false);
window.addEventListener("click", mouseDownListener, false);
isPicEntering = false;
isSelected=false;
var ttt2 = '{"e0":["jkj","HLine",62,4],"e1":["jkj","HLine",125,4],"e2":["jkj","HLine",177,4]}';
var ttt = '{"e0":["jkj","HLine",63,4],"e1":["jkj","HLine",132,4],"e2":["jkj","HLine",248,4],"e3":["jkj","HLine",1],"e4":["jkj","VLine",41,4],"e5":["jkj","VLine",126,4],"e6":["jkj","VLine",192,4],"e7":["jkj","VLine",275,4],"e9":["jkj","Rect",["e4","e0","e5","e1"],4],"e10":["jkj","Rect",["e4","e1","e5","e2"],4],"e11":["jkj","Rect",["e5","e1","e6","e2"],4],"e12":["jkj","Rect",["e6","e1","e7","e2"],4]}';
var ttt3 = '{"0":17,"e0":["jkj","HLine",96,4],"e1":["jkj","HLine",187,4],"e3":["jkj","VLine",53,4],"e4":["jkj","VLine",115,4],"e5":["jkj","VLine",217,4],"e6":["jkj","VLine",273,4],"e8":["jkj","Rect",["e4","e0","e5","e1"],4],"e9":["jkj","Rect",["e3","e0","e4","e1"],4],"e11":["jkj","Bound",["e8",4],4],"e12":["jkj","Bound",["e8",3],4],"e14":["jkj","Load",["e9",2,[84,96,2,67]],4],"e15":["jkj","Load",["e9",1,[53,141.5,83,-0.5]],4]}';
pico = JSON.parse(ttt);
pico = {'0':0};
cvc=c1var.getContext('2d');
areaHeight = c1var.height;


var x1 = new XMLHttpRequest(); x1.open('GET', 'backend.php?op=loadpage', false); x1.send();

//alert(areaHeight);
redraw();
// ON LOAD
	
function tempDraw() {
for (i=0; i<a.length; i++) {
    cvc.moveTo(a[i][0], a[i][1]);
	cvc.lineTo(a[i][2], a[i][3]);
	cvc.stroke();
	}; 
}	

function turnOverOn(cvc) { cvc.lineWidth = 4; };
function turnOverOff(cvc) { cvc.lineWidth = 2; };


function redraw() {
//  tempDraw();  
    var i, i1, i2, i3, i4, pe, pt, pd, k2, x1, y1, x0, y0;
    cvc.fillStyle = "#FFFFFF";
    cvc.strokeStyle = "#000000";
    cvc.strokeStyle='green';
	cvc.lineWidth = 1;
	cvc.fillRect(0,0,c1var.width,c1var.height);
	cvc.beginPath();
	cvc.fillStyle = "rgba($0,$0,$0,0.5)";
	cvc.strokeStyle='red';
	cvc.lineWidth = 2;
	cvc.fill();
	cvc.fillRect(10, 10, 20, 20); cvc.fill(); 
	// Draw pic
	for (k in pico) {pe = getPicoElById(k);
	    if (!Array.isArray(pe)) continue;
	    if (k === PIC_STATIC_NAME) {
	    //    console.log('FFSS:in static')
	        for (a11 in pe) {
	            a1 = pe[a11];
	            x0 = a1[0][0]; y0 = getCompY(a1[0][1]);
	           // console.log('in pe2', a1);
	            cvc.beginPath();
	            cvc.moveTo(x0, y0); 
	            for (k2 = 1; k2<a1.length; k2++) {
	          //      console.log('in k2', a1[k2]);
	                x1= a1[k2][0]; y1=[getCompY(a1[k2][1])];
	                cvc.lineTo(x1, y1);
	            }
	            cvc.stroke(); 
	        }
	    }
	    pt = pe[PIC_TYPE]; pd = pe[PIC_DATA];
	    if (pe[PIC_STATUS] === PIC_STATUS_MOUSE_OVER) turnOverOn(cvc);
	    switch(pt) {
	        case 'HLine': cvc.beginPath(); pdr = getCompY(pd);
	            cvc.moveTo(0, pdr); cvc.lineTo(coords.right, pdr); cvc.stroke();break;
	        case 'VLine':cvc.beginPath();
	            cvc.moveTo(pd, 0); cvc.lineTo(pd, coords.bottom); cvc.stroke();break;
	        case 'Rect':
	            if (pe[PIC_DATA]) {
	                cvc.fillStyle = "#FF00FF";
	            x1 = pico[pe[PIC_DATA][0]][PIC_DATA]; y1 = getCompY(pico[pe[PIC_DATA][1]][PIC_DATA]);
	            x2 = pico[pe[PIC_DATA][2]][PIC_DATA]; y2 = getCompY(pico[pe[PIC_DATA][3]][PIC_DATA]);
	            //x2 = pe[PIC_DATA][2]; y2 = pe[PIC_DATA][3];
	            cvc.fillRect(x1, y1, x2-x1, y2-y1); cvc.fill(); 
	           cvc.stroke();
	            //console.log('DRAW: rect:'+ x1 +' ' + y1 + ' ' + x2 + ' ' + y2);
	             };break;
	        case 'Bound' :
	            if ( pd ) { drawBound2('#0000FF');
	            }; // if pd
	            break; // Bound
	            
	        case 'Load' :
	            if (pd) {
	                drawBound('#00FFFF'); 
	                if (pd[2]) { // already set load or setting
	                    arx1 = pd[2][0]; ary1 = pd[2][1]; arx2 = arx1 + pd[2][2]; ary2 = ary1 + pd[2][3];
	                    //cvc.moveTo(arx1, getCompY(ary1)); cvc.lineTo(arx2, getCompY(ary2)); cvc.stroke();
	                    canvas_arrow(cvc, arx1, getCompY(ary1), arx2, getCompY(ary2)); cvc.stroke();
	                    
	                    
	                }; // if pd[2]
	            } // pd
	            break; 
	            
	    }; // switch
	    turnOverOff(cvc);
	    cvc.fillStyle = "rgba($0,$0,$0,0.5)";
	    drawEntName();
	} // k

	cvc.stroke();
	cvc.fillStyle = "rgba($0,$0,$0,0.5)";
	s1 = document.getElementById("s1id");
	s1.innerHTML=JSON.stringify(pico);
	s2=	document.getElementById("s2id");
	s2.innerHTML='Pico count:'+getPicoLength()+'/isSelected:'+isSelected+'/isSevral:'+isPicEnteringSeveral+
	    '/mode:'+mode + '<br>/dx:'+dx+'/dy:'+dy;
	    
	function drawBound2(color) {
	    cvc.beginPath();
	                cvc.strokeStyle = color;
	                cvc.lineWidth = 5;
	                re = getData(pd[0]); side = pd[1];
	                r = getData(re[0]);
	                t = getRealY(getData(re[1]));
	                l = getData(re[2]);
	                b = getRealY(getData(re[3]));
	                if (side === PIC_SIDE_LEFT) {
	                    x1 = x2 = l; y1 = t; y2 = b; };
	                if (side === PIC_SIDE_TOP) {
	                    x1 = l; x2 = r; y1 = y2 = t; };
	                if (side === PIC_SIDE_RIGHT) {
	                    x1 = x2 = r; y1 = t; y2 = b; };
	                if (side === PIC_SIDE_BOTTOM) {
	                    x1 = l; x2 = r; y1 = y2 =b; };
	                cvc.moveTo(x1, y1); cvc.lineTo(x2, y2);
	                cvc.stroke();
	} ; // draw bound
	
	function drawBound(color) {
	    cvc.beginPath();
	    cvc.strokeStyle = color;
	    cvc.lineWidth = 5;
	    c = getBoundCoords(pd);
	    cvc.moveTo(c[0], getCompY(c[1])); 
	    cvc.lineTo(c[2], getCompY(c[3]));
	    cvc.stroke();
	};
	
function canvas_arrow(context, fromx, fromy, tox, toy){
    var headlen = 7;   // length of head in pixels
    var headang = Math.PI/8;
    var angle = Math.atan2(toy-fromy,tox-fromx);
    context.lineWidth = 1;
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-headang),toy-headlen*Math.sin(angle-headang));
    context.moveTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle+headang),toy-headlen*Math.sin(angle+headang));
}	
	
	function drawEntName() {
	    cvc.fillStyle = '#00f';
	    switch(pt) {
	        case 'HLine' : 
	            cvc.fillText(k+'='+pd, 10, pdr); break;
	        case 'VLine': cvc.fillText(k+'='+pd, pd, 10); break;
	        case 'Rect': cvc.fillText(k, (x1+x2)/2, (y1+y2)/2); break;
	        case 'Bound': break;
	    }
	}
};






/*	FROM REDRAW
	for (i=0; i<pic.length; i++) {
//	    if (pic[i] != 'null') {
	  if (pic[i][PIC_TYPE]=='HLine') { 
	      cvc.moveTo(0, pic[i][PIC_DATA]); cvc.lineTo(coords.right, pic[i][PIC_DATA]); }; 
	  if (pic[i][PIC_TYPE]=='VLine') { 
	      cvc.moveTo(pic[i][PIC_DATA], 0); cvc.lineTo(pic[i][PIC_DATA], coords.bottom); };
	  if (pic[i][PIC_TYPE]=='Rect') {
	  cvc.fillStyle = "#FF00FF";
		i1=getPicNum(pic[i][PIC_DATA][0]); 
		x1=pic[i1][PIC_DATA];
		i2=getPicNum(pic[i][PIC_DATA][1]);
		y1=pic[i2][PIC_DATA];
		i3=getPicNum(pic[i][PIC_DATA][2]); x2=pic[i3][PIC_DATA];
		i4=getPicNum(pic[i][PIC_DATA][3]); y2=pic[i4][PIC_DATA];
		cvc.fillRect(x1, y1, x2-x1, y2-y1);		
		cvc.fill();
	  }; // rect
//	    };
	}; // i 
	*/
	
	/*
	function picInit() {
  pic.push([PIC_ID_PREFIX + '0', 'HLine', -110, PIC_STATUS_DONE]);
  pic.push([PIC_ID_PREFIX + '1', 'HLine', coords.right+222, PIC_STATUS_DONE]);
  pic.push([PIC_ID_PREFIX + '2', 'VLine', -110, PIC_STATUS_DONE]);
  pic.push([PIC_ID_PREFIX + '3', 'VLine', coords.bottom+222, PIC_STATUS_DONE]);
  };

function getPicNum(picId) { var j;
for (j=0; j<pic.length; j++) {if (picId==pic[j][PIC_ID]) return(j); }; };

function getPicDataI(i) { return(pic[i][PIC_DATA]); };
function getPicDataId(id) { return(pic[getPicNum(id)][PIC_DATA]); };
function getPicTypeI(i) { return(pic[i][PIC_TYPE]); };
function getPicStatusI(i) { return(pic[i][PIC_STATUS]); };
function setPicStatusI(i, st) { pic[i][PIC_STATUS]=st; };
function stopEntering() { pic.length--; isPicEntering=false; mode='none'; };
function doneEntering() { pic[pic.length-1][PIC_STATUS]=PIC_STATUS_DONE; isPicEntering = false; isSelected = false; };
function doneSelected() { pic[selectedElId][PIC_STATUS]=PIC_STATUS_DONE; isPicEntering = false; isSelected = false; };
*/