//#include <numeric>
#include <stdlib.h>
#include <cstdio>
#include <string>
#include "base.h"
//#include "stdafx.h"
#include "..\stdafx.h"

// create set of tokens for string 'str1'
// *seps - set of separators which divide string
// vc1 - output set of strings (array of char*)
// buf - buffer for storing output array of chars
void btokenize(std::string& str1, char* seps,  Cvc vc1, char* buf) {
unsigned int i; // just counter
int curn; // counter for tokens
unsigned int cur; // current symbol
int curi; // current symbol for current token
unsigned int sepsize; // size of array with separators
int bsep; // sign that seperator met
sepsize=0; while (seps[sepsize]) sepsize++;
for (i=0; i<str1.size(); i++) buf[i]=str1[i]; 
buf[str1.size()]=0;
cur=0; curi=0; curn=0;
while(cur!=str1.size()) {
	bsep=0;
	for (i=0; i<sepsize; i++) 
		if (buf[cur]==seps[i]) bsep=1;
	if (bsep && curi) {curi=0; buf[cur]=0; };
	// if (bsep && !curi) {cur++; 
	if (!bsep) {
		if (curi==0) {vc1[curn]=&buf[cur]; curn++; }; curi++; };
	cur++; 
}; // while
};


CDataOb::CDataOb()  { 
	intptrs.clear(); doubleptrs.clear(); stringptrs.clear(); intptrs.push_back(&type); };
CDataOb::CDataOb(int type1) {
	type=type1;
	intptrs.clear(); doubleptrs.clear(); stringptrs.clear(); intptrs.push_back(&type); };

void CDataOb::CopyTo(CDataOb* ob1) { unsigned int i;
	for(i=0; i<intptrs.size(); i++) {
		*(ob1->intptrs[i])=*(intptrs[i]); };
	for(i=0; i<i32ptrs.size(); i++) {
		*(ob1->i32ptrs[i])=*(i32ptrs[i]); };
	for(i=0; i<doubleptrs.size(); i++) {
		*(ob1->doubleptrs[i])=*(doubleptrs[i]); };
	for(i=0; i<stringptrs.size(); i++) {
		*(ob1->stringptrs[i])=*(stringptrs[i]); };
};

CDataOb* CDataOb::Clone() {
	CDataOb* i;
return(i);

}; // clone


/*CDataOb* CDataOb::GetClone() {

};*/

void CDataOb::out(std::string* str1) {
	int i; 
	//str1=""; 
	int iint, idouble, istring;
	char buf[55]; std::string sb;
	iint=intptrs.size(); idouble=doubleptrs.size(); istring=stringptrs.size();
	_itoa_s(iint, buf, 10); sb=buf; 
	*str1+=sb; *str1+="|"; 
	for (i=0; i<iint; i++) { _itoa_s(*intptrs[i], buf, 10); *str1+=buf; *str1+="|"; };
	_itoa_s(idouble, buf, 10); *str1+=buf; *str1+="|"; 

	for (i=0; i<idouble; i++) { _gcvt_s(buf, 50, *doubleptrs[i], 15); *str1+=buf; *str1+="|"; };
	_itoa_s(istring, buf, 10); *str1+=buf; *str1+="|"; 
	for (i=0; i<istring; i++) { /*_itoa_s(*stringptrs[i], buf, 10); */
		*str1+=(*stringptrs[i]); *str1+="|"; };
		*str1+="\n";
};

void CDataOb::in(std::string& str1) {
	unsigned int i, j, iint, idouble, istring, curbuf;
	char buf[222];
	char seps[]="|;";
	Cvc vc1; curbuf=0;
	btokenize(str1, seps, vc1, buf);
	iint=atoi(vc1[0]);
	for (i=0; i<iint; i++) *intptrs[i]=(atoi(vc1[i+1]));
	curbuf=iint;
	idouble=atoi(vc1[curbuf]); curbuf++;
	for (i=0; i<idouble; i++) *doubleptrs[i]=(atoi(vc1[curbuf+i]));
	curbuf+=idouble;
	istring=atoi(vc1[curbuf]);
	for (i=0; i<istring; i++) {
		for (j=0; !((vc1[curbuf+i])[j]); j++)
			(stringptrs[i])[j]= (vc1[curbuf+i])[j]; };


	// intptrs.clear(); doubleptrs.clear(); stringptrs.clear();
	/*char* tok1; 
	for (i=0; i<str1.size(); i++) buf[i]=str1[i]; buf[str1.size()]=0;	
	tok1=strtok_s(buf, seps); iint=atoi(tok1);
	for (i=0; i<iint; i++) { tok1=strtok(buf, seps); *intptrs[i]=atoi(tok1); };*/
	/* str1>>idouble; for (i=0; i<idouble; i++) str1>>(int)(*(doubleptrs[i]));
	str1>>istring; for (i=0; i<istring; i++) str1>>(int)(*(doubleptrs[i])); */
};

// template <class T>


// template <class T>
template <class T> int TBase1<T>::SetCurrentID(int id1) {
	cno=binary_search_vector(id, id1);
return(cno); };


