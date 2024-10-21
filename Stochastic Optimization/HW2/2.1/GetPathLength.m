function pathLength = GetPathLength(path, cityLocation)

    pathLength = 0;
    
    % Start with the last city in the path to make sure we also include the
    % distance back to the starting city
    current = path(length(path));
    
    % Loop through the path and compute the length of each leg of the tour
    for i = 1:length(path)
        next = path(i);
        
        % Calculate Euclidean distance between current and next city
        pathLength = pathLength + sqrt((cityLocation(current,1) - cityLocation(next,1))^2 + ...
                                       (cityLocation(current,2) - cityLocation(next,2))^2);
        current = next;  % Move to the next city
    end
    
end
