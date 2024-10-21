function selectedIndividualIndex = TournamentSelect(fitnessList, tournamentProbability, tournamentSize)

    % REUSED FROM HP1
    
    tournamentParticipants = randperm(length(fitnessList), tournamentSize);

    [~, sortedIndices] = sort(fitnessList(tournamentParticipants), 'descend');

    sortedParticipants = tournamentParticipants(sortedIndices);
    for i = 1:tournamentSize 
        if rand <= tournamentProbability || i == tournamentSize
            selectedIndividualIndex = sortedParticipants(i);
            return;
        end
    end
end
