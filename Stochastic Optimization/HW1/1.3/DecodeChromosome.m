% Note: Each component of x should take values in [-a,a], where a = maximumVariableValue.
function x = DecodeChromosome(chromosome, numberOfVariables, maximumVariableValue)

    % Number of bits per variable
    k = length(chromosome) / numberOfVariables;

    % Initialize the output array
    x = zeros(1, numberOfVariables);

    for i = 1:numberOfVariables
        
        % Extrange the genes of each values from start ((i-1)*k+1) to end
        % (i*k). If i = 1, this will result in start = 1, and end = k.
        % if i = 2, this will result in start = k + 1, and end = 2*k, and
        % so on.
        bitSegment = chromosome((i-1)*k+1 : i*k);

        
        decimalValue = 0;
        for q = 1:length(bitSegment)
            decimalValue = decimalValue + bitSegment(q) * 2^(length(bitSegment) - q);
        end
        
        x(i) = -maximumVariableValue + (2 * maximumVariableValue) * decimalValue / (2^k - 1);
    end
end
