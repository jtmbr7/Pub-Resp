#include <iostream>

unsigned int zero(unsigned int n) {

    if (n < 0)
        return 0;

    for (unsigned int i = 1, result = 1, b, c, a; ; i *= 10) {

        b = n / i;
        a = b / 10;

        if (a == 0)
            return result;

        c = n % i;
        b = b % 10;

        if (b == 0)
            result += (a - 1) * i + c + 1;
        else
            result += a * i;
    }
}

int main()
{
    unsigned int i, j;
    while (std::cin >> i >> j) {
        if (i == -1 && j == -1)
            break;
        
        if (i == 0)
            if (j == 0)
                std::cout << 1 << "\n";
            else std::cout << zero(j) << "\n";
        else std::cout << (zero(j) - zero(i - 1)) << "\n";
    }
}
