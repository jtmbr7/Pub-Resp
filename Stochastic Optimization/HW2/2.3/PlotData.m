function PlotData(plotData)

    iSlopes = size(plotData, 1) - 1;
    iDataSet = plotData{iSlopes + 1};

    for iSlope = 1:iSlopes
        data = plotData{iSlope};
        distance = data(:,1);
        slope = data(:,2);
        AMtq = data(:,3);
        gear = data(:,4);
        velocity = data(:,5);
        FBtemp = data(:,6);
        y = data(:,7);
        
        figure;
        
        % Plot Slope vs Distance
        subplot(6,1,1);
        plot(distance, slope, 'k');
        ylabel('Slope (rad)');
        title('Slope, Speed, Gear, Torque, and Brake Temp vs Distance');
        grid on;
        
        % Plot Torque (AMtq) vs Distance
        subplot(6,1,2);
        plot(distance, AMtq, 'k');
        ylabel('Brake Pedal Pressure (N)');
        grid on;
        
        % Plot Gear vs Distance
        subplot(6,1,3);
        plot(distance, gear, 'k');
        ylabel('Gear');
        grid on;
        
        % Plot Velocity vs Distance
        subplot(6,1,4);
        plot(distance, velocity, 'k');
        ylabel('Speed (m/s)');
        grid on;
        
        % Plot Brake Temperature (FBtemp) vs Distance
        subplot(6,1,5);
        plot(distance, FBtemp, 'k');
        ylabel('Brake Temperature (K)');
        grid on;
        
        % Plot Elevation vs Distance
        subplot(6,1,6);
        plot(distance, y, 'k');
        ylabel('Elevation (m)');
        xlabel('Distance (m)');
        grid on;
        
        % Adjust the layout and use correct title formatting
        sgtitle(sprintf('Vehicle System Dynamics vs Distance DataSet=%d,Slope=%d', iDataSet, iSlope)); % Use sprintf for string formatting
    end
end