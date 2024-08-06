#include <iostream>
#include <iomanip>
#include <set>
#include <array>

struct Edge {
	int head, tail;
	double weight;

	bool operator<(const Edge& e) const {
		if (weight == e.weight) {
			if (head == e.head)
				return tail < e.tail;
			else return head < e.head;
		}
		else return weight > e.weight;
	}
};

int n_nodes, n_edges;

std::array<std::set<Edge>, 10000> nodes;

int main()
{
	std::array<double, 10> results;
	int r = 0;
	for(; ; ++r) {

		std::cin >> n_nodes >> n_edges;
		if (n_nodes == 0 && n_edges == 0)
			break;

		for (int i = 0; i < n_nodes; ++i)
			nodes[i].clear();

		double weight;
		for (int i = 0, head, tail; i++ < n_edges && std::cin >> head >> tail >> weight;) {
			nodes[head].insert({ tail, head, weight });
			nodes[tail].insert({ head, tail, weight });
		}

		std::array<bool, 10000> visited;
		visited.fill(false);

		std::set<Edge> steps{};
		for (Edge e : nodes[0])
			steps.insert(e);

		std::set<Edge>::iterator it = steps.begin();
		for (; it->head != n_nodes - 1; it = steps.begin()) {
			visited[it->tail] = true;

			for (Edge e : nodes[it->head]) {
				if (!visited[e.head]) {
					e.weight *= it->weight;
					steps.insert(e);
				}
			}

			steps.erase(it);
		}
		results[r] = it->weight;
	}

	for(int i = 0; i < r; ++i)
		std::cout << std::fixed << std::setprecision(4) << results[i] << "\n";
}