import React, { useRef, useEffect, useState } from "react";
import { DrawerLayoutAndroid, SafeAreaView, StyleSheet, View,FlatList } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { IconButton } from "react-native-paper";
import { ScrollView,ActivityIndicator,Image ,Alert} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseURL from "./BaseURL";

export default function DoctorDashboard({navigation,route}) {

    const [name,setName]=useState('')
    const [imgPath,setImage]=useState('')

    const drawer = useRef(null); // Ref for controlling the drawer
    
    const { userName } = route.params;

    const [userData, setUserData] = useState(null);
    const [doctorData, setDoctorData] = useState(null);


    //For Patients
    const [id,setId]= useState('')//ye Doctor ki id hai
    console.log("Doctor ki Id : ", id)
    const [patients, setPatients] = useState([]);
    const [imgPathP,setImagePath]=useState([])
    const [nameP,setNameP] = useState('')
    const [date,setDate]=useState('')
    const [time,setTime]=useState('')


    //Patient ki Id
    const [pid,setPid]=useState([])

    // ye time slot k liye
    const [slot,setSlot]=useState([])

    const [loading,setLoading]=useState(null)


    const hasImage = imgPath !== ''; // Check if imgPath is not empty
   
    ///////////////////////////////////////////////////////////////////
    // // get doctor by email
  
    useEffect(() => {
      // Function to fetch the doctor info after login using the email from route.params
      const fetchDoctorInfo = async () => {
        try {
          // Make sure to use the email (`userName`) in your API call
          const response = await fetch(`${BaseURL}getDoctorByEmail/${userName}`, {
            method: 'GET', // Assuming it's a GET request to fetch doctor info by email
            redirect: 'follow',
          });
  
          if (!response.ok) {
            throw new Error(`Error fetching doctor data: ${response.statusText}`);
          }
  
          const result = await response.json(); // Parse the JSON response
          console.log('Doctor data:', result);

          const { name } = result;
          const {imgpath} =result;
          console.log(name)
          setName(name)


      
          console.log(imgpath)
          setImage(imgpath)


          const {id}=result
          console.log(id)
          setId(id)


  
          setDoctorData(result); // Set the fetched doctor data
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false); // Stop loading spinner
        }
      };
  
      fetchDoctorInfo(); // Call the function when the component mounts
    }, [userName]); // Run the effect when `userName` changes
  
   
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////////////////////
    //Appointments
    // Fetch patients when `id` changes
