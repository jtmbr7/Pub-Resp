% First compute the function value, then compute the fitness
% value; see also the problem formulation.

function fitness = EvaluateIndividual(x)
    
    g = (1.5 - x(1) + x(1) * x(2))^2 + (2.25 - x(1) + x(1) * x(2)^2)^2 + (2.625 - x(1) + x(1) * x(2)^3)^2;

    fitness = 1/(g + 1);
end
