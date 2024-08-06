// LiUid: johte805
// Author: John Tember
// This is a simple implementation of an algorithm that caluclates ration aretmetic.
// It uses the euclidian algorithm which is a well known algorithm
// with time complexity O(log(min(a,b)). The time complexity is due to the fact that
// the algorithm needs to iterate the number of times of bits in the samllesr of the two values.
// It works by repeadetly ginding the remainder of dividing the narger number by the smaller number,
// and the smaller number by the remainder until the remainder is zero.

#include <iostream>
#include <vector>
#include <map>
#include <string>

void gcd(long long int a, long long int b) {

	long long int A = std::abs(a);
	long long int B = std::abs(b);

	while (B > 0) {
		long long int temp = A;
		A = B;
		B = temp % B;
	}

	a /= A;
	b /= A;

	if(a < 0 && b > 0 || b < 0 && a > 0)
		std::cout << "-" << std::abs(a) << " / " << std::abs(b) << "\n";
	else std::cout << std::abs(a) << " / " << std::abs(b) << "\n";
}


int main()
{

	char op;
	int n;
	long long int x1, y1, x2, y2;
	std::cin >> n;

	for (int i = 0; i < n; ++i) {
		std::cin >> x1 >> y1 >> op >> x2 >> y2;

		if (op == '+')
			gcd(x1 * y2 + y1 * x2, y1 * y2);
		else if (op == '-')
			gcd(x1 * y2 + y1 * -x2, y1 * y2);
		else if (op == '*')
			gcd(x1 * x2, y1 * y2);
		else gcd(x1 * y2, y1 * x2);

	}
	
}
