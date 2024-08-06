// LiUid: johte805
// Author: John Tember
// This is an implementation of the SA-IS algorithm which is a well known
// algorithm with Time Complexity of O(n + n) = O(n)
// This is because it uses O(n) time to sort the suffixes of the string
// using induced sorting method. The second phase of the algorithm
// uses O(n) time to recusivly construct the suffix array.
// I think this algorithm was very hard to understand at first.
// I have spent a lot of time to understand it, but I think it was worth it.
// Very cool algoirithm!

#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <sstream>

struct SuffixArray {

    SuffixArray(std::string _chars) : chars(_chars) {

        // Adding character with lowest ascii value to the end of the string
        chars.push_back('§');

        // Classifies each character as either L or S.
        classify_types();

        // Find all LMS blocks
        find_LMS_blocks();

        // Initializes character blocks
        init_character_blocks();

        // Insert LMS blocks
        insert_LMS_blocks();

        // Insert characters of type L
        insert_L();

        // Reset the back of all character blocks
        reset_back();

        // Insert characters of type S
        insert_S();

        // Sort the LMS_blocks
        sort_LMS();

        // Reset the back of all character blocks
        reset_back();

        // Reset the front of all character blocks
        reset_front();

        // Insert the sorted LMS_blocks
        insert_sorted_LMS_blocks();

        // Insert characters of type L
        insert_L();

        // Reset the back of all character blocks
        reset_back();

        // Insert characters of type S
        insert_S();
    }

    // Each LMS_block contains their starting and end position, their index and the number of
    // which they occur in the suffix array
    struct LMS_block {
        int start, end, number = 0;
    };

    // Begin and end are the next empty position, front and back is the original position of begin and end
    struct Character_Block {
        int begin, end, front, back;
    };

    // Gets the value of the resulting vector at position i (i + 1 because we added '§')
    int operator[](int i) const {
        return values[i + 1];
    }

    // Iterates over the characters and classifies them as either L or S based on their ascii value:
    // L: characters is larger than the next character
    // S: characters is smaller than the next character
    void classify_types() {

        types.resize(chars.size());
        types[chars.size() - 1] = false;

        for (int i = chars.size() - 2; i > -1; --i)
            if (chars[i] == chars[i + 1])
                types[i] = types[i + 1];
            else if (chars[i] > chars[i + 1])
                types[i] = true;
            else types[i] = false;
    }

    // Finds all LMS_blocks (Left Most Small) by comparing the previously assigned types.
    void find_LMS_blocks() {

        LMS.resize(chars.size());
        for (int i = types.size() - 1, q = types.size() - 1; i > 0; --i)
            if (types[i - 1] && !types[i]) {
                LMS_values.push_back(i);
                LMS_blocks[i] = { i, q};
                LMS[i] = true;
                q = i;
            }
    }

    // Initializes character blocks. This means calculating their starting position and end position.
    void init_character_blocks() {
        
        std::map<char, int> char_counter;

        for (char c : chars)
            ++char_counter[c];

        int i = 0, q;
        for (std::pair<char, int> p : char_counter) {
            q = i + p.second;
            character_blocks[p.first] = { i, q, i, q };
            i = q;
        }
    }

    // Intersts the LMS_blocks at the end of their character block
    void insert_LMS_blocks() {

        values.resize(chars.size());
        for (std::map<int, LMS_block>::reverse_iterator it = LMS_blocks.rbegin(); it != LMS_blocks.rend(); ++it) {
            insert_back(it->first);
        }
    }

    // CLears the values and inserts the sort LMS_blocks at the end of their character block. (Similar to previous function)
    void insert_sorted_LMS_blocks() {

        values.clear();
        values.resize(chars.size());

        std::vector<int>::reverse_iterator it = result.rbegin();
        for (std::vector<int>::reverse_iterator it = result.rbegin(); it != result.rend(); ++it) {
            insert_back(LMS_values[LMS_values.size() - *it - 1]);
        }
    }

    // Inserts all the suffixes with type L at the front of their character block.
    void insert_L() {
        for (int i : values)
            if(i > 0 && types[i - 1])
                insert_front(i - 1);
    }

    // Inserts all the suffixes with type S at the back of their character block.
    void insert_S() {
        for(int i = values.size() - 1; i > -1; --i)
            if (values[i] > 0 && !types[values[i] - 1])
                insert_back(values[i] - 1);
    }

    // Put suffix i at the back of its character block
    void insert_back(int i) {
        values[--character_blocks[chars[i]].back] = i;
    }

    // Put suffix i at the front of its character block
    void insert_front (int i) {
        values[character_blocks[chars[i]].front++] = i;
    }

    // Resets the back of each character block to its original position
    void reset_back() {
        std::map<char, Character_Block>::iterator it = character_blocks.begin();
        while(it != character_blocks.end()) {
            it->second.back = it->second.end;
            ++it;
        }
    }

    // Resets the front of each character block to its original position
    void reset_front() {

        std::map<char, Character_Block>::iterator it = character_blocks.begin();
        while (it != character_blocks.end()) {
            it->second.front = it->second.begin;
            ++it;
        }
    }

    // Gets the string of an LMS_block, this is for comparing if duplicates when soring the LMS_blocks
    std::string getString(const LMS_block& l) {
        return chars.substr(l.start, l.end - l.start + 1);
    }
    
    // Sorts the LMS_blocks
    void sort_LMS() {

        // First suffix will be an LMS_block
        std::string prev = getString(LMS_blocks[values[0]]);
        int q = 0;
        for (int i : values) {


            // If suffix i is LMS the we give it value q, if it is different from prev LMS_block we incerase q by one.
            if (LMS[i]) {
                LMS_block& lms = LMS_blocks[i];
                std::string next = getString(lms);

                if (prev != next)
                    ++q;

                lms.number = q;
                prev = next;
            }
        }

        // Counts the number of copies of each Suffix
        std::vector<int> counter;
        counter.resize(q + 1);

        for (std::map<int, LMS_block>::iterator it = LMS_blocks.begin(); it != LMS_blocks.end(); ++it) {
            counter[it->second.number]++;
        }

        // Finds the placement in the resulting vector for each character based on how many copies of each there is
        std::vector<int> placement;
        q = 0;
        for (int i : counter) {
            q += i;
            placement.push_back(q);
        }

        // Inster each LMS at the right position
        result.resize(LMS_blocks.size());
        int r = 0;
        for (std::map<int, LMS_block>::iterator it = LMS_blocks.begin(); it != LMS_blocks.end(); ++it) {
            result[--placement[it->second.number]] = r++;
        }
    }

    std::string chars; // String of the characters
    std::vector<bool> types; // Vector keeps track of L and S values
    std::vector<bool> LMS; // Vector keeps track of the LMS blocks
    std::vector<int> values; // Keeps track of the suffix array

    std::vector<int> LMS_values; // Stores the values of the LMS blocks
    std::vector<int> result; // The resulting sorted LMS blocks

    std::map<char, Character_Block> character_blocks; // Keeps track of the character blocks
    std::map<int, LMS_block> LMS_blocks; // Stores the LMS_blocks
};

int main()
{
    
    std::string word, numbers;
    while (std::getline(std::cin, word)) {

        SuffixArray SA(word);

        std::getline(std::cin, numbers);
        std::stringstream ss{ numbers };
        int n;
        ss >> n;
        for(int i = 0, q; i < n; ++i) {
            ss >> q;
            std::cout << SA[q] << " ";
        }
    }

}
