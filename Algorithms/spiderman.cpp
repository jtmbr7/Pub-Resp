#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <sstream>
#include <array>
#include <set>

struct Node {

	Node(int _current, int _max, bool _direction, const Node* _prev)
	: current(_current), max(_max), direction(_direction), prev(_prev) {}

	int current, max;
	bool direction;
	const Node* prev;

	bool operator<(const Node& n) const {
		return current < n.current;
	}

	Node operator+(int value) const {

		int newValue = current + value;
		if (max > newValue)
			return { newValue, max, true, this };
		else return { newValue, newValue, true, this };

	}

	Node operator-(int value) const {

		int newValue = current - value;
		if (max > newValue)
			return { newValue, max, false, this };
		else return { newValue, newValue, false, this };

	}
};

int remaining;
std::array<std::set<Node>, 40> states;
std::array<int, 40> numbers;


void insert(Node&& n, int i) {

	if (n.current < 0)
		return;

	std::set<Node>::iterator it = states[i].find(n);
	if (it == states[i].end()) {
		states[i].insert(n);
	}
	else if(it->max >= n.max) {
		states[i].erase(it);
		states[i].insert(n);
	}
}

int main() {

	int q, n = 0;
	std::cin >> q >> std::ws;

	for (; q > 0; --q) {

		for (int i = 0; i < 40; ++i) {
			states[i].clear();
		}

		remaining = 0;
		std::cin >> n >> std::ws;;
		if(n == 0) {
			std::cout << "IMPOSSIBLE\n";
			continue;
		}

		for (int i = 0; i < n; ++i) {
			std::cin >> numbers[i];
			remaining += numbers[i];
		}

		states[0].insert({ numbers[0], numbers[0], true, nullptr });

		remaining -= numbers[0];

		for (int i = 1; i < n; ++i) {
			remaining -= numbers[i];

			for (const Node& node : states[i - 1]) {
				insert(node + numbers[i], i);
				insert(node - numbers[i], i);
			}
		}
		
		std::set<Node>::iterator it = states[n - 1].begin();
		if (it->current != 0) {
			std::cout << "IMPOSSIBLE\n";
			continue;
		}

		if (it == states[n - 1].end())
			std::cout << "IMPOSSIBLE\n";
		else {

			int i = 0;
			std::array<bool, 40> direcitons;
			direcitons[i] = it->direction;

			const Node* k = it->prev;
			while (k) {
				direcitons[++i] = k->direction;
				k = k->prev;
			}

			while (i >= 0) {
				if (direcitons[i--])
					std::cout << "U";
				else std::cout << "D";
			}
				
			std::cout << "\n";
		}
	}
}