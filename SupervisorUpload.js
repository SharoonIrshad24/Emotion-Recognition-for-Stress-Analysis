import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TextInput,
  Alert
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import Svg, { Path } from "react-native-svg";
import LinearGradient from 'react-native-linear-gradient'; // Import the gradient component
import BaseURL from "./BaseURL";


const SCREEN_WIDTH = Dimensions.get("window").width;


export default function SupervisorUpload({route}) {


  const { appid } = route.params;

  const { id } = route.params;

  const {pname} = route.params;
  console.log("Name : " ,pname)

  console.log("Appointment Id  :" , appid)

 // const { sessionId } = route.params;

  //console.log("Session Id::",sessionId)
  const [predict,setPredict]=useState('')

  let res;
  
  const [result1,setResult]=useState('')

  let EEGPath;
  
  const [loading, setLoading] = useState(false);

  const [fileName,setFileName]= useState('');

  let seId;

  const [sessionId,setSessionId]=useState('')


    ////////////////////////////////////////////////////////////////////////
          // Start Session for Add Session in DataBase
          
          const addSession = async (appId) => {
            try {
              const data = JSON.stringify({
                supervisorid: id,
                appointmentid: appId
              });
          
              console.log("Supervisor ID for Session:", id);
              console.log("Appointment ID for Session:", appId);
          
              const requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: data
              };
          
              const response = await fetch(`${BaseURL}/AddSession`, requestOptions);
          
              if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
              }
          
              const result = await response.json();
              console.log("Session Added:", result);
          
              const sessionId = result.id;  // Correctly declare sessionId
              console.log("Session ID:", sessionId);
          
              setSessionId(sessionId);  // Update state
          
              return result;  
            } catch (error) {
              console.error("Session couldn't be added:", error.message);
            }
          };
          
          useEffect(() => {
            if (appid) {  // Ensure appid exists before calling
              addSession(appid);
            }
          }, [appid]);  // Add appid as a dependency
          

          ///////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////
//Start Recording 

  const recordEEG = async () =>{

      try {

        setLoading(true)
              // Make sure to use the email (`userName`) in your API call
              const response = await fetch(`http://192.168.163.252:5001/StartSession/${fileName}`, {
                method: 'GET', // Assuming it's a GET request to fetch doctor info by email
                redirect: 'follow',
              });
      
              console.log(response)

              if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
              }

              const result = await response.text(); // Parse the JSON response
              console.log(result)

              if (response.ok) {
                Alert.alert('Success', result); // Show the plain text response in an alert
              } else {
                throw new Error(result); // Throw error if not successful
              }

               // Alert when recording is successfully completed

              Alert.alert('Success', 'Recording Completed!');

      predictEmotion()

      console.log('File Saved:', result);
    
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to complete EEG recording. Please try again.');
    } finally {
      setLoading(false); // Stop loading spinner regardless of success or error
    }
          };
        
/////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////
// Predict Emotion
const predictEmotion = async () => {
  try {
    const response = await fetch(`${BaseURL}/predictEEGEmotion/${fileName}.csv`, {
      method: 'GET',
      redirect: 'follow',
    });

    const result = await response.json();
    console.log("Predicted Emotion Data:", result);

   const formattedResult = JSON.stringify(result); // Updated here
  //   const formattedResult = '[' + result.replace(/"/g, '') + ']'; // Convert to a JSON string format
  //  //const cleanedStr = str.replace(/"/g, '');
   
   //const formattedResult = '[' + result.replace(/^"|"$/g, '') + ']'; // Remove only first & last quotes


    setResult(formattedResult);
    console.log("Formatted Result:", formattedResult);

    addExperiment(`D:/Project APIs/EEG/${fileName}.csv`, formattedResult, sessionId);

  } catch (error) {
    console.log("Prediction Failed:", error);
  }
};

////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
//Add Experiment to DataBase
const addExperiment = async (EEGPath, result, sessionid) => {
  try {
    const data = JSON.stringify({
      EEGPath: EEGPath, // Already passed as full path
      result: JSON.stringify(result), // Make sure it’s in the right format
      sessionid: sessionid
    });

    console.log("Sending Data:", data); // Debugging

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data
    };

    const response = await fetch(`${BaseURL}/AddExperiment`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result0 = await response.json();
    console.log("Experiment Added:", result0);

    return result0; // Return the parsed result
  } catch (error) {
    console.error("Experiment couldn't be added:", error.message);
  }
};


