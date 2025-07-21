#include <iostream>
#include <vector>
#include <cmath>
#include <random>
#include <map>
#include <string>
#include <algorithm>
#include <iomanip>
#include <cstdlib>
#include <sstream>


const int n_visible = 3, n_pattern = 4;
const int patterns[n_pattern][n_visible]{ {-1, -1, -1},{1, -1, 1},{-1, 1, 1},{1, 1, -1} };

static std::mt19937 gen(42);
double random(double a, double b) {
	std::uniform_real_distribution<> dist(a, b);
	return dist(gen);
}

struct Neuron {

	int state = 0;
	double b = 0.0, bias = 0.0;

	void stochasticUpdate() {

		state = random(0, 1) < 1 / (1 + std::exp(-2 * b)) ? 1 : -1;
	}
};

struct Weight {

	Weight(const double limit) {
		value = random(-limit, limit);
	}

	double value;
};

class Distribution {
public:
	Distribution() {
		probabilities.resize(4);
	}

	double D_KL() const {

		double result = 0.0;
		for (const double& probability : probabilities) {
			if (probability == 0)
				return std::numeric_limits<double>::infinity();

			result += (1.0 / 4) * std::log((1.0 / 4) / probability);
		}

		return result;
	}

	double& operator[](int i) {
		return probabilities[i];
	}

	double operator[](int i) const {
		return probabilities[i];
	}

	double error(const int& M) const {
		double ub = upper_bound(M), dkl = D_KL();

		if(std::isinf(dkl))
			return std::numeric_limits<double>::infinity();

		return dkl > ub ? dkl - ub : 0.0;
	}

	double upper_bound(const double& M) const {

		if (M < std::pow(2, n_visible - 1) - 1)
			return std::log(2) * (n_visible - std::floor(std::log2(M + 1)) - (M + 1) / std::pow(2, std::floor(std::log2(M + 1))));
		return 0;
	}
	
	friend std::ostream& operator<<(std::ostream& os, const Distribution& distribution) {

		os << "[ ";
		for (const double& probability : distribution.probabilities)
			os << std::setfill(' ') << std::setw(8) << probability << " ";
		os << "]";
		return os;
	}

	std::vector<double> probabilities;
};

class DistributionList {
public:

	DistributionList(int _n_hidden) : n_hidden(_n_hidden) {

	}

	double error(int M) const {
		double globalError = 0.0;
		for(const Distribution& distribution : distributions) {

			double localError = distribution.error(M);
			if(std::isinf(localError))
				return std::numeric_limits<double>::infinity();
			globalError += localError;
		}

		return globalError / distributions.size();
	}

	void operator+=(const Distribution& distibution) {
		distributions.push_back(distibution);
	}
	
	friend std::ostream& operator<<(std::ostream& os, const DistributionList& distributionList) {

		if (distributionList.distributions.size() == 0)
			return os;
		std::cout << "n_hidden = " << distributionList.n_hidden << ", average error = " << distributionList.error(distributionList.n_hidden) << ", upper_bound = " << distributionList.distributions[0].upper_bound(distributionList.n_hidden) << "\n";
		for (const Distribution& distribution : distributionList.distributions)
			os << distribution  << ", DKL = " << std::setw(10) << distribution.D_KL() << ", local error = " << std::setw(10) << distribution.error(distributionList.n_hidden) << "\n";

		return os;
	}

	int n_hidden;
	std::vector<Distribution> distributions;
};

struct Result {
public:
	Result() {
		for(int i = 0; i < 4; ++i)
			distributionLists.push_back(std::pow(2, i));
	}

	DistributionList& operator[](int i) {
		return distributionLists[i];
	}

	bool operator<(const Result& other) const {
		return error() < other.error();
	}

	double error() const {
		double globalError = 0.0;
		for (int i = 0; i < distributionLists.size(); ++i) {

			double localError = distributionLists[i].error(i + 1);

			if(std::isinf(localError))
				return std::numeric_limits<double>::infinity();

			globalError += localError;
		}
		return globalError / 4;
	}

	friend std::ostream& operator<<(std::ostream& os, const Result& result) {

		os << "global error: " << result.error() << "\n";

		for (const DistributionList& distributionList : result.distributionLists)
			os << distributionList << "\n";

		return os;
	}

	std::vector<DistributionList> distributionLists;
};

