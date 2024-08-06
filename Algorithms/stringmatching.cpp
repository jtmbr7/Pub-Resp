// Author: John Tember
// LiU-ID; johte805
// The problem is solved with Knuth Morris Pratt algorithm. This is a
// well known algorithm with the time complexity O(n).
// this is because the algorithm ahs a linear running time and compares
// each characters in the input string at most twice.

#include <iostream>
#include <string>
#include <vector>

// The prefix function that assings a value to each characters.
// If two characters do not match we go back in the pattern with the amount
// of the assigned value for the character.
void prefix(const std::string pattern, std::vector<int>& pi) {

    pi.resize(1); // reusing the pi vector, so i clear it first;
    for (int i = 1, k = 0; i < pattern.size(); ++i) {
        while(k > 0 && pattern[k] != pattern[i])
            k = pi[k - 1];

        if (pattern[i] == pattern[k])
            ++k;

        pi.push_back(k);
    }
}

// Implementation of Knuth-Morris-Pratt algorithm, instead of backracking
// we use the values of the pattern to only move back or forward in the pattern.
void KMP(const std::string& pattern, const std::string& str, const std::vector<int>& pi, std::vector<int>& result) {
    
    result.resize(0);
    for (int i = 0, q = 0; i < str.size(); ++i) {

        // if the characters do not match, we move the pattern.
        while (q > -1 && pattern[q] != str[i]) {
            if (q > 0)
                q = pi[q - 1];
            else --q;
        }

        ++q;

        // if we reach end of patter and characters match, we have a result
        if (q == pattern.size()) {
            result.push_back(i - pattern.size() + 1);
            q = pi[q - 1];
        }

    }
}

void print(const std::vector<int>& result) {
    for (int i : result)
        std::cout << i << " ";
    std::cout << "\n";
}

int main()
{

    // We want to keep a margin of one zero at the beginning of the vector
    // beacuse it always starts with a zero
    std::vector<int> pi{0};
    std::vector<int> result;
    for (std::string pattern, str; std::getline(std::cin, pattern) && std::getline(std::cin, str);) {

        prefix(pattern, pi); // put prefix in vector pi
        KMP(pattern, str, pi, result);
        print(result);
        
    }
}
