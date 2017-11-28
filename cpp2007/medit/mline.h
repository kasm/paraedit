
#include "mentity.h"

class Cmline : public Cmentity {

	Cmline();
	Cmline(Cpnt* start, Cpnt* end);

	double get_x0();
	double get_y0();
	double get_x1();
	double get_y1();

	void set_x0(double x0);
	void set_y0(double y0);
	void set_x1(double x1);		
	void set_y1(double y1);

	void get_cpoint(CPoint* p);

	Cpnt* p0;
	Cpnt* p1;
	

};
