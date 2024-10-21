function newIndividuals = Cross(individual1, individual2)
    
    % REUSED FROM HP1
    
    crossoverPoint = randi([1, length(individual1) - 1]);
    
    offspring1 = [individual1(1:crossoverPoint), individual2(crossoverPoint+1:end)];
    offspring2 = [individual2(1:crossoverPoint), individual1(crossoverPoint+1:end)];
    
    newIndividuals = [offspring1; offspring2];
end
