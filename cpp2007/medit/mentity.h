
#ifndef _MENTITY_H_
#define _MENTITY_H_ 97986875656

#include <afxwin.h>
#include "base.h"
//#include "meditor.h"
//#pragma once

#define DIMENSION 3
#define NOT_SELECTED 498

#define SEL_MARKER_SIZE 4
#define SEL_ENT_RADIUS 3
#define LINK_POINT 468
#define LINK_PERP 7878
#define LINK_MID 782745

// types of entities
#define ENT_LINE 787582756
#define ENT_CIRCLE 987986032
#define ENT_SIMPLE_TEXT 82623152


class Ctestclickstruct {
public:
	int clicked_body;
	int clicked_point; };


class CParamLink : public CObject {
public:
int to_ent; // pointer to object to link
int to_point; // number of point TO which linked
int linked_ent; // 
int base_point; // (point of linked object) which is base relatively to linked point
int linked_point; // number of point which is linked
double param1;
double param2;
int type;

void SetParam(int to_ent, int to_point, int linked_ent, int linked_point, int base_point, int type, double param);
};


//struct ts1 mkkjk = {"sjdfl", 2,5,2};

class Cpnt {
public:
	double x[DIMENSION];

	void moveto(Cpnt& p1) { for (int i=0; i<DIMENSION; i++) x[i]=p1.x[i]; };
	void moveto(double x1, double y1) { x[0]=x1; x[1]=y1; };
	void add(double x1, double y1) {x[0]=x1; x[1]=y1; };
	void add(Cpnt& p1) { for (int i=0; i<DIMENSION; i++) x[i]+=p1.x[i]; };
	Cpnt();
	// void copyto(Cpnt* p1) {for (int i=0; i<DIMENSION; i++) x[i]=p1->x[i]; };
//	int rx();
//	int ry();
	
	int linked; // 1 if point is linked to somewhere
	CDataOb* link; // pointer to object that stores link specs
	void set_screen_point(CPoint* point);
};

Cpnt::Cpnt() { x[0]=0; x[1]=0; linked=0; }; 

// base class for all kinds of entities
class Cmentity1 : public CDataOb {
public: 
	//int ClassFactory(int type);
//		ClassFactory(type); };

		// entity data
		std::vector<Cpnt*> pnts;
		std::vector<CPoint*> pnti_ptr;
		std::vector<CPoint> pnti;

		// common data
	UINT32 iType;
	UINT32 id_Layer;
	UINT32 iColor;
	UINT32 iLineWidth;
	UINT32 iLineStyle;
	//UINT32 Nnodes;

	// selection status
	UINT32 IsSelected;
	UINT32 SelectedPoint;

	Cmentity1();
	Cmentity1(int type);
void	move(double x1, double y1);

	void FillPtrs() { 
		i32ptrs.clear();
		i32ptrs.push_back(&iType);
		i32ptrs.push_back(&iLayer);
		i32ptrs.push_back(&iColor);
		i32ptrs.push_back(&iLineWidth);
		i32ptrs.push_back(&iLineStyle);
		i32ptrs.push_back(&IsSelected);
		i32ptrs.push_back(&SelectedPoint);
		doubleptrs.clear();
		for (unsigned int i=0; i<pnts.size(); i++) {
			for (int j=0; j<DIMENSION; j++) {
				doubleptrs.push_back( &(pnts[i]->x[j]) ); 
			}; // for j
			pnti.reserve(pnts.size());
		}; // for i
	}; // fill ptrs

	//virtual void 
	virtual void draw(CDC* dc) = 0;

}; // Cmentity1

// my DC function to make entity class independent to Microsoft DC class
// void mydraw_moveto(

class CELine : public Cmentity1 {
public:
	Cpnt p1;
	Cpnt p2;
	CELine();
	void draw(CDC* dc);
};

CELine::CELine() {
	pnts.clear(); pnts.push_back(&p1); pnts.push_back(&p2); 
	pnti.clear(); 
	FillPtrs();
};

void CELine::draw(CDC* dc) {
	// CMapPtrToPtr map1;
dc->MoveTo(pnti[0].x, pnti[0].y);
dc->LineTo(pnti[1].x, pnti[1].y);
};

