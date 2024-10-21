function path = GeneratePath(pheromoneLevel, visibility, alpha, beta)

    numberOfCities = size(pheromoneLevel, 1);
    
    % Initalize an array (path) where we will store the generated path, and
    % an array (visited) where we will keep track of which cities we have
    % visited.
    path = zeros(1, numberOfCities);
    visited = false(1, numberOfCities); 

    % Randomly select a city to start from, put it in the path and mark
    % this city as visited.
    currentCity = randi(numberOfCities);
    path(1) = currentCity;
    visited(currentCity) = true;

    % Construct the path by visiting the remaining cities
    for i = 2:numberOfCities

        probabilities = zeros(1, numberOfCities);
        
        % Calculate the numerator for each unvisited city
        for j = 1:numberOfCities
            if ~visited(j)
                probabilities(j) = (pheromoneLevel(currentCity, j)^alpha) * (visibility(currentCity, j)^beta);
            end
        end
        
        cumulativeProbabilities = 0.0;
        r = rand() * sum(probabilities);
        for q = 1:length(probabilities);
            cumulativeProbabilities = cumulativeProbabilities + probabilities(q);
            if r < cumulativeProbabilities;
                nextCity = q;
                break;
            end
        end

        % Update the path and mark the city as visited
        path(i) = nextCity;
        visited(nextCity) = true;

        % Move to the next city
        currentCity = nextCity;
    end
end
