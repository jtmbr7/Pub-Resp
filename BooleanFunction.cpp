#include <iostream>
#include <vector>
#include <set>
#include <bitset>
#include <random>

struct BooleanFunction {

public:

    BooleanFunction(int n_dimentions) {
        values.resize(std::pow(2, n_dimentions));
        for (int j = 0; j < values.size(); ++j)
            values[j] = rand() % 2; // Assign random values
    }

    int value(int i) const {
        return values[i] ? 1 : -1;
    }

    int size() const {
        return values.size();
    }

    std::vector<bool> getValues() const {
        return values;
    }

private:
    std::vector<bool> values; // List of all the values, stored as bools instead of ints to speed up the tracking of duplicates.
};

struct Perceptron {

    std::vector<double> weights;
    const double learningRate = .05;
    double threshold = .0;

    Perceptron(int n_weights) {
        std::default_random_engine generator; // used to take random value from the distribution
        std::normal_distribution<double> nd(0, std::sqrt(1.0 / n_weights)); // normal distribution with variance 1/n

        weights.resize(n_weights);
        for (double& weight : weights)
            weight = nd(generator); // sample value from the distribution and set the weight to it
    }

    void train(const int& n, const BooleanFunction& bf) {

        for (int epoch = 0; epoch < n; ++epoch) {

            for (int i = 0; i < bf.size(); ++i) {

                double O = makePrediction(i); // make the prediction
                double delta = bf.value(i) - O; // and see if it is the right one

                for (int j = 0; j < weights.size(); ++j) {
                    int bit = (i >> (weights.size() - j - 1)) & 1; // find the input of the weight by transforming int conncted input to a bit
                    weights[j] += learningRate * delta * bit; // update the weight
                }

                threshold -= learningRate * delta; // update the threshold
            }
        }
    }

    bool isLinearlySeparable(const BooleanFunction& bf) {
        for (int i = 0; i < bf.size(); ++i)
            if (makePrediction(i) != bf.value(i)) // if any value is not correct, it is not seperable
                return false;
        return true;
    }

    double makePrediction(int q) {

        double b = -threshold;
        std::bitset<32> binary(q); // transform the index q to bits, will represent its position in the space.

        for (int i = 0; i < weights.size(); ++i)
            b += binary[weights.size() - i - 1] * weights[i]; // Calculate weighted sum

        return sgn(b); // return the sgn of the weighted sum
    }

    double sgn(double b) {
        return b >= 0 ? 1 : -1;
    }
};

int main() {

    const int epochs = 20, maxDimentions = 5, trials = 10e4;

	for (int dimentions = 2; dimentions <= maxDimentions; ++dimentions) {

        int count = 0;
        std::set<std::vector<bool>> duplicateTracker; // Set that keeps track of duplicates
        
		for (int trial = 0; trial < trials; ++trial) {
            BooleanFunction bf(dimentions);

            if (duplicateTracker.find(bf.getValues()) != duplicateTracker.end()) // If duplicate, continue and create a new one
                continue;

            duplicateTracker.insert(bf.getValues()); // If new, store it in the tracker

			Perceptron p(dimentions);
			p.train(epochs, bf); // Trains the perceptron

            if (p.isLinearlySeparable(bf)) // If linearly seperable, we count it.
                ++count;
		}

        std::cout << dimentions << ": " << count << "\n";
	}
}