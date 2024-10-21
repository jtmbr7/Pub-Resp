function selectedIndividualIndex = TournamentSelect(fitnessList, tournamentProbability, tournamentSize)

    % Randomly selects tournamentSize unique individuals (represented by their indices)
    % from the population for the tournament. randperm() ensures no repetition,
    % meaning each selected index is unique.
    tournamentParticipants = randperm(length(fitnessList), tournamentSize);

    % Sort the selected tournament participants based on their fitness values in descending order.
    % sortedIndices contains the relative indices of the tournamentParticipants after sorting by fitness.
    % "~" is used to ignore the actual sorted fitness values, as only the indices are needed.
    [~, sortedIndices] = sort(fitnessList(tournamentParticipants), 'descend');

    % Reorders tournamentParticipants according to the fitness sorting from the previous step.
    % sortedParticipants now contains the tournament participants ranked from highest to lowest fitness.
    sortedParticipants = tournamentParticipants(sortedIndices);


    % We attempt to select each individual based on the tournamentProbability.
    % We start with the strongest individual (the one with the highest fitness),
    % giving them the highest chance of being selected, with a chance of tournamentProbability.
    % If the strongest individual is not selected we move to the next strongest individual, and so on.
    % The selection process continues until we either select an individual
    % or reach the last one, who will always be selected if no one else has been.
    % Since tournamentProbability is > 0.5, the strongest individual has the highest chance of being selected.
    % As the loop progresses, the next individuals are considered with decreasing likelihood.
    % The probability of selecting individual n is therefore
    % (1 - tournamentProbability)^n * tournamentProbability, except for the
    % weakest individual which has a probability of (1 - tournamentProbability)^n.
    for i = 1:tournamentSize 
        if rand <= tournamentProbability || i == tournamentSize
            selectedIndividualIndex = sortedParticipants(i);
            return;
        end
    end
end
