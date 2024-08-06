// LiUid: johte805
// Author: John Tember
// this is my implementation of the FenwickTree or Binary Indexed Tree.
// It is a well known data structure and there is a lot of documentation about it.
// The time complexity of update is O(logn) as it iterates though the tree updating multiple nodes.
// The query function also takes O(logn) as it iterates though the tree
// based on the binary representation of the index.


#include <iostream>
#include <array>
#include <vector>

struct FenwickTree {

    void update(int index, int delta) {
        index++;
        while (index < tree.size()) {
            tree[index] += delta;
            index += index & -index;
        }
    }

    long long int query(int index) {
        long long int sum = 0;

        while (index > 0) {
            sum += tree[index];
            index -= (index & -index);
        }
        return sum;
    }

    std::array<long long int, 5000001> tree;
};

FenwickTree F;

int main() {

    int N, Q;
    std::cin >> N >> Q;

    char c;
    int a, b;
    std::vector<long long int> result;
    for (int i = 0; i < Q; ++i) {
        std::cin >> c;
        if (c == '+') {
            std::cin >> a >> b;
            F.update(a, b);
        }
        else {
            std::cin >> a;
            result.push_back(F.query(a));
        }
    }

    for (long long int i : result)
        std::cout << i << "\n";
}