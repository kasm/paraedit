// meditDoc.cpp : implementation of the CMeditDoc class
//

#include "stdafx.h"
#include "medit.h"
#include "medit\meditor.h"
#include "medit\mentity.h"

#include "meditDoc.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

/////////////////////////////////////////////////////////////////////////////
// CMeditDoc

IMPLEMENT_DYNCREATE(CMeditDoc, CDocument)

BEGIN_MESSAGE_MAP(CMeditDoc, CDocument)
	//{{AFX_MSG_MAP(CMeditDoc)
		// NOTE - the ClassWizard will add and remove mapping macros here.
		//    DO NOT EDIT what you see in these blocks of generated code!
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CMeditDoc construction/destruction

CMeditDoc::CMeditDoc()
{
	// TODO: add one-time construction code here

}

CMeditDoc::~CMeditDoc()
{
}

BOOL CMeditDoc::OnNewDocument()
{
	if (!CDocument::OnNewDocument())
		return FALSE;

	// TODO: add reinitialization code here
	// (SDI documents will reuse this document)

	return TRUE;
}



/////////////////////////////////////////////////////////////////////////////
// CMeditDoc serialization

void CMeditDoc::Serialize(CArchive& ar)
{ 
/*	CDiagramEntityContainer* m_objs=GetData();
	// --- DiagramEditor ---
	// Saving and loading to/from a text file
	if (ar.IsStoring())
	{
		ar.WriteString( m_objs->GetString() + _T( "\r\n" ) );
		int count = 0;
		CDiagramEntity* obj;
		while( ( obj = m_objs->GetAt( count++ ) ) )
			ar.WriteString( obj->GetString() + _T( "\r\n" ) );

		m_objs->SetModified( FALSE );
	}
	else
	{

		m_objs->Clear();
		CString str;
		while(ar.ReadString( str ) )
		{

			if( !m_objs->FromString( str ) )
			{
				CDiagramEntity* obj = CDiagramEntity::CreateFromString( str );
				if( obj )
					m_objs->Add( obj );
			}
		}
		m_objs->SetModified( FALSE );
	}	
	
*/	
	
	std::string str1;

	if (ar.IsStoring())
	{
		medit.ent.ToString(&str1);
		ar.Write(str1.c_str(), str1.length());
		
		
		// TODO: add storing code here
	}
	else
	{
		// TODO: add loading code here
	}
}

/////////////////////////////////////////////////////////////////////////////
// CMeditDoc diagnostics

#ifdef _DEBUG
void CMeditDoc::AssertValid() const
{
	CDocument::AssertValid();
}

void CMeditDoc::Dump(CDumpContext& dc) const
{
	CDocument::Dump(dc);
}
#endif //_DEBUG

/////////////////////////////////////////////////////////////////////////////
// CMeditDoc commands
