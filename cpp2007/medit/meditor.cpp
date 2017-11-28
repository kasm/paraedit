// meditor.cpp : implementation file
//
#include "..\stdafx.h"
#include "..\medit.h"
#include "meditor.h"
#include "mentity.h"
#include <math.h>
#include <afxtempl.h>
#include <afxcoll.h>
#include <vector>
#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif
/*
void draw_line(CDC* dc, Cmentity* line) {
CMapPtrToPtr map1;
dc->MoveTo(line->pnti[0].x, line->pnti[0].y);
dc->LineTo(line->pnti[1].x, line->pnti[1].y);
};
*/
/////////////////////////////////////////////////////////////////////////////
// Cmeditor

Cmeditor::Cmeditor()
{	create_layer("aux");
	create_layer("0");
	current_layer=0;
	emode=MODE_NONE;
	current_color=0x00ff0000; // b g r
	current_line_width=1;
	current_line_style=PS_SOLID;
	pz.panx=0; pz.pany=0;
	pz.zoom=1;
	sel_ent_id=NOT_SELECTED;
	mouse_ent_id=NOT_SELECTED;
	mouse_point=NOT_SELECTED;

TBase1<Cint1> b1;
Cintob t11, t22;
t11.FillPtrs(); t22.FillPtrs();
t11.i=10, t22.i=20;
b1.Add(&t11);
b1.Add(&t22);
void* k22=b1.GetPid(1);
std::string str1; str1.clear();
b1.ToString(&str1);
// t11.out(str1);

int i1, i2, i3; int *k;
i1=1001, i2=1002; i3=1003;
	CBase b;
	b.Add(&i1);
	b.Add(&i2);
	b.Add(&i3);
	b.DelID(1);
	b.Pack();
	k=b.SelID(1);
i1=2;
}

Cmeditor::~Cmeditor()
{
}




void Cmeditor::Create1( DWORD dwStyle, const RECT &rect, CWnd *pParentWnd)
{
	pz.rectx=rect.right; pz.recty=rect.bottom;
	pz.zoom=1;
	pz.panx=0;
	pz.pany=0;
	BOOL res = CWnd::Create( NULL, NULL, dwStyle, rect, pParentWnd, NULL );}


int Cmeditor::create_entity(int type) {
	int i; i=0; 
	i=ent.Add(EntityClassFactory(type)); // i - not number, but ID !!!!!
	Cmentity1* me=(Cmentity1*)ent.GetPid(i);
	me->id_Layer=current_layer;
	me->iColor=current_color;
	me->iLineWidth=current_line_width;
	me->iLineStyle=current_line_style;
	me->IsSelected=0;
	return(i);};

	// layer

void Cmeditor::create_layer(std::string& name) { lr.Add(new CLayer(name)); };

CLayer::CLayer(std::string& pname) {
	name=pname;
	edible=1;
	visible=1;
	linkable=1;
	color=0x00ff;
	width=1;
	line_style=PS_SOLID;
};

// end of layer

void Cmeditor::user_start_entity(CString type) {
	Cmentity* me; int i; i=create_entity(type);
	sel_ent=i; me=(Cmentity*)ent[i];
	emode=MODE_ENTERING_POINT; entering_point1=0;
};

void Cmeditor::set_screen_point(CPoint* point, Cmentity1* me, int number) {
  me->pnti[number].x=point->x; me->pnti[number].y=point->y;
  pz.get_double_point(&me->pnts[number], point); };

void Cmeditor::draw_selection_markers(CDC *dc) {
Cmentity* me;
CPen selpen; CPen* oldpen;
if (!selpen.CreatePen(PS_SOLID, 2, COLOR_MARKER_SEL_POINT)) AfxMessageBox("no pen!!");
int i, j, x, y;
for (i=0; i<ent.GetSize(); i++) {
  me=(Cmentity*)ent[i];
  if (me->is_selected) 
    for (j=0; j<me->npoints; j++) {
	  x=pz.get_screen_x(me->pnts[j].x); 
	  y=pz.get_screen_y(me->pnts[j].y);
	  if (me->selected_point==j) {
		  oldpen=dc->SelectObject(&selpen); };
	  dc->Rectangle(x-SEL_MARKER_SIZE, y-SEL_MARKER_SIZE, 
	    x+SEL_MARKER_SIZE, y+SEL_MARKER_SIZE);
	  if (me->selected_point==j) {
		  dc->SelectObject(oldpen); };
	  }; // j
	  }; // i
selpen.DeleteObject();
if (mouse_ent!=NOT_SELECTED) {
  if (!selpen.CreatePen(PS_SOLID, 1, COLOR_MARKER_MOUSE_ENT)) AfxMessageBox("no pen!!");
  oldpen=dc->SelectObject(&selpen);
  me=(Cmentity*)ent[mouse_ent];
  for (j=0; j<me->npoints+nlink_types; j++) 
    dc->Rectangle(me->pnti[j].x-SEL_MARKER_SIZE, me->pnti[j].y-SEL_MARKER_SIZE,
	  me->pnti[j].x+SEL_MARKER_SIZE, me->pnti[j].y+SEL_MARKER_SIZE);
  dc->SelectObject(oldpen); selpen.DeleteObject();   }; // if mouse ent

if (mouse_point!=NOT_SELECTED) {
  if (!selpen.CreatePen(PS_SOLID, 1, COLOR_MARKER_MOUSE_POINT)) AfxMessageBox("no pen!!");
  oldpen=dc->SelectObject(&selpen);
  dc->Rectangle(me->pnti[mouse_point].x-SEL_MARKER_SIZE, me->pnti[mouse_point].y-SEL_MARKER_SIZE,
    me->pnti[mouse_point].x+SEL_MARKER_SIZE, me->pnti[mouse_point].y+SEL_MARKER_SIZE);
  dc->SelectObject(oldpen); selpen.DeleteObject(); }; // if mouse point
	  };


