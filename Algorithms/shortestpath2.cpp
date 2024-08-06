// Author: John Tember
// LiU-ID; johte805
// This code is pretty much the same as Lab 2.1.
// The only difference is that i also load two extra variables from the input,
// "time" (representing the time that each edge is open) and "period" (representing the period
// between each open time of the edge)
// The edges can be seen as bridges where cars can only drive on 
// the time "time" and after that each "period" time unit. 
// Time complexity should be O(n^2) where n is the number of nodes in worst case.


#include <iostream>
#include <vector>
#include <array>
#include <set>
#include <limits.h>
#include <cmath>
static int node_couter{ 0 };

struct Node {
    // Only keeping track of head, as I don't need to know where from I'm comming.
    struct Edge {
        Node* head;
        int weight, time, period;
    };

    int dist, index = node_couter++; // Distance from source (index for printing path)
    Node* prev; // Prevous node

    // Doing vector instead of array for simplicity
    std::vector<Edge> edges;
};


int n_nodes = 0, n_edges = 0, n_queries = 0, start = 0;
std::array<Node, 10000> nodes;

// Obj that sorts the indexes in a set based on the distance of the corresponding node
struct Priority {
    Node* index;

    // If distance is same sort by value of pointer
    bool operator<(const Priority& p) const {
        if (index->dist == p.index->dist)
            return index < p.index;
        else return index->dist < p.index->dist;
    }
};

// Returns true if input was valid
bool read_input() {


    // Reseting the edges in each node
    for (int i = 0; i < n_nodes; ++i)
        nodes[i].edges.resize(0);

    std::cin >> n_nodes >> n_edges >> n_queries >> start;

    if (n_nodes == 0 && n_edges == 0 && n_queries == 0 && start == 0)
        return false;

    for (int i = 0, tail, head, time, period, weight; i < n_edges; ++i) {
        std::cin >> tail >> head >> time >> period >> weight;
        nodes[tail].edges.push_back({ &nodes[head], weight, time, period });
    }

    return true;
}



int main() {

    while (read_input()) {

        // Dijkstra stars here
        std::set<Priority> Q{}; // Priority queue

        nodes[start].dist = 0; // Start node has no distance
        for (int q = 0; q < n_nodes; ++q) {  // Setting default values and adding to queue
            if(q != start)
                nodes[q].dist = INT_MAX;
            nodes[q].prev = nullptr;
            Q.insert({ &nodes[q] });
        }

        while (!Q.empty()) {  // Run until all nodes are done
            Node* u = Q.begin()->index; // Set is always sorted, take the first element
            Q.erase(Q.begin()); // Remove it from the queue
            for (const Node::Edge& e : u->edges) {  // Calculate distances to all nodes connected to u

                int time = e.time;

                if (e.period != 0 && time < u->dist)
                    time += e.period * ceil(((double)u->dist - (double)e.time) / e.period);

                if (time >= u->dist) {
                    unsigned int alt = e.weight + time;
                    if (alt < e.head->dist) {
                        std::set<Priority>::iterator it = Q.find({ e.head });
                        Node* n = it->index;
                        Q.erase(it);
                        n->prev = u;
                        n->dist = alt;
                        Q.insert({ n }); // put new nodes into queue
                    }
                }
            }
        }

        for (int i = 0, end; i < n_queries && std::cin >> end; ++i) {
            // If distance is not changed we have not ended up on the node
            if (nodes[end].dist == INT_MAX)
                std::cout << "Impossible\n";
            else {
                std::cout << nodes[end].dist << "\n";

                // For printing out path
                /*
                std::cout << nodes[end].index;
                for (Node* p = &nodes[end]; p->prev; p = p->prev)
                    std::cout << " <--[" << p->dist - p->prev->dist << "]-- " << p->prev->index;
                std::cout << "\n";
                */
            }

        }

        std::cout << "\n\n";
    }
}