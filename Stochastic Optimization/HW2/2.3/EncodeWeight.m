function binarySegment = EncodeWeight(weight, wMax, bitsPerVariable)
    normalizedValue = (weight + wMax) / (2 * wMax);
    scaledValue = round(normalizedValue * (2^bitsPerVariable - 1));
    binarySegment = dec2bin(scaledValue, bitsPerVariable) - '0'; 
end
