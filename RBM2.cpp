#include <iostream>
#include <vector>
#include <random>
#include <bitset>
#include <string>


const int n_patterns = 4, n_bits = 3;
const int patterns[n_patterns][n_bits]{ {-1, -1, -1},{1, -1, 1},{-1, 1, 1},{1, 1, -1} };
std::default_random_engine generator{};

double random(double a, double b) {
    return a + (b - a) * ((double)rand() / (double)RAND_MAX);
}

class Weight;

class Neuron {
public:
    Neuron() {

    }

    void update();
    int stochastic_update();

    std::vector<Weight*> weights;
    double bias = 0.0, state = 0.0, b = 0.0, saved = 0.0;
    std::vector<double> delta;
};

class Weight {
public:
    Weight(Neuron& _visible, Neuron& _hidden, int n_neurons) : visible(&_visible), hidden(&_hidden) {
        std::normal_distribution<double> nd(0, std::sqrt(1.0 / n_neurons));
        value = nd(generator);
    }

    double compute(const Neuron* neuron) const {
        return value * (neuron == visible ? hidden->state : visible->state);
    }

    Neuron* visible;
    Neuron* hidden;
    double value;
    std::vector<double> delta;
};

class RestrictedBoltzmannMachine {
public:
    RestrictedBoltzmannMachine(int n_visible, int n_hidden, double _learningRate) : learningRate(_learningRate) {
        visibleNeurons.resize(n_visible);
        hiddenNeurons.resize(n_hidden);

        int n_neurons = n_visible + n_hidden;
        for (Neuron& visibleNeuron : visibleNeurons)
            for (Neuron& hiddenNeuron : hiddenNeurons)
                weights.push_back(Weight(visibleNeuron, hiddenNeuron, n_neurons));

        for (Weight& weight : weights) {
            weight.hidden->weights.push_back(&weight);
            weight.visible->weights.push_back(&weight);
        }
            
    }

    void train(const int pattern[n_patterns][n_bits], int vMax, int k) {

        for (int v = 0; v < vMax; ++v) {
            std::vector<int> sampler{ 0, 1, 2, 3 };

            while (sampler.size() > 0) {
                int r = rand() % sampler.size();
                int index = sampler[r];
                std::cout << index << "\n";
                sampler.erase(sampler.begin() + r);

                for (int i = 0; i < visibleNeurons.size(); ++i) {
                    visibleNeurons[i].state = patterns[index][i];
                    visibleNeurons[i].saved = visibleNeurons[i].state;
                }

                for (Neuron& hiddenNeuron : hiddenNeurons) {
                    hiddenNeuron.update();
                    hiddenNeuron.saved = hiddenNeuron.b;
                }

                for (int i = 0; i < k; ++i) {
                    for (Neuron& visibleNeuron : visibleNeurons)
                        visibleNeuron.update();

                    for (Neuron& hiddenNeuron : hiddenNeurons)
                        hiddenNeuron.update();
                }

                calculateAllDeltas();
            }

            updateDeltas();
        }
    }

    void updateDeltas() {
        for (Weight& weight : weights) {
            for (double d : weight.delta)
                weight.value += d;
            weight.delta.resize(0);
            weight.delta.clear();
        }

        for (Neuron& visibleNeuron : visibleNeurons) {
            for (double d : visibleNeuron.delta)
                visibleNeuron.bias += d;
            visibleNeuron.delta.resize(0);
            visibleNeuron.delta.clear();
        }

        for (Neuron& hiddenNeuron : hiddenNeurons) {
            for (double d : hiddenNeuron.delta)
                hiddenNeuron.bias += d;
            hiddenNeuron.delta.resize(0);
            hiddenNeuron.delta.clear();
        }
    }

