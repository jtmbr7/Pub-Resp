#include <iostream>
#include <vector>
#include <random>
#include <fstream>
#include <sstream>
#include <string>

std::random_device rd;
std::mt19937 gen(rd());
class Neuron;

class Weight {
public:
    Weight(Neuron* _source, double variance) : source(_source) {
        std::normal_distribution<> dist(0.0, std::sqrt(variance));
        value = dist(gen);
    }

    Neuron* source;
    double value;
};

class Neuron {
public:
    Neuron() {}

    void compute() {
        for (Weight& weight : weights)
            newValue += weight.source->value * weight.value;
        newValue = std::tanh(newValue);
    }

    void save() {
        value = newValue;
    }

    std::vector<Weight> weights;
    double value = 0.0, newValue = 0.0;
};

class Sampler {
public:
    Sampler(int n, int self = -1) {
        for (int i = 0; i < n; ++i)
            if (i == self)
                continue;
            else samples.push_back(i);
    }

    int sample(std::mt19937& gen) {
        std::uniform_int_distribution<> dist(0, samples.size() - 1);
        int s = dist(gen);
        int k = samples[s];
        samples.erase(samples.begin() + s);
        return k;
    }

    std::vector<int> samples;
};

class Reservoir {
public:
    Reservoir(int n_visible, int n_hidden, int n_output, int min_connections, int max_connections)
        : visible(n_visible), hidden(n_hidden), output(n_output) {

        for (int i = 0; i < visible.size(); ++i) {
            int n_connections = min_connections + std::uniform_int_distribution<>(0, max_connections - min_connections)(gen);
            Sampler sampler(n_hidden, i);

            for (int q = 0; q < n_connections; ++q)
                hidden[sampler.sample(gen)].weights.push_back({ &visible[i], 0.002 });
        }

        for (int i = 0; i < hidden.size(); ++i) {
            int n_connections = min_connections + std::uniform_int_distribution<>(0, max_connections - min_connections)(gen);
            Sampler sampler(n_hidden, i);

            for (int q = 0; q < n_connections; ++q)
                hidden[i].weights.push_back({ &hidden[sampler.sample(gen)], 2.0 / 500.0 });
        }

        for (int i = 0; i < output.size(); ++i)
            for (int j = 0; j < hidden.size(); ++j)
                output[i].weights.push_back({ &hidden[j], 1.0 });
    }

    void compute() {
        
    }

    std::vector<Neuron> visible;
    std::vector<Neuron> hidden;
    std::vector<Neuron> output;
};


int main() {



    Reservoir reservoir(3, 500, 3, 1, 5);
    reservoir.compute();
}
