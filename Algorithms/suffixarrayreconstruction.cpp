#include <iostream>
#include <array>
#include <string>
#include <set>
#include <vector>

std::string line;

std::string solve() {
	int l, s;
	std::cin >> l >> s;

	std::string result;
	result.resize(l);

	bool invalid = false;
	for (int p; s > 0 && std::cin >> p; --s) {
		--p;
		std::cin >> std::ws;
		std::getline(std::cin, line);

		for (int i = 0; !invalid && i < line.size() && p < l; ++i, ++p) {

			if (line[i] == '*') {
				for (i = line.size() - 1, p = l - 1; !invalid && i >= 0 && p >= 0; --i, --p) {
					if (line[i] == '*')
						break;
					else if (!result[p])
						result[p] = line[i];
					else if (result[p] != line[i])
						invalid = true;
				}

				break;
			}
			else if (!result[p])
				result[p] = line[i];
			else if (result[p] != line[i])
				invalid = true;
		}
	}

	if (invalid)
		return "IMPOSSIBLE";

	for(const char& c : result)
		if (!c)
			return "IMPOSSIBLE";

	return result;
}

int main()
{
	std::vector<std::string> results;
	int n;
	std::cin >> n;
	for (; n > 0; --n)
		results.push_back(solve());

	for (const std::string& r : results)
		std::cout << r << "\n";
}