void Cmeditor::draw_ents(CDC* dc) {
	Cmentity* me;	int i;
	CPen ent_pen; 	CPen* old_pen;
	for (i=0; i<ent.GetSize(); i++) {
			me=(Cmentity*)(ent[i]);
if (!ent_pen.CreatePen(me->line_style, me->line_width, me->color)) 
	  AfxMessageBox("no pen!!");
	old_pen=dc->SelectObject(&ent_pen);
		pz.ent2screen(me);
		me->draw(dc);
		dc->SelectObject(old_pen);
	ent_pen.DeleteObject();
}; // i	
};

void Cmeditor::draw(CDC *dc) {
	
	draw_selection_markers(dc);
	draw_ents(dc);
};

void Cmeditor::select(int i) {
	Cmentity* me;
		me=(Cmentity*)(ent[i]);
		me->is_selected=1;
};

void Cmeditor::fill_node_points(int enti) {
  int i;
  Cmentity* me=(Cmentity*)ent[enti];
  pz.ent2screen(me);
  for (i=0; i<nlink_types; i++) {
	me->link(&me->pnts[me->npoints+i], &last_point, i+me->npoints, me, 0); 
	pz.get_screen_point(&me->pnti[me->npoints+i], &me->pnts[me->npoints+i]); };
	};


void Cmeditor::check_mouse_point(CPoint* point) {
  int i, j; Ctestclickstruct cs;
  double l1;
  Cmentity* me;
  mouse_ent=NOT_SELECTED; mouse_point=NOT_SELECTED;
  for (i=0; i<ent.GetSize(); i++) {
    if (i!=sel_ent) {
    me=(Cmentity*)ent[i];
	me->test_click(&cs, point); if (cs.clicked_body) mouse_ent=i;
	fill_node_points(i);
	for (j=0; j<me->npoints+nlink_types; j++) {
	  l1=sqrt((double)(point->x - me->pnti[j].x) * (point->x - me->pnti[j].x)+
	    (point->y - me->pnti[j].y) * (point->y - me->pnti[j].y));
	  if (l1<SEL_MARKER_SIZE) mouse_point=j;
	  }; // j
	  }; // if i!=sel_ent
	}; // i
};
	
void Cmeditor::rebuild() {
Cmentity* me; Cmentity* me1; CParamLink* l1;
int a[50]; int li[50]; int i, j, k, n, nl, some_links;
nl=links.GetSize(); some_links=1;
n=ent.GetSize();
for (i=0; i<5; i++) li[i]=1;
while (some_links) {
  for (i=0; i<n; i++) a[i]=0;
  for (i=0; i<nl; i++) {
    l1=(CParamLink*)links[i];
	if (li[i]) a[l1->linked_ent]++;
    };

  for (i=0; i<n; i++) {
    me=(Cmentity*)ent[i];
	if (!a[i]) {
	  for (k=0; k<nl; k++) {
	    l1=(CParamLink*)links[k];
	    if (l1->to_ent==i) {
		me1=(Cmentity*)ent[l1->linked_ent];
		me1->link(&me1->pnts[l1->linked_point], &me1->pnts[l1->base_point], l1->type, me, 0);
		a[k]=0; li[k]=0;
		}; // if ent i
		}; // k
      }; // a[i]
	}; // i
some_links=0; for (i=0; i<nl; i++) some_links+=li[i];
}; // while
};
  





BEGIN_MESSAGE_MAP(Cmeditor, CWnd)
	//{{AFX_MSG_MAP(Cmeditor)
	ON_WM_LBUTTONDOWN()
	ON_WM_MOUSEMOVE()
	ON_WM_PAINT()
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()


/////////////////////////////////////////////////////////////////////////////
// Cmeditor message handlers

