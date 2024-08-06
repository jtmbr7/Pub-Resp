// LiUid: johte805
// Author: John Tember
//
// This is an implementation of the union-find
// with path Compression and union by rank.
// 
// The path compression means that i compress the structure everytime i
// visit a node by making it point straight to its root which will.
// flatten out the tree. Next time i walk the same path it will be shorter.
//
// union by rank means that i keep track of the height of the trees,
// and always join the trees in a way that creates the lowest
// resulting tree.
// 
// The time complexity of the find function is O(log(n)), but becomes
// nearly O(1) because of the path compression.
// Each time the find function is called we compress
// the tree making it faster the next time we use it.
// 
// The time complexity of the union operation is O(1), but it uses the find function
// and will therefore be affected by the current structure of the tree.
// if the tree is flat, both algorithms turn into O(1)

#include <iostream>
#include <vector>

std::vector<int> parent;
std::vector<int> rank;

int find(int i) {
    if (parent[i] != i)
        parent[i] = find(parent[i]);
    return parent[i];
}

void join(int i, int j) {
    int root1 = find(i);
    int root2 = find(j);
    if (root1 != root2) {
        if (rank[root1] < rank[root2])
            parent[root1] = root2;
        else if (rank[root1] > rank[root2])
            parent[root2] = root1;
        else {
            parent[root2] = root1;
            rank[root1]++;
        }
    }
}

int main() {
    int n_elements, n_queries;
    std::cin >> n_elements >> n_queries;
    parent.resize(n_elements);
    rank.resize(n_elements);
    for (int i = 0; i < n_elements; ++i) {
        parent[i] = i;
        rank[i] = 0;
    }

    char op;
    int a, b;
    std::vector<bool> output;
    for (int i = 0; i < n_queries; ++i) {
        std::cin >> op >> a >> b;

        if (op == '?') {
            output.push_back(find(a) == find(b));
        }
        else {
            join(a, b);
        }
    }

    for(bool b : output)
        std::cout << (b ? "yes\n" : "no\n");
}