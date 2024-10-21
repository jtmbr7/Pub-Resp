function mutatedIndividual = Mutate(individual, mutationProbability)

    % REUSED FROM HP1

    mutatedIndividual = individual;

    for i = 1:length(individual)
        if rand <= mutationProbability
            mutatedIndividual(i) = 1 - individual(i);
        end
    end
end
