#include <iostream>
#include <vector>
#include <cmath>
#include <climits>

std::vector<int> prime_list;
std::vector<bool> table;

void generate_primes() {

    int n = std::sqrt(INT_MAX);
    table.resize(n);

    for (int i = 0; i < n; ++i)
        table[i] = true;

    table[0] = false;
    table[1] = false;

    for (int i = 2; i < n; ++i)
        if (table[i])
            for (int q = i * i; q < n; q += i)
                table[q] = false;

    for (int i = 0; i < n; ++i)
        if (table[i])
            prime_list.push_back(i);
}

int gcd(int a, int b) {
    if (a == 0) return b;
    if (b == 0) return a;
    while (b != 0) {
        int t = b;
        b = a % b;
        a = t;
    }
    return a;
}

int main()
{
    generate_primes();
    long int value;
    int squared, howMany, result;
    bool neg;
    while (std::cin >> value && value != 0) {
        neg = value < 0;
        value = std::abs(value);
        result = 1;

        for (const int& prime : prime_list) {
            squared = prime * prime;
            howMany = 0;

            if (value < squared)
                break;

            while (value % prime == 0) {
                value /= prime;
                ++howMany;
            }

            if (howMany > 0) {
                if (result == 1)
                    result = howMany;
                else result = gcd(result, howMany);
            }
        }

        if (value == 1) {
            if (neg)
                while (result % 2 == 0)
                    result /= 2;

            std::cout << result << "\n";
        }
        else std::cout << 1 << "\n";
    }
}