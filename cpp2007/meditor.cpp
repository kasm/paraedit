// meditor.cpp : implementation file
//

#include "stdafx.h"
#include "medit.h"
#include "meditor.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

/////////////////////////////////////////////////////////////////////////////
// Cmeditor

Cmeditor::Cmeditor()
{
}

Cmeditor::~Cmeditor()
{
}


BEGIN_MESSAGE_MAP(Cmeditor, CWnd)
	//{{AFX_MSG_MAP(Cmeditor)
	ON_WM_RBUTTONDBLCLK()
	ON_WM_LBUTTONDOWN()
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()


/////////////////////////////////////////////////////////////////////////////
// Cmeditor message handlers

CScrollBar* Cmeditor::GetScrollBarCtrl(int nBar) const
{
	// TODO: Add your specialized code here and/or call the base class
	
	return CWnd::GetScrollBarCtrl(nBar);
}

void Cmeditor::OnRButtonDblClk(UINT nFlags, CPoint point) 
{
	// TODO: Add your message handler code here and/or call default
	
	CWnd::OnRButtonDblClk(nFlags, point);
}

void Cmeditor::OnLButtonDown(UINT nFlags, CPoint point) 
{
	// TODO: Add your message handler code here and/or call default
	
	CWnd::OnLButtonDown(nFlags, point);
}
