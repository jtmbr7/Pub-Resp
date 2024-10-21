function fitness = RunLGP(chromosome, functionData, M, constantRegister, operators)
   
    error = 0.0;

    % Evaluate the function over the data
    for i = 1:size(functionData, 1)
        xk = functionData(i, 1);  % Input
        yk = functionData(i, 2);  % Expected output
        
        % Evaluate the generated function with xk
        y = ChromosomeToVal(chromosome, xk, M, constantRegister, operators);
        
        % Check for NaN or Inf (invalid result)
        if isnan(y) || isinf(y)
            fitness = 0;  % Return a very low fitness
            return
        end

        % Calculate squared error
        error = error + (y - yk)^2;
    end

    % Compute RMSE and fitness
    error = sqrt(error / size(functionData, 1));
    
    if error > 0
        fitness = 1 / error;
    else
        fitness = Inf;  % Handle case where error is 0 or very small
    end
end
