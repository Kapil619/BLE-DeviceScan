import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const dummyData = [
  {x: 'Mon', y: 'Morning', value: 2},
  {x: 'Mon', y: 'Evening', value: 6},
  {x: 'Tue', y: 'Morning', value: 3},
  {x: 'Tue', y: 'Evening', value: 7},
  {x: 'Wed', y: 'Morning', value: 1},
  {x: 'Wed', y: 'Evening', value: 4},
];

export default function Chart({navigation}: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Heatmap Chart</Text>

      {/* Simple Grid as a Heatmap */}
      <View style={styles.grid}>
        {dummyData.map((item, index) => (
          <View
            key={index}
            style={[
              styles.cell,
              {backgroundColor: `rgba(255, 0, 0, ${item.value / 10})`},
            ]}>
            <Text style={styles.cellText}>
              {item.x} {item.y}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BLE')}>
        <Text style={styles.buttonText}>Go to BLE Screen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 20, alignItems: 'center'},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},
  cell: {
    width: 100,
    height: 60,
    margin: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {color: '#fff', fontWeight: 'bold', textAlign: 'center'},
  button: {
    marginTop: 40,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
});
