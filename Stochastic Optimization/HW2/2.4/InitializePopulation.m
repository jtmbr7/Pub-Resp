function population = InitializePopulation(populationSize, minSequences, ...
    maxSequences, M, constantRegister, operators)

    population = cell(populationSize, 1);
    N = length(constantRegister);
    O = length(operators);

    for i = 1:populationSize

        chromosomeLength = 4 * (minSequences + randi(maxSequences - minSequences + 1) - 1);

        tmpChromosome = zeros(chromosomeLength, 1);
        
        for j = 1:4:chromosomeLength
            tmpChromosome(j) = randi(O);          % First gene: operator [1 to O]
            tmpChromosome(j + 1) = randi(M);        % Second gene: destination register [1 to M]
            tmpChromosome(j + 2) = randi(M + N);    % Third gene: first operand [1 to M+N]
            tmpChromosome(j + 3) = randi(M + N);    % Fourth gene: second operand [1 to M+N]
        end

        % Store the generated chromosome in the population
        population{i} = tmpChromosome;
    end
end
