function acceleration = GetAcceleration(force, mass)
    
    acceleration = force / mass;

    % Prevent the truck from "breaking backward" if the break force is
    % larger than the gravitational force
    if acceleration < 0
        acceleration = 0;
    end
end