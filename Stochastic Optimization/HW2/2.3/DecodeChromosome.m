function [wIH, wHO] = DecodeChromosome(chromosome, nIn, nHidden, nOut, wMax)
    
    nInPlusBias = nIn + 1;
    nHiddenPlusBias = nHidden + 1;
    
    % Calculate the total number of variables (weights and biases)
    numberOfVariables = nHidden * nInPlusBias + nOut * nHiddenPlusBias;
    
    % Calculate the number of genes per variable
    genesPerVariable = length(chromosome) / numberOfVariables;
    
    % Initialize weight matrices
    wIH = zeros(nHidden, nInPlusBias);
    wHO = zeros(nOut, nHiddenPlusBias);

    % Initialize gene indices
    geneStart = 1;
    geneEnd = genesPerVariable;
    
    % Decode weights for input-to-hidden layer
    for i = 1:nHidden
        for j = 1:nInPlusBias
            wIH(i,j) = DecodeChromosomeSegment(chromosome(geneStart:geneEnd), wMax);
            geneStart = geneEnd + 1;
            geneEnd = geneStart + genesPerVariable - 1;  % Adjust for next gene segment
        end
    end

    % Decode weights for hidden-to-output layer
    for i = 1:nOut
        for j = 1:nHiddenPlusBias
            wHO(i,j) = DecodeChromosomeSegment(chromosome(geneStart:geneEnd), wMax);
            geneStart = geneEnd + 1;
            geneEnd = geneStart + genesPerVariable - 1;
        end
    end
end
