#include <iostream>
#include <array>
#include <vector>

struct Square {
	bool wall = false;
	bool wet = false;
};

struct vec2 {
	int x, y;

	vec2 operator+(const vec2& v) const {
		return vec2{ x + v.x, y + v.y };
	}
};

int X, Y, T, L, W;

std::array<std::array<Square, 1001>, 1001> map;

std::array<vec2, 4> matrix{ {{1, 0}, {-1, 0}, {0, 1}, {0, -1}} };

int main()
{

	while(true) {

		for (int y = 1; y <= Y; ++y) {
			for (int x = 1; x <= X; ++x) {
				map[x][y].wall = false;
				map[x][y].wet = false;
			}
		}
		std::cin >> X;
		if (X == -1)
			return 0;
		std::cin >> Y >> T >> L >> W;

		std::vector<vec2> steps;

		for (int i = 0, x, y; i < L; ++i) {
			std::cin >> x >> y;
			map[x][y].wet = true;
			steps.push_back({ x, y });
		}

		for (int i = 0, x1, y1, x2, y2; i < W; ++i) {

			std::cin >> x1 >> y1 >> x2 >> y2;
			int xdir = 1, ydir = 1;
			if (x1 == x2)
				xdir = 0;
			else if (x1 > x2)
				xdir = -1;

			if (y1 == y2)
				ydir = 0;
			else if (y1 > y2)
				ydir = -1;

			for (; x1 != x2 || y1 != y2; x1 += xdir, y1 += ydir) {
				map[x1][y1].wall = true;
			}

			map[x2][y2].wall = true;
		}

		int count = L;

		for(int t = 1, i = 0, q = steps.size(); t < T; ++t, i = q, q = steps.size()) {

			for (; i < q; ++i) {
				vec2 current = steps[i];
		
				for (const vec2& m : matrix) {

					vec2 next = current + m;

					if (next.x < 1 || next.y < 1 || next.x > X || next.y > Y)
						continue;

					if (map[next.x][next.y].wall)
						continue;

					else if (!map[next.x][next.y].wet) {
						map[next.x][next.y].wet = true;
						steps.push_back(next);
						++count;
					}
				}
			}
		}

		std::cout << count << "\n";

	}
}