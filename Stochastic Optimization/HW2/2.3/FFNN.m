function [breakPressure, gearDelta] = FFNN(velocity, alpha, brakeTemp, wIH, wHO)

    c = 2;  % Constant for sigmoid steepness

    % Determine network structure
    [nHidden, nInPlusBias] = size(wIH);
    [nOut, nHiddenPlusBias] = size(wHO);
    nIn = nInPlusBias - 1;

    % Initialize input, hidden, and output layers
    input = [velocity, alpha, brakeTemp];
    hidden = zeros(nHidden, 1);
    output = zeros(nOut, 1);
    
    % Feedforward pass: input to hidden layer
    for i = 1:nHidden
        for j = 1:nIn
            hidden(i,1) = hidden(i,1) + input(j) * wIH(i, j);
        end
        hidden(i,1) = hidden(i,1) + wIH(i, nInPlusBias);  % Add bias
        hidden(i,1) = 1 / (1 + exp(-c * hidden(i,1)));    % Sigmoid activation
    end

    % Feedforward pass: hidden layer to output layer
    for i = 1:nOut
        for j = 1:nHidden
            output(i,1) = output(i,1) + hidden(j) * wHO(i, j);
        end
        output(i,1) = output(i,1) + wHO(i, nHiddenPlusBias);  % Add bias
        output(i,1) = 1 / (1 + exp(-c * output(i,1)));        % Sigmoid activation
    end

    % Assign outputs
    breakPressure = output(1, 1); % Brake power
    gearDelta = output(2, 1);  % Gear adjustment
end
