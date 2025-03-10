import React, { useRef, useEffect, useState } from "react";
import { DrawerLayoutAndroid, SafeAreaView, StyleSheet, View ,Alert} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { IconButton } from "react-native-paper";
import { ScrollView,ActivityIndicator,Image } from "react-native";
import BaseURL from "./BaseURL";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SupervisorDashboard({navigation,route}){


  const { userName } = route.params;


  const [name,setName]=useState('')
  const [imgpath,setImage]=useState('')
  const [id,setId]=useState('')

  
  const [doc_id,setDocId]=useState('')

  const [patients, setPatients] = useState([]);

  const [nameP,setNameP]=useState('');

  const [supervisorData, setSupervisorData] = useState(null);

  const [loading,setLoading]=useState(null)

  const [patientId,setPatientId]=useState('')

// let seId;
//   const [sessionId,setSessionId]=useState('')

  const [slot,setSlot]=useState([])


  const drawer = useRef(null); // Ref for controlling the drawer

  console.log(userName)


  /////////////////////////////////////////////////////////////////

    // // get Supervisor by email
  
    useEffect(() => {
      // Function to fetch the doctor info after login using the email from route.params
      const fetchSupervisorInfo = async () => {
        try {
          // Make sure to use the email (`userName`) in your API call
          const response = await fetch(`${BaseURL}getSupervisorByEmail/${userName}`, {
            method: 'GET', // Assuming it's a GET request to fetch doctor info by email
            redirect: 'follow',
          });
  
          if (!response.ok) {
            throw new Error(`Error fetching supervisor data: ${response.statusText}`);
          }
  
          const result = await response.json(); // Parse the JSON response
          console.log('Supervisor data:', result);

          const { name } = result;
          const {imgpath} =result;
          console.log(name)
          setName(name)

          const {id}=result;
          console.log("Supervisor Id : " , id)
          setId(id)


      
          console.log(imgpath)
          setImage(imgpath)


  
          setSupervisorData(result); // Set the fetched doctor data
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false); // Stop loading spinner
        }
      };
  
      fetchSupervisorInfo(); // Call the function when the component mounts
    }, [userName]); // Run the effect when `userName` changes
  
   
    //////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////
    // get Supervisor's Doctor
    useEffect(() => {
      const fetchData = async () => {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
    
        try {
          const response = await fetch(
            `${BaseURL}getSupervisorDoctor/${id}`,
            requestOptions
          );
          if (response.ok) {
            const result = await response.json(); // Parse JSON response
            console.log(result);

            const {doctor_id}=result;
            setDocId(doctor_id)
            console.log("This is the Dostors Id : ", doctor_id)
            
          } else {
            console.error("Error:", response.status, response.statusText);
            const errorText = await response.text();
            //console.error("Error details:", errorText); // Log the raw response
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchData();
    }, [id]); // Ensure dependency array is correct
    ////////////////////////////////////////////////////////////////



      ////////////////////////////////////////////////////////////////////////
        //Appointments
        
        useEffect(() => {
          const fetchPatientData = async () => {
            const myHeaders = new Headers({
              "Content-Type": "application/json",
              // Add other headers here if needed
            });
        
            const requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow"
            };
        
            try {
              const response = await fetch(`${BaseURL}getTodaysAppointments/${doc_id}`, requestOptions);
        console.log(id)
              if (!response.ok) {
                throw new Error(`Fetching patient data: ${response.statusText}`);
              }
        

              const result = await response.json();
              setPatients(result);

              console.log("")

              // Check if result is valid and log it
              if (result && Array.isArray(result)) {
                console.log("Fetched patient data:", result);
            
                
              const appIds = result.map(patient => patient.appid);
              console.log("Appointment Id : " , appIds)
              

            // Extract and log all patient IDs
            const allPatientIds = result.map(patient => patient.id);
            console.log("All Patient IDs:", allPatientIds);
    
            // Optionally, save the first patient's ID to state
            if (allPatientIds.length > 0) {
              setPatientId(allPatientIds);
              console.log("Patient ki Id : ",allPatientIds)
             
            }
           else {
            console.warn("Result is not a valid array.");
          }

              
                
              }
            } catch (error) {
              // Check if there's actually an error to log
              if (!patients || patients.length === 0) {
                // console.error("Error fetching data:", error);
                console.warn("No Appointments for today ")
              }
            }
          };
        
          if (doc_id) { // Only fetch if id is defined
            fetchPatientData();
          }
        }, [doc_id]);
    
        
        ////////////////////////////////////////////////////////////////////////
    

////////////////////////////////////////////////////////////////////////////
 // 
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
                 `${BaseURL}/getNewPatientAppointmentDate/${doc_id}/${patient.id}`
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
                                                                           
                                                                            
////////////////////////////////////////////////////////////////////////////

    //     ////////////////////////////////////////////////////////////////////////
    //     // Start Session for Add Session in DataBase

       
    // const addSession = async  (appId) =>{
          
    //     try {
    //         const data = JSON.stringify({
    //           supervisorid: id,
    //           appointmentid: appId
    //         });
        
    //         console.log("Supervisor ki Id Session k liye:", id);
    //         console.log("Appointment Id Session k liye:", appId);
        
    //         const requestOptions = {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: data
    //         };
        
    //         //  Await the fetch response
    //         const response =await fetch(`${BaseURL}/AddSession`, requestOptions);
        
    //         //  Check response status properly
    //         if (!response.ok) {
    //           throw new Error(`Error: ${response.status} - ${response.statusText}`);
    //         }
        
    //         // Parse JSON correctly
    //         const result =await response.json();
    //         console.log("Session Added:", result);

    //          seId = result.id
    //          console.log("Session Id : " ,seId)
    //          setSessionId(seId)
            
        
    //         return result; //Returning the result in case it's needed
    //       } catch (error) {
    //         console.error("Session doesn't Add:", error.message);
    //       }
    //     };
      
        

    //     console.log("Session Id :::" ,sessionId)
    //     ///////////////////////////////////////////////////////////////////////


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

        <Button style={styles.drBtn} onPress={() => navigation.navigate('RegisteredPatients',{id:doc_id})}>
             <Text style={{ fontSize: 20,color:'white',marginLeft:-60}}>My Patients</Text>
        </Button>
        
        </View>
        

       



        
        
      


        <Text style={{color:'white',marginTop:40}}>__________________________</Text>

        <Button onPress={handleLogout}>
          <Text style={{ fontSize: 25,fontWeight:'bold',color:'white',paddingTop:60}}>Logout</Text>
        </Button>

    
    </View>
  
);



  return(
    
    
    <DrawerLayoutAndroid
    ref={drawer}
    drawerWidth={300} // Size of the drawer
    drawerPosition="right"
    renderNavigationView={navigationView}
    
  >



  <SafeAreaView>



<View style={styles.top}>
        <Text style={{color:"white",fontSize:25,alignSelf:'center',paddingTop:10}}>Supervisor</Text>
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

<View style={styles.img}>

      <Image
        source={{ uri: `${BaseURL}/image/${imgpath}` }} // Replace with your image URL
        style={styles.image1}
        resizeMode="cover" // Optional: adjust how the image scales
      />

      </View>


          <View>
            <Text style={styles.hello2}>Hello,</Text>
            <Text style={styles.dr}>Mr. {name}</Text>
          </View>

      <Text style={{marginTop:195,fontSize:20,color:'#7C0909',alignSelf:'center',fontWeight:'bold'}}>My Patients</Text>

     <View style={styles.appPatient}>

  {/* Scrollable Patient Data */}
  <View style={styles.scrollableContainer}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.viewPat}>
        {patients === null ? (
          <Text>Loading...</Text>
        ) : patients.length === 0 ? (
          <Text>No appointments</Text>
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


              <Button 
  style={styles.startBtn} 
  onPress={() => {
    navigation.navigate("SupervisorUpload", { appid: patient.appid ,id:id , pname : patient.name}); 
  }}
>
  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>Start Session</Text>  
</Button>



  {/* <Button 
    style={styles.startBtn} 
    onPress={() => {
      navigation.navigate("SupervisorUploadFusion", { appid: patient.appid ,id:id , pname : patient.name}); 
    }}
  >
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>Start Session with Fusion</Text>  
  </Button> */}

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


  </SafeAreaView>

  

</DrawerLayoutAndroid>
)
}

const styles = StyleSheet.create({

  
  appPatient: {
    flex: 1,
    backgroundColor: "#FDF4F4", // Background color for the entire screen
    padding: 10,
    
  },
  
  appPatient:{
    backgroundColor:"white",
    width:340,
    alignSelf:'center',
    position:'absolute',
    top:300,
    height:1000,
    elevation:10,
    borderRadius:20
  },

  scrollContainer: {
    paddingBottom: 1500, // Ensure some padding at the bottom
    paddingVertical: 10,
  },

  scrollableContainer: {
    flex: 1, // Allows this container to grow and take remaining space
    marginVertical: 10, // Adds spacing around the scrollable area
    width:320
  },
  


  viewPat: {
    width:320,
    height:350,
    marginLeft:5,
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    borderColor:'#FDF4F4'
    

  },

  patData: {
    height: 280,
    width: 300,
    backgroundColor: "#F3E1E1",
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 15,
    elevation: 10,
    marginTop:20
  },
  
  patImage: {
    height: 80,
    width: 90,
    backgroundColor: "transparent",
    position: "relative",
    top: 10,
    left: 15,
    borderRadius: 50,
  },

  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 18,
    marginLeft: 20,
    color:"#7C0909"
  },

  patData1: {
    height: 50,
    width: 300,
    backgroundColor: "#7C0909",
    position: "absolute",
    top: 200,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    color:"white",
    fontSize:16,
    paddingTop:10,
    textAlign:'center'
  },


  menu: {
    position: "absolute",
    height: 60,
    width: 150,
    left: 234,
    top: 60,
    backgroundColor: "transparent",
    flexDirection: "row",
  },

  hello2: {
    position: "absolute",
    fontWeight:'bold',
    left:125,
    top:60,
    fontSize: 22,
    color: "#7C0909",
  },
  
  dr: {
    position: "absolute",
    top:100,
    left:125,
    fontSize: 21,
    fontWeight: "bold",
    color: "#7C0909",
  },

  image1: {
    width: 100,
    height: 100,
    borderRadius:80,
    
  },

  top:{
    height:60,
    backgroundColor:'#7C0909'
  },


  img:{
    height:100,
    width:100,
    backgroundColor:'transparent',
    position:'absolute',
    top:100,
    left:15,
    alignSelf:'center',
    borderRadius:80,
    resizeMode:"stretch"
  },

  hello:{
    marginTop:230,
    alignSelf:'center',
    fontSize:25,
    fontWeight:'bold',
    color:'#7C0909'
  },

  name:{
    marginTop:20,
    alignSelf:'center',
    fontSize:25,
    fontWeight:'bold',
    color:'#7C0909'
  },

  btns:{
    height:300,
    width:340,
    borderColor:"black",
    borderWidth:0,
    marginTop:20,
    alignSelf:'center',
  },

  btn:{
    height:70,
    width:250,
    backgroundColor:"#7C0909",
    alignSelf:'center',
    marginTop:20,
    borderRadius:23
  },
  txtBtn:{
    color:'white',
    fontSize:23,
    paddingTop:20,
  }
,
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

startBtn:{
  backgroundColor:"#7C0909",
  width:250,
  height:45,
  marginTop:20,
  alignSelf:'center',
},

timeSlot:{
  backgroundColor:"#7C0909",
  height:50,
  marginTop:13,
  borderBottomEndRadius:15,
  borderBottomLeftRadius:15,
  elevation:5
},

text:{
  fontSize:15,    
  color:"white",
  paddingTop:7,
  textAlign:"center"
}
})