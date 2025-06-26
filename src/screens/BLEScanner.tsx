import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableHighlight,
  View,
} from 'react-native';
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
  PeripheralInfo,
} from 'react-native-ble-manager';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RootStackParamList} from '../../App';
import {handleAndroidPermissions} from '../utils/utils';

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

declare module 'react-native-ble-manager' {
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}
type BLEScannerNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'BLEScanner'
>;

const ScanDevicesScreen = () => {
  const navigation = useNavigation<BLEScannerNavProp>();

  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );

  const startScan = () => {
    if (!isScanning) {
      setPeripherals(new Map());
      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan started');
          })
          .catch((err: any) => {
            console.error('[startScan] scan error', err);
          });
      } catch (error) {
        console.error('[startScan] error thrown', error);
      }
    }
  };

  const enableBluetooth = async () => {
    try {
      console.debug('[enableBluetooth]');
      await BleManager.enableBluetooth();
      ToastAndroid.show('Bluetooth enabled', ToastAndroid.SHORT);
    } catch (error) {
      console.error('[enableBluetooth] thrown', error);
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    ToastAndroid.show('Scan stopped', ToastAndroid.SHORT);
    console.debug('[handleStopScan] scan stopped');
  };

  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
    setPeripherals(map => {
      let p = map.get(event.peripheral);
      if (p) {
        p.connected = false;
        return new Map(map.set(event.peripheral, p));
      }
      return map;
    });
  };

  const handleConnectPeripheral = (event: any) => {
    ToastAndroid.show(
      `[handleConnectPeripheral][${event.peripheral}] connected.`,
      ToastAndroid.SHORT,
    );
    console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
  };

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    console.debug('[handleDiscoverPeripheral] discovered:', peripheral);
    ToastAndroid.show(
      `Discovered peripheral (${peripheral.id})`,
      ToastAndroid.SHORT,
    );
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    setPeripherals(map => new Map(map.set(peripheral.id, peripheral)));
  };

  const togglePeripheralConnection = async (peripheral: Peripheral) => {
    if (peripheral && peripheral.connected) {
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${peripheral.id}] error disconnecting`,
          error,
        );
      }
    } else {
      await connectPeripheral(peripheral);
    }
  };

  const retrieveServices = async () => {
    const infos: PeripheralInfo[] = [];
    for (const [id, peripheral] of peripherals) {
      if (peripheral.connected) {
        const info = await BleManager.retrieveServices(id);
        infos.push(info);
      }
    }
    return infos;
  };

  const readCharacteristics = async () => {
    const services = await retrieveServices();
    for (const info of services) {
      info.characteristics?.forEach(async c => {
        try {
          const value = await BleManager.read(
            info.id,
            c.service,
            c.characteristic,
          );
          console.log(
            '[readCharacteristics]',
            info.id,
            c.service,
            c.characteristic,
            value,
          );
        } catch (error) {
          console.error('[readCharacteristics] error', error);
        }
      });
    }
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      if (peripheral) {
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = true;
            return new Map(map.set(peripheral.id, p));
          }
          return map;
        });

        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected`);

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = false;
            p.connected = true;
            return new Map(map.set(peripheral.id, p));
          }
          return map;
        });

        await sleep(900);

        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] RSSI: ${rssi}`);

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.rssi = rssi;
            return new Map(map.set(peripheral.id, p));
          }
          return map;
        });

        navigation.navigate('PeripheralDetailsScreen', {peripheralData});
      }
    } catch (error) {
      console.error(`[connectPeripheral][${peripheral.id}] error`, error);
    }
  };

  function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    BleManager.start({showAlert: false})
      .then(() => console.debug('BleManager started.'))
      .catch(error => console.error('BleManager start error:', error));

    const listeners = [
      BleManager.onDiscoverPeripheral(handleDiscoverPeripheral),
      BleManager.onStopScan(handleStopScan),
      BleManager.onConnectPeripheral(handleConnectPeripheral),
      BleManager.onDisconnectPeripheral(handleDisconnectedPeripheral),
    ];

    handleAndroidPermissions();
    return () => {
      listeners.forEach(listener => listener.remove());
    };
  }, []);

  const renderItem = ({item}: {item: Peripheral}) => {
    const backgroundColor = item.connected ? '#e8f5e9' : Colors.white;
    return (
      <>
        <Text style={styles.headingText}>Devices List:</Text>
        <TouchableHighlight
          underlayColor="#ccc"
          onPress={() => togglePeripheralConnection(item)}>
          <View style={[styles.row, {backgroundColor}]}>
            <Text style={styles.peripheralName}>
              {item.name} - {item?.advertising?.localName}
              {item.connecting && ' - Connecting...'}
            </Text>
            <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
            <Text style={styles.peripheralId}>{item.id}</Text>
          </View>
        </TouchableHighlight>
      </>
    );
  };

  return (
    <>
      <StatusBar />
      <View style={styles.buttonGroup}>
        <Pressable style={styles.scanButton} onPress={startScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
          </Text>
        </Pressable>

        <Pressable style={styles.scanButton} onPress={readCharacteristics}>
          <Text style={styles.scanButtonText}>Read Characteristics</Text>
        </Pressable>

        {Platform.OS === 'android' && (
          <Pressable style={styles.scanButton} onPress={enableBluetooth}>
            <Text style={styles.scanButtonText}>Enable Bluetooth</Text>
          </Pressable>
        )}
      </View>

      {/* Floating Heatmap Button */}
      <Pressable
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Chart')}>
        <Ionicons name="information-circle-outline" size={28} color="#fff" />
      </Pressable>

      {Array.from(peripherals.values()).length === 0 && (
        <View style={styles.row}>
          <Text style={styles.noPeripherals}>
            No Peripherals, press "Scan Bluetooth" above.
          </Text>
        </View>
      )}

      <FlatList
        data={Array.from(peripherals.values())}
        contentContainerStyle={{rowGap: 12, marginTop: 30}}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </>
  );
};

const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: '50%',
  },
  scanButton: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50', // Colorful green
    borderRadius: 12,
    padding: 10,
    height: 50,
    ...boxShadow,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  body: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    marginTop: 30,
  },
  headingText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    color: '#333',
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    color: '#555',
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
    color: '#777',
  },
  row: {
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    ...boxShadow,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: '#555',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF5722', // Bright orange
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    ...boxShadow,
  },
});

export default ScanDevicesScreen;
