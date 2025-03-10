import React, { useState, useEffect,useRef ,useCallback} from "react";
import { SafeAreaView, StyleSheet, View,Alert,Image ,DrawerLayoutAndroid ,TouchableOpacity,ActivityIndicator } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Text } from "react-native-paper";
import { ScrollView } from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import BaseURL from "./BaseURL";



export default function PatientDetails({navigation,route}){


    const { patientId } = route.params || {};
    const { AppointmentId } = route.params || {}

    const { id } = route.params || {}; // Doctor's Id

    console.log("Doctor Id : " , id, "Patient Id : ", patientId)
    console.log("Appointment Id : " ,AppointmentId)

    const [name,setName]=useState('')
    const [gender,setGender]=useState('')
    const [age,setAge]=useState('')
    const [height,setHeight]=useState('')
    const [weight,setWeight]=useState('')
    const [contact,setContact]=useState('')
    const [imgPath,setImage]=useState('')

//For Sessions
const [sessionData, setSessionData] = useState([]); 

 const [loading, setLoading] = useState(false);

 const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [error, setError] = useState('');
 
 const drawer = useRef(null); // Ref for controlling the drawer

 ////////////////////////////////////////////////////////////
        // link mobile number with keypad
        
          const makeCall = (phoneNumber) => {
            const phoneURL = `tel:${phoneNumber}`; // Format for dialing
            Linking.openURL(phoneURL).catch((err) =>
              console.error('Failed to open dialer:', err)
            );
          };
        

        ////////////////////////////////////////////////////////////


 //////////////////////////////////////////////////////////////////////////////////////////////////
 const calculateAge = (dob) => {
    const birthDate = new Date(dob);  // Convert the dob string into a Date object
    const today = new Date();         // Get today's date
  
    let age1 = today.getFullYear() - birthDate.getFullYear();  // Calculate the year difference
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    // Adjust age if the current month/day is before the birth month/day
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age1--;
    }
  
    return age1;
  };
  

//   // Example usage with a dob string from API

 const age2 = calculateAge(age);
 console.log("Age:", age2);  // Output the calculated age

  /////////////////////////////////////////////////////////////////////////////////////////


const tableData = [
    ['Name',name],
  ['Gender', gender],
  ['Age', age2],
  ['Height', height],
  ['Weight', weight, ]
];


console.log(" id : " , id)
console.log("Patient Id : " , patientId)


useEffect(() => {
  const fetchPatientAndSessions = async () => {
    if (!patientId) {
      console.log("Missing patientId. Skipping API call.");
      return;
    }

    setLoadingPatient(true);
    setLoadingSessions(true);

    try {
      // Fetch Patient Data
      console.log("Fetching patient data for patientId:", patientId);
      const patientResponse = await fetch(`${BaseURL}getPatientById/${patientId}`);
      
      if (!patientResponse.ok) {
        throw new Error(`Failed to fetch patient: ${patientResponse.status}`);
      }

      const patientResult = await patientResponse.json();
      console.log("Patient API Response:", patientResult);

      setName(patientResult.name || "N/A");
      setGender(patientResult.gender === "M" ? "Male" : "Female");
      setAge(patientResult.dob || "N/A");
      setHeight(patientResult.height ? `${patientResult.height} cm` : "N/A");
      setWeight(patientResult.weight ? `${patientResult.weight} kg` : "N/A");
      setContact(patientResult.contact || "N/A");
      setImage(patientResult.imgPath || null);
    } catch (error) {
      console.error("Patient fetch error:", error);
      setError("Failed to load patient data");
    } finally {
      setLoadingPatient(false);
    }

    // ✅ Ensure `id` is available before fetching sessions
    if (!id) {
      console.log("Missing session id, skipping session fetch.");
      setLoadingSessions(false);
      return;
    }

    // 🔄 Retry mechanism: Refetch sessions if response is empty
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
          setSessionData(prev => [...sessionResult]); // ✅ Ensure React state updates properly
          console.log("Session data updated:", sessionResult);
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
  };

  fetchPatientAndSessions();
}, [id, patientId]); // Runs when `id` or `patientId` changes

