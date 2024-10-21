function f = ChromosomeToFunct(chromosome, M, constantRegister, operators)

    % Initialize variable registers (r1, r2, ..., rM)
    variableRegister = cell(M, 1);
    for i = 1:M
        variableRegister{i} = sprintf('0', i);  % Initialize variable registers as r1, r2, etc.
    end

    % Initialize the function string, which will eventually become a valid function
    funcString = '@(x) ';  % Start with function handle @(x)
    variableRegister{1} = 'x';  % r1 is the input x

    % Parse the chromosome
    nGenes = length(chromosome);
    for i = 1:4:nGenes
        % Extract the operator and operands
        opCode = chromosome(i);       % Operator (1 to 4)
        destReg = chromosome(i+1);    % Destination register
        operand1 = chromosome(i+2);   % First operand (could be variable or constant)
        operand2 = chromosome(i+3);   % Second operand (could be variable or constant)
        
        % Operand 1: variable or constant
        if operand1 <= M
            op1Str = variableRegister{operand1};  % Variable register
        else
            op1Str = num2str(constantRegister(operand1 - M));  % Constant value as string
        end
        
        % Operand 2: variable or constant
        if operand2 <= M
            op2Str = variableRegister{operand2};  % Variable register
        else
            op2Str = num2str(constantRegister(operand2 - M));  % Constant value as string
        end

        % Simplification rules
        if strcmp(operators{opCode}, '+')
            % Simplify addition by zero
            if strcmp(op1Str, '0')
                expression = op2Str;
            elseif strcmp(op2Str, '0')
                expression = op1Str;
            else
                expression = sprintf('(%s + %s)', op1Str, op2Str);
            end
        elseif strcmp(operators{opCode}, '-')
            % Simplify subtraction by zero
            if strcmp(op2Str, '0')
                expression = op1Str;
            else
                expression = sprintf('(%s - %s)', op1Str, op2Str);
            end
        elseif strcmp(operators{opCode}, '*')
            % Simplify multiplication by zero and one
            if strcmp(op1Str, '0') || strcmp(op2Str, '0')
                expression = '0';  % Multiplying by 0 results in 0
            elseif strcmp(op1Str, '1')
                expression = op2Str;
            elseif strcmp(op2Str, '1')
                expression = op1Str;
            else
                expression = sprintf('(%s * %s)', op1Str, op2Str);
            end
        elseif strcmp(operators{opCode}, '/')
            % Simplify division by 1, but avoid division by zero
            if strcmp(op2Str, '1')
                expression = op1Str;
            elseif strcmp(op2Str, '0')
                expression = 'Inf';  % Handle division by zero safely
            else
                expression = sprintf('(%s / %s)', op1Str, op2Str);
            end
        end
        
        % Update the destination register
        variableRegister{destReg} = expression;
    end
    
    f = str2func([funcString, variableRegister{1}]);
end