template <class T> int TBase1<T>::DelID(int id1) {
	cno=binary_search_vector(id, id1);
	if (cno!=NOT_FOUND) {deleted[cno]=1; return(0); }
	else return(NOT_FOUND); };

/*	
template <class T> T* TBase1<T>::GetPid(int id1) {
		int k;
		k=binary_search_vector(id, id1);
		return(ptr[k]);
	};
*/

int binary_search_vector(Cvi& v, int findme) {
int f=1; int a=0; int b=v.size()-1; int t;
if (v[a]==findme) return(a); if (v[b]==findme) return(b);

while (f) {
t=(a+b)/2;
if (v[t]==findme) return(t);
if (v[t]<findme) a=t; else b=t;
if ( (b-a)==1 && (v[a]!=findme || v[b]!=findme)) f=0;
}; // while
return(NULL);
}
















//typedef vector <int> intar;

CBase::CBase() {
//intar v;
	int i;
for (i=0; i<n; i++) index[i]=new int[50];
n=0; nid=0;
id=new int[50];
p=new int*[50];
del=new int[50];
active_index=KEY_INDEXED;

};

int CBase::Add(int* p1) {
id[n]=nid; p[n]=p1; del[n]=0; nid++; n++; 
return(nid-1); };

int* CBase::SelID(int id1) {
int i; i=binary_search(n, id, id1); 
if (!del[i]) cur=i; else return(NULL);
return(p[i]); };

void* CBase::GetPtr(int id1) {
int i;
i=binary_search(n, id, id1);
if (del[i]) return(NULL); else return(p[i]);
};

void CBase::DelID(int id1) {
	SelID(id1); if (!del[cur]){ del[cur]=1; }; };

void* CBase::GetPtr() {return(p[cur]); };

int CBase::Next() {
if (cur==n-1) return(EOBASE);
if (active_index==KEY_INDEXED) {
	while(!del[cur++]) {if (cur==n) { cur--; return(EOBASE); }; };
	return(id[cur]); 
}
else {
	while(!del[index[active_index][cur++]]) { if (cur==n) {cur--; return(EOBASE); }; };
	return(id[index[active_index][cur]]); 
}; // else
	};


void CBase::Pack() {int i, j, k; j=0; k=0;
for (i=0; i<n; i++) {
  if (!del[i]) { 
	  del[j]=0; id[j]=id[i]; p[j]=p[i]; j++; }
  else k++;
  }; // i
n=n-k;
  };

void CBase::Index(int DataNumber) {
	create_index(data[DataNumber], index[DataNumber], data_type[DataNumber], n); };

void CTreeBase::Add(int parID, int* p1) {
	pID=parID; ((CBase*)this)->Add(p1);
};

void CTreeBase::GetChild() {
};

int ToChild() {
return(0);};

//template<class T>
void create_index(int* data, int* ind1, int data_type, int n)
	 {
	// double min, max; 
	int i, sorted, t;
	/*min=*data[0]; imin=0; max=*data[0]; imax=0;
	for (i=0; i<n; i++) {
		if (*data[i]<min) {min=*data[i]; imin=i; };
		if (*data[i]>max) {max=*data[i]; imax=i; };
	};*/
	
	for (i=0; i<n; i++) ind1[i]=i; sorted=0;
	while (!sorted) { sorted=0;
		for (i=0; i<n-1; i++) {
			if (data_type==0) {
				if ((int*)data[ind1[i]]<(int*)data[ind1[i+1]]) {
	    			t=ind1[i]; ind1[i]=ind1[i+1]; ind1[i+1]=t; sorted++; };
			if (data_type==1) {
				if ((double*)data[ind1[i]]<(double*)data[ind1[i+1]]) {
					t=ind1[i]; ind1[i]=ind1[i+1]; ind1[i+1]=t; sorted++; }; };
			
		};
	};
	 }; // create index
};

int binary_search_index(int n, int* data, int data_type, int* index, int* findme) {
	int f=1; int a=0; int b=n; int t;
	double* d1; double df;
	if(data_type==0) { // int
		if (data[index[a]]==*findme) return(a); if (data[index[b]]==*findme) return(b);
		while(f) {
			t=(a+b)/2;
			if (data[index[t]]==*findme) return(t);
			if (data[index[t]]<*findme) a=t; else b=t;
		}; // while
	} // if int
	else {
		d1=(double*)data;
		df=(*((double*)findme));
		if ( (d1[index[a]])==df) return(a); 
		if ( (d1[index[b]])==df) return(b);
		while(f) {
			t=(a+b)/2;
			if ( d1[index[t]]==df) return(t);
			if ( d1[index[t]]<df) a=t; else b=t;
		}; // while
	}; // if int
return(NULL); };

int binary_search(int n, int* id, int findme) {
int f=1; int a=0; int b=n; int t;
if (id[a]==findme) return(a); if (id[b]==findme) return(b);

while (f) {
t=(a+b)/2;
if (id[t]==findme) return(t);
if (id[t]<findme) a=t; else b=t;
if ( (b-a)==1 && (id[a]!=findme || id[b]!=findme)) f=0;
}; // while
return(NULL);
}