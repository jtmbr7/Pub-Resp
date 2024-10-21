function [fitness, performanceMatrix, plotData] ...
    = RunTruckSimulation(wIH, wHO, iSlope, iDataSet)

    % Time (s)
    time = 0; % initial
    timeDelta = 0.1; % stepsize
    
    % Truck Mass (kg)
    mass = 20000;

    % Truck Coordinaties (m)
    xPosition = 0; % initial
    xPositionMax = 1000;
    yPosition = 0;
    distanceTravelled = 0;

    % Truck Velocity (m/s)
    velocity = 20; % initial
    velocityMin = 1;
    velocityMax = 25;

    % Brake Temperature (K)
    brakeTemp = 500; % initial
    brakeTempMax = 750;
    brakeTempAmbient = 283; % ambient/min temperature

    % Brake Constants
    tau = 30; % (s) scales temperature decrease
    C_h = 40; % (K/s) scales temperature increase
    C_b = 3000; % (N) scales force
    
    % Gear
    gear = 7; % initial
    gearCooldown = 0; % (s) initial
    gearCooldownDuration = 2; % (s) duration of the cooldown

    % Other constants
    alphaMax = 10;
    gravity = 9.81;
    
    % Storage for the data to be plotted
    plotData = zeros(ceil(xPositionMax / (velocityMax * timeDelta)), 7);
    
    iteration = 1;
    while xPosition < xPositionMax && velocity <= velocityMax && velocity >= velocityMin && brakeTemp <= brakeTempMax


        alpha = GetSlopeAngle(xPosition, iSlope, iDataSet);
        
        [breakPressure, gearDelta] = FFNN(velocity/velocityMax, ...
            alpha/alphaMax, brakeTemp/brakeTempMax, wIH, wHO);

        forceBrake = GetFoundationForce(mass, gravity, breakPressure, ...
            brakeTemp, brakeTempMax);
        forceEngine = GetEngineForce(gear, C_b);
        forceGravity = mass * gravity * sind(alpha);
        forceTotal = forceGravity - forceBrake - forceEngine;
        
        acceleration = GetAcceleration(forceTotal, mass);

        % Store the current state
        plotData(iteration, :) = [xPosition, alpha, breakPressure, ...
            gear, velocity, brakeTemp, yPosition];

        % ------------ Caluculations for next state ------------

        % Adjust the gear and cooldown
        [gear, gearCooldown] = ChangeGear(gear, gearDelta, ...
            gearCooldownDuration, gearCooldown, timeDelta);
        
        xPosition = xPosition + velocity * cosd(alpha) * timeDelta;

        if xPosition > xPositionMax

            % Update timeDelta so that it reflects the time that actually
            % passed before reaching the end
            timeDelta = UpdateTimeDelta(velocity, alpha, timeDelta, ...
                xPosition, xPositionMax);
            xPosition = xPositionMax;
        end
        
        yPosition = yPosition - velocity * sind(alpha) * timeDelta;
        velocity = velocity + acceleration * timeDelta;

        % Get the brake temperature
        brakeTemp = GetBrakeHeat(breakPressure, brakeTemp, ...
            brakeTempAmbient, C_h, tau, timeDelta);

        distanceTravelled = distanceTravelled + velocity * timeDelta;
        iteration = iteration + 1;
        time = time + timeDelta;
    end

    % Storing the last state, with the updated variables from the loop
    alpha = GetSlopeAngle(xPosition, iSlope, iDataSet);
    plotData(iteration, :) = [xPosition, alpha, breakPressure, gear, ...
        velocity, brakeTemp, yPosition];
    
    velocityAverage = distanceTravelled / time;
    
    % Fitness calculated based on the time it took to drive down the slope
    % and the penalty of violating the constraints
    fitness = (10 * xPosition/xPositionMax) * (velocityAverage/velocityMax)/10;
    performanceMatrix = [velocityAverage, xPosition];
end
