M = 5;
constantRegister = [0; 1; -1; 0.5; -0.5];
operators = {'+', '-', '*', '/'};


chromosome = [1, 2, 3, 4, 1, 1, 2, 2]
f = ChromosomeToFunct(chromosome, M, constantRegister, operators)

f(1)