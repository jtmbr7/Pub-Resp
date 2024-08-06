// LiUid: johte805
// Author: John Tember
//
// This is my implementation of the patience sort.
// 
// The problem to be solved is to find the longest increasing subsequence of an array of integers.
// Patience sort does this by sorting the integers in different stacks, where each card can only
// be added if the most recent card in the stack is larger than the new card. Each card has a parent card
// Which is the last added card in the previous stack
// The result is calculated by backtracking the card in the last stack though its parent.
// 
// My first implementation ran in O(n^2) because i iterated though the vector
// of stacks each time i wanted to insert a card.
// My new implementaiton uses a custom set that keeps track of the lower_bound
// to find the right stack for the new card.
// By card i mean number in the dequence.
// The algorithm runs in O(nlogn) and patience sort is a well known algorithm.
// My grandmother uses this algorithm to play cards.


#include<iostream>
#include<vector>
#include<set>

int card_index = 0;
struct Card {

    // Returns the value of the card
    Card(int _value) : value(_value) {

    }

    int value, index = card_index++, parent_stack = -1, parent_card = -1;
};

int stack_index = 0;
struct Stack {

    Stack(int value) : cards({ Card(value) }) {

    }

    // Return the value of the latest added card in the stack
    int last() {
        return cards[cards.size() - 1].value;
    }

    // Checks if a card with value can fit into the stack
    bool can_fit(int value) {
        return cards.size() == 0 || cards.back().value > value;
    }

    // Inserts a card into the stack with the input value
    void insert(int value) {
        cards.push_back({ value });
    }

    // Sets the parent of the last card in this stack to the last card in the input stack
    void connect(Stack& s) {
        cards.back().parent_stack = s.index;
        cards.back().parent_card = s.cards.size() - 1;

    }

    int index = stack_index++;
    std::vector<Card> cards;
};
// I use this "queue" structure so that i can use a set structure, and find the lowest bound
struct Q {
    int value, index;

    bool operator<(const Q& q) const {
        return value < q.value;
    }
};

// This function uses lower_bound to find the first stack that the input value can fit into
void insert(std::vector<Stack>& stacks, std::set<Q>& queue, int value) {

    std::set<Q>::iterator it = queue.lower_bound({ value });

    if (it == queue.end()) {
        stacks.push_back({ value });
        queue.insert({ value, stacks[stacks.size() - 1].index });
    }
    else {
        Stack& s = stacks[it->index];

        if (s.last() == value) {
            card_index++;
            return;
        }

        stacks[it->index].insert(value);
        queue.erase(it);
        queue.insert({ value, s.index });
    }

    it = queue.find({ value });

    if (it->index > 0)
        stacks[it->index].connect(stacks[it->index - 1]);

}

void read_input(std::vector<int>& values, int n) {
    card_index = 0;
    stack_index = 0;

    for (int i = 0, q; i < n; ++i) {
        std::cin >> q;
        values.push_back(q);
    }

}

void patience_sort(std::vector<int>& values, std::vector<int>& result) {

    std::vector<Stack> stacks;
    std::set<Q> queue;

    for (int i : values) {
        insert(stacks, queue, i);
    }

    int stack = stacks.size() - 1;
    int card = stacks[stack].cards.size() - 1;
    while (stack != -1 && card != -1) {
        const Card& c = stacks[stack].cards[card];
        result.push_back(c.index);
        stack = c.parent_stack;
        card = c.parent_card;
    }
}


void write_output(std::vector<int>& result) {
    std::cout << result.size() << "\n";
    for (std::vector<int>::reverse_iterator it = result.rbegin(); it != result.rend(); ++it) {
        std::cout << *it << " ";
    }

    std::cout << "\n";
}
int main() {

    int n;
    while (std::cin >> n) {

        std::vector<int> values, result;
        read_input(values, n);
        patience_sort(values, result);
        write_output(result);
        
    }
}