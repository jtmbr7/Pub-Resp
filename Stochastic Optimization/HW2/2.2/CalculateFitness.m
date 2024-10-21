function particleBestFitness = CalculateFitness(particlePositions)
    % Number of particles
    numParticles = size(particlePositions, 1);
    
    % Initialize the fitness array
    particleBestFitness = zeros(numParticles, 1);

    % Loop through each particle and calculate its fitness
    for i = 1:numParticles
        x1 = particlePositions(i, 1);  % First dimension (x1)
        x2 = particlePositions(i, 2);  % Second dimension (x2)
        
        % Fitness function: f(x1, x2) = (x1^2 + x2 - 11)^2 + (x1 + x2^2 - 7)^2
        particleBestFitness(i) = (x1^2 + x2 - 11)^2 + (x1 + x2^2 - 7)^2;
    end
end
