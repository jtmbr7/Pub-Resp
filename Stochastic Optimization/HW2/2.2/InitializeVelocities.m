function velocities = InitializeVelocities(numParticles, dim, xmax, alpha, delta_t)
    % Initialize particle velocities using the formula provided:
    % v = alpha / delta_t * (-xmax + 2 * r * xmax), where r is a random number in [0, 1]

    % Generate random values between 0 and 1
    r = rand(numParticles, dim);
    
    % Calculate initial velocities based on the formula
    velocities = (alpha / delta_t) * (-xmax + 2 * r * xmax);
end