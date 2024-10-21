function chromosome = EncodeNetwork(wIH, wHO, wMax)

    % Get sizes of weight matrices
    [nHidden, nInPlusBias] = size(wIH);
    [nOut, nHiddenPlusBias] = size(wHO);
    
    % Calculate total number of variables (weights and biases)
    numberOfVariables = nHidden * nInPlusBias + nOut * nHiddenPlusBias;

    genesPerVariable = 32;  % Number of bits per variable
    
    % Initialize the chromosome with the correct number of bits
    chromosome = zeros(1, numberOfVariables * genesPerVariable);
    
    geneStart = 1;
    geneEnd = genesPerVariable;
    
    % Encode input-to-hidden weights
    for i = 1:nHidden
        for j = 1:nInPlusBias
            chromosome(geneStart:geneEnd) = EncodeWeight(wIH(i,j), wMax, genesPerVariable);
            geneStart = geneEnd + 1;
            geneEnd = geneEnd + genesPerVariable;
        end
    end

    % Encode hidden-to-output weights
    for i = 1:nOut
        for j = 1:nHiddenPlusBias
            chromosome(geneStart:geneEnd) = EncodeWeight(wHO(i,j), wMax, genesPerVariable);
            geneStart = geneEnd + 1;
            geneEnd = geneEnd + genesPerVariable;
        end
    end
end
