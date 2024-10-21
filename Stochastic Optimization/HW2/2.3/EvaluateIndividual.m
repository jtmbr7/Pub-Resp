function [fitness, performanceMatrix, plotData] = EvaluateIndividual(chromosome, iDataSet, iSlopeStart, iSlopeEnd, wMax, nIn, nHidden, nOut)

    % Decode the chromosome into weight matrices for the neural network
    [wIH, wHO] = DecodeChromosome(chromosome, nIn, nHidden, nOut, wMax);
    
    % Initialize fitness and performance metrics
    fitness = 0;
    performanceMatrix = zeros(2, 1);

    % Calculate the number of slopes to evaluate on
    nSlopes = iSlopeEnd - iSlopeStart + 1;

    % Initialize plot data storage for each slope + iDataSet storage
    plotData = cell(nSlopes + 1, 1);
    
    % Loop through the specified slopes and evaluate the truck's performance
    for iSlope = iSlopeStart:iSlopeEnd
        [fitness_, performanceMatrix_, plotData_] = RunTruckSimulation(wIH, wHO, iSlope, iDataSet);
        
        % Accumulate fitness and performance metrics across slopes
        fitness = fitness + fitness_;
        performanceMatrix(:) = performanceMatrix(:) + performanceMatrix_(:);

        % Store the plot data for each slope, excluding empty rows
        plotData{iSlope} = plotData_(any(plotData_, 2), :);
    end
    
    % Calculate the average performance metrics and fitness across slopes
    performanceMatrix(:) = performanceMatrix(:) / nSlopes;
    fitness = fitness / nSlopes;

    % Store the dataset information for further reference
    plotData{nSlopes + 1} = iDataSet;
end
