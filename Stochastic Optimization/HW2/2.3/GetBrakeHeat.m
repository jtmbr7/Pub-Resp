function breakTemp = GetBrakeHeat(pedalPressure, breakTemp, ...
    brakeTempAmbient, C_h, tau, timeDelta)


     % If the driver is putting no (or very low) pressure on the brake
     % pedal, the brakes start cooling down
    if pedalPressure < 0.01
        breakTemp = breakTemp - ...
            ((breakTemp - brakeTempAmbient) / tau) * timeDelta;
    else
        % If the driver puts pressure on the pedal, it start heating up
        breakTemp = breakTemp + C_h * pedalPressure * timeDelta;
    end

    % The temperature of the brakes cannot be lower than the ambient
    % temperature.
    if breakTemp < brakeTempAmbient
        breakTemp = brakeTempAmbient;
    end
end
