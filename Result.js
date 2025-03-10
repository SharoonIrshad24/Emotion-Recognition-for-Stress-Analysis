// import React, { useState, useEffect, useRef } from "react";
// import { SafeAreaView, StyleSheet, View, Text, Alert, Dimensions, FlatList, ScrollView, DrawerLayoutAndroid } from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Modal, Portal, Button, IconButton } from 'react-native-paper';
// import { Table, Rows, Row } from 'react-native-table-component';
// import { VictoryChart, VictoryLine, VictoryTheme, VictoryAnimation, VictoryLabel, VictoryAxis } from 'victory-native';
// import Slider from '@react-native-community/slider';
// import BaseURL from "./BaseURL";

// const signalColors = {
//   theta: '#c43a31', // Red
//   delta: '#007bff', // Blue
//   alpha: '#28a745', // Green
//   beta: '#ff7f00',  // Orange
// };

// const expectedChannels = ['TP9', 'TP10', 'AF7', 'AF8'];
// const signals = ['theta', 'delta', 'alpha', 'beta'];
// const MAX_POINTS = 256; // Points per second (256Hz)

// export default function Result({ navigation, route }) {

//   const drawer = useRef(null);
  
//   const { patientId } = route.params || {};


//   const {EEGPath} = route.params || {};
//   const {Result} = route.params || {};
//   const {SessionID} = route.params || {};
//   const {id} = route.params || {};

//   const { appId } = route.params;



//   console.log("Patient Id : ",patientId)
//   console.log("EEG Path : ", EEGPath)
//   console.log("result : ", Result)
//   console.log("Session ID : ", SessionID)
//   console.log(" ID : ", id)
//   console.log(" Appointment Id : ", appId)

//   const fileName = EEGPath.split('/').pop().split('\\').pop(); 

//   console.log(fileName); // Output: "Bilal.csv"


//   // Clean and convert to array
// const res = Result
// .slice(1, -1)    // Remove square brackets
// .split(',')      // Split into array
// .map(s => s.trim()); // Remove any whitespace

// console.log(res);


// const tableData = [
//   // ['Stress', 'Happy', 'Sad'], // Header row
//   ...res.map(item => [item]) // Add your actual values for Happy/Sad
// ];

// //const tableHead = ['True Label', 'EEG Emotion', 'Facial Emotion'];
// // Output: ["Stress 1", "Stress 1", "Stress 1", "Stress 1", "Stress 1", "Stress 1", "Stress 1", "Stress 1", "Stress 1"]

// // If you want unique values
// const uniqueValues = [...new Set(res)];
// console.log(uniqueValues);
// // Output: ["Stress 1"]



//   const [name, setName] = useState('');
//   const [eegData, setEegData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sliderValues, setSliderValues] = useState({}); // Store slider values for each graph
//   const { width } = Dimensions.get('window');



//   useEffect(() => {
//     const getPatientById = async () => {
//       const myHeaders = new Headers({
//         "Content-Type": "application/json",
//       });
    
//       const requestOptions = {
//         method: "GET",
//         headers: myHeaders,
//         redirect: "follow",
//       };
    
//       try {
//         const response = await fetch(`${BaseURL}getPatientById/${patientId}`, requestOptions); // ✅ FIXED: Moved requestOptions outside the template literal
    
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
    
//         const result = await response.json();
//         setName(result.name); // ✅ Updates name asynchronously
//       } catch (error) {
//         console.error("Error fetching patient data:", error);
//         Alert.alert("Error", "Failed to fetch patient data");
//       }
//     };

//     const fetchEEGData = () => {
//       fetch(`${BaseURL}eeg_bands_file/${fileName}`)
//         .then((response) => {
//           if (!response.ok) {
//             //throw new Error(HTTP error! status: ${response.status});
//           }
//           return response.json();
//         })
//         .then((result) => {
//           const normalizedData = normalizeEEGData(result);
//           if (validateEEGData(normalizedData)) {
//             setEegData(normalizedData);
//           } else {
//             setError(new Error('Invalid EEG Data format'));
//           }
//           setLoading(false);
//         })
//         .catch((fetchError) => {
//           setError(fetchError);
//           setLoading(false);
//         });
//     };

