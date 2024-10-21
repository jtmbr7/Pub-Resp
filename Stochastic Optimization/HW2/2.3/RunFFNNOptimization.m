function [averageFitnessTraining, averageFitnessValidation, bestChromosomeTraining, bestChromosomeValidation, plotData] = ...
    RunFFNNOptimization(populationSize, tournamentSize, ...
    tournamentProbability, maxGenerations, crossoverProbability, ...
    mutationProbability, nIn, nHidden, nOut, wMax, nGenes)

    format long

    maximumFitnessValidation = 0;  % Track the best fitness on the validation set
    averageFitnessTraining = zeros(maxGenerations, 1);  % Store fitness for each generation (training)
    averageFitnessValidation = zeros(maxGenerations, 1);  % Store fitness for each generation (validation)

    patience = 10;  % Number of generations to wait if no validation improvement
    wait = 0;      % Counter to track patience usage

    % Initialize population
    population = InitializePopulation(populationSize, nGenes);

    for generation = 1:maxGenerations
        maximumFitnessTraining = 0;  % Track the best training fitness for this generation

        populationFitness = zeros(populationSize, 1);  % Fitness of each individual in the population

        % Evaluate the population
        for i = 1:populationSize
            chromosome = population(i,:);

            % Evaluate the fitness for this individual (on training set)
            [populationFitness(i, 1), performanceMatrix_, plotData_] = ...
                EvaluateIndividual(chromosome, 1, 1, 10, wMax, nIn, nHidden, nOut);
            
            % Save the best training chromosome
            if (populationFitness(i, 1) > maximumFitnessTraining) 
                maximumFitnessTraining = populationFitness(i, 1);
                bestChromosomeTraining = chromosome;
                performanceMatrix = performanceMatrix_;
                plotData = plotData_;
            end
        end

        % Print current generation performance
        sprintf('Generation: %d, Score: %0.10f, v_average: %0.10f, x: %0.10f', generation, maximumFitnessTraining, performanceMatrix(1), performanceMatrix(2)) 

        % Evaluate the best training chromosome on the validation set
        [fitnessValidation, ~, ~] = EvaluateIndividual(bestChromosomeTraining, 2, 1, 5, wMax, nIn, nHidden, nOut);
        
        % Store fitness for plotting later
        averageFitnessTraining(generation, 1) = maximumFitnessTraining;
        averageFitnessValidation(generation, 1) = fitnessValidation;
        
        % If the validation performance is as good or better, continue
        if fitnessValidation >= maximumFitnessValidation - 10e-6
            bestChromosomeValidation = bestChromosomeTraining;
            maximumFitnessValidation = fitnessValidation;
            wait = 0;  % Reset patience counter
        else
            wait = wait + 1;  % Increment patience counter

            % Stop early if validation performance doesn't improve within patience
            if wait >= patience
                % Remove unused entries from fitness arrays
                averageFitnessTraining = averageFitnessTraining(any(averageFitnessTraining ~= 0, 2), :);
                averageFitnessValidation = averageFitnessValidation(any(averageFitnessValidation ~= 0, 2), :);
                disp('Early stopping due to no improvement in validation set');
                return;
            end
        end

        % Genetic algorithm: Selection, Crossover, Mutation
        temporaryPopulation = population;
        for i = 1:2:populationSize
            i1 = TournamentSelect(populationFitness,tournamentProbability,tournamentSize);
            i2 = TournamentSelect(populationFitness,tournamentProbability,tournamentSize);
            r = rand;
            if (r < crossoverProbability) 
                individual1 = population(i1,:);
                individual2 = population(i2,:);
                newIndividualPair = Cross(individual1, individual2);
                temporaryPopulation(i,:) = newIndividualPair(1,:);
                temporaryPopulation(i+1,:) = newIndividualPair(2,:);
            else
                temporaryPopulation(i,:) = population(i1,:);
                temporaryPopulation(i+1,:) = population(i2,:);     
            end
        end
      
        % Ensure the best chromosome from training is preserved
        temporaryPopulation(1,:) = bestChromosomeTraining;

        % Apply mutation to the rest of the population
        for i = 2:populationSize
            tempIndividual = Mutate(temporaryPopulation(i,:),mutationProbability);
            temporaryPopulation(i,:) = tempIndividual;
        end

        % Update the population for the next generation
        population = temporaryPopulation;
    end
end
