// meditView.cpp : implementation of the CMeditView class
//
//#include <windows.h>
#include "stdafx.h"
#include "medit.h"
#include "medit\meditor.h"
#include "medit\mentity.h"
#include "meditDoc.h"
#include "meditView.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

/////////////////////////////////////////////////////////////////////////////
// CMeditView

IMPLEMENT_DYNCREATE(CMeditView, CView)

BEGIN_MESSAGE_MAP(CMeditView, CView)
	//{{AFX_MSG_MAP(CMeditView)
	ON_COMMAND(ID_LALA, OnLala)
	ON_COMMAND(ID_SCALE1, OnScale1)
	ON_COMMAND(ID_SCALE2, OnScale2)
	ON_COMMAND(ID_SCALE10, OnScale10)
	ON_COMMAND(ID_ARC, OnArc)
	ON_COMMAND(ID_LINE, OnLine)
	ON_COMMAND(ID_RECT, OnRect)
	//}}AFX_MSG_MAP
	// Standard printing commands
	ON_COMMAND(ID_FILE_PRINT, CView::OnFilePrint)
	ON_COMMAND(ID_FILE_PRINT_DIRECT, CView::OnFilePrint)
	ON_COMMAND(ID_FILE_PRINT_PREVIEW, CView::OnFilePrintPreview)
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CMeditView construction/destruction

CMeditView::CMeditView()
{
	// TODO: add construction code here

}

CMeditView::~CMeditView()
{
}

BOOL CMeditView::PreCreateWindow(CREATESTRUCT& cs)
{
	// TODO: Modify the Window class or styles here by modifying
	//  the CREATESTRUCT cs


	return CView::PreCreateWindow(cs);
}

/////////////////////////////////////////////////////////////////////////////
// CMeditView drawing

void CMeditView::OnDraw(CDC* pDC)
{
	CMeditDoc* pDoc = GetDocument();
	ASSERT_VALID(pDoc);
//pDC->MoveTo(70,50); pDC->LineTo(30,30);
	CPen p;
	//Cmeditor med=pDoc->medit;
	p.CreatePen(PS_SOLID, 1, pDoc->medit.current_color);
pDC->SelectObject(&p);
pDoc->medit.draw(pDC);
}

/////////////////////////////////////////////////////////////////////////////
// CMeditView printing

BOOL CMeditView::OnPreparePrinting(CPrintInfo* pInfo)
{
	// default preparation
	return DoPreparePrinting(pInfo);
}

void CMeditView::OnBeginPrinting(CDC* /*pDC*/, CPrintInfo* /*pInfo*/)
{
	// TODO: add extra initialization before printing
}

void CMeditView::OnEndPrinting(CDC* /*pDC*/, CPrintInfo* /*pInfo*/)
{
	// TODO: add cleanup after printing
}

/////////////////////////////////////////////////////////////////////////////
// CMeditView diagnostics

#ifdef _DEBUG
void CMeditView::AssertValid() const
{
	CView::AssertValid();
}

void CMeditView::Dump(CDumpContext& dc) const
{
	CView::Dump(dc);
}

CMeditDoc* CMeditView::GetDocument() // non-debug version is inline
{
	ASSERT(m_pDocument->IsKindOf(RUNTIME_CLASS(CMeditDoc)));
	return (CMeditDoc*)m_pDocument;
}
#endif //_DEBUG

/////////////////////////////////////////////////////////////////////////////
// CMeditView message handlers

void CMeditView::OnLala() 
{ int i, k;
CMeditDoc* pDoc=GetDocument();
i=pDoc->medit.create_entity(ENT_LINE);
Cmentity1* me=(Cmentity1*)pDoc->medit.ent[i];


me->pnts[0]->x[0]=335; me->pnts[0]->x[1]=10;
me->pnts[1]->x[0]=250; me->pnts[1]->x[1]=240;

i=pDoc->medit.create_entity(ENT_LINE);
me=(Cmentity1*)pDoc->medit.ent[i];
me->pnts[0]->x[0]=200; me->pnts[0]->x[1]=120;
k=pDoc->medit.links.Add(new CParamLink());
me->pnts[1]->linked=1; 
CParamLink* l1=(CParamLink*)pDoc->medit.links[0];
l1->to_ent=0; l1->linked_ent=1; l1->type=LINK_PERP; l1->linked_point=1;
//me->pnts[1].link=new CParamLink();
//((CParamLink*)(me->pnts[1].link))->to_ent=0; 
//((CParamLink*)(me->pnts[1].link))->type=LINK_PERP;
//int k=((Cmentity*)(pDoc->medit.ent.GetAt(0)))->pnti[0].x;


pDoc->medit.select(0);
/*pDoc->medit.create_entity("arc");
me=(Cmentity*)pDoc->medit.ent[1];
me->pnts[0].x=30; me->pnts[0].y=30;
me->pnts[1].x=50; me->pnts[1].y=50;
me->pnts[2].x=50; me->pnts[2].y=40;
me->pnts[3].x=40; me->pnts[3].y=30;*/
RedrawWindow();
}

void CMeditView::OnInitialUpdate() 
{
	CView::OnInitialUpdate();
	
//if( !m_editor.m_hWnd )
//	{

		CMeditDoc* pDoc = GetDocument();

		CRect rect;
		GetClientRect( rect );
		
		pDoc->medit.Create1( WS_CHILD | WS_VISIBLE, rect, this);

//	}
//	else
//		m_editor.Clear();
	
//}	
}
/*
void CMeditView::OnLButtonDown(UINT nFlags, CPoint point) 
{
vmedit=&(GetDocument()->medit);
	Cmentity* me;
	int i, j, x, y;
i=0;
	if (vmedit->emode==MODE_MOVING) {
		me=(Cmentity*)vmedit->ent[vmedit->sel_point];
		me->pnts[me->selected_point].x=point.x;
		me->pnts[me->selected_point].y=point.y;
		vmedit->emode=MODE_NONE; };

	for (i=0; i<vmedit->ent.GetSize(); i++) {
		me=(Cmentity*)vmedit->ent[i];
		for (j=0; j<me->npoints; j++) {
			x=me->pnts[j].rx(); y=me->pnts[j].ry();
			if (( abs(x-point.x) < SelMarkerSize) && (abs(y-point.y) < SelMarkerSize)) {
				vmedit->emode=MODE_MOVING; 
				me->selected_point=j;
				vmedit->sel_point=i;
				break;};
		}; // j
	}; // i


	CView::OnLButtonDown(nFlags, point);
}*/

void CMeditView::OnScale1() 
{
			CMeditDoc* pDoc = GetDocument();
			pDoc->medit.pz.zoom=1;
			UpdateWindow();
			RedrawWindow();
}

void CMeditView::OnScale2() 
{
			CMeditDoc* pDoc = GetDocument();
			pDoc->medit.pz.zoom=2;
			
	UpdateWindow();			RedrawWindow();

}

void CMeditView::OnScale10() 
{
			CMeditDoc* pDoc = GetDocument();
			pDoc->medit.pz.zoom=0.1;
	UpdateWindow();			RedrawWindow();

}

void CMeditView::OnArc() 
{
			CMeditDoc* pDoc = GetDocument();
			pDoc->medit.user_start_entity("arc");
	
	
}

void CMeditView::OnLine() 
{
			CMeditDoc* pDoc = GetDocument();
			pDoc->medit.user_start_entity("line");
	
}

void CMeditView::OnRect() 
{
	// TODO: Add your command handler code here
	
}
