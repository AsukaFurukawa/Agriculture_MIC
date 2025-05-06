import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../Card';
import { colors } from '../../theme/colors';

interface WeatherChartProps {
  data: {
    temperatures: number[];
    humidity: number[];
    labels: string[];
  };
  title: string;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ data, title }) => {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    temperature: data.temperatures[index],
    humidity: data.humidity[index],
  }));

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis
              dataKey="name"
              stroke={colors.text.secondary}
              tick={{ fill: colors.text.secondary }}
            />
            <YAxis
              yAxisId="left"
              stroke={colors.primary}
              tick={{ fill: colors.text.secondary }}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: colors.text.secondary }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={colors.info}
              tick={{ fill: colors.text.secondary }}
              label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight', fill: colors.text.secondary }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: 8,
              }}
              labelStyle={{ color: colors.text.primary }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: 20,
              }}
            />
            <LineChart
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              stroke={colors.primary}
              strokeWidth={2}
              dot={{ fill: colors.primary }}
              name="तापमान"
            />
            <LineChart
              yAxisId="right"
              type="monotone"
              dataKey="humidity"
              stroke={colors.info}
              strokeWidth={2}
              dot={{ fill: colors.info }}
              name="नमी"
            />
          </LineChart>
        </ResponsiveContainer>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  chartContainer: {
    height: 300,
    paddingRight: 16,
  },
}); 