function deltaPheromoneLevel = ComputeDeltaPheromoneLevels(pathCollection, pathLengthCollection)

    numberOfAnts = size(pathCollection, 1);       % Number of ants
    numberOfCities = size(pathCollection, 2);     % Number of cities in each path
    
    % Initialize delta pheromone levels to zero for all paths
    deltaPheromoneLevel = zeros(numberOfCities, numberOfCities);
    
    % Loop over each ant
    for k = 1:numberOfAnts
        path = pathCollection(k, :);             % The path followed by ant k
        pathLength = pathLengthCollection(k);    % The length of the path for ant k
        
        % Calculate pheromone contribution for this ant
        contribution = 1 / pathLength;  % The shorter the path, the higher the contribution
        
        current = path(length(path));
        % Loop over each pair of cities in the path
        for i = 1:numberOfCities
            next = path(i);
            
            % Update pheromone level for the path between fromCity and toCity
            deltaPheromoneLevel(current, next) = deltaPheromoneLevel(current, next) + contribution;

            current = next;
        end
    end
end
