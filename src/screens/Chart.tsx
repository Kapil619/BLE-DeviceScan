import HeatMap from '@ncuhomeclub/react-native-heatmap';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
} from 'react-native-gifted-charts';
import Header from '../components/Header';

const Chart = () => {
  const data = [
    12, 423, 42, 0, 0, 0, 0, 23, 0, 3, 0, 0, 0, 34, 35, 34, 23, 23, 35, 34, 10,
    2, 4, 6, 2, 5, 15, 0,
  ];
  const data2 = [{value: 50}, {value: 80}, {value: 90}, {value: 70}];

  return (
    <>
      <Header title="Charts/Graphs" />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}>
        {/* Bar Chart */}
        <BarChart isAnimated data={data2} />
        <ChartDivider title="Bar Chart" />

        {/* Line Chart */}
        <LineChart isAnimated data={data2} />
        <ChartDivider title="Line Chart" />

        {/* Pie Chart */}
        <PieChart isAnimated data={data2} />
        <ChartDivider title="Pie Chart" />

        {/* Radar Chart */}
        <RadarChart isAnimated data={[50, 80, 90, 70]} />
        <ChartDivider title="Radar Chart" />

        {/* Heat Map */}
        <HeatMap
          xLabels={['1', '2', '3', '4']}
          yLabels={['1', '2', '3', '4']}
          shape="circle"
          direction="horizontal"
          data={data}
          yNumber={5}
        />
        <ChartDivider title="Heat Map" />
      </ScrollView>
    </>
  );
};

const ChartDivider = ({title}: {title: string}) => (
  <View style={styles.dividerContainer}>
    <View style={styles.divider} />
    <Text style={styles.dividerText}>{title}</Text>
    <View style={styles.divider} />
  </View>
);

export default Chart;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    rowGap: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});
