// Author: John Tember
// LiU-ID: johte805
// Time complexity O(e) where e is the amount of edges
// This is  Hierholzer's algorithm which is a well know algorithm. I choose to do the traverall backwards as then i dont have to 
// reverse the list in the end.
// First i though it would be sufficient to just do backtracking alone from end node to start, but i realized that i missed cycles when i did this. So i implemented the
// Hierholzers algorithm which worked.

#include <iostream>
#include <array>
#include <vector>


struct Node {
    int in = 0, out = 0;
    std::vector<int> edges;

    // returns the previous node, return -1 if there is no unvisited previous node
    int getPrev() {
        if (in == 0)
            return -1;

        else return edges[--in];
    }
};

int n_nodes, n_edges, start, end;
std::array<Node, 10000> nodes;

// Thie function returns false if there are mutiple start or end, also if a node has an invalid out or indegree.
bool find_start_and_end() {
    start = -1;
    end = -1;

    for (int i = 0; i < n_nodes; ++i) {
        const Node& n = nodes[i];
        if (std::abs(n.in - n.out) > 1) // Invalid node for this algorithm
            return false;
        else if (n.out == n.in) // Just a passthough node
            continue;
        else if (n.out - n.in == 1) { // Start node
            if (start == -1)
                start = i;
            else return false;
        }
        else if (n.in - n.out == 1) { // End node
            if (end == -1)
                end = i;
            else return false;
        }
    }

    return true;
}

std::array<int, 50000> v1; // usnig arrays as i like them better than vectors
std::array<int, 50000> v2;

int find_path() {

    int i = 0, q = 0, current = end;
    bool backtracking = false; // i use this variable to know when im backtracking and when im not.

    // if there is not start node, just pick a random one
    if (current == -1)
        current = 0;

    v1[i++] = current;

    while (i > 0) {

        current = nodes[current].getPrev();

        if (current == -1) {
            current = v1[--i];
            v2[q++] = current;
            backtracking = true;
        }
        else {
            // this is to prevent that the beginning of a cycle end up in the wrong spot. This would happend without it.
            // 1 -> 2 -> 2 -> 3 -> 4 -> 5 WRONG
            // 1 -> 2 -> 3 -> 4 -> 2 -> 5 RIGHT
            if (backtracking) {
                v1[i++] = v2[--q];
                backtracking = false;
            }

            v1[i++] = current;
        }
    }

    return q;
}

bool read_input() {
    // Resetting the nodes values (as im using array instead of vector)
    for (int i = 0; i < n_nodes; ++i) {
        nodes[i].in = 0;
        nodes[i].out = 0;
        nodes[i].edges.clear();
    }

    // Break if input is 0 0
    std::cin >> n_nodes >> n_edges;
    if (n_edges == 0 && n_nodes == 0)
        return false;

    // Read the input, I put on the edges backwards as I traverse the graph from end to start instead.
    for (int i = 0, tail, head; i < n_edges; ++i) {
        std::cin >> tail >> head;
        nodes[head].edges.push_back(tail);
        ++nodes[tail].out;
        ++nodes[head].in;
    }

    return true;
}

void write_output(int n) {
    // If we havent traversed all the edges, the graph is not connected
    if (n != n_edges + 1)
        std::cout << "Impossible\n";
    else {
        for (int i = 0; i < n; ++i)
            std::cout << v2[i] << " ";
        std::cout << "\n";
    }
}

int main() {

    while (read_input()) {

        if (find_start_and_end()) {
            write_output(find_path());
        }
        else std::cout << "Impossible\n";
    }
}