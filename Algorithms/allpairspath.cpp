// Author: John Tember
// LiU-ID; johte805
// The problem is Floyd-Warshall algorithm.
// Time complecity is O(n^3)
// This time complexity is due to the fact that we update the distance matrix
// with a tripple nested loop, aswell as look for negative loops in a tripple loop.
// we also have a normal nested loop but as this time complexity is lower than a
// tripple loop we get the time complexity O(n^3)
#include <iostream>
#include <vector>
#include <array>
#include <limits.h>

struct Edge {
    int tail, head, weight;
};

int n_nodes = 0, n_edges = 0, n_queries = 0;
std::array<Edge, 5000> edges;
std::array<std::array<int, 150>, 150> next;
std::array<std::array<int, 150>, 150> dist;

// Returns true if input was valid
bool read_input() {

    std::cin >> n_nodes >> n_edges >> n_queries;

    if (n_nodes == 0 && n_edges == 0 && n_queries == 0)
        return false;

    for (int i = 0, tail, head, weight; i < n_edges; ++i) {
        std::cin >> tail >> head >> weight;
        edges[i] = { tail, head, weight };
    }

    return true;
}

void shortest_path_all_pairs() {

    // Set all default values
    for (int i = 0; i < n_nodes; ++i) {
        for (int q = 0; q < n_nodes; ++q) {
            dist[i][q] = INT_MAX;
            next[i][q] = -1;
        }

        dist[i][i] = 0;
        next[i][i] = i;
    }

    // Put in all the values for each edge, if duplicates select the one with lowest weight.
    for (int q = 0; q < n_edges; ++q) {
        Edge& e = edges[q];
        if (e.tail == e.head && e.weight > 0) //skip if distance to itself is larger than 0
            continue;

        if (e.weight < dist[e.tail][e.head]) {
            dist[e.tail][e.head] = e.weight;
            next[e.tail][e.head] = e.head;
        }
    }

    // standard floyd-warshall implementataion
    for (int k = 0; k < n_nodes; ++k) {
        for (int i = 0; i < n_nodes; ++i) {
            for (int j = 0; j < n_nodes; ++j) {

                // skip if distance is infinity
                if (dist[i][k] == INT_MAX || dist[k][j] == INT_MAX)
                    continue;

                if (dist[i][j] > dist[i][k] + dist[k][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }

    // Looking for negative loops
    for (int k = 0; k < n_nodes; ++k) {
        for (int i = 0; i < n_nodes; ++i) {
            for (int j = 0; j < n_nodes; ++j) {

                if (dist[i][k] == INT_MAX || dist[k][j] == INT_MAX)
                    continue;

                if (dist[k][k] < 0) {
                    dist[i][j] = INT_MIN;
                }
            }
        }

    }
}

void print() {

    for (int i = 0, start, end; i < n_queries && std::cin >> start >> end; ++i) {

        if (dist[start][end] == INT_MAX)
            std::cout << "Impossible\n";
        else if (dist[start][end] == INT_MIN)
            std::cout << "-Infinity\n";
        else {
            std::cout << dist[start][end] << "\n";

            /*
            std::cout << start;

            if(start != end)
                do {
                    start = next[start][end];
                    std::cout << " ----> " << start;

                } while (start != end);

            std::cout << "\n";
            */
        }

    }

    std::cout << "\n\n";
}

int main() {
    while (read_input()) {
        shortest_path_all_pairs();
        print();
    }
}