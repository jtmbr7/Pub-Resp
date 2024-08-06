// Author: John Tember
// LiU-ID: johte805
//This solution has the time-complexity of O(n) where n is the number of vertices.
// I redid this a million times because i forgot to write "std::" before the abs functions...
// I basically just calculate the signed area of the polygon, if it is negative it is in a clockwise order
// if its positve it is in a counterclockwise order. If it would end up on 0 this would mean the points ar ein a straight line
// but this is not the case of the input.
// this solution is pretty straight-forward, very simple.

#include <iostream>
#include <iomanip>
#include <array>


struct Vert {
	double x, y;
};

// Calculating the area by using the cross-product of the vertices.
int calculate_area(const std::array<Vert, 1001>& verts, int n) {

	double A = 0.0;
	for (int i = 0; i < n - 1; ++i)
		A += (verts[i].x * verts[i + 1].y) - (verts[i + 1].x * verts[i].y);

	return A;
}

int main()
{

	std::array<Vert, 1001> verts;
	while(true) {
		int n;
		std::cin >> n;
		if (n == 0)
			break;

		for (int i = 0; i < n; ++i)
			std::cin >> verts[i].x >> verts[i].y;

		verts[n++] = verts[0];

		double A = calculate_area(verts, n);

		if (A >= 0)
			std::cout << "CCW";
		else std::cout << "CW";

		std::cout << " " << std::setprecision(1) << std::fixed  << std::abs(A)/2 << "\n";
	}
}
