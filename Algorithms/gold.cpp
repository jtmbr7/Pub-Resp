#include <iostream>
#include <array>
#include <vector>

std::array<std::array<char, 50>, 50> map;
std::vector<std::array<int, 2>> mind;
std::array<std::array<int, 2>, 4> matrix{ {{-1, 0}, {1, 0}, {0, -1}, {0, 1}} };
int w, h;
int value = 0.0;

void printMap() {
	std::cout << "\n";
	for (int y = 0; y < h; ++y) {
		for (int x = 0; x < w; ++x) {
			std::cout << map[x][y];
		}
		std::cout << "\n";
	}
}

bool think() {


	if(mind.size() == 0)
		return false;

	std::array<int, 2> p = mind.back();
	map[p[0]][p[1]] = ' ';
	mind.pop_back();

	for (std::array<int, 2> m : matrix) {
		int x = p[0] + m[0];
		int y = p[1] + m[1];

		if (x < 0 || x > w || y < 0 || y > h)
			continue;

		char environment = map[x][y];

		if (environment == '.') {
			mind.push_back({ x, y });
		}
		else if (environment == 'G') {
			map[x][y] = '.';
			mind.push_back({ x, y });
			++value;
		}
		else if (environment == 'C') {
			map[x][y] = ',';
			++value;
		}
	}

	//printMap();

	return true;
}

int main()
{
	std::cin >> w >> h;
	
	char input;
	for (int y = 0; y < h; ++y) {
		for(int x = 0; x < w; ++x) {
			std::cin >> input;

			if (input == 'P') {
				mind.push_back({x, y});
				input = '.';
			}

			map[x][y] = input;
		}
	}

	for (int y = 0; y < h; ++y) {
		for (int x = 0; x < w; ++x) {
			if (map[x][y] == 'T') {
				for (std::array<int, 2> m : matrix) {
					int X = x + m[0];
					int Y = y + m[1];

					if (X < 0 || X > w || Y < 0 || Y > h)
						continue;

					char environment = map[X][Y];

					if (environment == 'G')
						map[X][Y] = 'C';

					if (environment == '.')
						map[X][Y] = ',';
				}
			}
		}
	}

	char i = map[mind[0][0]][mind[0][1]];
	if (i == ',' || i == 'C') {

	}
	else {
		while (think()) {};
	}


	std::cout << value;
}