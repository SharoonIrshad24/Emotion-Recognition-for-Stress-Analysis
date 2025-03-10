import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, View, Text, Alert, Dimensions, FlatList, ScrollView, DrawerLayoutAndroid } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { Table, Rows } from 'react-native-table-component';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryLabel, VictoryAxis } from 'victory-native';
import Slider from '@react-native-community/slider';
import BaseURL from "./BaseURL";

const signalColors = {
  theta: 'yellow',
  delta: 'blue',
  alpha: 'orange',
  beta: 'red',
};

const expectedChannels = ['TP9', 'TP10', 'AF7', 'AF8'];
const signals = ['theta', 'delta', 'alpha', 'beta'];
const MAX_POINTS = 256; // 256Hz (points per second)

export default function ResultPatient({ navigation, route }) {

  const drawer = useRef(null);
  
  
  ///dataBase Related Info
  const { patientId, EEGPath, Result, SessionID, id, appId } = route.params || {};

  console.log("Patient ID:", patientId);
  console.log("EEG Path:", EEGPath);
  console.log("Result:", Result);
  console.log("Session ID:", SessionID);
  console.log("ID:", id);
  console.log("Appointment ID:", appId);

  const fileName = EEGPath?.split('/').pop().split('\\').pop();
  console.log("File Name:", fileName);

  // Convert Result string to array
  const res = Result.slice(1, -1).split(',').map(s => s.trim());
  console.log("Processed Result:", res);

  const tableData = res.map(item => [item]);
  const uniqueValues = [...new Set(res)];
  console.log("Unique Values:", uniqueValues);

  const [name, setName] = useState('');
  const [eegData, setEegData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderValues, setSliderValues] = useState({});
  const { width } = Dimensions.get('window');

  useEffect(() => {
    const getPatientById = async () => {
      try {
        const response = await fetch(`${BaseURL}getPatientById/${patientId}`, { method: "GET", headers: { "Content-Type": "application/json" } });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        setName(result.name);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        Alert.alert("Error", "Failed to fetch patient data");
      }
    };

    const fetchEEGData = async () => {
      try {
        const response = await fetch(`${BaseURL}eeg_bands_file/${fileName}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        const normalizedData = normalizeEEGData(result);
        if (validateEEGData(normalizedData)) {
          setEegData(normalizedData);
        } else {
          setError(new Error('Invalid EEG Data format'));
        }
      } catch (fetchError) {
        setError(fetchError);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      getPatientById();
      fetchEEGData();
    } else {
      Alert.alert("Error", "Patient ID is missing.");
    }
  }, [patientId]);

  const normalizeEEGData = (data) => {
    const normalized = {};
    for (const [channel, signalsData] of Object.entries(data)) {
      normalized[channel] = {};
      for (const [signal, values] of Object.entries(signalsData)) {
        normalized[channel][signal.toLowerCase()] = Array.isArray(values) ? values : [];
      }
      signals.forEach((signal) => {
        if (!normalized[channel][signal]) {
          normalized[channel][signal] = [];
        }
      });
    }
    return normalized;
  };

  const validateEEGData = (data) => {
    if (!data || typeof data !== 'object') return false;
    return expectedChannels.some((channel) => signals.some((signal) => Array.isArray(data[channel]?.[signal])));
  };

  const toXYData = (arr, sliderValue) => {
    if (!Array.isArray(arr)) return [];
    const startIndex = Math.floor(sliderValue * arr.length);
    const endIndex = Math.min(startIndex + MAX_POINTS, arr.length);
    return arr.slice(startIndex, endIndex).map((value, index) => ({
      x: (startIndex + index) / 256,
      y: typeof value === 'number' && !isNaN(value) ? value : 0,
    }));
  };

  const updateSliderValue = (channel, signal, value) => {
    setSliderValues(prevValues => ({
      ...prevValues,
      [`${channel}-${signal}`]: value,
    }));
  };

  const renderGraph = ({ item: { channel, signal } }) => {
    if (!eegData || !eegData[channel] || !eegData[channel][signal]) {
      return null;
    }

    const sliderValue = sliderValues[`${channel}-${signal}`] || 0;
    const data = toXYData(eegData[channel][signal] || [], sliderValue);
    const hasData = data.length > 0;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.channelTitle}>{`${channel} - ${signal.charAt(0).toUpperCase() + signal.slice(1)} Band`}</Text>
        <VictoryChart theme={VictoryTheme.material} height={300} width={width - 20}>
          <VictoryAxis label="Time (s)" style={{ axisLabel: { padding: 40 } }} />
          <VictoryAxis dependentAxis label="Frequency (Hz)" style={{ axisLabel: { padding: 40 } }} />
          {hasData ? (
            <VictoryLine data={data} interpolation="linear" style={{ data: { stroke: signalColors[signal] } }} />
          ) : (
            <VictoryLabel text="No Data Available" x={width / 2 - 60} y={150} style={{ fontSize: 16, fill: 'gray' }} />
          )}
        </VictoryChart>
        <View style={styles.sliderContainer}>
          <Text>Adjust Data Range</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.05}
            value={sliderValue}
            onSlidingComplete={(value) => updateSliderValue(channel, signal, value)}
          />
          <Text>Time: {Math.round(sliderValue * 100)}%</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.back}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Results</Text>
        <Text style={styles.patientName}>{name}</Text>
        <Text style={{color:"#7C0909",fontSize:20,fontWeight:"bold",textAlign:"center"}}>Emotions</Text>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
        <FlatList data={expectedChannels.flatMap(channel => signals.map(signal => ({ channel, signal })))} keyExtractor={(item) => `${item.channel}-${item.signal}`} renderItem={renderGraph} />
      </ScrollView>
      {/* <Button style={styles.prescriptionButton} onPress={() => navigation.navigate('Prescription', { patientId, appId })}>
        <Text style={styles.addPrescription}>Add Prescription</Text>
      </Button> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // back: { backgroundColor: '#FDF4F4' },
  // header: { fontSize: 20, fontWeight: 'bold', padding: 15, backgroundColor: "#7C0909", color: "white" },
  // patientName: { fontSize: 22, fontWeight: 'bold', padding: 15, color: "#7C0909" },
  // chartContainer: { alignItems: 'center', marginBottom: 30 },
  // channelTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: "#7C0909" },
  // prescriptionButton: { alignSelf: "center", marginTop: -70, height: 50, width: 200, borderRadius: 50, backgroundColor: "#7C0909" },
  // addPrescription: { color: 'white', fontSize: 18, fontWeight: 'bold' },


  
  back: {
    backgroundColor: '#FDF4F4',
  },
  view1: {
    backgroundColor: "#7C0909",
    height: 60,
    flexDirection: 'row',
  },
  header: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingTop: 15,
    height:70,
    backgroundColor:"#7C0909"
  },
  patientName: {
    color: '#7C0909',
    fontSize: 22,
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingTop: 30,
  },
  emotion: {
    color: '#7C0909',
    fontSize: 25,
    fontWeight:"bold",
    fontWeight: 'bold',
    textAlign:"center",
    paddingTop: 30,
  },
  graphContainer: {
    backgroundColor: "transparent",
    height: 150,
    width: 350,
    marginTop: 30,
    marginBottom:275,
    alignSelf: 'center',
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  channelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#7C0909'
  },
  addPrescription: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 170,
    paddingTop: 30,
  },
  text: {
    margin: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7C0909',
  },
  head: {
    height: 100,
    backgroundColor: '#f1f8ff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContainer: { paddingBottom: 70 },




  drawerContainer: {
    flex: 1,
    backgroundColor:'#7C0909',
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  drawerText: {
    fontSize: 20,
    color:'white',
    marginLeft:-10
  
  },

  iconText:{
    flexDirection:'row',
    width:160,
    height:60,
    marginRight:120,
    marginTop:-180,
    backgroundColor:'transparent'

  },

  drBtn:{
    width:230,
    height:50,
    backgroundColor:'transparent',
    marginTop:12,
    marginRight:5

  },


  iconText2:{
    flexDirection:'row',
    width:280,
    height:60,
    marginLeft:0,
    marginTop:10,
    backgroundColor:'transparent'

  },
});