useEffect(() => {
  const fetchPatientData = async () => {
    try {
      const response = await fetch(`${BaseURL}/getTodaysAppointments/${id}`);
      const result = await response.json();

      console.log("Fetched patients:", result);

      if (Array.isArray(result)) {
        setPatients(result); // Update patients state
      } else {
        console.warn("Patients result is not an array:", result);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  if (id) {
    fetchPatientData();
  }
}, [id]);

// Fetch time slots when `patients` is updated
useEffect(() => {
  const getTimeOfAppointment = async () => {
    try {
      if (Array.isArray(patients) && patients.length > 0) {
        const fetchWithRetry = async (url, retries = 3) => {
          for (let attempt = 1; attempt <= retries; attempt++) {
            try {
              const response = await fetch(url);
              if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
              return await response.json();
            } catch (error) {
              if (attempt === retries) throw error;
              console.warn(`Retrying... (${attempt}/${retries})`, error);
            }
          }
        };

        const timeSlots = await Promise.all(
          patients.map(async (patient) => {
            try {
              const response = await fetchWithRetry(
                `${BaseURL}/getNewPatientAppointmentDate/${id}/${patient.id}`
              );
              console.log(`Time slot for Patient ID ${patient.id}:`, response);

              // Check for valid response
              if (response.time) {
                const formattedTime = response.time.split(".")[0];
                console.log("Formatted Time:", formattedTime);
                return { pid: patient.id, timeSlot: formattedTime };
              } else {
                console.warn(`Invalid response for Patient ID ${patient.id}:`, response);
                return { pid: patient.id, timeSlot: "Unavailable" };
              }
            } catch (error) {
              console.error(`Error fetching time slot for Patient ID ${patient.id}:`, error);
              return { pid: patient.id, timeSlot: "Unavailable" }; // Fallback
            }
          })
        );

        const updatedSlots = timeSlots.reduce((acc, { pid, timeSlot }) => {
          acc[pid] = timeSlot;
          return acc;
        }, {});

        console.log("Updated slots:", updatedSlots);
        setSlot((prevSlots) => ({ ...prevSlots, ...updatedSlots }));
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  if (patients.length > 0) {
    getTimeOfAppointment();
  }
}, [patients]);

    
    
    ////////////////////////////////////////////////////////////////////////
    


    // /////////////////////////////////////////////////////////////////////////
    // // Getting Time Slot which is booked for Session

    // useEffect(() => {
    //   const getTimeOfAppointment = async () => {
    //     const myHeaders = new Headers({
    //       "Content-Type": "application/json",
    //       // Add other headers if needed
    //     });
    
    //     const requestOptions = {
    //       method: "GET",
    //       headers: myHeaders,
    //       redirect: "follow",
    //     };
    
    //     try {
    //       // Check if pid is an array and iterate over it
    //       if (Array.isArray(pid) && pid.length > 0) {
    //         // Fetch time slots for each patient (pid)
    //         const timeSlots = await Promise.all(
    //           pid.map(async (currentPid) => {
    //             const response = await fetch(
    //               `${BaseURL}/getNewPatientAppointmentDate/${id}/${currentPid}`,
    //               requestOptions
    //             );
    //             console.log(`Fetching time slot for Patient ID: ${currentPid}`);
    
    //             if (!response.ok) {
    //               throw new Error(
    //                 `Fetching Time Slot failed for ${currentPid} with status: ${response.status} - ${response.statusText || 'No status text'}`
    //               );
    //             }
    
    //             const result = await response.json();
    //             console.log("Date and Time slot for Patient:", result);
    
    //             const time_slot = result.time;
    //             const formattedTime = time_slot.split(".")[0];
    //             console.log("Formatted Time Slot: ", formattedTime);
    
    //             return { pid: currentPid, timeSlot: formattedTime };  // Return the patient ID and the time slot
    //           })
    //         );
    
    //         // Once all time slots are fetched, update the state
    //         setSlot((prevSlots) => {
    //           const updatedSlots = timeSlots.reduce((acc, { pid, timeSlot }) => {
    //             acc[pid] = timeSlot;  // Store time slot by patient ID
    //             return acc;
    //           }, {});
              
    //           return { ...prevSlots, ...updatedSlots };  // Merge with the previous state if needed
    //         });
    //       } else {
    //         console.warn("No valid patient IDs available.");
    //       }
    //     } catch (error) {
    //       // Log the error and display a user-friendly message
    //       console.error("Error fetching time slots:", error);
          
    //       // Optionally, you could set an error state here to display an error message to the user
    //       setSlot((prevSlots) => ({
    //         ...prevSlots,
    //         error: "Failed to fetch some time slots",  // Example error message
    //       }));
    //     }
    //   };
    
    //   // Only fetch if `id` and `pid` are defined and `pid` is an array with values
    //   if (id && Array.isArray(pid) && pid.length > 0) {
    //     getTimeOfAppointment();
    //   }
    // }, [id, pid]);  // Dependencies are `id` and `pid` arrays


//     useEffect(()=>{
//         const getTimeofAppointment = async () =>{

//           const myHeaders = new Headers({
//             "Content-Type": "application/json",
//             // Add other headers here if needed
//           });
      
//           const requestOptions = {
//             method: "GET",
//             headers: myHeaders,
//             redirect: "follow"
//           };
//           try {
//             const response = await fetch(`${BaseURL}/getNewPatientAppointmentDate/${id}/${pid}`, requestOptions);
//       console.log(id)
//             if (!response.ok) {
//               const errorMessage = `Fetching Time Slot failed with status: ${response.status} - ${response.statusText || 'No status text'}`;
//               throw new Error(errorMessage);
//             }
      
//             const result = await response.json();
//             console.log("Date and Time slot: ",result)
//             setSlot(result);
            
//             const time_slot = result.time
//             const formattedTime=time_slot.split(".")[0];
//             console.log(" Time Slot : " , formattedTime)
            
//             // Update the state with the time slot for the current patient (pid)
//       setSlot(prevSlots => ({
//         ...prevSlots,
//         [pid]: formattedTime,  // Store the time slot by patient ID
//       }));
           

//         } catch (error) {
//             console.error("Error fetching Slots:", error);
//           }
//         };
//  // Only fetch if `id` and `pid` are defined
//  if (id && pid) {
//   getTimeofAppointment();
// }
//     },[id, pid])

    /////////////////////////////////////////////////////////////////////////

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
        

        <View style={styles.iconText2}>
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
      {/* Main Content */}
      <SafeAreaView style={styles.back}>
        {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}


          <View style={styles.view1}></View>


    
          <View style={styles.img}>
  {imgPath ? (
    <Image
      source={{ uri: `${BaseURL}/image/${imgPath}` }}
      style={styles.image1}
      resizeMode="cover"
    />
  ) : (
    <IconButton
      icon="account"
      size={50}
      iconColor="#7C0909"
    />
  )}
</View>

          <View style={styles.menu}>
            <IconButton icon="bell" size={30} iconColor="#7C0909" style={{ marginLeft: 45 }} />

            <IconButton
              icon="menu"
              size={30}
              iconColor="#7C0909"
              style={{ marginLeft: 0 }}
              onPress={() => drawer.current.openDrawer()} // Open drawer on click
            />
          </View>

          <View>
            <Text style={styles.hello}>Hello,</Text>
            <Text style={styles.dr}>Dr. {name}</Text>
          </View>

          {/* <View style={styles.search}>
            <IconButton
              icon="magnify"
              size={25}
              iconColor="#7C0909"
              onPress={() => console.log("Search pressed")}
            />

            <TextInput
              mode="flat"
              placeholder="Search"
              underlineColor="transparent"
              style={{
                backgroundColor: "transparent",
                width: 200,
                paddingTop: -24,
              }}
            />
          </View> */}

          <Text style={styles.txtToday}>Today Appointments</Text>

        
        
        {/* gpt */}
        <View style={styles.appPatient}>

  {/* Scrollable Patient Data */}
  <View style={styles.scrollableContainer}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.viewPat}>
        {patients === null ? (
          <Text>Loading...</Text>
        ) : patients.length === 0 ? (
          <Text style={{fontSize:15}}>No appointments for today </Text>
        ) : (
          patients.map((patient) => (
            <View key={patient.id} style={styles.patData}>
              {/* Patient Image */}
              <Image
                source={{ uri: `${BaseURL}/image/${patient.imgpath}` }}
                style={styles.patImage}
                resizeMode="contain"
              />

              {/* Patient Name */}
              <Text style={styles.patientName}>{patient.name}</Text>


{/* <View style={{backgroundColor:"#7C0909", height:35,
  width:100,borderRadius:10,alignSelf:"center",marginTop:10
}}>
  <Text style={{color:"white",paddingTop:5,textAlign:"center"}}>View Details</Text>
</View> */}
              {/* Additional Patient Data */}
              <View style={styles.timeSlot}>

             
        <View key={patient.id} style={styles.timeSlot}>
          <Text style={styles.text}>
            Time : {slot[patient.id] || "Loading..."}
          </Text>
        </View>
      
              </View>
                              
            </View>
          ))
        )}
      </View>
    </ScrollView>
  </View>


</View>
        {/*  */}


        
        {/* </ScrollView> */}
      </SafeAreaView>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({


  appPatient: {
    flex: 1,
    backgroundColor: "#FDF4F4", // Background color for the entire screen
    padding: 10,
    marginTop:10
    
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  scrollableContainer: {
    flex: 1, // Allows this container to grow and take remaining space
    marginVertical: 10, // Adds spacing around the scrollable area
  },
  scrollContainer: {
    paddingVertical: 10, // Adds padding within the scroll view
  },
  viewPat: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation:5,
    marginTop:10
  },
  patData: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  patImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1, // Allows the name to take available space
  },
  patData1: {
    fontSize: 14,
    color: "#555",
  },
  footer: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },






  
  
  image1: {
    width: 85,
    height: 85,
    borderRadius: 30,
    
  },


  image: {
    width: 85,
    height: 85,
    borderRadius: 100,
    marginVertical: 10,
  },
  
  back: {
    backgroundColor: "#FDF4F4",
    flex: 1,
  },
  
  view1: {
    backgroundColor: "#7C0909",
    height: 40,
    width: 400,
  },

  img: {
    height: 85,
    width: 85,
    borderRadius: 100,
    marginTop: 10,
    marginLeft: 10,
  },

  hello: {
    position: "absolute",
    left: 105,
    top: -70,
    fontSize: 20,
    color: "#7C0909",
  },

  dr: {
    position: "absolute",
    left: 105,
    top: -35,
    fontSize: 20,
    fontWeight: "bold",
    color: "#7C0909",
  },

  menu: {
    position: "absolute",
    height: 60,
    width: 150,
    left: 234,
    top: 40,
    backgroundColor: "transparent",
    flexDirection: "row",
  },

  search: {
    width: 290,
    height: 54,
    borderRadius: 13,
    borderWidth: 1,
    elevation: 45, // For Android
    borderColor: "white",
    position: "absolute",
    top: 165,
    left: 50,
    flexDirection: "row",
  },

  txtToday: {
    position: "absolute",
    top: 180,
    left: 30,
    fontSize: 22,
    fontWeight: "bold",
    color: "#7C0909",
  },

  viewPat: {
    width: 300,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    alignSelf: "center",
    elevation:5
  },

  patData: {
    height: 180,
    width: 300,
    backgroundColor: "white",
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 15,
    elevation: 10,
    marginTop:28
  },

  patImage: {
    height: 77,
    width: 87,
    backgroundColor: "transparent",
    position: "relative",
    top: 10,
    left: 15,
    borderRadius: 50,
  },

  patData1: {
    height: 50,
    width: 300,
    backgroundColor: "#7C0909",
    position: "absolute",
    top: 130,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    color:"white",
    fontSize:16,
    paddingTop:10,
    textAlign:'center'
  },

   patientName: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 18,
    marginLeft: 20,
  },

  appPatient:{
    backgroundColor:"#FDF4F4",
    width:330,
    alignSelf:'center',
    position:'absolute',
    top:260,
    height:1000,
    elevation:30
  },
 
  scrollContainer: {
    paddingBottom: 1500, // Ensure some padding at the bottom
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
  timeSlot:{
    backgroundColor:"#7C0909",
    height:50,
    marginTop:13,
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
    elevation:5
  },

  text:{
    fontSize:15,    
    color:"white",
    paddingTop:7,
    textAlign:"center"
  }
});




