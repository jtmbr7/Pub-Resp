function pheromoneLevel = UpdatePheromoneLevels(pheromoneLevel, deltaPheromoneLevel, rho)

    % Evaporate existing pheromone levels by factor (1 - rho)
    pheromoneLevel = (1 - rho) * pheromoneLevel;
    
    % Add the new pheromone deposits (deltaPheromoneLevel)
    pheromoneLevel = pheromoneLevel + deltaPheromoneLevel;
    
    % Ensure pheromone levels do not fall below a lower bound (e.g., 10^-15)
    lowerBound = 1e-15;
    pheromoneLevel(pheromoneLevel < lowerBound) = lowerBound;
end