//     if (patientId) {
//       getPatientById();
//       fetchEEGData();
//     } else {
//       console.error("Patient ID is not provided");
//       Alert.alert("Error", "Patient ID is missing.");
//     }
//   }, [patientId]);

//   const normalizeEEGData = (data) => {
//     const normalized = {};
//     for (const [channel, signalsData] of Object.entries(data)) {
//       normalized[channel] = {};
//       for (const [signal, values] of Object.entries(signalsData)) {
//         normalized[channel][signal.toLowerCase()] = Array.isArray(values) ? values : [];
//       }
//       signals.forEach((signal) => {
//         if (!normalized[channel][signal]) {
//           normalized[channel][signal] = [];
//         }
//       });
//     }
//     return normalized;
//   };

//   const validateEEGData = (data) => {
//     if (!data || typeof data !== 'object') return false;
//     const isValidChannel = (channelData) =>
//       signals.some((signal) => Array.isArray(channelData[signal]));
//     return expectedChannels.some((channel) => isValidChannel(data[channel]));
//   };

//   // Convert to XY data for plotting
//   const toXYData = (arr, sliderValue) => {
//     if (!Array.isArray(arr)) return [];
//     const startIndex = Math.floor(sliderValue * arr.length);
//     const slicedData = arr.slice(startIndex, startIndex + MAX_POINTS);
//     return slicedData.map((value, index) => ({
//       x: index / 256, // Time in seconds
//       y: typeof value === 'number' && !isNaN(value) ? value : 0,
//     }));
//   };

//   // Update slider value for a specific graph
//   const updateSliderValue = (channel, signal, value) => {
//     setSliderValues((prevValues) => ({
//       ...prevValues,
//       [`${channel}-${signal}`]: value,  // ✅ Fixed: Corrected template literals
//     }));
//   };

//   // Render graph with VictoryChart
//   const renderGraph = ({ item: { channel, signal } }) => {
//   const sliderValue = sliderValues[`${channel}-${signal}`] || 0;  // ✅ Fixed: Corrected template literals
//   const data = toXYData(eegData[channel]?.[signal] || [], sliderValue);
//   const hasData = data.length > 0;
    
  
//   return (
//       <View style={styles.chartContainer}>
//        <Text style={styles.channelTitle}>
//   {`${channel} - ${signal.charAt(0).toUpperCase() + signal.slice(1)} Band`}
// </Text>
//         <VictoryChart theme={VictoryTheme.material} height={300} width={width - 20}>
//           <VictoryAxis
//             label="Time (s)"
//             style={{
//               axisLabel: { padding: 40 },
//             }}
//           />
//           <VictoryAxis
//             dependentAxis
//             label="Frequency (Hz)"
//             style={{
//               axisLabel: { padding: 40 },
//             }}
//           />
//           {hasData ? (
//             <VictoryAnimation
//               duration={1000}
//               data={{ data }}
//             >
//               {({ data }) => (
//                 <VictoryLine
//                   data={data}
//                   interpolation="linear"
//                   style={{ data: { stroke: signalColors[signal] } }}
//                 />
//               )}
//             </VictoryAnimation>
//           ) : (
//             <VictoryLabel
//               text="No Data Available"
//               x={(width - 20) / 2 - 60}
//               y={150}
//               style={{ fontSize: 16, fill: 'gray' }}
//             />
//           )}
//         </VictoryChart>
        
//         {/* Slider for adjusting data points */}
//         <View style={styles.sliderContainer}>
//           <Text>Adjust Data Range</Text>
//           <Slider
//             style={styles.slider}
//             minimumValue={0}
//             maximumValue={1}
//             step={0.01}
//             value={sliderValue}
//             onValueChange={(value) => updateSliderValue(channel, signal, value)}
//           />
//           <Text>Time: {sliderValue * 100}%</Text>
//         </View>
//       </View>
//     );
//   };

 

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.loadingText}>Loading EEG Data...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>Error fetching EEG data: {error.message}</Text>
//       </View>
//     );
//   }