class CECircle : public Cmentity1 {
public:
	CECircle();
	Cpnt center;
	double radius;
	void draw(CDC* dc);
};

CECircle::CECircle() {
	pnts.clear(); pnts.push_back(&center); doubleptrs.push_back(&radius);
	FillPtrs();
};

void CECircle::draw(CDC* dc) {
dc->Ellipse((int)(pnti[0].x+radius), (int)(pnti[0].y+radius), 
			(int)(pnti[0].x-radius), (int)(pnti[0].y-radius));
};


class CESimpleText : public Cmentity1 {
public:
	CESimpleText();
	Cpnt place;
	std::string string;
	void draw(CDC* dc);
};

CESimpleText::CESimpleText() {
	pnts.clear(); pnts.push_back(&place); 
	stringptrs.clear(); stringptrs.push_back(&string);
	FillPtrs(); };

void CESimpleText::draw(CDC* dc) {
dc->TextOutA(pnti[0].x, pnti[0].y, string.c_str(), 1);
};

Cmentity1* EntityClassFactory(int ent_type);
















/*
int Cmentity1::ClassFactory(int type) {
	switch (type) {
		case (type== ent_is_line) : 
*/
/*
class Cmentity : public CObject {
public:
	Cmentity();
	Cmentity(int nd, int np, int ns);
	Cmentity(CString type);

	// перемещение объекта на нужное расстояние
void move(double x, double y);
// получить нужное значение по его индексу
double get_double(int index);
Cpnt* get_point(int index);
CString* get_string(int index);

// attributes
int temp[20];
	int itype;
	int layer;
	COLORREF color;
	int line_width;
	int line_style;

	// amount of data
	int npoints;
	int ndouble;
	int nstrings;
	int nnodes; // amount of points and nodes (for object snap)

	CString type;
	// data
	double* dvalues;
	Cpnt* pnts;
	CPoint* pnti;
	double* dvi;
	CString* strs;

	// selection status
	int is_selected;
	int selected_point;
	int selected_length;
	
 void draw(CDC* dc);
 void link(	Cpnt* linked_point, Cpnt* base_point, int link_type, Cmentity* tolink, int param);
 void Cmentity::test_click(Ctestclickstruct* cs, CPoint* point);

 CString ToString();

}; // mentity
*/


class CPZstruct {
public:
	double panx;
	double pany;
	double zoom;
	int rectx;
	int recty;

	int get_screen_x(double ex);
	int get_screen_y(double ey);
	double get_double_x(int sx);
	double get_double_y(int sy);
	void get_screen_point(CPoint* sp, Cpnt* dp);
	void ent2screen(Cmentity1* ent);
	void get_double_point(Cpnt* dp, CPoint* sp);
};
// global definitions

// draw functions to replace virtual
/*void draw_line(CDC* dc, Cmentity* line);
void link_to_line(Cpnt* linked_point, Cpnt* base_point, int link_type, Cmentity* tolink, int param);
void test_click_line(Ctestclickstruct* cs, CPoint* point, Cmentity* tent); // tent - tested ent

void draw_rect(CDC* dc, Cmentity* rectangle);
void draw_arc(CDC* dc, Cmentity* arc);
*/

/*
struct ts1 {
char type[32];
int ndouble;
int npoints;
int nstrings;
void (*draw1)(CDC* dc, Cmentity* ll);
void (*link1)(Cpnt* linked_point, Cpnt* base_point, int link_type, Cmentity* tolink, int param);
void (*test_click1)(Ctestclickstruct* cs, CPoint* point, Cmentity* tent);
};
*/

/*
const int ntypes = 3;
//const void* k=draw_line;
const ts1 mtypes[3] = {
  {"line", 0,2,0, draw_line, link_to_line, test_click_line}, 
  {"rect", 0, 2, 0, draw_rect, link_to_line, test_click_line}, 
  {"arc", 0, 4, 0, draw_arc, link_to_line, test_click_line}};

const int nlink_types=2;
const int link_types[2] = {LINK_PERP, LINK_MID};
*/
#endif

