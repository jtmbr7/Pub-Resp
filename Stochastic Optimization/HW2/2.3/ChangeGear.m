function [gear, gearCooldown] = ChangeGear(gear, gearDelta, ...
    gearCooldownDuration, gearCooldown, timeDelta)
    
    % Decrease the cooldown by the elapsed time
    gearCooldown = gearCooldown - timeDelta;

    % If the cooldown is over, allow for a gear change
    if gearCooldown < 0
        % Check if the gear should be decreased (if delta < 0.33) and it's not in the lowest gear
        if gearDelta < 0.33 && gear > 1
            gear = gear - 1;
            gearCooldown = gearCooldownDuration;  % Reset cooldown after changing the gear
        % Check if the gear should be increased (if delta > 0.66) and it's not in the highest gear
        elseif gearDelta > 0.66 && gear < 10
            gear = gear + 1;
            gearCooldown = gearCooldownDuration;  % Reset cooldown after changing the gear
        end
    end
end
