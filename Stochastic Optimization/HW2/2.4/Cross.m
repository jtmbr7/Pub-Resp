function [offspring1, offspring2] = Cross(individual1, individual2)
    
    cp11 = 0;
    cp12 = 0;
    
    while cp11 == cp12 || cp11 > cp12
        cp11 = (randi(length(individual1) / 4) - 1) * 4;
        cp12 = randi(length(individual1) / 4) * 4;
    end

    cp21 = 0;
    cp22 = 0;
    
    while cp21 == cp22 || cp21 > cp22
        cp21 = (randi(length(individual2) / 4) - 1) * 4;
        cp22 = randi(length(individual2) / 4) * 4;
    end

    offspring1 = [individual1(1:cp11); individual2(cp21 + 1:cp22); individual1(cp12 + 1:end)];
    offspring2 = [individual2(1:cp21); individual1(cp11 + 1:cp12); individual2(cp22 + 1:end)];
end
