#include <fstream>
#include <iostream>
#include <vector>
#include <sstream>
#include <random>
#include <direct.h>

struct Data {

    Data(const std::string& line) {

        std::stringstream ss(line);

        char delimiter;
        ss >> x1 >> delimiter >> x2 >> delimiter >> t;
    }

    double x1, x2, t;
};

void normalize(std::vector<Data>& training_set, std::vector<Data>& validation_set) {

    int dataPoints = training_set.size() + validation_set.size();
    double mean1 = 0, mean2 = 0;

    for (const Data& data : training_set) {
        mean1 += data.x1;
        mean2 += data.x2;
    }

    for (const Data& data : validation_set) {
        mean1 += data.x1;
        mean2 += data.x2;
    }

    mean1 /= dataPoints;
    mean2 /= dataPoints;

    double variance1 = 0, variance2 = 0;

    for (const Data& data : training_set) {
        variance1 += (data.x1 - mean1) * (data.x1 - mean1);
        variance2 += (data.x2 - mean2) * (data.x2 - mean2);
    }

    for (const Data& data : validation_set) {
        variance1 += (data.x1 - mean1) * (data.x1 - mean1);
        variance2 += (data.x2 - mean2) * (data.x2 - mean2);
    }

    variance1 /= dataPoints;
    variance2 /= dataPoints;

    double std1 = 0, std2 = 0;

    std1 = std::sqrt(variance1);
    std2 = std::sqrt(variance2);

    for (Data& data : training_set) {
        data.x1 = (data.x1 - mean1) / std1;
        data.x2 = (data.x2 - mean2) / std2;
    }

    for (Data& data : validation_set) {
        data.x1 = (data.x1 - mean1) / std1;
        data.x2 = (data.x2 - mean2) / std2;
    }
}

void readData(std::vector<Data>& data, const std::string& fileName) {
    std::ifstream inputFile(fileName);

    std::string line;
    while (std::getline(inputFile, line))
        data.push_back(Data(line));
}

class Neuron;

std::default_random_engine generator;
class Weight {

public:
    Weight(Neuron& _source, int N) : source(_source) {

        std::normal_distribution<double> nd(0, std::sqrt(1.0 / N));
        value = nd(generator);
    }

    Neuron& source;
    double value;
};

class Neuron {
public:
    Neuron() {

    }

    void run() {
        value = -bias;
        for(const Weight& weight : weights)
            value += weight.value * weight.source.value;

        value = std::tanh(value);
    }

    double value = 0.0, bias = 0.0, error = 0.0;
    std::vector<Weight> weights;
};

class Layer {
public:
    Layer(const int& n_neurons) {
        neurons.resize(n_neurons);
    }

    void connect(Layer& L) {

        for(Neuron& neuron : neurons)
            for(Neuron& source : L.neurons)
                neuron.weights.push_back({ source, (int)L.neurons.size() });
    }

    void run() {
        for (Neuron& neuron : neurons)
            neuron.run();
    }

    std::vector<Neuron> neurons;
};

class Network {
public:
    Network(const std::vector<int>& layer_settings, double LR) : learningRate(LR) {

        for(const int& n_neurons : layer_settings)
            layers.push_back(n_neurons);

        layers.push_back(1);

        for (int i = 1; i < layers.size(); ++i)
            layers[i].connect(layers[i - 1]);
    }

    void observe(const std::vector<double>& observations) {

        int i = 0;
        for (; i < observations.size() && i < layers[0].neurons.size(); ++i)
            layers[0].neurons[i].value = observations[i];

        for (; i < layers[0].neurons.size(); ++i)
            layers[0].neurons[i].value = 0;
    }

    double run() {

        for (int i = 1; i < layers.size(); ++i)
            layers[i].run();

        return layers.back().neurons[0].value;
    }

    void backwardPass(double O, double t) {

        Neuron& outputNeuron = layers.back().neurons[0];

        outputNeuron.error = (t - O) * (1 - std::pow(O, 2));

        for (Weight& weight : outputNeuron.weights) {
            Neuron& source = weight.source;
            source.error = (1 - std::pow(source.value, 2)) * weight.value * outputNeuron.error;
        }

        for (int i = layers.size() - 1; i > 0; --i) {
            for (Neuron& neuron : layers[i].neurons) {
                for (Weight& weight : neuron.weights)
                    weight.value += learningRate * weight.source.value * neuron.error;

                neuron.bias -= learningRate * neuron.error;
            }
        }
        
    }

    void write(std::ofstream& w1, std::ofstream& w2, std::ofstream& t1, std::ofstream& t2) {
        
        for (const Neuron& neuron : layers[1].neurons) {
            for(const Weight& weight : neuron.weights)
                w1 << weight.value << ",";
            w1 << "\n";

            t1 << neuron.bias << "\n";
        }


        for (const Neuron& neuron : layers[2].neurons) {
            for (const Weight& weight : neuron.weights) {
                w2 << weight.value << "\n";
            }

            t2 << neuron.bias << "\n";
        }
    }

    std::vector<Layer> layers;
    double learningRate;
};

void search(int n_hidden, double learningRate, int epochs, const std::vector<Data>& training_set, const std::vector<Data>& validation_set) {

    std::string trialName = std::to_string(n_hidden) + "_" + std::to_string(learningRate);
    trialName.erase(trialName.find_last_not_of('0') + 1, std::string::npos);
    _mkdir(trialName.c_str());

    std::string logFileName = "./" + trialName + "/log.txt";
    std::ofstream logFile(logFileName);

    Network n({ 2, n_hidden }, learningRate);
    double bestErrorPercentage = 1.0;

    for (int epoch = 0; epoch < epochs; ++epoch) {

        std::vector<int> indexPool;
        for (int i = 0; i < training_set.size(); ++i)
            indexPool.push_back(i);

        while (indexPool.size() > 0) {

            int randomIndex = std::rand() % indexPool.size(), dataIndex = indexPool[randomIndex];
            const Data& data = training_set[dataIndex];
            indexPool.erase(indexPool.begin() + randomIndex);

            n.observe({ data.x1, data.x2 });
            double O = n.run();
            n.backwardPass(O, data.t);
        }

        int errorCount = 0;

        for (const Data& data : validation_set) {

            n.observe({ data.x1, data.x2 });
            double O = n.run();

            if ((O > 0 && data.t < 0) || (O < 0 && data.t > 0)) {

                ++errorCount;
            }
        }

        double errorPercentage = (double)errorCount / validation_set.size();

        if (errorPercentage < 0.12 && errorPercentage < bestErrorPercentage) {

            std::string w1FileName = logFileName = "./" + trialName + "/w1.csv";
            std::ofstream w1File(w1FileName);

            std::string w2FileName = logFileName = "./" + trialName + "/w2.csv";
            std::ofstream w2File(w2FileName);

            std::string t1FileName = logFileName = "./" + trialName + "/t1.csv";
            std::ofstream t1File(t1FileName);

            std::string t2FileName = logFileName = "./" + trialName + "/t2.csv";
            std::ofstream t2File(t2FileName);

            bestErrorPercentage = errorPercentage;
            n.write(w1File, w2File, t1File, t2File);
        }

        logFile << epoch << ": " << errorCount << ", " << errorPercentage << "\n";
        std::cout << epoch << ": " << errorCount << ", " << errorPercentage << "\n";
    }
}

int main()
{

    std::vector<Data> training_set, validation_set;
    readData(training_set, "training_set.csv");
    readData(validation_set, "validation_set.csv");
    normalize(training_set, validation_set);

    search(10, 0.005, 20000, training_set, validation_set);
}