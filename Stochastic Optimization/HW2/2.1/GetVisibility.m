function visibility = GetVisibility(cityLocation)
    % The visibility of a city is defined as 

    % Get the number of cities
    numberOfCities = size(cityLocation, 1);
    
    % Initialize the visibility matrix
    visibility = zeros(numberOfCities, numberOfCities);
    
    % Loop over each pair of cities
    for i = 1:numberOfCities
        for j = 1:numberOfCities
            if i ~= j
                % Calculate Euclidean distance between city i and city j
                distance = sqrt((cityLocation(i,1) - cityLocation(j,1))^2 + ...
                                (cityLocation(i,2) - cityLocation(j,2))^2);
                % Set visibility as inverse of distance
                visibility(i,j) = 1 / distance;
            else
                % Set visibility between a city and itself to 0 (not relevant)
                visibility(i,j) = 0;
            end
        end
    end
end
