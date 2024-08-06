#include <iostream>
#include <array>
#include <vector>
#include <cmath>
#include <iomanip>
#include <set>

int n_islands, n_bridges = 0;
struct Island {
	double x, y;
	std::vector<Island*>* set;

	void join(Island* i) {
		std::vector<Island*>* s2 = i->set;

		for (Island* q : *i->set) {
			set->push_back(q);
			q->set = set;
		}

		s2->resize(0);
	}
};

struct Bridge {
	std::array<Island*, 2> connections;
	double length;

	bool operator<(const Bridge& b) const {
		if (length == b.length) {
			if (connections[0] == b.connections[0])
				return connections[1] < b.connections[1];
			else return connections[0] < b.connections[0];
		}
		else return length < b.length;
	}
};

std::array<std::vector<Island*>, 750> sets;
std::array<Island, 750> islands;
std::array<double, 10> results;
std::set<Bridge> bridges;


int main() {

	int n;
	std::cin >> n;
	for (int k = 0; k < n; ++k, bridges.clear()) {
		for (int i = 0; i < n_islands; ++i)
			sets[i].resize(0);

		std::cin >> n_islands;
		for (int i = 0; i < n_islands; ++i) {
			std::cin >> islands[i].x >> islands[i].y;
			islands[i].set = &sets[i];
			sets[i].push_back(&islands[i]);

			for (int q = 0; q < i; ++q) {
				double d = pow(islands[i].x - islands[q].x, 2) + pow(islands[i].y - islands[q].y, 2);
				bridges.insert({ &islands[i], &islands[q], d});
			}
		}

		double result = 0;
		int howMany = 0;
		for(const Bridge& b : bridges) {
			Island* i1 = b.connections[0];
			Island* i2 = b.connections[1];

			if (i1->set != i2->set) {
				
				if(i1->set->size() > i2->set->size())
					i1->join(i2);
				else i2->join(i1);

				result += sqrt(b.length);
				if (++howMany == n_islands - 1)
					break;
			}
		}

		results[k] = result;
	}

	for(int i = 0; i < n; ++i)
		std::cout << std::fixed << std::setprecision(6) << results[i] << "\n";
}