class RestrictedBoltzmannMachine {
public:
	RestrictedBoltzmannMachine(int _n_hidden, double _learningRate, int _k) : hiddenNeurons(_n_hidden), learningRate(_learningRate), k(_k) {

		double limit = sqrt(6.0 / (n_visible + hiddenNeurons.size()));  // Xavier limit
		for (int i = 0; i < n_visible * hiddenNeurons.size(); ++i)
			weights.push_back(limit);
	}

	Weight& getWeight(int i, int j) {
		return weights[i + j * n_visible];
	}

	void forwardPass() {
		pass(hiddenNeurons, visibleNeurons, true);
	}

	void backwardPass() {
		pass(visibleNeurons, hiddenNeurons, false);
	}

	void pass(std::vector<Neuron>& target, const std::vector<Neuron>& source, bool forwards) {

		for (int i = 0; i < target.size(); ++i) {

			target[i].b = -target[i].bias;

			for (int q = 0; q < source.size(); ++q)
				target[i].b += source[q].state * (forwards ? getWeight(q, i).value : getWeight(i, q).value);

			target[i].stochasticUpdate();
		}
	}

	void train(const int epochs, const int batchSize) {

		for (; epoch < epochs; ++epoch) {

			std::vector<double>
				visibleDeltas(visibleNeurons.size()),
				hiddenDeltas(hiddenNeurons.size()),
				weightDeltas(weights.size());

			for (int b = 0; b < batchSize; ++b) {
				int u = std::rand() % n_pattern;

				std::vector<double>
					visible0(visibleNeurons.size()),
					hidden0(hiddenNeurons.size());

				for (int i = 0; i < n_visible; ++i) {
					visibleNeurons[i].state = patterns[u][i];
					visible0[i] = visibleNeurons[i].state;
				}

				forwardPass();

				for (int i = 0; i < hiddenNeurons.size(); ++i)
					hidden0[i] = hiddenNeurons[i].b;

				for (int i = 0; i < k; ++i) {
					backwardPass();
					forwardPass();
				}

				for (int i = 0; i < n_visible; ++i) {

					visibleDeltas[i] -= learningRate * (visible0[i] - visibleNeurons[i].state);

					for (int q = 0; q < hiddenNeurons.size(); ++q)
						weightDeltas[i + q * n_visible] += learningRate * (std::tanh(hidden0[q]) * visible0[i] - std::tanh(hiddenNeurons[q].b) * visibleNeurons[i].state);
				}

				for (int i = 0; i < hiddenNeurons.size(); ++i)
					hiddenDeltas[i] -= learningRate * (std::tanh(hidden0[i]) - std::tanh(hiddenNeurons[i].b));
			}

			for (int i = 0; i < visibleNeurons.size(); ++i)
				visibleNeurons[i].bias += visibleDeltas[i];

			for(int i = 0; i < weights.size(); ++i)
				weights[i].value += weightDeltas[i];

			for (int i = 0; i < hiddenNeurons.size(); ++i)
				hiddenNeurons[i].bias += hiddenDeltas[i];
		}
	}

	void sampleDistributions(std::vector<Distribution>& distributions, int N, int n_dynamics) {

		distributions.resize(n_dynamics);

		for (int sample = 0; sample < N; ++sample) {

			int u = std::rand() % n_pattern;
			for (int i = 0; i < n_visible; ++i)
				visibleNeurons[i].state = patterns[u][i];

			for (int i = 0; i < n_dynamics; ++i) {
				forwardPass();
				backwardPass();

				for (u = 0; u < n_pattern; ++u) {
					bool matching = true;
					for (int i = 0; i < n_visible; ++i)
						if (patterns[u][i] != visibleNeurons[i].state) {
							matching = false;
							break;
						}

					if (matching) {
						++distributions[i][u];
						break;
					}
				}
			}
		}

		for (Distribution& distribution : distributions)
			for (double& probability : distribution.probabilities)
				probability /= N;
	}

	std::vector<Neuron> visibleNeurons{ 3 }, hiddenNeurons;
	std::vector<Weight> weights;
	const double learningRate;
	const int k;
	int epoch = 0;
};


struct Range {

	Range(const std::vector<double> _values) : min(_values[0]), max(_values.back()), stepSize(0), iterations(_values.size()), values(_values) {}

