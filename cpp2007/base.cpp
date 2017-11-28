//#include <numeric>
#include "base.h"


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

void CBase::SelID(int id1) {
int i; i=binary_search(n, id, id1); 
if (!del[i]) cur=i; };

void* CBase::GetPtr(int id1) {
int i;
i=binary_search(n, id, id1);
if (del[i]) return(NULL); else return(p[i]);
};

void CBase::DelID(int id1) {
	SelID(id1); if (!del[cur]){ del[cur]=1; n--;}; };

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


void CBase::Pack() {int i, j; j=0;
for (i=0; i<n; i++) {
  if (!del[i]) { 
	  del[j]=0; id[j]=id[i]; p[j]=p[i]; j++; };
  }; // i
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
	double min, max; int i, j, k, sorted, t;
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
}; // while
return(NULL);
}