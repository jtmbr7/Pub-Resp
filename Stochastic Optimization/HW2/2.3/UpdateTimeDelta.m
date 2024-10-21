function timeDelta = UpdateTimeDelta(velocity, alpha, timeDelta, xPosition, xPositionMax)
    % Updates the time step in the final iteration of the simulation, adjusting
    % the time to account for overshooting the maximum allowed position (xPositionMax).

    % Calculate the distance traveled during the last time step, along the slope
    travelledDistance = velocity * cosd(alpha) * timeDelta;
    
    % Calculate the overshoot: the amount by which the current position exceeds the maximum
    overdrive = xPosition - xPositionMax;
    
    % Determine the valid portion of the last traveled distance (excluding the overshoot)
    validDistance = travelledDistance - overdrive;
    
    % Adjust the time step based on the valid distance (portion of the last time step)
    timeDelta = (validDistance / travelledDistance) * timeDelta;
end
