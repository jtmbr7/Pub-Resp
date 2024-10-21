function [bestPosition, bestFitness] = RunPSO()
    
    x = linspace(-5, 5);
    y = linspace(-5, 5);
    [X, Y] = meshgrid(x, y);
    Z = log(0.0001 + (X.^2 + Y - 11).^2 + (X + Y.^2 - 7).^2);
    contour(X, Y, Z, 100)
    colorbar
    
    inertia = 1.4;
    inertia_min = 0.3;
    intertia_decay = 0.999;


    % PSO parameters
    numParticles = 30;          % Number of particles
    iterations = 1000;           % Maximum number of iterations
    cognitiveCoeff = 1.5;       % Cognitive coefficient (c1)
    socialCoeff = 1.5;          % Social coefficient (c2)
    dim = 2;                    % Dimensionality of the problem (x1, x2)
    lowerBound = -5;            % Lower bound of search space
    upperBound = 5;             % Upper bound of search space
    delta_t = 0.01;
    alpha = 1;

    % Initialize particles
    positions = lowerBound + rand(numParticles, dim) * (upperBound - lowerBound);
    velocities = InitializeVelocities(numParticles, dim, upperBound, alpha, delta_t);
    bestPositions = positions;
    bestFitness = CalculateFitness(positions);

    % Initialize global best
    [globalBestFitness, idx] = min(bestFitness);
    globalBestPosition = bestPositions(idx, :);

    % Main PSO loop
    for iteration = 1:iterations
        for i = 1:numParticles
            
            % Update velocity
            cognitiveComponent = cognitiveCoeff * rand(1, dim) .* (bestPositions(i,:) - positions(i,:));
            socialComponent = socialCoeff * rand(1, dim) .* (globalBestPosition - positions(i,:));
            velocities(i,:) = inertia * velocities(i,:) + cognitiveComponent + socialComponent;

            % Update position
            positions(i,:) = positions(i,:) + velocities(i,:);

            % Ensure the particles stay within bounds
            positions(i,:) = max(positions(i,:), lowerBound);
            positions(i,:) = min(positions(i,:), upperBound);

            % Evaluate fitness of the particle's new position
            fitness = CalculateFitness(positions(i, :));

            % Update the particle's best position if fitness improved
            if fitness < bestFitness(i)
                bestFitness(i) = fitness;
                bestPositions(i,:) = positions(i,:);
            end

            % Update the global best position if necessary
            if fitness < globalBestFitness
                globalBestFitness = fitness;
                globalBestPosition = positions(i,:);
            end
        end

        % Optionally, display the iteration and best fitness
        disp(['Iteration ' num2str(iteration) ', Best Fitness: ' num2str(globalBestFitness)]);
        inertia = inertia * intertia_decay;
        if inertia < inertia_min
            inertia = inertia_min;
        end
    end

    % Return the best position and fitness found
    bestPosition = globalBestPosition
    bestFitness = globalBestFitness
end