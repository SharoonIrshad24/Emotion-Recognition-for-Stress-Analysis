import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, View, Text, Alert, Dimensions, ActivityIndicator,FlatList,TouchableOpacity, ScrollView, DrawerLayoutAndroid } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { Table, Rows } from 'react-native-table-component';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryLabel, VictoryAxis } from 'victory-native';
import Slider from '@react-native-community/slider';
import BaseURL from "./BaseURL";
import { releaseSecureAccess } from "react-native-document-picker";

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





export default function ResultTask({ navigation, route }) {
  
    const { id } = route.params || {}

    console.log(" Doctor ki Id  : ", id )
    const { patientId } = route.params || {};
    console.log("Patient Id: " ,patientId)
    

    //For Sessions
    const [sessionData, setSessionData] = useState([]); 
    const [loadingSessions, setLoadingSessions] = useState(true);


    //For Experiment
    const [exp,setExp]=useState([])
  

    //For Second Result
    const [EEGPath2,setEEGPath2]=useState('')
    const [result2,setResult2]=useState('')

    console.log("EEG Path of Second File : " , EEGPath2)
    console.log("Result of Second File : " , result2)

    const fileName2 = EEGPath2?.split('/').pop().split('\\').pop().replace(/^\[|\]$/g, '');
    console.log("File Name:", fileName2);

    const res2 = result2.slice(1, -1).split(',').map(s => s.trim());
    console.log("Processed Result:", res2);

    const tableData2 = res2.map(item => [item]);
    const uniqueValues2 = [...new Set(res2)];
    console.log("Unique Values2 :", uniqueValues2);


    const len=sessionData.length-1
    console.log("Length of All Sessions : " ,  len)

    const [lastSessionId,setLastSessionId]=useState('')
    console.log("Last Session Id hai ye : " ,lastSessionId)
    

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// for 1st Data

    const drawer = useRef(null);
//   const {  EEGPath, Result, SessionID, appId } = route.params || {};

//   console.log("Patient ID:", patientId);
//   console.log("EEG Path:", EEGPath);
//   console.log("Result:", Result);
//   console.log("Session ID:", SessionID);
//   console.log("ID:", id);
//   console.log("Appointment ID:", appId);

const [EEGPath,setEEGPath]=useState('')
const [result,setResult]=useState('')

console.log("EEG Path for 1st graph: " , EEGPath)
console.log("Result : 1st graph" , result)

const fileName = EEGPath?.split('/').pop().split('\\').pop().replace(/^\[|\]$/g, '');

  console.log("File Name:", fileName);


  //Convert Result string to array
  const res = result.slice(1, -1).split(',').map(s => s.trim());
  console.log("Processed Result:", res);

  const tableData = res.map(item => [item]);
  const uniqueValues = [...new Set(res)];
  console.log("Unique Values:", uniqueValues);

 // const tableData=["Relax","Happy","Happy","Happy","Happy","Happy","Happy","Happy","Relax","Relax"]

  const [name, setName] = useState('');
  const [eegData, setEegData] = useState(null);
  const [eegdata2, setEEGData2]= useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderValues, setSliderValues] = useState({});
  const { width } = Dimensions.get('window');






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







 
    // const getPatientById = async () => {
    //   try {
    //     const response = await fetch(`${BaseURL}getPatientById/${patientId}`, { method: "GET", headers: { "Content-Type": "application/json" } });
    //     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    //     const result = await response.json();
    //     setName(result.name);
    //   } catch (error) {
    //     console.error("Error fetching patient data:", error);
    //     Alert.alert("Error", "Failed to fetch patient data");
    //   }
    // };


    useEffect(() => {
        // const getPatientById = async () => {
        //   try {
        //     const response = await fetch(`${BaseURL}getPatientById/${patientId}`, { method: "GET", headers: { "Content-Type": "application/json" } });
        //     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        //     const result = await response.json();
        //     setName(result.name);
        //   } catch (error) {
        //     console.error("Error fetching patient data:", error);
        //     Alert.alert("Error", "Failed to fetch patient data");
        //   }
        // };
    
        const fetchEEGData1 = async () => {
          try {
            const response = await fetch(`${BaseURL}eeg_bands_file/${fileName}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            console.log("EEG Data : ", result)
           // console.log("EEG Data : ", result)
            const normalizedData = normalizeEEGData1(result);
            if (validateEEGData1(normalizedData)) {
              setEEGData2(normalizedData);
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
         
          fetchEEGData1();
        } else {
          Alert.alert("Error", "Patient ID is missing.");
        }
      }, [fileName]);
    
    
          const normalizeEEGData1 = (data) => {
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
    
          
      const validateEEGData1 = (data) => {
        if (!data || typeof data !== 'object') return false;
        return expectedChannels.some((channel) => signals.some((signal) => Array.isArray(data[channel]?.[signal])));
      };
    
      const toXYData1 = (arr, sliderValue) => {
        if (!Array.isArray(arr)) return [];
        const startIndex = Math.floor(sliderValue * arr.length);
        const endIndex = Math.min(startIndex + MAX_POINTS, arr.length);
        return arr.slice(startIndex, endIndex).map((value, index) => ({
          x: (startIndex + index) / 256 * 3,
          y: typeof value === 'number' && !isNaN(value) ? value : 0,
        }));
      };
    
      
      const updateSliderValue1 = (channel, signal, value) => {
        setSliderValues(prevValues => ({
          ...prevValues,
          [`${channel}-${signal}`]: value,
        }));
      };
    
      
      const renderGraph1 = ({ item: { channel, signal } }) => {
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
                  onSlidingComplete={(value) => updateSliderValue1(channel, signal, value)}
                />
                <Text>Time: {Math.round(sliderValue * 100)}%</Text>
              </View>
            </View>
          );
        };







///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//get Sessions



  //////////////////////////////////////////////////////////////////////////////////
  // Get Sessions

  



useEffect(()=>
    {

        const fetchSessions = async (retryCount = 2) => {
            try {
              console.log("Fetching sessions with id:", id, "and patientId:", patientId);
              const apiUrl = `${BaseURL}GetSessions/${id}/${patientId}`;
              console.log("API URL:", apiUrl);
        
              const sessionResponse = await fetch(apiUrl);
              console.log("Response status:", sessionResponse.status);


        
              if (!sessionResponse.ok) {
                console.error("API responded with an error:", sessionResponse.status);
                return;
              }
        
              const sessionResult = await sessionResponse.json();
              console.log("Raw Session API Response:", sessionResult);

             
        
              if (Array.isArray(sessionResult) && sessionResult.length > 0) {
                setSessionData([...sessionResult]); // ✅ Ensure React state updates properly
                console.log("Session data updated:", sessionResult);


                

               
                // const val=sessionData[len].sessionid
                // console.log("Last Last Last Session Id : " ,val)
                
                //setLastSession(sessionResult.length)
              } else {
                console.warn("Unexpected API response format or empty result:", sessionResult);
                if (retryCount > 0) {
                  console.log(`Retrying session fetch... Attempts left: ${retryCount}`);
                  setTimeout(() => fetchSessions(retryCount - 1), 2000); // 🔄 Retry after 2 seconds
                } else {
                  setSessionData([]); // 🔄 Ensure empty sessions are handled properly
                }
              }
            } catch (error) {
              console.error("Session fetch error:", error);
            } finally {
              setLoadingSessions(false);
            }
          };
        
          fetchSessions(); // Call function to fetch sessions
    },[id,patientId])


    console.log("Sessions Dataaaaaaaa : " , sessionData)
    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//For Experiment

const getExperiments=async(sessionId)=>{

         try {
                const response = await fetch(`${BaseURL}GetExperiments/${sessionId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    redirect: "follow",
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const result = await response.json();
                console.log("Experiment Data:", result);
               
               // Validate session data structure
      const validData = Array.isArray(result) 
      ? result.filter(item => item?.EEGPath && item?.Result && item?.SessionID && item?.id)
      : [];



    setExp(validData.map(item => ({
      EEGPath: item.EEGPath,
      Result: item.Result,
      SessionID:item.SessionID,
      id:item.id,
    })));
        console.log("All Experiments : ",exp)

         // Set upper graphs to the first experiment (latest) of the session
    if (validData.length > 0) {
      const firstExperiment = validData[0]; // Adjust index if order differs
      setEEGPath(firstExperiment.EEGPath);
      setResult(firstExperiment.Result);

      console.log("EEG Path of First Experiment : " , EEGPath)
      console.log("Result of First Experiment : " , result)

    }

    } catch (error) {
        console.error("Error fetching Experiment data:", error);
    }
    }


//
  useEffect(() => {
    // const getPatientById = async () => {
    //   try {
    //     const response = await fetch(`${BaseURL}getPatientById/${patientId}`, { method: "GET", headers: { "Content-Type": "application/json" } });
    //     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    //     const result = await response.json();
    //     setName(result.name);
    //   } catch (error) {
    //     console.error("Error fetching patient data:", error);
    //     Alert.alert("Error", "Failed to fetch patient data");
    //   }
    // };

    const fetchEEGData = async () => {
      try {
        const response = await fetch(`${BaseURL}eeg_bands_file/${fileName2}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
       // console.log("EEG Data : ", result)
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
     
      fetchEEGData();
    } else {
      Alert.alert("Error", "Patient ID is missing.");
    }
  }, [fileName2]);


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

        <Text style={{fontSize:20, color:"#7C0909",marginTop:10}}>Sessions</Text>
       
      



<View style={styles.appPatient}>

{/* Scrollable Patient Data */}
<View style={styles.scrollableContainer}>

  <ScrollView contentContainerStyle={styles.scrollContainer}>
    

  <View style={styles.appoinments}>

              {console.log("Session Data in UI:", sessionData)}
              
              {loadingSessions ? (
  <ActivityIndicator size="large" color="#7C0909" />
) : sessionData.length === 0 ? (
  <Text style={styles.noSessionsText}>No sessions available</Text>
) : (
  sessionData.map((item, index) => (

    
    
    <TouchableOpacity key={index} style={styles.appoin}>
      {console.log("Rendering Session:", item)}
      {console.log(" Picking Date : " , item.dates)}
      {console.log(" Session Id : " , item.sessionid)}
      {console.log("Last Index Data of Session : " ,sessionData[len])}
      {console.log("Last Session Id : ",sessionData[len].sessionid)}
      
    
      
      
      <Button
        style={styles.sessionButton}
        

       // onPress={()=>getExperiments(item.sessionid,sessionData[len].sessionid)}
        // setLastSessionId(sessionData[len].sessionid)
        onPress={async () => {
            getExperiments(item.sessionid);
            setLastSessionId(sessionData[len].sessionid);
            getExperimentsfinal(sessionData[len].sessionid)
          }}
               
      >

        {console.log("Check Seesion Id : ",item.appId)}

        <Text>Session {index + 1} {item.dates}</Text>
      </Button>
    </TouchableOpacity>
  ))
)}
            </View>

  </ScrollView>
</View>
</View>



<View style={styles.appPatient}>

<Text  style={{fontSize:20, color:"#7C0909",marginTop:1}}>Experiments</Text>
<View style={styles.scrollableContainer}>

  <ScrollView contentContainerStyle={styles.scrollContainer}>
    
{exp.length === 0 ? (
           <Text style={{ color: 'black', textAlign: 'center', marginTop: 20 }}>
               No experiments available
           </Text>
               
        ) : (
               exp.map((experiment, index) => (


                <TouchableOpacity key={index} style={styles.appoin}
                
                
                
                //abhi ye wala On tha
                onPress={()=>{
                   setEEGPath2(experiment.EEGPath)
                   //fetchEEGData(experiment.EEGPath),
                    setResult2(experiment.Result)

                 // fetchEEGData
                   
                    
                    // {console.log("Fetching Graph Data")}
                    // fetchEEGData
                    // Result:experiment.Result,
                    // SessionID:experiment.SessionID,
                    // id:experiment.id,
                    // patientId,
                    // appId
                }
                    
                }

                

               
                // onPress={()=>navigation.navigate('FusionResult',{
                //     EEGPath:experiment.EEGPath,
                //     Result:experiment.Result,
                //     SessionID:experiment.SessionID,
                //     id:experiment.id,
                //     patientId,
                //     appId
                // })}
                
                >
                      
                     
                    <Text style={{color:"white",textAlign:"center",paddingTop:5,fontSize:17,fontWeight:"bold",marginLeft:10}}>Experiment {index +1}</Text> 
               
                    {console.log("Experiment Details : ",experiment)}
                    {console.log("Last Experiment : " , index)}
                    {console.log("Last Experiment : " , experiment["EEGPath"])}
                    
                  
                    {/* {setEEGPath2(experiment["EEGPath"])} */}
                 
                </TouchableOpacity>
                

            ))
            
            
           )}
   

  </ScrollView>
</View>
</View>


        {/* <Text style={styles.patientName}>{name}</Text> */}
        <Text style={styles.emotion}>Emotions</Text>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Rows data={tableData} textStyle={styles.text} />
        </Table>


            <FlatList data={expectedChannels.flatMap(channel => signals.map(signal => ({ channel, signal })))} keyExtractor={(item) => `${item.channel}-${item.signal}`} renderItem={renderGraph} />


 <Text style={styles.emotion}>Emotions</Text>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Rows data={tableData} textStyle={styles.text} />
        </Table>


            <FlatList data={expectedChannels.flatMap(channel => signals.map(signal => ({ channel, signal })))} keyExtractor={(item) => `${item.channel}-${item.signal}`} renderItem={renderGraph1} />



      


        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Rows data={tableData2} textStyle={styles.text} />
        </Table>


 <FlatList data={expectedChannels.flatMap(channel => signals.map(signal => ({ channel, signal })))} keyExtractor={(item) => `${item.channel}-${item.signal}`} renderItem={renderGraph} />




      
           <Button style={{ alignSelf:"center",marginTop: -20,height:50,width:200,borderRadius:50, backgroundColor:"#7C0909" }} onPress={() => navigation.navigate('Prescription',{patientId,appId})}>
             <Text style={styles.addPrescription}>Add Prescription</Text>
           </Button>


           </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // back: { backgroundColor: '#FDF4F4' },
  // header: { fontSize: 20, fontWeight: 'bold', padding: 15 },
  // patientName: { fontSize: 22, fontWeight: 'bold', padding: 15 },
  // emotion: { fontSize: 25, fontWeight: 'bold', textAlign: "center", padding: 30 },
  // chartContainer: { marginBottom: 30, alignItems: 'center' },
  // channelTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  // text: { margin: 10, textAlign: 'center', fontSize: 15 },


  sessions:{
        height:200,
        width:200,
        backgroundColor:"white"

  },

  scrollableContainer: {
    flex: 1, // Allows this container to grow and take remaining space
    marginVertical: 10, // Adds spacing around the scrollable area
     backgroundColor:"white",
     width:300,
     height:420,
     marginLeft:10
  },

  scrollContainer: {
    paddingBottom: 3000, // Ensure some padding at the bottom
    paddingVertical: 10,
    
  },
  appPatient: {
    flex: 1,
    backgroundColor: "#FDF4F4", // Background color for the entire screen
    padding: 10,
    
  },
  appoinments:{
    height:230,
    width:250,
    marginTop:40,
    marginLeft:20,
    alignSelf:'center',
    backgroundColor:'transparent'
},
appoin:{
    height:30,
    width:250,
    marginTop:15,
    alignSelf:"center",
    backgroundColor:'#F9E0E0'
},

sessionButton: { backgroundColor: "#F9E0E0", marginVertical: 5, height:60,
    marginTop:10
 }
,



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
