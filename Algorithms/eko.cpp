#include <iostream>
#include <vector>
#include <algorithm>
#include<cmath>


int main()
{

	unsigned long long n, m;
	std::cin >> n >> m;
	std::vector<unsigned long long> trees;

	for (unsigned long long i = 0, value; i < n; ++i) {
		std::cin >> value;
		trees.push_back(value);
	}

	std::sort(trees.rbegin(), trees.rend());

	trees.push_back(0);

	unsigned long long remaining = m;
	unsigned long long height = 0;

	for (unsigned long long i = 1, value = 0, diff; i < trees.size(); ++i) {
		diff = trees[i - 1] - trees[i];

		if (diff * i >= remaining) {
			std::cout << (int)floor(trees[0] - height - (long double)remaining / i);
			break;
		}

		remaining -= diff * i;
		height += diff;
	}

}