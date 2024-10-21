function newIndividuals = Cross(individual1, individual2)

    % We select a random point in the chromosomes, where we will to the
    % crossover.
    crossoverPoint = randi([1, length(individual1) - 1]);
    
    % We mix the genes based on the point of crossover, so that individual1
    % will have all its own genes (1 -> crossoverPoint), and the genes of
    % individual2 from (crossoverPoint -> end). Individual2 will have the
    % same but from its own perspective.
    offspring1 = [individual1(1:crossoverPoint), individual2(crossoverPoint+1:end)];
    offspring2 = [individual2(1:crossoverPoint), individual1(crossoverPoint+1:end)];
    
    newIndividuals = [offspring1; offspring2];
end
