#ifndef BASE_H_87763235
#define BASE_H_87763235


#if _MSC_VER > 1000
#pragma once
#endif //
// database class
#include <stdlib.h>
#define EOBASE 98329599
#define ITEM_DELETED 982905909
#define NOT_FOUND 0982509088
#define KEY_INDEXED 97050277
#define MAX_FIELDS 20


template<class T> class CTEl {
	T* data;
	int el(); };


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
void SelID(int id1);
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