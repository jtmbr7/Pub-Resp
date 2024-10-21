function forceBreak = GetFoundationForce(mass, gravity, pedalPressure, ...
    brakeTemp, brakeTempMax)
    
    % Add base break force
    forceBreak = pedalPressure * gravity * mass / 20;

    % If the temperature becomes high, the force becomes smaller as the
    % brakes becomes worse
    if brakeTemp >= (brakeTempMax - 100)
        forceBreak = forceBreak * ...
            exp(-(brakeTemp - (brakeTempMax - 100)) / 100);
    end
end
