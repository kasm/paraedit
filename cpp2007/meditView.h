// meditView.h : interface of the CMeditView class
//
/////////////////////////////////////////////////////////////////////////////

#if !defined(AFX_MEDITVIEW_H__9F7A1453_B501_459A_96B0_1B8BE3EDE323__INCLUDED_)
#define AFX_MEDITVIEW_H__9F7A1453_B501_459A_96B0_1B8BE3EDE323__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000


class CMeditView : public CView
{
protected: // create from serialization only
	CMeditView();
	DECLARE_DYNCREATE(CMeditView)
Cmeditor* vmedit;
// Attributes
public:
	CMeditDoc* GetDocument();

// Operations
public:

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CMeditView)
	public:
	virtual void OnDraw(CDC* pDC);  // overridden to draw this view
	virtual BOOL PreCreateWindow(CREATESTRUCT& cs);
	virtual void OnInitialUpdate();
	protected:
	virtual BOOL OnPreparePrinting(CPrintInfo* pInfo);
	virtual void OnBeginPrinting(CDC* pDC, CPrintInfo* pInfo);
	virtual void OnEndPrinting(CDC* pDC, CPrintInfo* pInfo);
	//}}AFX_VIRTUAL

// Implementation
public:
	virtual ~CMeditView();
#ifdef _DEBUG
	virtual void AssertValid() const;
	virtual void Dump(CDumpContext& dc) const;
#endif

protected:

// Generated message map functions
protected:
	//{{AFX_MSG(CMeditView)
	afx_msg void OnLala();
	afx_msg void OnScale1();
	afx_msg void OnScale2();
	afx_msg void OnScale10();
	afx_msg void OnArc();
	afx_msg void OnLine();
	afx_msg void OnRect();
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};

#ifndef _DEBUG  // debug version in meditView.cpp
inline CMeditDoc* CMeditView::GetDocument()
   { return (CMeditDoc*)m_pDocument; }
#endif

/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_MEDITVIEW_H__9F7A1453_B501_459A_96B0_1B8BE3EDE323__INCLUDED_)
