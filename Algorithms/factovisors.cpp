#include <iostream>
#include <string>
#include <cmath>

bool factorize(int limit, int n) {

	const int max = ceil(sqrt(n)) ;
	for (int i = 2; i <= max; ++i) {

		int q = 0;
		while (n % i == 0) {
			++q;
			n /= i;
		}

		if (q == 0)
			continue;

		for (int k = i; k <= limit; k *= i)
			q -= limit / k;

		if (q > 0)
			return false;
	}

	if (n > limit)
		return false;

	return true;
}

int main()
{
	int i, j;
	while (std::cin >> i >> j) {
		if (j > 0 && (i >= j || j == 1 || factorize(i, j)))
			std::cout << j << " divides " << i << "!\n";
		else std::cout << j << " does not divide " << i << "!\n";
	}
}