void Cmeditor::OnLButtonDown(UINT nFlags, CPoint point) 
{Ctestclickstruct click;
CParamLink* l1;
	Cmentity* me; Cmentity* me1;
	int i, j, x, y;
i=0;
if (sel_ent!=NOT_SELECTED) me=(Cmentity*)ent[sel_ent];
switch(emode) {
  case MODE_MOVING_ENT: emode=MODE_NONE; break;
  case MODE_MOVING_POINT:	
		// me->selected_point=0;
		emode=MODE_NONE; break; 
  case MODE_NONE:
    if (sel_ent!=NOT_SELECTED) me->is_selected=0;
	
	for (i=0; i<ent.GetSize(); i++) {
		me=(Cmentity*)ent[i];
		me->test_click(&click, &point);
		if (click.clicked_body) {
		  emode=MODE_MOVING_ENT; 
		  sel_ent=i;
		  for (j=0; j<me->npoints; j++) {me->pnts[j].copyto(&last_ent_position[j]); };
		  //pz.get_double_point(&last_point, &point);
		};
		for (j=0; j<me->npoints; j++) {
			x=pz.get_screen_x(me->pnts[j].x); 
			y=pz.get_screen_y(me->pnts[j].y);
			if (( abs(x-point.x) < SEL_MARKER_SIZE) && (abs(y-point.y) < SEL_MARKER_SIZE)) {
				emode=MODE_MOVING_POINT; 
				me->selected_point=j;
				sel_ent=i; me->is_selected=1;
				break;};
		}; // j
	}; 
	break;// i
  case MODE_ENTERING_POINT:
	  me=(Cmentity*)ent[sel_ent];
	  check_mouse_point(&point);
	  if (mouse_ent!=NOT_SELECTED) {
	    me1=(Cmentity*)ent[mouse_ent];
	    if (mouse_point>=me1->npoints) {
		  i=links.Add(new CParamLink());
		  l1=(CParamLink*)links[i];
		  j=entering_point1-1; if (j<0) j=0;
		  l1->SetParam(mouse_ent, mouse_point, sel_ent, entering_point1, j, 
		    mouse_point, 0);
		  };
		};
	  if (entering_point1 == (me->npoints-1)) {
		  sel_ent=NOT_SELECTED; emode=MODE_NONE;
		  mouse_point=NOT_SELECTED; mouse_ent=NOT_SELECTED;
		  last_point.x=0; last_point.y=0;
	  } else
	  { entering_point1++; };
	  break;
}; // switch	
pz.get_double_point(&last_point, &point);
	CWnd::OnLButtonDown(nFlags, point);
	UpdateWindow();
	RedrawWindow();
}


void Cmeditor::OnMouseMove(UINT nFlags, CPoint point) 
{Cmentity* me; Ctestclickstruct cs;
Cmentity* me1; CParamLink* l1;
Cpnt pp; int i, j;
rebuild();
	if (sel_ent != NOT_SELECTED) me=(Cmentity*)ent[sel_ent];
switch(emode) {
  case MODE_NONE: 
	check_mouse_point(&point);
    break;
  case MODE_MOVING_POINT:
	me->pnts[me->selected_point].x=pz.get_double_x(point.x);
	me->pnts[me->selected_point].y=pz.get_double_y(point.y);
/*for (i=0; i<links.GetSize(); i++) {
	  l1=(CParamLink*)links[i];
	  if (l1->to_ent == sel_ent) {
		  me1=(Cmentity*)ent[l1->linked_ent];

//		  link_to_line(&pp, &(me1->pnts[0]), LINK_PERP, me, 1);
		  me1->pnts[1].x=pp.x;
		  me1->pnts[1].y=pp.y; };
	  if (l1->linked_ent == sel_ent) {
		  me1=(Cmentity*)ent[i];
		  link_to_line(&pp, &(me->pnts[0]), LINK_PERP, me1, 1);
		  me->pnts[1].x=pp.x;
		  me->pnts[1].y=pp.y; };
	};// i
	*/
	break;
  case MODE_ENTERING_POINT:
    	check_mouse_point(&point);

	me=(Cmentity*)ent[sel_ent];
	me->pnts[entering_point1].x=pz.get_double_x(point.x);
	me->pnts[entering_point1].y=pz.get_double_y(point.y);
	break;
  case MODE_MOVING_ENT:
	for (j=0; j<me->npoints; j++) last_ent_position[j].copyto(&me->pnts[j]);
	me->move(pz.get_double_x(point.x)-last_point.x, pz.get_double_y(point.y)-last_point.y);
	pz.ent2screen(me);
    break;
};// switch

	CWnd::OnMouseMove(nFlags, point);
	UpdateWindow();
	RedrawWindow();
}

void Cmeditor::OnPaint() 
{
	CPaintDC dc(this); // device context for painting
	CRect rect;
	GetClientRect (&rect);
	dc.FillSolidRect(rect, 0x00ffffff);
	draw(&dc);//, rect);
}

