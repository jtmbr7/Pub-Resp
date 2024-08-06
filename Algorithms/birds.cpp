
#include <iostream>
#include <set>
#include <cmath>

int length, distance, n, howMany = 0;

int main()
{
	std::cin >> length >> distance >> n;

	std::set<int> birds{length - 6 + distance};

	for (int i = 0, input; i < n; ++i) {
		std::cin >> input;
		birds.insert(input);
	}


	std::set<int>::iterator current = birds.begin();

	for (int i = 6; current != birds.end(); i += distance) {

		if (*current - i >= distance) {
			++howMany;
		}
		else {
			i = *current++;
		}
	}

	std::cout << howMany;

	/*
	if (length < 12) {
		std::cout << howMany;
	}

	

	std::set<int>::iterator end = --birds.end();
	for (std::set<int>::iterator it = birds.begin(); it != end;) {

		int space = (-(*it) + *(++it) - distance);
		if (space < 0)
			continue;
		howMany += (space/ distance);
	}

	std::cout << howMany;

	*/
}