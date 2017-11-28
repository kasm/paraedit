#if !defined(AFX_MEDITOR_H__240A86D5_83E2_4E37_B11D_F09699AB0537__INCLUDED_)
#define AFX_MEDITOR_H__240A86D5_83E2_4E37_B11D_F09699AB0537__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
// meditor.h : header file
//
#include "mentity.h"
#include "base.h"

#define MODE_NONE 920
#define MODE_MOVING_POINT 323
#define MODE_MOVING_ENT 888
#define MODE_ENTERING_POINT 2356

#define COLOR_MARKER_SEL_ENT RGB(255,0,0)
#define COLOR_MARKER_SEL_POINT RGB(0,0,0)
#define COLOR_MARKER_MOUSE_POINT RGB(255,255,0)
#define COLOR_MARKER_MOUSE_ENT RGB(0,0,255)


/////////////////////////////////////////////////////////////////////////////
// Cmeditor window

class CLayer : public CDataOb {
public:
  std::string name;
  int edible;
  int visible;
  int linkable;
  COLORREF color; // default color
  double width; // default line width
  int line_style;

  CLayer();
  CLayer(std::string name1);
void  FillPtrs(void) {
	  intptrs.push_back(&edible);
	  intptrs.push_back(&visible);
	  intptrs.push_back(&linkable);
	  intptrs.push_back((int*)&color);
	  intptrs.push_back(&line_style);
	  stringptrs.push_back(&name);
	  doubleptrs.push_back(&width);
  };

};


CLayer::CLayer() { FillPtrs(); };

CLayer::CLayer(std::string name1) {
	name=name1; 
FillPtrs(); };

class Cmeditor : public CWnd
{
// Construction
public:

	Cmeditor();

// Attributes
public:
int current_layer;
int current_color;
int current_line_width;
int current_line_style;
// int nents; // number of entities
public:
int sel_ent_id; // number of entity with selected point
int sel_point; // selected point
int mouse_ent_id; // number of entity under mouse cursor
int mouse_point; // number of point under mouse cursor
Cpnt last_point; // last point to which user clicked
Cpnt last_ent_position[10];
int entering_point1; // number of point of entity which is building
int emode; // current editor mode
TBase1<Cmentity1> ent; // entities
TBase1<CLayer> lr; // layers
CObArray links; // links
CPZstruct pz;
int edvi[20];
//CPoint epnti[20];
//int epntix[20];
//int epntiy[20];

// Operations
public:
int create_entity(int type);
void user_start_entity(CString type);
void draw(CDC* dc); // draw all
void draw_ents(CDC* dc); // draw entities
void draw_back(CDC* dc); // draw background
void draw_selection_markers(CDC* dc);
void select(int i); // select entity
void Cmeditor::Create1( DWORD dwStyle, const RECT &rect, CWnd *pParentWnd);
int get_screen_x(double ex);
int get_screen_y(double ey);
void create_layer(CString pname);
void set_screen_point(CPoint* point, Cmentity1* me, int number);
void fill_node_points(int ent1);
void check_mouse_point(CPoint* point);
void rebuild();

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(Cmeditor)
	//}}AFX_VIRTUAL

// Implementation
public:
	virtual ~Cmeditor();

	// Generated message map functions
protected:
	//{{AFX_MSG(Cmeditor)
	afx_msg void OnLButtonDown(UINT nFlags, CPoint point);
	afx_msg void OnMouseMove(UINT nFlags, CPoint point);
	afx_msg void OnPaint();
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};


/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_MEDITOR_H__240A86D5_83E2_4E37_B11D_F09699AB0537__INCLUDED_)
