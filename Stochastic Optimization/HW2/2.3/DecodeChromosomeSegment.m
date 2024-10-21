function num = DecodeChromosomeSegment(chromosomeSegment, wMax)
    % Convert from binary back to decimal
    decimalValue = bin2dec(num2str(chromosomeSegment)) / (2 ^ length(chromosomeSegment) - 1);
    
    % Scale the decimal value back to the range [-wMax, wMax]
    num = -wMax + 2 * wMax * decimalValue;
end
