#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <vector>

struct IrisData {
	IrisData(const std::string& line, const std::string& _label) {
		std::stringstream ss{ line };
		std::string str;
		while (std::getline(ss, str, ','))
			features.push_back(std::stod(str));
		label = std::stoi(_label);
	}

	double operator[](int i) const {
		return features[i];
	}

	std::vector<double> features;
	int label;
};

struct Neuron {

	Neuron(int _x, int _y) : x(_x), y(_y) {
		for(int i = 0; i < 4; ++i)
			weights.push_back(static_cast<double>(std::rand()) / RAND_MAX);
	}

	double computeDistance(const IrisData& input) const {

		double distance = 0.0;
		for(int i = 0; i < weights.size(); ++i)
			distance += std::pow(input[i] - weights[i], 2);
		return std::sqrt(distance);
	}

	double gridDistance(const Neuron& neuron) {
		return std::sqrt(std::pow(x - neuron.x, 2) + std::pow(y - neuron.y, 2));
	}

	double x, y;
	std::vector<double> weights;
};

class SOM {
public:
	SOM() {
		for (int x = 0; x < N; ++x)
			for (int y = 0; y < N; ++y)
				neurons.push_back({ x, y });
	}

	void train(const std::vector<IrisData>& irisData) {

		for (int epoch = 0; epoch < epochs; ++epoch) {
			double eta = eta0 * std::exp(-etaDecay * epoch);
			double sigma = sigma0 * std::exp(-sigmaDecay * epoch);

			std::vector<int> sampler;
			for (int i = 0; i < irisData.size(); ++i)
				sampler.push_back(i);

			while(sampler.size() > 0) {
				int sampleIndex = std::rand() % sampler.size();
				int sample = sampler[sampleIndex];
				const IrisData& data = irisData[sample];
				sampler.erase(sampler.begin() + sampleIndex);

				double minDistance = std::numeric_limits<double>::max();
				Neuron* winner = nullptr;

				for (Neuron& neuron : neurons) {
					double distance = neuron.computeDistance(data);
					if (distance < minDistance) {
						minDistance = distance;
						winner = &neuron;
					}
				}

				for (Neuron& neuron : neurons) {

					double gridDistance = winner->gridDistance(neuron);


					if (gridDistance < sigma) {
						double influence = std::exp(-std::pow(gridDistance, 2) / (2 * std::pow(sigma, 2)));

						for (int i = 0; i < neuron.weights.size(); ++i)
							neuron.weights[i] += eta * influence * (data[i] - neuron.weights[i]);
					}
				}
			}
		}
	}

	void validate(const std::vector<IrisData>& irisData) {

		std::vector<std::vector<int>> grid;
		grid.resize(N);
		for (int x = 0; x < N; ++x) {
			grid[x].resize(N);
			for (int y = 0; y < N; ++y) {
				grid[x][y] = -1;
			}
		}

		std::ofstream x("x.txt");
		std::ofstream y("y.txt");
		std::ofstream l("l.txt");

		for (const IrisData& data : irisData) {

			double minDistance = std::numeric_limits<double>::max();
			Neuron* winner = nullptr;

			for (Neuron& neuron : neurons) {

				double distance = neuron.computeDistance(data);
				if (distance < minDistance) {
					minDistance = distance;
					winner = &neuron;
				}
			}

			grid[winner->x][winner->y] = data.label;

			x << winner->x << "\n";
			y << winner->y << "\n";
			l << data.label << "\n";
		}

		for (int y = 0; y < N; ++y) {
			for (int x = 0; x < N; ++x) {
				int value = grid[x][y];
				if (value == -1)
					std::cout << " ";
				else std::cout << value;
			}
			std::cout << "\n";
		}
	}

	int epochs = 10, N = 40;
	double eta0 = 0.1, etaDecay = 0.01, sigma0 = 10, sigmaDecay = 0.05;
	std::vector<Neuron> neurons;
};

void ReadData(std::vector<IrisData>& irisData) {

	std::ifstream data("iris-data.csv");
	std::ifstream labels("iris-labels.csv");

	std::string line, label;
	while (std::getline(data, line) && std::getline(labels, label))
		irisData.push_back({ line, label });


	std::vector<double> max{ 0, 0, 0, 0 };

	for (const IrisData& data : irisData)
		for (int i = 0; i < 4; ++i)
			if (data.features[i] > max[i])
				max[i] = data.features[i];

	for (IrisData& ID : irisData)
		for (int i = 0; i < 4; ++i)
			ID.features[i] /= max[i];
}

int main()
{
	std::vector<IrisData> irisData;
	ReadData(irisData);

	SOM som;
	som.train(irisData);
	som.validate(irisData);
}