    void calculateAllDeltas() {
        for (Weight& weight : weights) {
            double posGrad = weight.visible->saved * std::tanh(weight.hidden->saved);
            double negGrad = weight.visible->state * std::tanh(weight.hidden->b);

            weight.delta.push_back(learningRate * (posGrad - negGrad));
        }

        for (Neuron& visibleNeuron : visibleNeurons) {
            double posGrad = visibleNeuron.saved;
            double negGrad = visibleNeuron.state;

            visibleNeuron.delta.push_back(learningRate * (posGrad - negGrad));
        }

        for (Neuron& hiddenNeuron : hiddenNeurons) {
            double posGrad = std::tanh(hiddenNeuron.saved);
            double negGrad = std::tanh(hiddenNeuron.b);

            hiddenNeuron.delta.push_back(learningRate * (posGrad - negGrad));
        }
    }

    double sampleDistribution(const int patterns[n_patterns][n_bits], int N) {
        int count[n_patterns] = { 0, 0, 0, 0 };

        for (int o = 0; o < N; ++o) {

            int ra = random(0, n_patterns);

            for (int i = 0; i < visibleNeurons.size(); ++i)
                visibleNeurons[i].state = patterns[ra][i];


            for (int i = 0; i < 10; ++i) {

                for (Neuron& hiddenNeuron : hiddenNeurons)
                    hiddenNeuron.update();

                for (Neuron& visibleNeuron : visibleNeurons)
                    visibleNeuron.update();
            }

            for (int q = 0; q < n_patterns; ++q) {
                bool found = true;
                for (int i = 0; i < n_bits; ++i)
                    if (visibleNeurons[i].state != patterns[q][i]) {
                        found = false;
                        break;
                    }

                if (found) {
                    ++count[q];
                    break;
                }
            }
        }
        for (int i = 0; i < n_patterns; ++i) {
            double P_n = (double)count[i] / (double)N;

            std::cout << P_n << " ";
        }

        std::cout << "\n";

        double P_data = 1.0 / n_patterns;
        double D_KL = 0.0;
        for (int i = 0; i < n_patterns; ++i) {
            double P_n = (double)count[i] / (double)N;

            if(P_n == 0)
                return std::numeric_limits<double>::infinity();

            D_KL += P_data * std::log(P_data / P_n);
        }

        return D_KL;
    }

    std::vector<Neuron> visibleNeurons, hiddenNeurons;
    std::vector<Weight> weights;
    const double learningRate;
};


void Neuron::update() {
    b = -bias;
    for (const Weight* weight : weights)
        b += weight->compute(this);

    state = random(0, 1) < 1.0 / (1.0 + std::exp(-2 * b)) ? 1 : -1;
}

int Neuron::stochastic_update() {

    double _r = random(0, 1);
    double _p = 1.0 / (1.0 + std::exp(-2 * b));

    if (_r < _p)
        return 1;
    else
        return 0;
}

int main()
{
    std::vector<std::string> finalPrompts;
    std::vector<double> finalScores;
    double learningRate = 0.1;
    int k = 100;

    for (int trial = 0; trial < 20; ++trial) {
        std::vector<std::string> prompts;
        std::vector<double> scores;
        for (int n_hidden = 1; n_hidden <= 8; n_hidden += n_hidden) {

            for (int vMax = 1; vMax < 20; ++vMax) {

                RestrictedBoltzmannMachine rbm(3, n_hidden, learningRate);
                rbm.train(patterns, vMax, k);

                std::cout << "k: " << k << ", n_hidden: " << n_hidden << ": learningRate: " << learningRate << ", vMax: " << vMax << "\n";
                prompts.push_back(std::to_string(k) + ";" + std::to_string(n_hidden) + ";" + std::to_string(learningRate) + ";" + std::to_string(vMax));
                double score = rbm.sampleDistribution(patterns, 100);
                std::cout << score << "\n\n";
                scores.push_back(score);
            }
        }

        int index = 0;
        double maxScore = 100;
        for (int i = 0; i < scores.size(); ++i) {
            if (scores[i] < maxScore) {
                maxScore = scores[i];
                index = i;
            }
        }

        finalPrompts.push_back(prompts[index]);
        finalScores.push_back(scores[index]);

        std::cout << prompts[index] << "\n" << scores[index] << "\n\n";
    }

    for (int i = 0; i < finalScores.size(); ++i) {
        std::cout << finalPrompts[i] << "\n" << finalScores[i] << "\n\n";
    }
}