///////////////////////////////////////////////////////////////////////////////////////

  // Animated value for wave motion
  const waveOffset1 = useRef(new Animated.Value(0)).current;
  const waveOffset2 = useRef(new Animated.Value(0)).current;
  const waveOffset3 = useRef(new Animated.Value(0)).current;
  const waveOffset4 = useRef(new Animated.Value(0)).current;
  const waveOffset5 = useRef(new Animated.Value(0)).current;
  const waveOffset6 = useRef(new Animated.Value(0)).current;
  const waveOffset7 = useRef(new Animated.Value(0)).current;

  // Start the wave animations
  useEffect(() => {
    const animateWave = (animatedValue) => {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1, // Moves the wave offset
          duration: 4000, // Duration for one full cycle
          useNativeDriver: true,
        })
      ).start();
    };

    // Animate two waves for a layered effect
    animateWave(waveOffset1);
    animateWave(waveOffset2);
    animateWave(waveOffset3);
    animateWave(waveOffset4);
    
  }, []);

  // Interpolate wave motion to shift the wave horizontally
  const translateX1 = waveOffset1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH], // Moves from 0 to -SCREEN_WIDTH
  });

  const translateX2 = waveOffset2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH], // Moves from 0 to -SCREEN_WIDTH
  });

  const translateX3 = waveOffset3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH], // Moves from 0 to -SCREEN_WIDTH
  });

  const translateX4 = waveOffset4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH], // Moves from 0 to -SCREEN_WIDTH
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#5B4B8A', '#9B1D43']} // Gradient colors
        style={styles.backgroundGradient}
      />
      
      {/* Wave Container */}
      <View style={styles.waveContainer}>
        {/* First Wave */}
        <Animated.View
          style={[
            styles.animatedWave,
            {
              transform: [{ translateX: translateX1 }],
            },
          ]}
        >
          <Svg
            width={SCREEN_WIDTH * 2} // Extended width for smooth looping
            height={150}
            viewBox={`0 0 ${SCREEN_WIDTH * 2} 150`}
          >
            <Path
              d={`M 0 75 Q 50 40, 100 75 T 200 75 T 300 75 T 400 75 T 500 75 T 600 75 T 700 75 T 800 75`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth={5}
            />
          </Svg>
        </Animated.View>

        {/* Second Wave */}
        <Animated.View
          style={[
            styles.animatedWave,
            {
              transform: [{ translateX: translateX2 }],
              top: 20, // Offset vertically for variation
            },
          ]}
        >
          <Svg
            width={SCREEN_WIDTH * 2}
            height={150}
            viewBox={`0 0 ${SCREEN_WIDTH * 2} 150`}
          >
            <Path
              d={`M 0 75 Q 50 60, 100 75 T 200 75 T 300 75 T 400 75 T 500 75 T 600 75 T 700 75 T 800 75`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth={5}
            />
          </Svg>
        </Animated.View>

{/* third wave */}
        <Animated.View
          style={[
            styles.animatedWave,
            {
              transform: [{ translateX: translateX3}],
              top: 60, // Offset vertically for variation
            },
          ]}
        >
          <Svg
            width={SCREEN_WIDTH * 2}
            height={150}
            viewBox={`0 0 ${SCREEN_WIDTH * 2} 150`}
          >
            <Path
              d={`M 0 75 Q 50 60, 100 75 T 200 75 T 295 110 T 400 75 T 500 75 T 600 75 T 700 75 T 800 75`}
              fill="none"
              stroke="rgba(253, 250, 250, 0.4)"
              strokeWidth={5}
            />
          </Svg>
        </Animated.View>



{/* Fourth wave */}
<Animated.View
          style={[
            styles.animatedWave,
            {
              transform: [{ translateX: translateX3}],
              top: 50, // Offset vertically for variation
            },
          ]}
        >
          <Svg
            width={SCREEN_WIDTH * 2}
            height={150}
            viewBox={`0 0 ${SCREEN_WIDTH * 2} 140`}
          >
            <Path
              d={`M 0 75 Q 50 60, 100 75 T 200 75 T 300 85 T 400 75 T 500 75 T 600 75 T 700 75 T 800 75`}
              fill="none"
              stroke="rgba(240, 223, 223, 0.4)"
              strokeWidth={5}
            />
          </Svg>
        </Animated.View>



      </View>

      {/* Foreground Content */}
      <View style={styles.foreground}>

      <Text style={styles.subtitle}> {pname} </Text>

      <Text></Text>

      <TextInput
            placeholder="Enter File Name"
            placeholderTextColor="white"
            style={{color:"white",fontSize:20,backgroundColor:"#F08080",borderRadius:15,width:300,textAlign:"center"}}
            onChangeText={a => setFileName(a)}
      ></TextInput>

      <Text></Text>


      <View style={styles.view2}>

      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (

      <Button style={{height:70,backgroundColor:'transparent',marginTop:20,paddingTop:20}}
      onPress={recordEEG}
              
      >
      
        <Text style={{fontSize:22,color:'white',textShadowColor: "rgba(0, 0, 0, 0.5)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3,}}>Start EEG Session
        </Text>
      
      </Button>
)}
                 
             </View>
                 
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject, // Covers the whole screen
  },
  waveContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    overflow: "hidden",
  },
  animatedWave: {
    position: "absolute",
    width: SCREEN_WIDTH * 2,
    height: 150,
  },
  foreground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 120,
  },
  
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    paddingTop:10
  },
  subtitle: {
    width:250,
    textAlign:"center",
    fontSize: 25,
    color: "white",
    marginTop: 30,
    fontStyle: "italic",
  },
});
