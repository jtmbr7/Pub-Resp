function F_b = GetEngineForce(gear, C_b)
    % Declare F_gear as a persistent variable
    persistent F_gear;
    
    % Initialize F_gear only once
    if isempty(F_gear)
        F_gear = [7, 5, 4, 3, 2.5, 2, 1.6, 1.4, 1.2, 1];
    end
    
    % Calculate engine force
    F_b = F_gear(gear) * C_b;
end