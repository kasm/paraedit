
#include "mline.h"

Cmline::Cmline() {
	type="line";
	Cmentity::Cmentity(0, 2, 0);
	p0=&pnts[0];
	p1=&pnts[1];
 };

Cmline::Cmline(Cpnt* start, Cpnt* end) {

start->copyto(p0); end->copyto(p1);
};

double Cmline::get_x0() { return(*x0); };
double Cmline::get_y0() { return(*y0); };
double Cmline::get_x1() { return(*x1); };
double Cmline::get_y1() { return(*y1); };

void Cmline::set_x0(double ax0) {*px0=ax0; };
void Cmline::set_y0(double ay0) {*py0=ay0; };
void Cmline::set_x1(double ax1) {*px1=ax1; };
void Cmline::set_y1(double ay1) {*py1=ay1; };
