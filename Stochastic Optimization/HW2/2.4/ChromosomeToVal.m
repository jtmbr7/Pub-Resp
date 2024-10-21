function y = ChromosomeToVal(chromosome, x, M, constantRegister, operators)
    % Initialize variable registers (r1, r2, ..., rM)
    variableRegister = zeros(M, 1);
    variableRegister(1) = x;  % r1 is the input x

    % Parse the chromosome and compute the result directly
    nGenes = length(chromosome);
    for i = 1:4:nGenes
        % Extract the operator and operands
        opCode = chromosome(i);       % Operator (1 to 4)
        destReg = chromosome(i+1);    % Destination register
        operand1 = chromosome(i+2);   % First operand (could be variable or constant)
        operand2 = chromosome(i+3);   % Second operand (could be variable or constant)
        
        % Operand 1: variable or constant
        if operand1 <= M
            val1 = variableRegister(operand1);  % Variable register value
        else
            val1 = constantRegister(operand1 - M);  % Constant value
        end
        
        % Operand 2: variable or constant
        if operand2 <= M
            val2 = variableRegister(operand2);  % Variable register value
        else
            val2 = constantRegister(operand2 - M);  % Constant value
        end

        % Apply the operation
        switch operators{opCode}
            case '+'
                variableRegister(destReg) = val1 + val2;
            case '-'
                variableRegister(destReg) = val1 - val2;
            case '*'
                variableRegister(destReg) = val1 * val2;
            case '/'
                % Safeguard against division by zero
                if val2 == 0
                    variableRegister(destReg) = Inf;  % Handle division by zero safely
                else
                    variableRegister(destReg) = val1 / val2;
                end
        end
    end

    % The final result is stored in r1
    y = variableRegister(1);
end
