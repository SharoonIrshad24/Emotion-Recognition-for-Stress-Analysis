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
import { Dropdown } from 'react-native-element-dropdown';
import { PermissionsAndroid, Platform } from "react-native";
import DocumentPicker from 'react-native-document-picker';
import BaseURL from "./BaseURL";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SupervisorUpload2({navigation,route}){


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


  // Request external write permission
async function requestExternalWritePermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission to upload files.',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        Alert.alert('Permission Error', err.message);
      }
      return false;
    } else {
      return true; // On iOS, no need for this permission
    }
  }
  
  // Function to handle file upload after permission is granted
  async function handleFileUpload() {
    const hasPermission = await requestExternalWritePermission();
    if (hasPermission) {
      try {
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles], // All file types
        });
        console.log('File selected:', result);
        Alert.alert('File Selected', result.name);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User canceled the picker');
        } else {
          console.log('Unknown error:', err);
        }
      }
    } else {
      Alert.alert('Permission Denied', 'Storage write permission is required to upload files.');
    }
  }


  
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

  

    return(<SafeAreaView>



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

       <View style={styles.data}>

            <View style={styles.selectPat}>
                <Text style={{color:"#7C0909",fontSize:22,fontWeight:'bold'}}>Patient </Text>

            <Dropdown
                style={styles.dropdown}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder='Select Subject'
                data={data}
                value={subject}
                onChange={item => setSlots(item.value)} // Set the onChange handler
             />
            
            </View>

           
            </View>

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

  

    </SafeAreaView>)
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
