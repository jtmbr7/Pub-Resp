#include <iostream>
#include <vector>
#include <set>
#include <map>
#include <vector>


int main()
{
	int n;
	std::cin >> n;
	std::vector<int> v{ };
	int input;
	for (int i = 0; i < n; ++i) {
		std::cin >> input;
		v.push_back(input);
	}


	
	if (v[v.size() - 1] != n + 1) {
		std::cout << "Error";
		return 0;
	}

	std::vector<int> u{};
	std::map<int, std::set<int>> map;
	std::vector<int> counter = { 0 };
	for (int i = 0; i < v[v.size() - 1]; ++i)
		counter.push_back(1);

	for (size_t i = 0; i < v.size() - 1; ++i)
		++counter[v[i]];

	for (size_t i = 1; i < counter.size(); ++i)
		map[counter[i]].insert(i);

	/*
	if (map.find(1) == map.end()) {
		std::cout << "Error";
		return 0;
	}*/

	for (size_t i = 0; i < v.size(); ++i) {

		if (counter[v[i]] == 0) {
			std::cout << "Error";
			return 0;
		}

		std::set<int>::iterator it = map[1].begin();
		u.push_back(*it);
		--counter[*it];
		map[1].erase(it);
		map[counter[v[i]]].erase(v[i]);
		--counter[v[i]];
		if (counter[v[i]] > 0)
			map[counter[v[i]]].insert(v[i]);

	}

	for (int i : u) {
		std::cout << i << "\n";
	}
}