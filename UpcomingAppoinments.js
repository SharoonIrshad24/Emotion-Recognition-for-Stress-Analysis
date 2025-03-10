import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, StyleSheet, View, Alert, Image, DrawerLayoutAndroid ,ActivityIndicator} from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Text } from "react-native-paper";
import { ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseURL from "./BaseURL";


export default function UpcomingAppoinments({ navigation, route }) {

    const { id } = route.params || {}; // Destructure safely to avoid undefined error

    console.log("Doctor ki Id : " , id)

    const [patients, setPatients] = useState([]);

    patients.map((patient, index) => {
        console.log(`Patient ${index}:`, patient); // Check full object
        console.log("Patient ID:", patient.id);
        console.log("Appointment ID:", patient.appid); // Debug this
    })


    const [imgPath,setImage]=useState('')

    const drawer = useRef(null); // Ref for controlling the drawer

    //Id of Patient
    const [pid,setPid]=useState([])


    const[time,setTime]=useState([]);

    const [loading, setLoading] = useState(true); // Add Loading state



    useEffect(() => {
      const fetchPatientData = async () => {
          setLoading(true);
          try {
              const response = await fetch(`${BaseURL}getNewPatient/${id}`);
              if (!response.ok) throw new Error(`Error fetching patients: ${response.statusText}`);

              const result = await response.json();
              console.log("Patients:", result);
              
              if (Array.isArray(result)) {
                  setPatients(result);
                  fetchAppointmentDates(result);
              }
          } catch (error) {
              console.error(error);
          } finally {
              setLoading(false);
          }
      };

      if (id) fetchPatientData();
  }, [id]);


    const fetchAppointmentDates = async (patientsList) => {
    try {
        const dates = await Promise.all(
            patientsList.map(async (patient) => {
                try {
                    const response = await fetch(`${BaseURL}getNewPatientAppointmentDate/${id}/${patient.id}`);
                    if (!response.ok) return [{ pid: patient.id, date: "Unavailable" }];

                    const data = await response.json();
                    console.log(`Fetched Date for ${patient.id}:`, data.date || data.dates);

                    return data.dates && Array.isArray(data.dates)
                        ? data.dates.map((date) => ({ pid: patient.id, date }))
                        : [{ pid: patient.id, date: data.date || "Unavailable" }];
                } catch (error) {
                    console.error(`Error fetching date for ${patient.id}:`, error);
                    return [{ pid: patient.id, date: "Unavailable" }];
                }
            })
        );

        setTime(dates.flat());
    } catch (error) {
        console.error("Error fetching appointment dates:", error);
    } finally {
        setLoading(false); // Ensure loading is set to false after fetching
    }
};

// Fetch data when component mounts or patientsList updates
useEffect(() => {
    if (patients.length > 0) {
        fetchAppointmentDates(patients);
    } else {
        setLoading(false);
    }
}, [patients]);


//     useEffect(() => {
//         const fetchPatientData = async () => {
//           setLoading(true);

//             const myHeaders = new Headers({
//                 "Content-Type": "application/json",
//             });

//             const requestOptions = {
//                 method: "GET",
//                 headers: myHeaders,
//                 redirect: "follow",
//             };

//             try {
//                 const response = await fetch(`${BaseURL}/getNewPatient/${id}`, requestOptions);

//                 if (!response.ok) {
//                     throw new Error(`Fetching patient data: ${response.statusText}`);
//                 }

//                 const result = await response.json();
//                 // Check if result is an array and set it directly to patients state
//                 console.log("All Patients : ", result)

//             if (result && Array.isArray(result)) {
//                 setPatients(result); // Store the entire array of patients with their image paths

//                 const pids=result.map(patient => patient.id);
//                 console.log(pids)
//                 setPid(pids)
                
                
               

//             } else {
//                 console.log("Fetched data is not an array:", result);
//             }

//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };

//         if (id) {
//             fetchPatientData();
//         } else {
//             console.error("ID is undefined. Cannot fetch patient data.");
//         }
//     }, [id]);
      
// ///////////////////////////////////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////////////////////

// //Getting Appointment Date

// // useEffect(() => {
// //     const getDateOfAppointment = async () => {
// //       if (!Array.isArray(patients) || patients.length === 0) return;
  
// //       try {
// //         const dates = await Promise.all(
// //           patients.map(async (patient) => {
// //             try {
// //               const response = await fetch(
// //                 `${BaseURL}/getNewPatientAppointmentDate/${id}/${patient.id}`
// //               );
  
// //               if (!response.ok) {
// //                 console.error(
// //                   `Error fetching date for Patient ID ${patient.id}: HTTP ${response.status}`
// //                 );
// //                 return { pid: patient.id, date: "Unavailable" };
// //               }
  
// //               const data = await response.json();
  
// //               console.log("Fetched Date:", patient.id, data.date);
  
// //               // If the API returns multiple dates, preserve all of them
// //               return data.dates?.map((date) => ({ pid: patient.id, date })) || [
// //                 { pid: patient.id, date: "Unavailable" },
// //               ];
// //             } catch (error) {
// //               console.error(`Error fetching date for Patient ID ${patient.id}:`, error);
// //               return [{ pid: patient.id, date: "Unavailable" }];
// //             }
// //           })
// //         );
  
// //         // Flatten the nested array structure into a single array
// //         const flattenedDates = dates.flat();
  
// //         setTime(flattenedDates); // Update the state with all records
// //         console.log("All Dates Saved:", flattenedDates);
// //       } catch (error) {
// //         console.error("Unexpected error fetching appointment dates:", error);
// //       }
// //     };
  
// //     getDateOfAppointment();
// //   }, [patients]);


// useEffect(() => {
//     const getDateOfAppointment = async () => {
//       if (!Array.isArray(patients) || patients.length === 0) return;
  
//       try {
//         const dates = await Promise.all(
//           patients.map(async (patient) => {
//             try {
//               const response = await fetch(
//                 `${BaseURL}/getNewPatientAppointmentDate/${id}/${patient.id}`
//               );
  
//               if (!response.ok) {
//                 console.error(
//                   `Error fetching date for Patient ID ${patient.id}: HTTP ${response.status}`
//                 );
//                 return [{ pid: patient.id, date: "Unavailable" }];
//               }
  
//               const data = await response.json();
  
//               console.log("Fetched Date:", patient.id, data.date || data.dates);
  
//               // Handle both `data.date` (single date) and `data.dates` (array of dates)
//               if (data.dates && Array.isArray(data.dates)) {
//                 return data.dates.map((date) => ({ pid: patient.id, date }));
//               }
  
//               if (data.date) {
//                 return [{ pid: patient.id, date: data.date }];
//               }
  
//               // Fallback if no valid date is present
//               return [{ pid: patient.id, date: "Unavailable" }];
//             } catch (error) {
//               console.error(`Error fetching date for Patient ID ${patient.id}:`, error);
//               return [{ pid: patient.id, date: "Unavailable" }];
//             }
//           })
//         );
  
//         // Flatten the nested array structure into a single array
//         const flattenedDates = dates.flat();
  
//         setTime(flattenedDates); // Update the state with all records
//         console.log("All Dates Saved:", flattenedDates);
//       } catch (error) {
//         console.error("Unexpected error fetching appointment dates:", error);
//       }
//     };
  
//     getDateOfAppointment();
//   }, [patients]);
  
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
    
    
            <View style={styles.iconText}>
            
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
            
            </View>
            
    
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
    
    
            <View style={styles.iconText2}>
            
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
            
            </View>
    
    
            <Text style={{color:'white',marginTop:40}}>__________________________</Text>
    
            <Button onPress={handleLogout}>
              <Text style={{ fontSize: 25,fontWeight:'bold',color:'white',paddingTop:60}}>Logout</Text>
            </Button>
    
        
        </View>
      
    );




    return (

        <DrawerLayoutAndroid
              ref={drawer}
              drawerWidth={300} // Size of the drawer
              drawerPosition="right"
              renderNavigationView={navigationView}
              
            >

            
        <SafeAreaView style={styles.back}>
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollContainer}>
                
                <View style={styles.view1}>
                    {/* <IconButton
                        icon="arrow-left"
                        size={28}
                        iconColor="white"
                        style={{ marginLeft: 0 }}
                    /> */}
                
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 22, marginTop: 14, marginLeft:20 }}>Appointments</Text>
                
                    <IconButton icon="bell" size={28} iconColor="white" style={{ marginLeft: 110 }} />
                
                    <IconButton icon="menu" size={30} iconColor="white" style={{ marginLeft: 0 }}  onPress={() => drawer.current.openDrawer()} />
                
                </View>

                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, marginTop: 14, marginLeft: 10, textAlign:"center" }}>Appointments</Text>

                {loading ? (
    <ActivityIndicator size="large" color="#7C0909" style={{ marginTop: 20 }} />
) : patients.length === 0 ? (
    <Text style={{ color: 'black', textAlign: 'center', marginTop: 20 }}>No appointments available</Text>
) : (
                    patients.map((patient, index) => (
                        <View key={index} style={styles.patientDetail}>
                            
                            <View style={styles.image}>
                            <Image
                                source={{ uri:`${BaseURL}/image/${patient.imgpath}`}} // Replace with your image URL
                                style={styles.image1}
                                resizeMode="center" // Optional: adjust how the image scales
                            />
                            </View>
                            
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, paddingTop: 40, paddingLeft: 10 }}>
                                {patient.name || "Name of Patient"}
                            </Text>
                           
                            <View style={styles.scheduledDate}>
                                <Text style ={{paddingTop:7,paddingLeft:5, fontSize:13,textAlign:'center'}}>  Meeting on  </Text>
                                <Text style={{textAlign:'center',fontWeight:'bold'}}>{time.find((t) => t.pid === patient.id)?.date || "No Appointment"}</Text>
                            </View>
                           
                            <Button style={styles.detail} onPress={() => navigation.navigate('PatientDetails', { patientId: patient.id , AppointmentId: patient.appid , id:id})}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, paddingTop: 5 }}>View Details</Text>
                            </Button>
                        </View>
                    
                  ))
                )}
                
            </ScrollView>
        </SafeAreaView>

        </DrawerLayoutAndroid>
    );
}

const styles = StyleSheet.create({


    back: {
        backgroundColor: '#FDF4F4'
    },
    view1: {
        height: 65,
        width: 385,
        backgroundColor: "#7C0909",
        flexDirection: 'row'
    },
    patientDetail: {
        height: 180,
        width: 340,
        marginTop: 40,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        flexDirection: 'row',
        elevation:13
    },
    image1: {
        width: 90,
        height: 85,
        borderRadius: 30,
        
      },
    image: {
        width: 110,
        height: 130,
        backgroundColor: 'transparent',
        borderRadius: 20,
        top:15,
        left:10
        
    },
    scheduledDate: {
        width: 140,
        height: 50,
        position:'absolute',
        top:120,
        left:30,
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black'
    },
    detail: {
        width: 150,
        height: 50,
        position:'absolute',
        top:120,
        left:180,
        backgroundColor: '#7C0909',
        borderRadius: 15,
    },
    scrollContainer: {
        paddingBottom: 20, // Add padding as needed
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
});
