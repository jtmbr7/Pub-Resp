#include <iostream>
#include <array>
#include <map>
#include <set>
#include <cmath>

std::array<int, 200> result;

void run(int t) {
	std::string word;
	std::cin >> word;

	std::map<char, int> count;
	for (const char& c : word)
		count[c]++;


	char unique = '0';
	for (const std::pair<char, int>& p : count)
		if (p.second % 2 == 1)
			if (unique == '0')
				unique = p.first;
			else {
				result[t] = -1;
				return;
			}


	int end = word.size() - 1, steps = 0, saved = word.size() / 2;
	for (int i = 0; i < word.size()/2; ++i, --end) {
		for (int q = end; q > i; --q) {

			if (word[i] == word[q]) {
				for (int k = q; k < end; ++k, ++steps)
					std::swap(word[k], word[k + 1]);
				break;
			}
			else if (q == i + 1) {
				saved = i;
				++end;
				break;
			}
		}
	}

	for (int k = saved; k < word.size() / 2; ++k, ++steps)
		std::swap(word[k], word[k + 1]);

	result[t] = steps;
}



int main()
{
	int n;
	std::cin >> n;
	for (int i = 0; i < n; ++i)
		run(i);

	for (int i = 0; i < n; ++i)
		if (result[i] == -1)
			std::cout << "Impossible\n";
		else std::cout << result[i] << "\n";
}