//   const graphData = [];
//   expectedChannels.forEach((channel) => {
//     signals.forEach((signal) => {
//       graphData.push({ channel, signal });
//     });
//   });

//   // Logout function
//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem('userToken');
//       navigation.replace('LoginEEG');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to log out. Please try again.');
//     }
//   };

//   // Drawer content
//   const navigationView = () => (
//     <View style={styles.drawerContainer}>
//       <Button onPress={handleLogout}>
//         <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white', paddingTop: 80 }}>Logout</Text>
//       </Button>
//     </View>
//   );

//   return (
//     <DrawerLayoutAndroid
//       ref={drawer}
//       drawerWidth={300}
//       drawerPosition="right"
//       renderNavigationView={navigationView}
//     >
//       <SafeAreaView style={styles.back}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <View style={styles.view1}>
//             <Text style={styles.header}>Results</Text>
//           </View>
//           <Text style={styles.patientName}> {name}</Text>
//           <Text style={styles.emotion}>Emotions</Text>

//           <View style={styles.graphContainer}>
//             <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              
//               <Rows data={tableData} textStyle={styles.text} />
//             </Table>
//           </View>

//           <FlatList
//   data={graphData}
//   keyExtractor={(item) => `${item.channel}-${item.signal}`} // ✅ Fixed: Corrected template literals
//   renderItem={renderGraph}
// />


//           <Button style={{ marginTop: -17 }} onPress={() => navigation.navigate('Prescription',{patientId,appId})}>
//             <Text style={styles.addPrescription}>Add Prescription</Text>
//           </Button>
//         </ScrollView>
//       </SafeAreaView>
//     </DrawerLayoutAndroid>
//   );
// }

// const styles = StyleSheet.create({
//   back: {
//     backgroundColor: '#FDF4F4',
//   },
//   view1: {
//     backgroundColor: "#7C0909",
//     height: 60,
//     flexDirection: 'row',
//   },
//   header: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//     paddingLeft: 15,
//     paddingTop: 15,
//   },
//   patientName: {
//     color: '#7C0909',
//     fontSize: 22,
//     fontWeight: 'bold',
//     paddingLeft: 15,
//     paddingTop: 30,
//   },
//   emotion: {
//     color: '#7C0909',
//     fontSize: 25,
//     fontWeight:"bold",
//     fontWeight: 'bold',
//     textAlign:"center",
//     paddingTop: 30,
//   },
//   graphContainer: {
//     backgroundColor: "transparent",
//     height: 150,
//     width: 350,
//     marginTop: 30,
//     marginBottom:275,
//     alignSelf: 'center',
//   },
//   chartContainer: {
//     marginBottom: 30,
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     padding: 10,
//     borderRadius: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   channelTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color:'#7C0909'
//   },
//   addPrescription: {
//     color: '#7C0909',
//     fontSize: 18,
//     fontWeight: 'bold',
//     paddingLeft: 170,
//     paddingTop: 30,
//   },
//   text: {
//     margin: 10,
//     textAlign: 'center',
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: '#7C0909',
//   },
//   head: {
//     height: 100,
//     backgroundColor: '#f1f8ff',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#333',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   scrollContainer: { paddingBottom: 70 },




//   drawerContainer: {
//     flex: 1,
//     backgroundColor:'#7C0909',
//     padding: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   drawerText: {
//     fontSize: 20,
//     color:'white',
//     marginLeft:-10
  
//   },

//   iconText:{
//     flexDirection:'row',
//     width:160,
//     height:60,
//     marginRight:120,
//     marginTop:-180,
//     backgroundColor:'transparent'

//   },

//   drBtn:{
//     width:230,
//     height:50,
//     backgroundColor:'transparent',
//     marginTop:12,
//     marginRight:5

//   },


//   iconText2:{
//     flexDirection:'row',
//     width:280,
//     height:60,
//     marginLeft:0,
//     marginTop:10,
//     backgroundColor:'transparent'

//   },
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  chalta hua graph >>>>>

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