// Debugging: Log when sessionData updates
useEffect(() => {
  console.log("Updated sessionData:", sessionData);
}, [sessionData]);




        
// useEffect(() => {
//     const fetchPatientData = async () => {
//       try {
//         setLoadingPatient(true);
//         const response = await fetch(`${BaseURL}getPatientById/${patientId}`);
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch patient: ${response.status}`);
//         }

//         const result = await response.json();
        
//         // Validate and set data with fallbacks
//         setName(result.name || 'N/A');
//         setGender(result.gender === 'M' ? 'Male' : 'Female');
//         setAge(result.dob || 'N/A');
//         setHeight(result.height ? `${result.height} cm` : 'N/A');
//         setWeight(result.weight ? `${result.weight} kg` : 'N/A');
//         setContact(result.contact || 'N/A');
//         setImage(result.imgPath || null);

//       } catch (error) {
//         console.error("Patient fetch error:", error);
//         setError('Failed to load patient data');
//       } finally {
//         setLoadingPatient(false);
//       }
//     };

    

//     if (patientId) 
//     {
//       fetchPatientData();

//     }
         
//   }, [patientId]);

 
// ////////////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////////////////////
// //Get Sessions

// useEffect(() => {
//   const getSessions = async () => {
//     if (!id || !patientId) {
//       console.log("Missing id or patientId. Skipping API call.");
//       return; // Prevent API call if parameters are missing
//     }

//     console.log("Fetching sessions with id:", id, "and patientId:", patientId);
//     setLoadingSessions(true); // Start loading indicator

//     try {
//       const apiUrl = `${BaseURL}GetSessions/${id}/${patientId}`;
//       console.log("API URL:", apiUrl);

//       const response = await fetch(apiUrl);
//       console.log("Response status:", response.status);

//       if (!response.ok) {
//         console.error("API responded with an error:", response.status);
//         return;
//       }

//       const result = await response.json();
//       console.log("Raw API Response:", result);

//       if (Array.isArray(result)) {
//         setSessionData(result);
//         console.log("Session data updated:", result);
//       } else {
//         console.warn("Unexpected API response format:", result);
//       }
//     } catch (error) {
//       console.error("Session fetch error:", error);
//     } finally {
//       setLoadingSessions(false); // Stop loading indicator
//     }
//   };

//   getSessions();
// }, [id, patientId]); // Dependency array ensures API call runs when id or patientId changes

// // Debugging: Log when sessionData updates
// useEffect(() => {
//   console.log("Updated sessionData:", sessionData);
// }, [sessionData]);

// useEffect(() => {
//   const getSessions = async () => {
//     if (!id || !patientId) return;

//     setLoadingSessions(true); // Start loading
//     try {
//       const response = await fetch(`${BaseURL}GetSessions/${id}/${patientId}`);
//       console.log("Response status:", response.status);

//       const result = await response.json();
//       console.log("API Response:", result);

//       // Ensure data is an array before setting
//       if (Array.isArray(result)) {
//         setSessionData(result);
//       } else {
//         console.error("Unexpected API format:", result);
//         setSessionData([]); // Set to empty array if unexpected format
//       }
//     } catch (error) {
//       console.error("Session fetch error:", error);
//       setSessionData([]); // Ensure UI updates even on error
//     } finally {
//       setLoadingSessions(false); // Stop loading
//     }
//   };

//   getSessions();
// }, [id, patientId]);



// const getSessions = async (id, patientId, setSessionData, setLoadingSessions, setError) => {
//   if (!id || !patientId) return;

//   setLoadingSessions(true);
//   console.log("Fetching sessions for:", id, patientId);

//   try {
//     const response = await fetch(`${BaseURL}GetSessions/${id}/${patientId}`);
    
//     console.log("Response status:", response.status);
//     if (!response.ok) throw new Error(`Session fetch failed: ${response.status}`);

//     const result = await response.json();
//     console.log("RAW API Response:", result);

//     if (!Array.isArray(result)) {
//       console.error("Unexpected API format:", result);
//       setError("Invalid session data format");
//       return;
//     }

//     // Ensure valid data
//     const validData = result.filter(item => {
//       console.log("Checking session item:", item);
//       return item?.sessionid && item?.appid;
//     });

//     console.log("Filtered Sessions:", validData);

//     setSessionData(validData.map(({ sessionid, appid }) => ({ sessionId: sessionid, appId: appid })));

//   } catch (error) {
//     console.error("Session error:", error);
//     setError("Failed to load sessions");
//   } finally {
//     setLoadingSessions(false);
//   }
// };


// useEffect(() => {
//   if (id && patientId) {
//     getSessions(id, patientId, setSessionData, setLoadingSessions, setError);
//   }

//   // TEST: Force sessionData update
//   setTimeout(() => {
//     setSessionData([{ sessionId: "test123", appId: "app456" }]);
//   }, 5000);
// }, [id, patientId]);

// const getSessions = async () => {
//     try {
//       setLoadingSessions(true);
//       if (!id || !patientId) return;
  
//       const response = await fetch(`${BaseURL}/GetSessions/${id}/${patientId}`);
//       if (!response.ok) throw new Error(`Session fetch failed: ${response.status}`);
  
//       const result = await response.json();
      
//       // Validate session data
//       const validData = Array.isArray(result) 
//         ? result.filter(item => item?.sessionid && item?.appid)
//         : [];
  
//       setSessionData(validData.map(item => ({
//         sessionId: item.sessionid,
//         appId: item.appid
//       })));

//       console.log(sessionData)
  
//     } catch (error) {
//       console.error("Session error:", error);
//       setError('Failed to load sessions');
     
//     } finally {
//       setLoadingSessions(false);
//     }
//   };
  
//   // Fetch when component mounts or IDs change
//   useEffect(() => {
//     getSessions();
//   }, [id, patientId]); // Directly track dependencies here
 
//////////////////////////////////////////////////////////////////////////////////////////



     ///////////////////////////////////////////////////////////////////////
    // Logout function to clear AsyncStorage and navigate to login screen

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            navigation.replace('LoginEEG'); // Replace to avoid going back
        } catch (error) {
            Alert.alert('Error', 'Failed to log out. Please try again.');
        }
    };
  
    //////////////////////////////////////////////////////////////////////////
   
    //////////////////////////////////////////////////////////////////////////
    
        // Drawer content
        const navigationView = () => (
          <View style={styles.drawerContainer}>
    
    
            {/* <View style={styles.iconText}>
            
            <IconButton
                  icon="account-group" // Icon for people/group
                  size={30}
                  iconColor="white"
                  // style={{marginLeft:-200,marginTop:-150}}
                  onPress={() => navigation.navigate('RegisteredPatients')}
                
            />
    
            <Button style={styles.drBtn} onPress={() => navigation.navigate('RegisteredPatients',{id})}>
                 <Text style={{ fontSize: 20,color:'white',marginLeft:-60}}>My Patients</Text>
            </Button>
            
            </View> */}
            
    
            {/* <View style={styles.iconText2}>
            <IconButton
                icon="calendar-today" // Icon for people/group
                size={30}
                iconColor="white"
                // style={{marginLeft:-200,marginTop:-150}}
                onPress={() => navigation.navigate('UpcomingAppoinments')}
            />
    
            <Button style={styles.drBtn}   onPress={() => navigation.navigate('UpcomingAppoinments',{id})}>
                 <Text style={{ fontSize: 20,color:'white',marginLeft:-60}}>Appoinments</Text>
            </Button>
            
            </View>
     */}
    
    
            {/* <View style={styles.iconText2}>
            
            <IconButton
                  icon="account-group" // Icon for people/group
                  size={30}
                  iconColor="white"
                  // style={{marginLeft:-200,marginTop:-150}}
                  onPress={() => navigation.navigate('RegisteredPatients')}
                
            />
    
            <Button style={styles.drBtn} onPress={() => navigation.navigate('SupervisorSignUp',{id})}>
                 <Text style={{ fontSize: 20,color:'white',marginLeft:-20}}>Register Supervisor</Text>
            </Button>
            
            </View> */}
    
    
            <Text style={{color:'white',marginTop:40}}>__________________________</Text>
    
            <Button onPress={handleLogout}>
              <Text style={{ fontSize: 25,fontWeight:'bold',color:'white',paddingTop:60}}>Logout</Text>
            </Button>
    
        
        </View>
      
    );
      

    
    return(
    
       <DrawerLayoutAndroid
    ref={drawer}
    drawerWidth={300}
    drawerPosition="right"
    renderNavigationView={navigationView}
  >
    <SafeAreaView style={styles.back}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.view1}>
          <IconButton
            icon="arrow-left"
            size={28}
            iconColor="white"
            style={{ marginLeft: 0 }}
          />

          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginTop: 14 }}>
            Patient Details
          </Text>

          <IconButton
            icon="bell"
            size={28}
            iconColor="white"
            style={{ marginLeft: 90 }}
          />

          <IconButton
            icon="menu"
            size={30}
            iconColor="white"
            style={{ marginLeft: 0 }}
            onPress={() => drawer.current.openDrawer()}
          />
        </View>

        {loadingPatient ? (
          <ActivityIndicator size="large" color="#7C0909" style={styles.loadingIndicator} />
        ) : (
          <>
            <View style={styles.imageNum}>
              <View style={styles.image}>
                {imgPath ? (
                  <Image
                    source={{ uri: `${BaseURL}image/${imgPath}` }} // Replace with your image URL
                    style={styles.image1}
                    resizeMode="contain" // Optional: adjust how the image scales
                  />
                ) : (
                  <IconButton
                    icon="account"
                    size={70}
                    iconColor="#7C0909"
                  />
                )}
              </View>

              <IconButton
                icon="phone"
                size={30}
                iconColor="#7C0909"
               // onPress={() => makeCall(contact)} // Replace with the desired number
                style={{ marginTop: 30, marginLeft: 30 }}
              />

              <Text style={{ color: '#7C0909', fontWeight: 'bold', fontSize: 18, paddingTop: 40, paddingLeft: 4 }}>
                {contact}
              </Text>
            </View>

            <View style={{ height: 20 }}></View>
            <Table borderStyle={styles.border}>
              <Rows data={tableData} style={styles.text} />
            </Table>

            <View style={styles.btns}>
              <Button style={styles.results} onPress={() => navigation.navigate('PrescriptionForPatient', { patientId })}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, paddingTop: 5, alignContent: 'center' }}>
                  Medicine Info
                </Text>
              </Button>



              <Button style={styles.results} onPress={() => navigation.navigate('ResultTask2', { id,patientId })}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, paddingTop: 5, alignContent: 'center' }}>
                  Result
                </Text>
              </Button>


            </View>

            <View style={styles.appoinments}>
              <Text style={{ color: '#7C0909', fontWeight: 'bold', fontSize: 20, paddingTop: 20, alignSelf: 'center' }}>
                Completed Sessions
              </Text>

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
      <Button
        style={styles.sessionButton}
        
        onPress={() =>
          navigation.navigate("Experiments", {
            session: item.sessionid,
            appId: item.appid,
            patientId,
          })
          
        }
      >
        {console.log("Check Seesion Id : ",item.appId)}
        <Text>Session {index + 1} {item.dates}</Text>
      </Button>
    </TouchableOpacity>
  ))
)}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  </DrawerLayoutAndroid>
    
    )

}

const styles=StyleSheet.create({

  sessionButton: { backgroundColor: "#F9E0E0", marginVertical: 5, height:100 }
  ,
    btns:{
        width:350,
        height:60,
        backgroundColor:'transparent',
        flexDirection:'row',
        position:'relative',
        top:15,
        left:10
    },

    back:{
        backgroundColor:'#FDF4F4'
    },


    view1:{
        height:65,
        width:385,
        backgroundColor:"#7C0909",
        flexDirection:'row'
    },

    imageNum:{
        width:350,
        height:120,
        marginTop:30,
        marginLeft:20,
        backgroundColor:'transparent',
        flexDirection:'row'
    },

    image1: {
        width: 150,
        height: 120,
        borderRadius: 30,
          
      },
    image:{
        width:130,
        height:120,
        backgroundColor:'transparent',
        position:'relative',
        borderRadius:25
    },

    text: { 
        paddingTop:5,
        paddingLeft:60,
        
    },
    
    border: {
         borderWidth: 1, 
         borderColor: 'transparent',
         
        
    },
    results:{
        width:180,
        height:50,
        backgroundColor:'#7C0909',
        marginTop:30,
        borderRadius:20,
        marginLeft:0

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
        height:50,
        width:250,
        marginTop:15,
        marginLeft:0,
        backgroundColor:'#F9E0E0'
    },
    scrollContainer: {
        paddingBottom: 2000 // Ensure some padding at the bottom
    },

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




      loaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 10
      },
      loadingText: {
        color: '#7C0909',
        fontSize: 16
      },
      noSessionsText: {
        color: 'black', 
        textAlign: 'center', 
        marginTop: 20,
        fontSize: 16
      },
      sessionButton: {
        paddingTop: 5, 
        textAlign: 'center',
        borderRadius: 10,
        backgroundColor: '#F9E0E0'
      }
})