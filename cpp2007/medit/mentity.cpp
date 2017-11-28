
#include "..\stdafx.h"
#include "mentity.h"
//#include "meditor.h"
#include <math.h>


int round1(double x) {return((int) (x+0.5)); };

//Cmentity1::Cmentity1(int ent_type) {
//	ClassFactory(ent_type); };

Cmentity1* EntityClassFactory(int ent_type) {
	switch(ent_type) {
		case ENT_LINE: return(new CELine);
		case ENT_CIRCLE: return(new CECircle);
		case ENT_SIMPLE_TEXT: return(new CESimpleText);
		default: return(NULL); };
};




void Cmentity1::move(double x1, double y1) {
	for (unsigned int i=0; i<pnts.size(); i++)
		pnts[i]->add(x1, y1);};

/*
#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif
*/





// calculates linked point (linked point)
// according to base point (previous) link type, entity and entity
/*
void link_to_line(Cpnt* linked_point, Cpnt* base_point, int link_type, Cmentity* tolink, int param) {
double cx1, cy1, x1, y1, x0, y0, x2, y2, length, xp, yp;
int tt; Cmentity* me1;
x0=base_point->x; y0=base_point->y;
x1=tolink->pnts[0].x; y1=tolink->pnts[0].y;
x2=tolink->pnts[1].x; y2=tolink->pnts[1].y;
length=sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
cx1=(x2-x1)/length; cy1=(y2-y1)/length;
tt=link_type-tolink->npoints;
if (tt<0) tolink->pnts[link_type].copyto(linked_point); 
else
switch (link_types[tt]) {
  case LINK_POINT: tolink->pnts[param].copyto(linked_point); break;
  case LINK_PERP: 
	xp=(cx1*cy1*(y0-y1)+x1*cy1*cy1+x0*cx1*cx1);
	yp=(cx1*cy1*(x0-x1)+y0*cy1*cy1+y1*cx1*cx1);
	break;
  case LINK_MID:
	xp=(x1+x2)/2; yp=(y1+y2)/2; break;
 // case LINK_INTERSECT:
   // me1=(Cmentity*)base_point;
//	if (me1->type=="line") {
//	  
//	break;
};
linked_point->x=xp; linked_point->y=yp;
};

void test_click_line(Ctestclickstruct* cs, CPoint* point, Cmentity* tent) // tent - tested ent
{int i;
int xp1, yp1, x0, y0, x1, y1, xp, yp;
double l1;
xp1=point->x; yp1=point->y; 
x0=tent->pnti[0].x; y0=tent->pnti[0].y; x1=tent->pnti[1].x; y1=tent->pnti[1].y;
l1=sqrt((double)(x1-x0)*(x1-x0)+(y1-y0)*(y1-y0));
xp=((xp1-x0)*(x1-x0)+(yp1-y0)*(y1-y0))/l1; 
yp=((yp1-y0)*(x1-x0)-(xp1-x0)*(y1-y0))/l1;
if (abs(yp)<SEL_ENT_RADIUS) cs->clicked_body=1; else cs->clicked_body=0;
};

void CParamLink::SetParam(int to_ent1, int to_point1, int linked_ent1, 
  int linked_point1, int base_point1, int type1, double param1) {
to_ent=to_ent1; to_point=to_point1; linked_ent=linked_ent1; 
linked_point=linked_point1; type=type1; base_point=base_point1;
};


void draw_rect(CDC* dc, Cmentity* rectangle) {
	dc->Rectangle(rectangle->pnti[0].x, rectangle->pnti[0].y,
		rectangle->pnti[1].x, rectangle->pnti[1].y); };

	void draw_arc(CDC* dc, Cmentity* arc) {
		dc->Arc(arc->pnti[0].x, arc->pnti[0].y,
			arc->pnti[1].x, arc->pnti[1].y,
			arc->pnti[2].x, arc->pnti[2].y,
			arc->pnti[3].x, arc->pnti[3].y);
	};

*/



