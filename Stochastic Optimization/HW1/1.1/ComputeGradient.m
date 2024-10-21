% This function should return the gradient of f_p = f + penalty.
% You may hard-code the gradient required for this specific problem.

function gradF = ComputeGradient(x, mu)

    x1 = x(1);
    x2 = x(2);
    
    % Compute the gradient of the original objective function f(x1, x2)
    gradObjective = [2 * (x1 - 1); 4 * (x2 - 2)];
    
    % Compute the value of the constraint function g(x1, x2)
    g = x1^2 + x2^2 - 1;
    
    % Check if the constraint is violated (g > 0) and compute the penalty gradient if necessary
    if g > 0
        gradPenalty = 4 * mu * g * [x1; x2];
    else
        gradPenalty = [0; 0]; % No penalty if constraint is satisfied
    end
    
    % Compute the total gradient as the sum of the objective gradient and the penalty gradient
    gradF = gradObjective + gradPenalty;
end