// meditDoc.h : interface of the CMeditDoc class
//
/////////////////////////////////////////////////////////////////////////////


#if !defined(AFX_MEDITDOC_H__9920E4A0_EAF2_42A5_B867_3A80E97794AC__INCLUDED_)
#define AFX_MEDITDOC_H__9920E4A0_EAF2_42A5_B867_3A80E97794AC__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
#include "medit\meditor.h"

class CMeditDoc : public CDocument
{
protected: // create from serialization only
	CMeditDoc();
	DECLARE_DYNCREATE(CMeditDoc)

// Attributes
public:
Cmeditor medit;
// Operations
public:

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CMeditDoc)
	public:
	virtual BOOL OnNewDocument();
	virtual void Serialize(CArchive& ar);
	//}}AFX_VIRTUAL

// Implementation
public:
	virtual ~CMeditDoc();

#ifdef _DEBUG
	virtual void AssertValid() const;
	virtual void Dump(CDumpContext& dc) const;

#endif

protected:

// Generated message map functions
protected:
	//{{AFX_MSG(CMeditDoc)
		// NOTE - the ClassWizard will add and remove member functions here.
		//    DO NOT EDIT what you see in these blocks of generated code !
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};

/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_MEDITDOC_H__9920E4A0_EAF2_42A5_B867_3A80E97794AC__INCLUDED_)