// if 3 seconds 256 * 3
// if 3 seconds 256 * 10





export default function Result({ navigation, route }) {
  const drawer = useRef(null);
  const { patientId, EEGPath, Result, SessionID, id, appId } = route.params || {};

  console.log("Patient ID:", patientId);
  console.log("EEG Path:", EEGPath);
  console.log("Result:", Result);
  console.log("Session ID:", SessionID);
  console.log("ID:", id);
  console.log("Appointment ID:", appId);

  const fileName = EEGPath?.split('/').pop().split('\\').pop().replace(/^\[|\]$/g, '');

  console.log("File Name:", fileName);

  // Convert Result string to array
  const res = Result.slice(1, -1).split(',').map(s => s.trim());
  console.log("Processed Result:", res);

  const tableData = res.map(item => [item]);
  const uniqueValues = [...new Set(res)];
  console.log("Unique Values:", uniqueValues);

 // const tableData=["Relax","Happy","Happy","Happy","Happy","Happy","Happy","Happy","Relax","Relax"]

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
      x: (startIndex + index) / 256 * 3,
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
      return null; // ✅ Prevents rendering if data is missing
    }
  
    const sliderValue = sliderValues[`${channel}-${signal}`] || 0;
    const data = toXYData(eegData[channel][signal] || [], sliderValue);
    const hasData = data.length > 0;


  return (
    <View style={styles.chartContainer}>
      <Text style={styles.channelTitle}>{`${channel} - ${signal.charAt(0).toUpperCase() + signal.slice(1)} Band`}</Text>
     
      <VictoryChart theme={VictoryTheme.material} height={300} width={width - 20}>

        
        <VictoryAxis label="Time (s)" style={{ axisLabel: { padding: 10 } }} />
        
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
        <Text style={styles.emotion}>Emotions</Text>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Rows data={tableData} textStyle={styles.text} />
        </Table>


            <FlatList data={expectedChannels.flatMap(channel => signals.map(signal => ({ channel, signal })))} keyExtractor={(item) => `${item.channel}-${item.signal}`} renderItem={renderGraph} />


      
      </ScrollView>

      
           <Button style={{ alignSelf:"center",marginTop: -70,height:50,width:200,borderRadius:50, backgroundColor:"#7C0909" }} onPress={() => navigation.navigate('Prescription',{patientId,appId})}>
             <Text style={styles.addPrescription}>Add Prescription</Text>
           </Button>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 
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



///////////////////////////////////////////////////////
// associating buttons with slider




// import React, { useState, useEffect, useRef } from "react";
// import { SafeAreaView, StyleSheet, View, Text, Alert, Dimensions, FlatList, ScrollView,TouchableOpacity, DrawerLayoutAndroid } from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Button } from 'react-native-paper';
// import { Table, Rows } from 'react-native-table-component';
// import { VictoryChart, VictoryLine, VictoryTheme, VictoryLabel, VictoryAxis } from 'victory-native';
// import Slider from '@react-native-community/slider';
// import BaseURL from "./BaseURL";

// const signalColors = {
//   theta: 'yellow',  
//   delta: 'blue',
//   alpha: 'orange',
//   beta: 'red',  
// };

// const expectedChannels = ['TP9', 'TP10', 'AF7', 'AF8'];
// const signals = ['theta', 'delta', 'alpha', 'beta'];
// const MAX_POINTS = 256; // 256Hz (points per second)


// // if 3 seconds 256 * 3
// // if 3 seconds 256 * 10





// export default function Result({ navigation, route }) {
//   const drawer = useRef(null);
//   const { patientId, EEGPath, Result, SessionID, id, appId } = route.params || {};

//   console.log("Patient ID:", patientId);
//   console.log("EEG Path:", EEGPath);
//   console.log("Result:", Result);
//   console.log("Session ID:", SessionID);
//   console.log("ID:", id);
//   console.log("Appointment ID:", appId);

//   const fileName = EEGPath?.split('/').pop().split('\\').pop().replace(/^\[|\]$/g, '');

//   console.log("File Name:", fileName);

//   // Convert Result string to array
//   const res = Result.slice(1, -1).split(',').map(s => s.trim());
//   console.log("Processed Result:", res);

//   const tableData = res.map(item => [item]);
//   const uniqueValues = [...new Set(res)];
//   console.log("Unique Values:", uniqueValues);

//  // const tableData=["Relax","Happy","Happy","Happy","Happy","Happy","Happy","Happy","Relax","Relax"]

//   const [name, setName] = useState('');
//   const [eegData, setEegData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sliderValues, setSliderValues] = useState({});
//   const { width } = Dimensions.get('window');

//   useEffect(() => {
//     const getPatientById = async () => {
//       try {
//         const response = await fetch(`${BaseURL}getPatientById/${patientId}`, { method: "GET", headers: { "Content-Type": "application/json" } });
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         const result = await response.json();
//         setName(result.name);
//       } catch (error) {
//         console.error("Error fetching patient data:", error);
//         Alert.alert("Error", "Failed to fetch patient data");
//       }
//     };

//     const fetchEEGData = async () => {
//       try {
//         const response = await fetch(`${BaseURL}eeg_bands_file/${fileName}`);
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         const result = await response.json();
//         const normalizedData = normalizeEEGData(result);
//         if (validateEEGData(normalizedData)) {
//           setEegData(normalizedData);
//         } else {
//           setError(new Error('Invalid EEG Data format'));
//         }
//       } catch (fetchError) {
//         setError(fetchError);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (patientId) {
//       getPatientById();
//       fetchEEGData();
//     } else {
//       Alert.alert("Error", "Patient ID is missing.");
//     }
//   }, [patientId]);

//   const normalizeEEGData = (data) => {
//     const normalized = {};
//     for (const [channel, signalsData] of Object.entries(data)) {
//       normalized[channel] = {};
//       for (const [signal, values] of Object.entries(signalsData)) {
//         normalized[channel][signal.toLowerCase()] = Array.isArray(values) ? values : [];
//       }
//       signals.forEach((signal) => {
//         if (!normalized[channel][signal]) {
//           normalized[channel][signal] = [];
//         }
//       });
//     }
//     return normalized;
//   };



//   const validateEEGData = (data) => {
//     if (!data || typeof data !== 'object') return false;
//     return expectedChannels.some((channel) => signals.some((signal) => Array.isArray(data[channel]?.[signal])));
//   };

//   const toXYData = (arr, sliderValue) => {
//     if (!Array.isArray(arr)) return [];
//     const startIndex = Math.floor(sliderValue * arr.length);
//     const endIndex = Math.min(startIndex + MAX_POINTS, arr.length);
//     return arr.slice(startIndex, endIndex).map((value, index) => ({
//       x: (startIndex + index) / 256 * 3,
//       y: typeof value === 'number' && !isNaN(value) ? value : 0,
//     }));
//   };

//   const updateSliderValue = (channel, signal, value) => {
//     setSliderValues(prevValues => ({
//       ...prevValues,
//       [`${channel}-${signal}`]: value,
//     }));
//   };
//   const renderGraph = ({ item: { channel, signal } }) => {
//     if (!eegData || !eegData[channel] || !eegData[channel][signal]) {
//       return null; // ✅ Prevent rendering if data is missing
//     }
  
//     const totalDuration = 60; // EEG total duration in seconds
//     const stepSize = 1 / totalDuration; // Moves by 1 second
  
//     // Ensure slider value exists
//     const sliderValue = sliderValues[`${channel}-${signal}`] ?? 0; 
  
//     // Get EEG data for current slider position
//     const data = toXYData(eegData[channel][signal] || [], sliderValue);
//     const hasData = data.length > 0;
  
//     // Emotion changes every 6 seconds
//     const emotionIndex = Math.floor(sliderValue * totalDuration / 6);
//     const emotion = String(tableData[emotionIndex]?.[0] || "Unknown"); // Get emotion from table
  
//     // Move graph left (1 second back)
//     const moveLeft = () => {
//       setSliderValues((prevValues) => ({
//         ...prevValues,
//         [`${channel}-${signal}`]: Math.max(sliderValue - stepSize, 0), // Prevent going below 0
//       }));
//     };
  
//     // Move graph right (1 second forward)
//     const moveRight = () => {
//       setSliderValues((prevValues) => ({
//         ...prevValues,
//         [`${channel}-${signal}`]: Math.min(sliderValue + stepSize, 1), // Prevent going above 1
//       }));
//     };
  
//     // ✅ Fix: Update slider state when user interacts
//     const handleSliderChange = (value) => {
//       setSliderValues((prevValues) => ({
//         ...prevValues,
//         [`${channel}-${signal}`]: value,
//       }));
//     };
  
//     return (
//       <View style={styles.chartContainer}>
//         <Text style={styles.channelTitle}>{`${channel} - ${signal.charAt(0).toUpperCase() + signal.slice(1)} Band`}</Text>
//         <Text style={styles.emotionText}>{`Emotion: ${emotion}`}</Text>
  
//         <VictoryChart theme={VictoryTheme.material} height={300} width={width - 20}>
//           <VictoryAxis label="Time (s)" style={{ axisLabel: { padding: 10 } }} />
//           <VictoryAxis dependentAxis label="Frequency (Hz)" style={{ axisLabel: { padding: 40 } }} />
//           {hasData ? (
//             <VictoryLine data={data} interpolation="linear" style={{ data: { stroke: signalColors[signal] } }} />
//           ) : (
//             <VictoryLabel text="No Data Available" x={width / 2 - 60} y={150} style={{ fontSize: 16, fill: 'gray' }} />
//           )}
//         </VictoryChart>
  
//         {/* Left & Right Buttons + Slider */}
//         <View style={styles.sliderContainer}>
//           <TouchableOpacity onPress={moveLeft} style={styles.arrowButton}>
//             <Text style={styles.arrowText}>◀</Text>
//           </TouchableOpacity>
  
//           <View style={styles.sliderWrapper}>
//             <Slider
//               style={styles.slider}
//               minimumValue={0}
//               maximumValue={1}
//               step={0.01} // ✅ Fix: Make movement smoother
//               value={sliderValue}
//               onValueChange={handleSliderChange} // ✅ Fix: Handle user input correctly
//             />
//           </View>
  
//           <TouchableOpacity onPress={moveRight} style={styles.arrowButton}>
//             <Text style={styles.arrowText}>▶</Text>
//           </TouchableOpacity>
//         </View>
  
//         <Text style={styles.timeText}>Time: {Math.round(sliderValue * totalDuration)} sec</Text>
//       </View>
//     );
//   };
  

//   return (
//     <SafeAreaView style={styles.back}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.header}>Results</Text>
//         <Text style={styles.patientName}>{name}</Text>
//         <Text style={styles.emotion}>Emotions</Text>
//         <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
//           <Rows data={tableData} textStyle={styles.text} />
//         </Table>


//             <FlatList data={expectedChannels.flatMap(channel => signals.map(signal => ({ channel, signal })))} keyExtractor={(item) => `${item.channel}-${item.signal}`} renderItem={renderGraph} />


      
//       </ScrollView>

      
//            <Button style={{ alignSelf:"center",marginTop: -70,height:50,width:200,borderRadius:50, backgroundColor:"#7C0909" }} onPress={() => navigation.navigate('Prescription',{patientId,appId})}>
//              <Text style={styles.addPrescription}>Add Prescription</Text>
//            </Button>

//     </SafeAreaView>
//   );
// }
// const styles = StyleSheet.create({
//   chartContainer: {
//     marginBottom: 30,
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     padding: 10,
//     borderRadius: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     width: "95%",
//   },
//   sliderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   sliderWrapper: {
//     flex: 1, // ✅ Fix: Allows the slider to take space
//     alignItems: "center",
//   },
//   slider: {
//     width: "100%",
//     height: 40,
//   },
//   arrowButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#7C0909",
//     alignItems: "center",
//     justifyContent: "center",
//     marginHorizontal: 10,
//   },
//   arrowText: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   timeText: {
//     marginTop: 5,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });