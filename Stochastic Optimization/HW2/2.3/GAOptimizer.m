% Network Settings
nIn = 3;
nHidden = 8;
nOut = 2;
wMax = 5;

% Chromosome Settings
nGenesPerVar = 32;
nVar = nHidden * (nIn + 1) + nOut * (nHidden + 1);
nGenes = nGenesPerVar * nVar;
mutationProbability = 1 / nGenes;

% GA Settings
populationSize = 500;
maxGenerations = 10000;
tournamentSize = 2;
tournamentProbability = 0.75;
crossoverProbability = 0.8;

% Run the FFNN optimization
[averageFitnessTraining, averageFitnessValidation, bestChromosomeTraining, bestChromosomeValidation, plotData]  = RunFFNNOptimization( ...
    populationSize, tournamentSize, tournamentProbability, ... 
    maxGenerations, crossoverProbability, mutationProbability, ...
    nIn, nHidden, nOut, wMax, nGenes);

PlotData(plotData);  % Plot training data

% Plotting the fitness values
figure;
generations = 1:length(averageFitnessTraining);
plot(generations, averageFitnessTraining, '-o', 'DisplayName', 'Training Fitness');
hold on;
plot(generations, averageFitnessValidation, '--s', 'DisplayName', 'Validation Fitness');

% Adding labels and title
xlabel('Generations');
ylabel('Average Fitness');
title('Average Fitness Over Generations');
legend('Location', 'best');
grid on;
hold off;

% Compare best training and validation chromosomes
if any(bestChromosomeTraining ~= bestChromosomeValidation)
    disp('The training and validation chromosomes are different.');
else
    disp('The training and validation chromosomes are the same.');
end


% Save the best chromosome to BestChromosome.m file
fileID = fopen('BestChromosome.m', 'w');
fprintf(fileID, 'bestChromosome = [%s];\n', num2str(bestChromosomeValidation));
fclose(fileID);