//void Cpnt::moveto(double x1, double y1) {x[0]=x1; x[1]=y1; };
//void Cpnt::add(double x1, double y1) { x[0]+=x1; y[1]+=y1; };
//void Cpnt::add(Cpnt &p1) {for (int i=0; i<DIMENSION; i++) {x[i]=p1.x[i]; }; };
// void Cpnt::copyto(Cpnt *pto) {pto->x=x; pto->y=y; };
//Cpnt::Cpnt() {x=0; y=0; linked=0; };
//int Cpnt::rx() {return (round1(x)); };
//int Cpnt::ry() {return (round1(y)); };




	// constructors

/*
Cmentity::Cmentity(CString sptype) {
ndouble=0; npoints=0; nstrings=0;
for (int i=0; i<ntypes; i++) {
  if (mtypes[i].type == sptype) {
	ndouble=mtypes[i].ndouble; npoints=mtypes[i].npoints; 
	nstrings=mtypes[i].nstrings; type=mtypes[i].type; 
	dvalues= new double[ndouble]; pnts=new Cpnt[npoints+10];
	strs=new CString[nstrings]; itype=i; 
	pnti=new CPoint[npoints+10];
	is_selected=NOT_SELECTED; selected_point=NOT_SELECTED; selected_length=NOT_SELECTED; break;
  };
	}; // for i
};  */

//double Cmentity::get_double(int index) {return dvalues[index]; };
//Cpnt* Cmentity::get_point(int index) {return &pnts[index]; };
//CString* Cmentity::get_string(int index) {return (&strs[index]); };
/*
void Cmentity::get_node_points() {
int i;
for (i=0; i<npoints; i++) {
void Cmentity::draw(CDC *dc) { (*mtypes[itype].draw1)(dc, this); };
void Cmentity::test_click(Ctestclickstruct* cs, CPoint* point) {
(*mtypes[itype].test_click1)(cs, point, this);};
void Cmentity::link(
	Cpnt* linked_point, Cpnt* base_point, int link_type, Cmentity* tolink, int param) {
	(*mtypes[itype].link1)(linked_point, base_point, link_type, tolink, param); };



CString Cmentity::ToString() {
CString strs, str1; int i;
str1.Format("%s %d %d %d %d %d %d\n", type, itype, layer, color, ndouble, npoints, nstrings);
strs+=str1;
for (i=0; i<ndouble; i++) str1.Format("%f ", dvalues[i]); str1.Format("\n");
strs+=str1;
for (i=0; i<npoints; i++) {str1.Format("%f %f ", pnts[i].x, pnts[i].y); strs+=str1; }; 
str1.Format("\n"); strs+=str1;
for (i=0; i<nstrings; i++) str1.Format("%s ", strs[i]); str1.Format("\n");
strs+=str1;
return (strs); };
*/

int CPZstruct::get_screen_x(double ex) {
	int lx=(int)((ex-panx)*zoom);
	return(lx);
};

int CPZstruct::get_screen_y(double ey) {
	int ly;
	ly=(int)((recty-50)-((int)ey-(int)pany)*zoom);
	return(ly);
};

double CPZstruct::get_double_x(int sx) {return((sx)/zoom+panx); };

double CPZstruct::get_double_y(int sy) {return(((recty-50)-sy)/zoom+pany); };

void CPZstruct::get_screen_point(CPoint* sp, Cpnt* dp) {
	sp->x=get_screen_x(dp->x[0]);
	sp->y=get_screen_y(dp->x[1]); };

void CPZstruct::ent2screen(Cmentity1* ent) {
  for (unsigned int i=0; i<ent->pnts.size(); i++) {
    get_screen_point(&(ent->pnti[i]), (ent->pnts[i])); };
	};

void CPZstruct::get_double_point(Cpnt* dp, CPoint* sp) {
  dp->x[0]=get_double_x(sp->x); dp->x[1]=get_double_y(sp->y); };