	Range(double _min, double _max, double _stepSize = 1) :
		min(_min),
		max(_max),
		stepSize(_stepSize),
		iterations(1.0 + ((max - min) / stepSize)) {

	}

	bool operator++() {

		++iteration;
		if (iteration < iterations)
			return true;

		iteration = -1;
		return false;

	}

	operator int() {
		if (stepSize == 0)
			return values[iteration];
		return min + iteration * stepSize;
	}

	const int min, max, stepSize, iterations;
	int iteration = -1;
	std::vector<double> values;
};

struct LoadingBar {
	LoadingBar(int _length, const std::vector<Range>& ranges, const int extra = 0) : iterations(extra) {

		for (const Range& range : ranges)
			iterations *= range.iterations;

		length = _length;
		stepSize = static_cast<double>(iterations) / _length;

		std::cout << "|";
		std::cout << std::setfill('-') << std::setw(_length) << "" << "|\n|";
	}

	void operator++() {
		++iteration;
		draw();
	}

	void draw() {
		int expectedPrints = static_cast<int>(iteration / stepSize);
		while (prints < expectedPrints) {
			std::cout << "-";
			++prints;
		}

		if (iteration == iterations) {
			while (prints < length) {
				std::cout << "-";
				++prints;
			}
			std::cout << "|\n";
		}
	}

	double stepSize;
	int iterations = 1, iteration = 0, prints = 0, length;
};

class Key {
public:
	Key(int _k, int _batchSize, double _learningRate) : k(_k), batchSize(_batchSize), learningRate(_learningRate) {}

	int k, batchSize;
	double learningRate;
};

std::string doubleToString(double value) {
	std::stringstream ss;
	ss << std::fixed << std::setprecision(10) << value;  // Set precision to 10 or whatever is appropriate
	std::string str = ss.str();

	// Remove trailing zeros
	str.erase(str.find_last_not_of('0') + 1, std::string::npos);

	// If the string ends with a decimal point, remove that too
	if (str.back() == '.') {
		str.pop_back();
	}

	return str;
}

void paramSearch() {

	int dynamic = 8, realisation = 100;

	int k[3]{ 1, 1, 1 }, batchSize[3]{ 9, 9, 1 };
	double learningRate[3]{ 0.007, 0.007, 1 };

	Range epoch(23050, 23050, 1), n_hidden({ 1, 2, 4, 8 });

	std::vector<Key> sampler;
	for (int i = k[0]; i <= k[1]; i += k[2])
		for (int p = batchSize[0]; p <= batchSize[1]; p += batchSize[2])
			for (double q = learningRate[0]; q <= learningRate[1]; q += learningRate[2])
				sampler.push_back({ i, p, q });

	bool unInit = true;
	std::pair<std::string, Result> best;
	while(!sampler.empty()) {

		std::map<std::string, Result> results;

		system("cls");

		std::cout << "key = " << best.first << ", " << best.second << "\n\n";

		int sample = std::rand() % sampler.size();
		Key key = sampler[sample];
		sampler.erase(sampler.begin() + sample);
		std::string keyString = std::to_string(key.k) + ";" + doubleToString(key.learningRate) + ";" + std::to_string(key.batchSize);

		std::cout << "current search = " << keyString << "\n";
		LoadingBar loadingBar(100, { n_hidden, epoch }, dynamic * realisation);

		while (++n_hidden) {
			for(int q = 0; q < realisation; ++q) {

				RestrictedBoltzmannMachine restrictedBoltzmannMachine(n_hidden, key.learningRate, key.k);

				while (++epoch) {

					restrictedBoltzmannMachine.train(epoch, key.batchSize);

					std::vector<Distribution> distributions;
					restrictedBoltzmannMachine.sampleDistributions(distributions, 1000, dynamic);

					for (int i = 0; i < distributions.size(); ++i) {

						++loadingBar;
						std::string subKey = keyString + ";" + std::to_string(epoch)
							+ ";" + std::to_string(i + 1);

						results[subKey][n_hidden.iteration] += distributions[i];
					}
				}
			}
		}


		for (const std::pair<std::string, Result>& result : results) {
			if (unInit || result.second < best.second) {
				best = result;
				unInit = false;
			}
		}
	}

	std::cout << best.first << " " << best.second << "\n\n";
}

int main() {
	paramSearch();
}