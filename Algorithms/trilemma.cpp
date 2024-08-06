#include <iostream>
#include <cmath>
#include <array>
#include <algorithm>
#include <string>
#include <sstream>
#include <math.h>

const double ZIGMA = 0.000001;

struct Position {
	int x, y;

	int distance(const Position& p) {
		return pow(x - p.x, 2) + pow(y - p.y, 2);
	}
};

int main()
{

	std::string line;
	std::array<std::string, 100> result;
	int n;
	std::getline(std::cin, line);
	std::stringstream s{ line };
	s >> n;
	Position p1{}, p2{}, p3{};
	for (int i = 0; i < n; ++i) {
		std::getline(std::cin, line);
		std::stringstream ss{ line };

		ss >> p1.x >> p1.y >> p2.x >> p2.y >> p3.x >> p3.y;
		std::array<int, 3> l{ p1.distance(p2), p1.distance(p3), p2.distance(p3) };

		std::sort(l.begin(), l.end());

		double a = p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y);
		if(abs(a) < ZIGMA) {
			result[i] = "not a triangle";
			continue;
		}

		bool iso = false;
		if (l[0] == l[1] || l[0] == l[2] || l[1] == l[2])
			iso = true;

		if (l[0] + l[1] == l[2]) {
			if (iso)
				result[i] = "isosceles right triangle";
			else result[i] = "scalene right triangle";
		}
			
		else if (l[0] + l[1] < l[2]) {
			if(iso)
				result[i] = "isosceles obtuse triangle";
			else result[i] = "scalene obtuse triangle";
		}
			
		else {
			if (iso)
				result[i] = "isosceles acute triangle";
			else result[i] = "scalene acute triangle";
		}
	}

	for (int i = 1; i <= n; ++i)
		std::cout << "Case #" << i << ": " << result[i - 1] << "\n";
}