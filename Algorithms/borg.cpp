
#include <iostream>
#include <vector>
#include <array>
#include <string>
#include <algorithm>
#include <sstream>

struct Edge {
	int head, tail, weight;

	friend std::ostream& operator<<(std::ostream& os, const Edge& e) {
		os << "(" << e.head << ", " << e.tail << ", " << e.weight << ")";
		return os;
	}
};

struct vec2 {
	int x, y;

	vec2 operator+(const vec2& v) {
		return vec2{ x + v.x, y + v.y };
	}

	bool operator==(const vec2& v) {
		return (x == v.x && y == v.y);
	}
	friend std::ostream& operator<<(std::ostream& os, const vec2& e) {
		os << "(" << e.x << ", " << e.y << ")";
		return os;
	}
};


std::array<vec2, 4> matrix{ {{-1, 0}, {1, 0}, {0, -1}, {0, 1}} };

int main() {

	std::vector<int> results;
	int n;
	std::cin >> n;
	
	for (; n > 0; --n) {

		int width, height;
		std::array<std::array<bool, 50>, 50> map;
		std::array<vec2, 101> vertices;
		std::array<std::vector<Edge>, 101> edges;
		int n_edges = 0, n_vertices = 0;

		std::cin >> width >> height >> std::ws;
		std::string s;
		for (int y = 0; y < height; ++y) {
			std::getline(std::cin, s);

			for (int x = 0; x < width; ++x) {
				char c = s[x];

				map[x][y] = (c == '#');
				if (c == 'A' || c == 'S')
					vertices[n_vertices++] = { x, y };
			}
		}

		for (int i = 0; i < n_vertices - 1; ++i) {

			const vec2& begin = vertices[i];
			std::vector<vec2> steps{ begin };
			std::array<std::array<bool, 50>, 50> unvisited;

			for (int y = 0; y < height; ++y)
				for (int x = 0; x < width; ++x)
					unvisited[x][y] = true;


			unvisited[begin.x][begin.y] = false;
			//std::cout << "Currently: (" << begin.x << ", " << begin.y << ")\n";

			for (int current = 0, end = 1, howMany = 1; current != end; ++howMany, end = steps.size()) {
				for (; current < end; ++current) {
					for (const vec2& m : matrix) {
						vec2 p = steps[current] + m;

						//std::cout << "\tChekcing (" << p.x << ", " << p.y << "): ";

						if (unvisited[p.x][p.y]) {
							if (!map[p.x][p.y]) {
								unvisited[p.x][p.y] = false;
								steps.push_back({ p.x, p.y });

								//std::cout << "TRUE\n";
								for (int q = i + 1; q < n_vertices; ++q) {

									if (p == vertices[q]) {
										edges[i].push_back({ i, q, howMany });
										edges[q].push_back({ q, i, howMany });
										break;
									}
								}
							}
							else {
								//std::cout << "Wall\n";
							}
						}
						else {
							//std::cout << "Already visited\n";
						}
					}
				}
			}
		}

		/*
		for (int y = 0; y < height; ++y) {
			for (int x = 0; x < width; ++x)
				std::cout << map[x][y];
			std::cout << "\n";
		}
		for (int i = 0; i < n_vertices; ++i) {
			const vec2& v = vertices[i];

			std::cout << "(" << v.x << ", " << v.y << "): ";
			for (const Edge& e : edges[i]) {
				std::cout << e;
			}
			std::cout << "\n";
		}

		std::cout << "\n";
		*/

		std::vector<Edge> list{ edges[0] };
		std::vector<Edge> saved{};
		std::array<bool, 101> visited{ };
		std::fill(visited.begin(), visited.end(), false);
		visited[0] = true;

		int result = 0;

		while (saved.size() < n_vertices - 1) {

			Edge s;
			for (int i = 0; i < list.size(); ++i)
				if (!visited[list[i].tail]) {
					s = list[i];
					break;
				}

			for (int i = 1; i < list.size(); ++i) {
				Edge e = list[i];

				if (!visited[e.tail] && s.weight > e.weight) {
					s = e;
				}
			}

			saved.push_back(s);
			result += s.weight;
			visited[s.tail] = true;

			for (Edge e : edges[s.tail])
				list.push_back(e);

		}
		/*
		for (const Edge& e : saved) {
			std::cout << e << "\n";
		}
		*/
		results.push_back(result);
	}
	for (int r : results) {
		std::cout << r << "\n";
	}
}
	
