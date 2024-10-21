function mutatedIndividual = Mutate(individual, mutationProbability)

    % First, we copy chromosome of the individual.
    mutatedIndividual = individual;

    % Loop though all genes, and flip them (if 0, it becomes 1, and if 1,
    % it becomes 0) with a probability of mutationProbability. This is done
    % individually for each gene, which means that each gene has a chance
    % of mutationProbability to be flipped.
    for i = 1:length(individual)
        if rand <= mutationProbability
            mutatedIndividual(i) = 1 - individual(i);
        end
    end
end
