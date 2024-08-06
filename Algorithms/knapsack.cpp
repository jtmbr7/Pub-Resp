// Author: John Tember
// LiU-ID: johte805
// time complexity is O(n * w) where n is the numebr of elements and w is the capacity
// This is because we have a nested loop that runs n * w times.
// The problem that is to be solved is to fill a knapsack with as much value as possible.
// The knapsack can contain a subset of items, where each item has a value and a weight.
// we want to add the items that result in the heighest possible value without exceding
// the capacity of the knapsack.

#include <iostream>
#include <array>
#include <vector>
#include <algorithm>

int max(int a, int b) { return (a > b) ? a : b; }

struct Item {
    int value, weight;
};

int capacity, n_items;
std::array<Item, 2001> items;
std::array<std::array<int, 2001>, 2001> table;

void knapSack()
{

    for (int i = 0; i <= n_items; ++i) {
        for (int w = 0; w <= capacity; ++w) {
            if (i == 0 || w == 0) // if no item or zero weight then put value to zero
                table[i][w] = 0;
            else if (items[i].weight <= w) // if weight is not too much then choose the heighest value of the previous and new
                table[w][i] = max(items[i].value + table[w - items[i].weight][i - 1], table[w][i - 1]);
            else table[w][i] = table[w][i - 1]; // ens pick the previous
        }
    }

    // Backtrakc to find the solution, if there is a difference in value since last add, then we added item i - 1
    std::vector<int> solution;
    for (int i = n_items; i > 0; --i) {
        int current = table[capacity][i];
        int next = table[capacity][i - 1];

        if (current == 0)
            break;

        if (current != next) {
            solution.push_back(i - 1);
            capacity -= items[i].weight;
        }
    }

    // print it backwards
    std::cout << solution.size() << "\n";
    for (int i = solution.size() - 1; i >= 0; --i)
        std::cout << solution[i] << " ";
    std::cout << "\n";
}

int main()
{
    // Reading the input, end if no input.
    while (std::cin >> capacity >> n_items) {
        for (int i = 1; i <= n_items; ++i)
            std::cin >> items[i].value >> items[i].weight;

        knapSack();
    }
}