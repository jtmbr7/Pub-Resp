#include <iostream>
#include <array>
#include <vector>


int n_queries, n_priests;
std::array<std::array<int, 8>, 100> preferences;
std::array<std::array<int, 8>, 100> list;


int flipStone(int stone, int index) {
	return stone ^ (1 << index);
}

int solve(int stones, int priest) {
	if (priest == n_priests)
		return stones;

	if (list[priest][stones] != -1)
		return list[priest][stones];

	int stone1 = solve(flipStone(stones, 0), priest + 1);
	int stone2 = solve(flipStone(stones, 1), priest + 1);
	int stone3 = solve(flipStone(stones, 2), priest + 1);

	int best = stone1;

	if (preferences[priest][stone2] < preferences[priest][best])
		best = stone2;

	if (preferences[priest][stone3] < preferences[priest][best])
		best = stone3;

	list[priest][stones] = best;
	return best;
}

std::vector<std::string> output{ "NNN", "NNY", "NYN", "NYY", "YNN", "YNY", "YYN", "YYY" };

int main()
{
	std::cin >> n_queries;
	for (int i = 0; i < n_queries; ++i) {
		std::cin >> n_priests;

		for (int q = 0; q < n_priests; ++q)
			for (int p = 0; p < 8; ++p)
			std::cin >> preferences[q][p];

		for (int q = 0; q < n_priests; ++q)
			for (int p = 0; p < 8; ++p)
				list[q][p] = -1;

		std::cout << output[solve(0, 0)] << "\n";
	
	}
}