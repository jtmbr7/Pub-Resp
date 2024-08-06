// LiUid: johte805
// Author: John Tember
// This is an implementation of Eratosthenes Sieve, which is an algorithm that
// creates a list of primes. It works by first setting all numbers as true (a prime)
// and then iterativly setting all numbers that are multiples of n to false
// where n is all numbers above 1.
// The time complexity is O(nlog(log(n))), this is because the inner loop runs from i * i untill n.
// as i increases, the iteratorions of the inner loop decreases, which edn up at log(log(n)), and the outer loop is n,
// hence the time complexity.


#include <iostream>
#include <vector>
#include <cmath>

int n, m, howmany = 0;
std::vector<bool> table;

void read_input() {
    std::cin >> n >> m;
    ++n;
    table.resize(n);
}

void prime_sieve() {
    for (unsigned int i = 0; i <= n; ++i)
        table[i] = true;

    table[0] = false;
    table[1] = false;

    for (unsigned long int i = 2; i <= n; ++i) {
        if (table[i]) {
            ++howmany;
            for (unsigned long int q = i * i; q <= n; q += i)
                table[q] = false;
        }
    }

    std::cout << howmany << "\n";
    for (unsigned int i = 0, q; i < m; ++i) {
        std::cin >> q;
        std::cout << table[q] << "\n";
    }
}

int main()
{

    read_input();
    prime_sieve();
}
