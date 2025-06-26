# BLE React Native App

This repository contains a React Native application for scanning, connecting, and interacting with Bluetooth Low Energy (BLE) devices. It also features a chart/graph screen for dummy data visualization..

## Features

- **Scan for BLE Devices:** Discover nearby BLE peripherals and display them in a list.
- **Connect/Disconnect:** Connect to and disconnect from BLE devices.
- **Read/Write Data:** Read from and write string data to BLE device characteristics.
- **Device Details:** View detailed information about connected peripherals, including services and characteristics.
- **Charts & Graphs:** Visualize data using various chart types with [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts) and [Victory Native](https://formidable.com/open-source/victory/docs/native/).
- **Modern UI:** Clean, scrollable, and responsive interface with colorful buttons and floating actions.


## Packages & Libraries Used

- [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager) – BLE scanning, connection, and data transfer
- [react-native-svg](https://github.com/software-mansion/react-native-svg) – SVG support for charts
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) – Animation support (required by some chart libraries)
- [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts) – Bar, Line, Pie, and Radar charts
- [victory-native](https://formidable.com/open-source/victory/docs/native/) – Additional charting (VictoryChart, VictoryLine, etc.)
- [react-navigation](https://reactnavigation.org/) – Navigation between screens
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) – Icons for UI


## Usage

- **Scan for Devices:** Tap the "Scan Bluetooth" button to discover nearby BLE devices.
- **Connect:** Tap a device in the list to connect. Connected devices are highlighted.
- **Peripheral Details:** Tap a connected device to view its services and characteristics.
- **Read/Write:** Can read & write to interact with characteristics (Partially Implemented).
- **Charts:** Tap the floating ⓘ button to view sample charts and heatmaps.


## Note
- **Classic Bluetooth devices (e.g., most earphones) are not supported for data transfer.** Only BLE peripherals with readable/writable characteristics can be used for read/write demonstrations.
- **Permissions:** BLE scanning requires location and Bluetooth permissions. Make sure to grant them when prompted.

## Screenshots

> _Add screenshots of the device list, peripheral details, and charts here._

