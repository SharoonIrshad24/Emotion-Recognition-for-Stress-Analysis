import React, { useState,useEffect,useRef } from "react";
import { SafeAreaView, StyleSheet, View,Alert,Image , DrawerLayoutAndroid  } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Text } from "react-native-paper";
import { ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseURL from "./BaseURL";


export default function RegisteredPatients({navigation, route}){

    const { id } = route.params || {}; // Destructure safely to avoid undefined error

    const [patients, setPatients] = useState([]);

    const [imgPath,setImage]=useState('')

    const drawer = useRef(null); // Ref for controlling the drawer

    useEffect(() => {
        const fetchPatientData = async () => {
            const myHeaders = new Headers({
                "Content-Type": "application/json",
            });
    
            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };
    
            try {
                const response = await fetch(`${BaseURL}/getRegisteredPatient/${id}`, requestOptions);
    
                if (!response.ok) {
                    throw new Error(`Fetching patient data: ${response.statusText}`);
                }
    
                const result = await response.json();
    
                // Check if result is an array and log each imgPath
                // if (result && Array.isArray(result)) {
                //     result.forEach(patient => {
                //         console.log("Image Path:", patient.imgPath);
                //         setImage(imgPath)
                //     });
                    
                    // Set patients to the result directly if needed
                    setPatients(result);
                    console.log(result)
                // } else {
                //     console.log("Fetched data is not an array:", result);
                // }
    
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        if (id) {
            fetchPatientData();
        } else {
            console.error("ID is undefined. Cannot fetch patient data.");
        }
    }, [id]);
    

    
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
    
    



const im=`${BaseURL}/image/${imgPath}`
console.log(im)


    return(
        <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300} // Size of the drawer
        drawerPosition="right"
        renderNavigationView={navigationView}
        
      >
    
    <SafeAreaView style={styles.back}>

 
    <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={styles.scrollContainer}>

        <View style={styles.view1}>

        {/* <IconButton
                icon="arrow-left"
                size={28}
                iconColor="white"
                style={{marginLeft:0}}
                
               
        /> */}

        <Text style={{color:'white',fontWeight:'bold',fontSize:22,marginTop:14,marginLeft:20}}>My Patients</Text>
        

        <IconButton
                icon="bell"
                size={28}
                iconColor="white"
                style={{marginLeft:130}}
               
        />
            
        <IconButton
                icon="menu"
                size={30}
                iconColor="white"
                style={{marginLeft:0}}
               
        />

        </View> 

        <Text style={{color:'black',fontWeight:'bold',fontSize:20,marginTop:14,marginLeft:10,textAlign:'center'}}> Registered Patients</Text>

        
        {patients.length === 0 ? (
    <Text style={{ color: 'black', textAlign: 'center', marginTop: 20 }}>
        No appointments available
    </Text>
) : (
    patients.map((patient, index) => (
        <View key={index} style={styles.patientDetail}>
            <View style={styles.image}>
            
            
            <Image
        source={{ uri: `${BaseURL}/image/${patient.imgPath}` }} // Replace with your image URL
        style={styles.image1}
        resizeMode="cover" // Optional: adjust how the image scales
      />
            
            
            
            </View>
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, paddingTop: 20, paddingLeft: 15 }}>
                {patient.name || "Name of Patient"}
            </Text>
           
            <Button
                style={styles.detail}
                onPress={() => navigation.navigate('PatientDetails', { patientId: patient.id , id:id})}
                
            >
                {console.log("Patient ki Id : ",patient.id)}
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, paddingTop: 5 }}>
                    View Details
                </Text>
            </Button>
        </View>
    ))
)} 

 


        </ScrollView>

    </SafeAreaView>
    
    </DrawerLayoutAndroid>

    )
}

const styles=StyleSheet.create({

    back:{
        backgroundColor:'#FDF4F4'
    },


    view1:{
        height:65,
        width:385,
        backgroundColor:"#7C0909",
        flexDirection:'row'
    },

    patientDetail:{
        height:130,
        width:340,
        marginTop:40,
        alignSelf:'center',
        backgroundColor:'white',
        borderRadius:20,
        flexDirection:'row',
        elevation:10
    },
    image1: {
        marginLeft:7,
        marginTop:7,
        width: 85,
        height: 85,
        borderRadius: 30,
        
      },

    image:{
        width:85,
        height:85,
        backgroundColor:'transparent',
        borderRadius:50
    },

    scheduledDate:{
        width:100,
        height:50,
        position:'absolute',
        top:62,
        left:95,
        backgroundColor:'white',
        borderRadius:15,
        borderWidth:1,
        borderColor:'black'
       
    },

    detail:{
        width:130,
        height:50,
        position:'absolute',
        marginTop:62,
        marginLeft:203,
        backgroundColor:'#7C0909',
        borderRadius:15,
    },
    scrollContainer: {
      // Ensure some padding at the bottom
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
        marginTop:0,
        backgroundColor:'transparent'
    
      },
})