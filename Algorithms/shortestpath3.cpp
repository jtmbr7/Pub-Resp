// Author: John Tember
// LiU-ID; johte805
// The problem is Bellman-Ford algorithm. It's a very well-known algorithm. It is slower than Dijkstras,
// but it is more dynamic. It can handle negative edges.
// The time complecity is O(N * E) where N is the number of nodes and E is the number of edges


#include <iostream>
#include <vector>
#include <array>
#include <set>
#include <limits.h>

struct Edge {
    int tail, head, weight;
};

int n_nodes = 0, n_edges = 0, n_queries = 0, start = 0;
std::array<Edge, 5000> edges;

// Returns true if input was valid
bool read_input() {

    std::cin >> n_nodes >> n_edges >> n_queries >> start;

    if (n_nodes == 0 && n_edges == 0 && n_queries == 0 && start == 0)
        return false;

    for (int i = 0, tail, head, weight; i < n_edges; ++i) {
        std::cin >> tail >> head >> weight;
        edges[i] = { tail, head, weight };
    }

    return true;
}

int main() {

    std::array<int, 1000> dist;
    std::array<int, 1000> prev;
    std::array<bool, 1000> negativeCycle;

    while (read_input()) {

        negativeCycle.fill(false);

        for (int q = 0; q < n_nodes; ++q) {  // Setting default values and adding to queue
            dist[q] = INT_MAX;
            prev[q] = -1;
        }

        dist[start] = 0; // Start node has no distance

        for (int q = 1; q < n_nodes; ++q) {  // Setting default values and adding to queue
            for (int k = 0; k < n_edges; ++k) {
                Edge& e = edges[k];
                if (dist[e.tail] + e.weight < dist[e.head] && dist[e.tail] != INT_MAX) {
                    dist[e.head] = dist[e.tail] + e.weight;
                    prev[e.head] = e.tail;
                }
            }
        }

        for (int q = 1; q < n_nodes; ++q) {  // Setting default values and adding to queue
            for (int k = 0; k < n_edges; ++k) {
                Edge& e = edges[k];

                if (dist[e.tail] == INT_MAX)
                    continue;

                if (negativeCycle[e.tail]) {
                    negativeCycle[e.head] = true;
                    dist[e.head] = INT_MIN;
                }
                else if (dist[e.tail] + e.weight < dist[e.head]) {
                    negativeCycle[e.head] = true;
                    dist[e.head] = INT_MIN;
                }
            }
        }

        for (int i = 0, end; i < n_queries && std::cin >> end; ++i) {
            if (dist[end] == INT_MAX)
                std::cout << "Impossible\n";
            else if (dist[end] == INT_MIN)
                std::cout << "-Infinity\n";
            else {
                std::cout << dist[end] << "\n";
                /*
                std::cout << end;
                for (int p = end; prev[p] != -1; p = prev[p])
                    std::cout << " <--[" << dist[p] - dist[prev[p]] << "]-- " << prev[p];
                std::cout << "\n";
                */
            }

        }

        std::cout << "\n\n";
    }
}