
% creates a 2D matrix populationSize x numberOfGenes
function population = InitializePopulation(populationSize, numberOfGenes)
    
    
    population = randi([0, 1], populationSize, numberOfGenes);
end
