#include <iostream>
#include <array>
#include <vector>
#include <set>


struct vec2 {
	int x, y;

	friend std::ostream& operator<<(std::ostream& os, const vec2& v) {
		os << "(" << v.x << ", " << v.y << ")";
		return os;
	}

	vec2 operator+(const vec2& v) {
		return { v.x + x, v.y + y };
	}

	bool operator==(const vec2& v) {
		return (v.x == x && v.y == y);
	}
};

vec2 goal;
int limit, width, height;
std::array<std::array<bool, 22>, 50> map;
std::vector<vec2> steps;
std::array<vec2, 5> matrix{ {{-1, 0}, {1, 0}, {0, -1}, {0, 1}, {0, 0}} };
std::set<std::array<int, 3>> rep;
std::vector<int> result;

bool occupied(vec2 pos, int n) {


	if (rep.find({ pos.x, pos.y, n % width }) != rep.end() || pos.x < 0 || pos.y < 0 || pos.y >= height || pos.x >= width)
		return true;

	rep.insert({ pos.x, pos.y, n % width });

	int direction = 1;
	if ((height - pos.y) % 2 == 0)
		direction = -1;

	pos.x += n * direction;
	while (pos.x < 0)
		pos.x += width;
	while(pos.x >= width)
		pos.x -= width;

	return map[pos.x][pos.y];
}


int run() {
	for (int current = 0, end = 1, howMany = 1; current != end; end = steps.size(), ++howMany) {

		if (howMany > limit)
			return -1;

		for (; current < end; ++current) {
			for (const vec2& m : matrix) {
				vec2 p = steps[current] + m;

				if (p == goal)
					return howMany;

				else if (!occupied(p, howMany))
					steps.push_back(p);
			}
		}
	}

	return -1;
}

int main()
{
	int n;
	std::cin >> n;
	for (; n > 0; --n, steps.resize(0), rep.clear()) {


		std::cin >> limit >> height >> width;

		height += 2;
		char c;
		for (int y = 0; y < height; ++y)
			for (int x = 0; x < width; ++x) {

				std::cin >> c;
				if (c == 'G')
					goal = { x, y };
				else if (c == 'F')
					steps.push_back({ x, y });

				map[x][y] = (c == 'X');

			}
		
		result.push_back(run());
		
	}
	

	for (int i : result)
		if (i > 0)
			std::cout << "The minimum number of turns is " << i << ".\n";
		else std::cout << "The problem has no solution.\n";

}
