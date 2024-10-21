
M = 5;
constantRegister = [1; 3; -1];
operators = {'+', '-', '*', '/'};

minSequences = 1;
maxSequences = 20;

populationSize = 100;
tournamentSize = 5;
tournamentProbability = 0.75;
nGenerations = 50000;
crossoverProbability = 0.2;

[maximumFitness, bestChromosome] = ...
    RunFFNNOptimization(populationSize, tournamentSize, ...
    tournamentProbability, nGenerations, crossoverProbability, ...
    minSequences, maxSequences, M, constantRegister, operators)



% Save the best chromosome to BestChromosome.m file
fileID = fopen('BestChromosome.m', 'w');
fprintf(fileID, 'bestChromosome = [\n');  % Start the array

% Print each value on a new line as an integer
for i = 1:length(bestChromosome)
    fprintf(fileID, '  %d\n', bestChromosome(i));
end

fprintf(fileID, '];\n');  % Close the array
fclose(fileID);



f = ChromosomeToFunct(bestChromosome, M, constantRegister, operators)