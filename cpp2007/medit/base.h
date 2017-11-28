#ifndef BASE_H_87763235
#define BASE_H_87763235

/*
Библиотека программных врапперов для различных объектов и манипуляций с ними
в случае использования массивов и иерархических структур объектов

*/

#if _MSC_VER > 1000
#pragma once
#endif //
// database class
#include <stdlib.h>
#include <vector>
#include <string>
#include <basetsd.h>

#define IS_DELETED 902005023
#define NOT_FOUND 982509088

typedef std::vector<int> Cvi;
typedef std::vector<double> Cvd;
typedef std::vector<std::string> Cvs;
typedef std::vector<int*> Cvpi;
typedef std::vector<double*> Cvpd;
typedef std::vector<std::string*> Cvps;
typedef std::vector<char*> Cvc;
typedef std::vector<UINT32> Cvi32;
typedef std::vector<UINT32*> Cvpi32;
typedef std::string Cstr1;

void btokenize(std::string& str1, char* seps,  Cvc vc1, char* buf);


// object to store, manipulate and in/out data
class CDataOb {
public:
	int type;

	virtual void FillPtrs(void) = 0 ;
	CDataOb();
	CDataOb(int type);
	Cvpi intptrs;
	Cvpi32 i32ptrs;
	Cvpd doubleptrs;
	Cvps stringptrs;
	void out(std::string* str1);
	void in(std::string& str1);
	void CopyTo(CDataOb* ob1);
	CDataOb* Clone();
	// CDataOb* GetClone();
};


class Cintob : public CDataOb {
public:
	int i;
	void FillPtrs(void) { intptrs.push_back(&i); };
	  
};

// void Cintob::FillPtrs() { intptrs.push_back(&i); };

class Cint1 { public: int i; };

/*
class Cel {
	int id;
	void* p; 
public:
	Cel(int id1, CObject* p1) { id=id1, p=p1}; 
};
*/
int binary_search_vector(Cvi& v, int val);


template <class T> class TBase1 {
//	std::vector<Cel> el;
	Cvi id; // unique identifier
	std::vector<CDataOb*> ptr;
	Cvi deleted; // sign that this record was deleted

	int id_count; // current UNIQUE count of identifiers (not a quantity !!!!)
	int cno; // current record;

public:
	TBase1();
	int Add(CDataOb* p1);
	int Add(); // return ID
	int DelID(int id1);
	int SetCurrentID(int id1);

	CDataOb* GetPid(int id1) {return(ptr[binary_search_vector(id, id1)]); };
	CDataOb* GetPcno() { return(ptr[cno]); };
	CDataOb* GetPno(int no1) {return(ptr[no1]); };
	int GetNoid(int id1) {return(binary_search_vector(id, id1)); };
	int GetIdno(int no1) {return(id[no1]); };
	int GetIdCno() {return(id[cno]); };
	void ToString(std::string* str1) 
	  {for (unsigned int i=0; i<ptr.size(); i++) 
	{ (*(ptr[i])).out(str1); }; };
	CDataOb* operator [](int i) {return (ptr[i]);};
}; // TBase1

template <class T> int TBase1<T>::Add(CDataOb* p1) {
	// el.push_back(new el(cind, p1));
	id.push_back(id_count);
	ptr.push_back(p1);
	cno=binary_search_vector(id, id_count); 
	id_count++; 
return(id_count-1); 
};

template <class T> int TBase1<T>::Add() {
	id.push_back(id_count);
	ptr.push_back(new T); /// ??? to know
};
	

template <class T> TBase1<T>::TBase1() {
	id_count=0;
	cno=0;
	id.clear(); id.reserve(50);
	ptr.clear(); ptr.reserve(50);

};




















#define EOBASE 98329599
#define ITEM_DELETED 9829
#define KEY_INDEXED 97050277
#define MAX_FIELDS 20



/*
template<class T> class CTEl {
	T* data;
	int el(); };

*/
	class CBase {
public:
int* index[MAX_FIELDS];
int* data[MAX_FIELDS];
int data_type[MAX_FIELDS];
int active_index; // number of current index
int nid; // current maximal ID
int n;  // number of items (with deleted)
int cur; // number of current item
int *del; // mark of deletion
int* id; // ID of item
int** p; // pointer to item's object
int nindex[MAX_FIELDS]; // tells is customer's data indexed

CBase();
void ToFirst();
int Next();
int Add(int* p1);
void* GetPtr();
void* GetPtr(int id1);
int* SelID(int id1);
void DelID(int id1);
void Pack();
void FindData(double what); // assume in current index
void Index(int DataCount);
}; 

int binary_search(int n, int* id, int findme);

int binary_search_index(int n, int* data, int data_type, int* index, int* findme);


class CTreeBase : public CBase {
public:
  int curlev; // current level of choosen el ; 0 - base (empty element)
  int pID; // parent's ID  // int buffer[100];
  int el[20]; // current ierarhy state (current relative address)
//  int nchild; // number of childs in current buffer
  CTreeBase();
  void Add(int parID, int* p1);
  void DelID(int id1);
  void Pack();

  int GotChild();
  void GetChild();
  int Next(); // next element of same lvl
  int ToChild(); // sets current lvl to child lvl and relative element number to 0
  int ToParent(); // sets current lvl to parent lvl and 
       // relative element number to parent rel number
};

//template<class T>
void create_index(int* data, int* ind1, int data_type, int n);

#endif