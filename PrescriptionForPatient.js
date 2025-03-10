import React, { useState ,useEffect,useRef} from "react";
import { SafeAreaView, StyleSheet, View,Alert,Image,DrawerLayoutAndroid } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Text } from "react-native-paper";
import { ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseURL from "./BaseURL";


export default function PrescriptionForPatient({navigation, route}){

    const { patientId } = route.params;

    const [name,setName]=useState('')
    const [imgPath,setImage]=useState('')
    const [pres,setPres]=useState('')

      const drawer = useRef(null); // Ref for controlling the drawer
    

    //////////////////////////////////////////////////////////////////////////////////////
    
    useEffect(() => {
        // Define the async function inside useEffect
        const fetchPrescription = async () => {
            const myHeaders = new Headers({
                "Content-Type": "application/json",
            });
    
            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };
    
            try {
                const response = await fetch(`${BaseURL}/getPatientPrescription/${patientId}`, requestOptions);
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const result = await response.json(); // Assuming JSON response
                console.log(result);  // Check the structure of the result
    
                // Check if the result is an array and has at least one item
                if (Array.isArray(result) && result.length > 0) {
                    const data = result[0]; // Access the first object in the array
                    setName(data.name);  // Set name
                    setImage(data.imgpath);  // Set image path
                    setPres(data.prescribtion);  // Set prescription
                } else {
                    console.warn("No data found in the response");
                }
    
            } catch (error) {
                console.error("Error fetching prescription data:", error);
                Alert.alert("Error", "Failed to fetch prescription data");
            }
        };
    
        if (patientId) {
            fetchPrescription(); // Call the function if patientId is available
        } else {
            console.error("Patient ID is not provided");
            Alert.alert("Error", "Patient ID is missing.");
        }
    }, [patientId]);
    ////////////////////////////////////////////////////////////////////////////



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
                  drawerWidth={300} // Size of the drawer
                  drawerPosition="right"
                  renderNavigationView={navigationView}
                  
                >

<SafeAreaView style={styles.back}>
    
    <ScrollView contentContainerStyle={styles.scrollContainer}>
       
        
         <View style={styles.view1}>

        {/* <IconButton
    
            icon="arrow-left"
            size={28}
            iconColor="white"
            style={{marginLeft:0}}   
    
        /> */}

        <Text style={{color:'white',fontWeight:'bold',fontSize:22,marginTop:14,marginLeft:15}}>Prescription </Text>


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
    

    <View style={styles.pres}>
        <View style={styles.img}>
        <Image
        source={{ uri: `${BaseURL}/image/${imgPath}` }} // Replace with your image URL
        style={styles.image1}
        resizeMode="cover" // Optional: adjust how the image scales
      />
        </View>

        <Text style={{marginLeft:120,marginTop:-60,fontSize:20,fontWeight:'bold',color:"#7C0909"}}>Dr. {name} </Text> 
        
        <Text></Text>
        <Text></Text>
        
        <Text style={styles.prescriptionText}>{pres}</Text>  
    </View>

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

    scrollContainer: {
        paddingBottom: 1000 // Ensure some padding at the bottom
    },

    pres:{
        width:320,
        height:300,
        borderRadius:30,
        backgroundColor:"white",
        alignSelf:"center",
        marginTop:40,
        elevation:10
        
    },
    image1: {
        width: 90,
        height: 90,
        borderRadius: 100,
        
      },

    img:{
        width:90,
        height:90,
        borderRadius:100,
        backgroundColor:'grey',
        marginTop:10,
        marginLeft:10
    },

    prescriptionText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'left',
        margin: 20,
        color: '#333',
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
})
