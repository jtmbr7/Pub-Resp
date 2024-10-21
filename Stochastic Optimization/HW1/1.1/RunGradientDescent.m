% This function should run gradient descent until the L2 norm of the
% gradient falls below the specified threshold.

function x = RunGradientDescent(xStart, mu, eta, gradientTolerance)

    % Initialize x with the starting point
    x = xStart;
    
    % Compute the initial gradient at the starting point
    gradF = ComputeGradient(x, mu);
    
    % Loop until the norm of the gradient falls below the specified tolerance
    while norm(gradF, 2) > gradientTolerance
        % Update x by moving in the opposite direction of the gradient
        % The step size is controlled by eta
        x = x - eta * gradF;
        
        % Recompute the gradient at the updated x
        gradF = ComputeGradient(x, mu);
    end
end
