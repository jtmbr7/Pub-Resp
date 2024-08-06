// LiUid: johte805
// Author: John Tember
// This is my implementation of a greedy algorithm that finds the
// lowest amount of intervals needed to cover another interval.
// The code reads the intervals in O(n) time, and sorts them in O(nlogn) time
// The code then finds the intervals in O(n) time as it at max iterates though all
// of the intervals to find the solution.
// Therefore: Time Complexity = O(nlogn + n + n) which is O(nlogn)

#include <iostream>
#include <sstream>
#include <fstream>
#include <iomanip>
#include <vector>
#include <algorithm>

class IntervalSolver {
public:
    IntervalSolver(double begin, double end, int n) : begin(begin), end(end), current(begin), n(n) {

        for (int i = 0; i < n; ++i)
            intervals.push_back(Interval(i));

        std::sort(intervals.begin(), intervals.end());
    }

    void solve() {

        std::vector<Interval>::iterator it = intervals.begin();
        while (it != intervals.end()) {

            // Break if we cant go further
            if (it->begin > current)
                break;

            // Find the connecting interval with the heighest end
            std::vector<Interval>::iterator save = it;
            while (it != intervals.end() && it->begin <= current) {
                if (it->end >= save->end)
                    save = it;
                ++it;
            }

            list.push_back(save->index);
            current = save->end;

            // Break if we've reached the end
            if (current >= end)
                break;
        }
    }

    void print() {
        // Printing the result to the console
        if (current < end)
            std::cout << "impossible\n";
        else {
            std::cout << list.size() << "\n";
            for (int i : list)
                std::cout << i << " ";
            std::cout << "\n";
        }
    }

private:

    class Interval {
    public:
        Interval(int index) : index(index) {
            std::cin >> begin >> end;
        }

        //This operator is for the default sorting of the set
        friend bool operator<(const Interval& lhs, const Interval& rhs) {
            if (lhs.begin == rhs.begin)
                return lhs.end < rhs.end;
            return lhs.begin < rhs.begin;
        }

        double begin, end;
        int index;
    };

    double begin, end, current;
    int n;
    std::vector<Interval> intervals;
    std::vector<int> list;
};

std::vector<IntervalSolver> intervalSolvers;
double begin, end;
int n;

void read_input() {
    // Initialized all the IntervalSolvers
    while (std::cin >> begin >> end >> n)
        intervalSolvers.push_back(IntervalSolver(begin, end, n));
}

void interval_solver() {
    // Calls the solve function
    for (IntervalSolver& is : intervalSolvers)
        is.solve();
}

void print() {
    // Calls the print function
    for (IntervalSolver& is : intervalSolvers)
        is.print();
}


int main()
{

    read_input();
    interval_solver();
    print();

}