// Author: John Tember
// LiU-ID; johte805
// Im using edmond-karp algorithm to find the maximum flow of the network
// it has time complexity O(VE^2) where v is the number of nodes and e is the number of edges
// the time complexity is because finding an augmented path takes O(E) time,
// and in worst case we have to repeat this process O(E). We also may need to loop back
// though all nodes each iteration, which would take O(V).
// The reversed edges are used to prevent bad paths, as we can always
// "push water" back thought a pipe to create a new better path.
// (hard to explain)
#include <iostream>
#include <array>
#include <vector>
#include <algorithm>
#include <queue>

struct Edge {
    int tail, head, capacity;
    Edge* reversed = nullptr;
    int flow = 0;
};

struct Node {
    std::vector<Edge*> edges;
};

int n_nodes, n_edges, start, end;
std::array<Node, 500> nodes;
std::array<Edge, 20000> edges;

// This functions finds a path with BFS, it puts the path in the parent array
bool find_path(std::array<Edge*, 500>& parent) {

    parent.fill(nullptr);
    std::queue<Node*> queue{ };
    queue.push(&nodes[start]);

    while (!queue.empty()) {

        Node* n = queue.front();
        queue.pop();

        for (Edge* e : n->edges) {
            if (!parent[e->head] && e->head != start && e->capacity > e->flow) {
                parent[e->head] = e;
                queue.push(&nodes[e->head]);
                if (e->head == end)
                    return true;
            }
        }
    }

    return false;
}

// This function is an implementation of the edmonds karp algorithm
// it works in the following way
// 1. Finds a path from start to end
// 2. Finds the max flow though this path
// 3. Applies this flow on each edge in the path (negative on the reversed edges)
// 4. Repeats 1 - 3 until no more path is found (the pipes are full of water)
void Edmonds_Karp() {

    int total_flow = 0;
    std::array<Edge*, 500> parent;
    while (find_path(parent)) {
        if (!parent[end])
            break;

        int max_flow = 10e8;

        for (Edge* p = parent[end]; p; p = parent[p->tail])
            if (max_flow > p->capacity - p->flow)
                max_flow = p->capacity - p->flow;

        total_flow += max_flow;

        for (Edge* p = parent[end]; p; p = parent[p->tail]) {

            p->reversed->flow -= max_flow;
            p->flow += max_flow;
        }
    }

    std::vector<Edge*> used_edges;

    for (int i = 0; i < n_edges; ++i) {
        if (edges[i].flow > 0) {
            used_edges.emplace_back(&edges[i]);
        }
    }

    std::cout << n_nodes << " " << total_flow << " " << used_edges.size() << "\n";
    for (const Edge* e : used_edges) {
        std::cout << e->tail << " " << e->head << " " << e->flow << "\n";
    }
}

void read_input() {
    std::cin >> n_nodes >> n_edges >> start >> end;

    for (int i = 0, q = n_edges, tail, head, capacity; i < n_edges; ++i, ++q) {
        std::cin >> tail >> head >> capacity;

        edges[i] = { tail, head, capacity, &edges[q] };
        edges[q] = { head, tail, 0, &edges[i] };
        nodes[tail].edges.push_back(&edges[i]);
        nodes[head].edges.push_back(&edges[q]);
    }
}

int main() {
    read_input();
    Edmonds_Karp();
}