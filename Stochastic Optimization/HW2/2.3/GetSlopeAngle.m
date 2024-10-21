function alpha = GetSlopeAngle(x, iSlope, iDataSet)
    if (iDataSet == 1) % Training
        if (iSlope == 1) 
            alpha = 1 + x/300 + 0.2 * cos(x/300) + sin(x / 80);
        elseif (iSlope == 2) 
            alpha = 2 + x/170 - cos(x/70) - 1.6 * sin(x / 90);
        elseif (iSlope == 3) 
            alpha = 4 + x/820 + 0.8 * cos(x/50) - 1.4 * sin(x / 90);
        elseif (iSlope == 4) 
            alpha = 6 + x/430 - cos(x/380) - 1.2 * sin(x / 120);
        elseif (iSlope == 5) 
            alpha = 6 - x/520 + cos(x/30) - 2.5 * sin(x / 70);
        elseif (iSlope == 6) 
            alpha = 7 - x/580 + cos(x/10) - 3 * sin(x / 190);
        elseif (iSlope == 7) 
            alpha = 7 - x/290 - 2 * cos(x/20) - 2.2 * sin(x / 75);
        elseif (iSlope == 8) 
            alpha = 8 - x/150 - 0.3 * cos(x/10) - sin(x / 70);
        elseif (iSlope == 9) 
            alpha = 10 - x/100 - 3.4 * sin(x / 190);
        elseif (iSlope== 10)
            alpha = 8 - x/100 + 3 * cos(1.5 + x/210) + sin(1.5 + x / 90);
        end 
    elseif (iDataSet == 2) % Validation
        if (iSlope == 1) 
            alpha = 3 + x/250 + 1.2 * cos(x/200) + 0.6 * sin(x / 100);
        elseif (iSlope == 2) 
            alpha = 4 + x/300 - 0.5 * cos(x/150) + 1.5 * sin(x / 90);
        elseif (iSlope == 3) 
            alpha = 1 - x/180 + 0.7 * cos(x/80) - sin(x / 70);
        elseif (iSlope == 4) 
            alpha = 5 + x/400 - 1.3 * cos(x/60) - 0.9 * sin(x / 100);
        elseif (iSlope == 5) 
            alpha = 7 - x/210 + 2.0 * cos(x/120) - 1.8 * sin(x / 90);
        end
    elseif (iDataSet == 3) % Test
        if (iSlope == 1) 
            alpha = 2 + x/500 + 1.8 * cos(x/300) - 0.9 * sin(x / 150);
        elseif (iSlope == 2) 
            alpha = 6 - x/240 + 1.0 * cos(x/100) + 0.5 * sin(x / 200);
        elseif (iSlope == 3) 
            alpha = 2 + x/160 - 1.5 * cos(x/80) - 1.2 * sin(x / 90);
        elseif (iSlope == 4) 
            alpha = 4 + x/350 + 2.0 * cos(x/120) - 1.0 * sin(x / 110);
        elseif (iSlope == 5) 
            alpha = 7 - x/140 + 2.5 * cos(x/50) - 2.0 * sin(x / 150);
        end
    end
end
