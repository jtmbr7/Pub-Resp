#include <iostream>
#include <array>
#include <vector>
#include <set>
#include <map>

struct Edge {
	 int head, tail, weight, g_start = 0, g_end = 0;


	 bool operator<(const Edge& e) const {
		 if (weight == e.weight) {
			 if (head == e.head)
				 return tail < e.tail;
			 else return head < e.head;
		 }
		 else return weight < e.weight;
	 }
};


int n_nodes, n_edges, start, end, delay, n_george;
std::array<std::map<int, Edge>, 1001> nodes;

std::array<int, 1000> george;


int main()
{
	std::cin >> n_nodes >> n_edges >> start >> end >> delay >> n_george;

	for (int i = 0; i < n_george; ++i)
		std::cin >> george[i];

	for (int i = 0, head, tail, weight; i < n_edges && std::cin >> head >> tail >> weight; ++i) {
		nodes[head][tail] = { tail, head, weight };
		nodes[tail][head] = { head, tail, weight };
	}

	if(n_george > 1) {
		for (int i = 1, t = 0, current = george[0]; i < n_george; current = george[i++]) {
			nodes[current][george[i]].g_start = t;
			nodes[george[i]][current].g_start = t;
			t += nodes[current][george[i]].weight;
			nodes[current][george[i]].g_end = t;
			nodes[george[i]][current].g_end = t;
		}
	}

	std::array<bool, 1001> visited;
	visited.fill(false);
	visited[start] = true;
	std::set<Edge> steps{};
	for (const std::pair<int, Edge>& p: nodes[start]) {
		Edge e = p.second;
		e.weight += delay;
		steps.insert(e);
	}

	std::set<Edge>::iterator it = steps.begin();
	for (; it->head != end; it = steps.begin()) {
		visited[it->tail] = true;
		for (const std::pair<int, Edge>& p : nodes[it->head]) {
			Edge e = p.second;
			if(!visited[e.head]) {
				e.weight += it->weight;

				if(it->weight >= e.g_start && it->weight < e.g_end)
					e.weight += e.g_end - it->weight;

				steps.insert(e);
			}
		}

		steps.erase(it);
	}

	std::cout << it->weight - delay;
}
