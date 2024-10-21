function [maximumFitness, bestChromosome] = ...
    RunFFNNOptimization(populationSize, tournamentSize, ...
    tournamentProbability, nGenerations, crossoverProbability, ...
    minSequences, maxSequences, M, constantRegister, operators)

    mutationMultiplier = 1;
    format long
    population = InitializePopulation(populationSize, minSequences, maxSequences, M, constantRegister, operators);
    functionData = LoadFunctionData;
    maximumFitness = 0;
    for generation = 1:nGenerations

        averageLength = 0;
        populationFitness = zeros(populationSize, 1);

        lastMax = maximumFitness;
        % Evaluate the population
        for i = 1:populationSize
            chromosome = population{i};
            averageLength = averageLength + length(chromosome);
            populationFitness(i, 1) = RunLGP(chromosome, functionData, M, constantRegister, operators);
            
            % Save the best training chromosome
            if populationFitness(i, 1) > maximumFitness
                maximumFitness = populationFitness(i, 1);
                bestChromosome = chromosome;

                if(maximumFitness > 100)
                    return
                end
            end
        end

        if lastMax == maximumFitness
                mutationMultiplier = mutationMultiplier + 1;
        else
            mutationMultiplier = 1;
        end

        averageLength = averageLength / populationSize;

        mutationProbability = mutationMultiplier * 0.02;
        if mutationProbability > 0.75
            mutationProbability = 0.75;
        end
        % Print current generation performance
        sprintf('Generation: %d, Score: %0.10f, average_length: %0.10f, mut_mult: %0.10f', generation, maximumFitness, averageLength, mutationProbability) 

        % Genetic algorithm: Selection, Crossover, Mutation
        temporaryPopulation = cell(populationSize, 1);


        for i = 1:2:populationSize
            valid = false;
            while valid == false
                valid = true;
                i1 = TournamentSelect(populationFitness,tournamentProbability,tournamentSize);
                i2 = TournamentSelect(populationFitness,tournamentProbability,tournamentSize);
                r = rand;
                if (r < crossoverProbability) 
                    [individual1, individual2] = Cross(population{i1}, population{i2});
                    
                    if length(individual1) > 400 || length(individual2) > 400
                        valid = false;
                    else
                        temporaryPopulation{i} = individual1;
                        temporaryPopulation{i+1} = individual2;
                    end
                else
                    temporaryPopulation{i} = population{i1};
                    temporaryPopulation{i+1} = population{i2};     
                end
            end
        end
      

        % Apply mutation to the rest of the population
        for i = 2:populationSize
            tempIndividual = Mutate(temporaryPopulation{i}, M, constantRegister, operators, mutationProbability);
            temporaryPopulation{i} = tempIndividual;
        end

        newGeneration = InitializePopulation(10, minSequences, ...
            maxSequences, M, constantRegister, operators);

        for i = 1:10
            temporaryPopulation{randi(populationSize)} = newGeneration{i};
        end

        % Ensure the best chromosome from training is preserved
        temporaryPopulation{1} = bestChromosome;

        % Update the population for the next generation
        population = temporaryPopulation;
    end
end
