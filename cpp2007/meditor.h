#if !defined(AFX_MEDITOR_H__C2541395_AE2D_4FCF_A3BE_C2C49B7FA2F0__INCLUDED_)
#define AFX_MEDITOR_H__C2541395_AE2D_4FCF_A3BE_C2C49B7FA2F0__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
// meditor.h : header file
//

/////////////////////////////////////////////////////////////////////////////
// Cmeditor window

class Cmeditor : public CWnd
{
// Construction
public:
	Cmeditor();

// Attributes
public:

// Operations
public:

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(Cmeditor)
	public:
	virtual CScrollBar* GetScrollBarCtrl(int nBar) const;
	//}}AFX_VIRTUAL

// Implementation
public:
	virtual ~Cmeditor();

	// Generated message map functions
protected:
	//{{AFX_MSG(Cmeditor)
	afx_msg void OnRButtonDblClk(UINT nFlags, CPoint point);
	afx_msg void OnLButtonDown(UINT nFlags, CPoint point);
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};

/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_MEDITOR_H__C2541395_AE2D_4FCF_A3BE_C2C49B7FA2F0__INCLUDED_)
