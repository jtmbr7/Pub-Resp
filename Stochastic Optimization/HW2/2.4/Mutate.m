function mutatedIndividual = Mutate(individual, M, constantRegister, operators, mutationProbability)
   
    
    N = length(constantRegister);
    O = length(operators);
    
    % Copy the individual to start mutation
    mutatedIndividual = individual;
    
    % Number of instructions (each instruction has 4 genes)
    nInstructions = length(individual) / 4;

    % Randomly select one instruction to mutate
    instructionIdx = randi(nInstructions);  % Pick one random instruction (1 to nInstructions)
    baseIdx = (instructionIdx - 1) * 4 + 1;  % Base index for the selected instruction
    
    % Mutate the selected instruction
    for i = baseIdx:(baseIdx + 3)
        if rand <= mutationProbability
            % Mutate based on the type of gene (Operator, Destination Register, or Operand)
            if mod(i, 4) == 1  % Operator mutation (1st gene in every 4-gene block)
                mutatedIndividual(i) = randi(O);  % Random new operator (1 to O)
            elseif mod(i, 4) == 2  % Destination register mutation (2nd gene)
                mutatedIndividual(i) = randi(M);  % Random new variable register (1 to M)
            elseif mod(i, 4) == 3 || mod(i, 4) == 0  % Operand mutation (3rd and 4th genes)
                % Random new operand (either a variable register or a constant register)
                mutatedIndividual(i) = randi(M + N);  % Random operand (1 to M+N)
            end
        end
    end
end
