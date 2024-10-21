
run('BestChromosome.m');

% Network parameters
nIn = 3;
nHidden = 8;
nOut = 2;
wMax = 5;

% Define the slope and dataset parameters
iSlope = 1;
iDataSet = 1;

% Run the simulation on the first slope
[~, ~, plotData] = EvaluateIndividual(bestChromosome, 1, 1, 10, wMax, nIn, nHidden, nOut);

% Step 6: Plot the simulation results
PlotData(plotData);   % PlotData function should visualize the truck dynamics
