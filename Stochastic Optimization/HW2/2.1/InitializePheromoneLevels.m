function pheromoneLevels = InitializePheromoneLevels(numberOfCities, tau0)

    % Initialize pheromone levels between all cities to tau0.
    % pheromoneLevels(i,j) represents the pheromone level between city i and city j.
    pheromoneLevels = tau0 * ones(numberOfCities, numberOfCities);
    
    % It is not allowed to walk from one city to itself, so we set
    % pheromone levels for paths from a city to itself to zero.
    for i = 1:numberOfCities
        pheromoneLevels(i, i) = 0;
    end
end
