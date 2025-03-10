import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, View,Alert,Image ,ActivityIndicator,TouchableOpacity } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Text } from "react-native-paper";
import { ScrollView } from "react-native";
import { Table, Rows } from 'react-native-table-component';
import {DrawerLayoutAndroid} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import BaseURL from "./BaseURL";


export default function PatientDashboard({navigation,route}){


        const { userName } = route.params;

        const [patientId,setID]=useState()
        
        const [name,setName]=useState('')
        const [gender,setGender]=useState('')
        const [age,setAge]=useState('')
        const [age3,setAgee]=useState('')
        const [height,setHeight]=useState('')
        const [weight,setWeight]=useState('')
        const [contact,setContact]=useState('')
        const [imgPath,setImgPath]=useState('')

        
        //For Sessions
        const [sessionData, setSessionData] = useState([]); 
        
        
         const [loading, setLoading] = useState(false);
        const [loadingSessions, setLoadingSessions] = useState(true)

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
          
          // Example usage with a dob string from API
        
         const age2 = calculateAge(age);
         console.log("Age:", age2);  // Output the calculated age

          /////////////////////////////////////////////////////////////////////////////////////////

        
        const tableData = [
            ['Name',name] ,
            ['Gender', gender],
            ['Age', age2 ],
            ['Height', height ],
            ['Weight', weight ]
        ];


       
          


        useEffect(() => {
            // Function to fetch patient data by email
            const fetchPatientData = async () => {
              const requestOptions = {
                method: "GET",
                redirect: "follow"
              };
        
              try {
                const response = await fetch(`${BaseURL}getPatientByEmail/${userName}`, requestOptions); // Use your local network IP
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const result = await response.json();  // Assuming the response is in JSON format
                console.log("Patient Data:", result);

                const {name}= result
                console.log(name)
                setName(name)

                const {gender}= result
                // console.log(gender)
                // setGender(gender)

                if(gender=='M'){
                    setGender("Male")
                }else{
                    setGender("Female")
                }
                
                

                const {dob}= result
                console.log(dob)
                setAge(dob)

                const {height}= result
                console.log(height)
                setHeight(height)

                const {weight}= result
                console.log(weight)
                setWeight(weight)

                const {contact}= result
                console.log(contact)
                setContact(contact)

                const {imgPath}= result
                console.log(imgPath)
                setImgPath(imgPath)


                const {id} = result
                setID(id)
                console.log(id)
          
            
                //Alert.alert("Patient Data", JSON.stringify(result));
              } catch (error) {
                console.error("Fetch error:", error);
                Alert.alert("Error", "Failed to fetch patient data");
              }
            };
            
        
            // Call the fetch function when the component mounts
            fetchPatientData();
          }, []); 



         //////////////////////////////////////////////////////////////////////////////////////////
         //Get Sessions
         useEffect(() => {
         const getSessions = async () => {
             try {
               setLoadingSessions(true);
               if (!patientId) return;
           
               const response = await fetch(`${BaseURL}GetSessionsForPatient/${patientId}`);

               console.log("Response : " , response)
               if (!response.ok) throw new Error(`Session fetch failed: ${response.status}`);
           
               const result = await response.json();
               console.log("Sessions : " , result)

              //  setSessionData(result)
               
              //  result.forEach((index) => {
              //   setSession(index.sessionid);
              // });
               
               const validData = Array.isArray(result) 
                 ? result.filter(item => item?.appid && item?.doctorid && item?.sessionid  && item?.supervisorid)
                 : [];
           
               setSessionData(validData.map(item => ({
                  appid:item.appid,
                  doctorid:item.doctorid,
                  sessionid: item.sessionid,
                  supervisorid: item.supervisorid
               })));
         
               console.log("Session Data Saved : " , sessionData)
           
             } catch (error) {
               console.error("Session error:", error);
               setError('Failed to load sessions');
              
             } finally {
               setLoadingSessions(false);
             }
           };
           
           // Fetch when component mounts or IDs change
          
             getSessions();

           },[patientId]); // Directly track dependencies here
          
         //////////////////////////////////////////////////////////////////////////////////////////



console.log("Image Path : " ,imgPath)
          
 // Logout function to clear AsyncStorage and navigate to login screen

 const handleLogout = async () => {
  try {
      await AsyncStorage.removeItem('@user_data');
      navigation.replace('LoginEEG'); // Replace to avoid going back
  } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
  }
};

/////////////////////////////////////////////////////////////////////



           // Drawer content
    const navigationView = () => (
        <View style={styles.drawerContainer}>
  
  
          <View style={styles.iconText}>
          
          <IconButton
                icon="account-group" // Icon for people/group
                size={30}
                iconColor="white"
                style={{marginTop:-10,marginLeft:0}}
              
          />
  
          <Button style={styles.drBtn} onPress={() => navigation.navigate('AllDoctors',{patientId})}>
               <Text style={{ fontSize: 20,color:'white',marginLeft:0,marginTop:0}}>All Doctors</Text>
          </Button>
          
          </View>
          
  

          <View style={styles.iconText2}>
          <IconButton
              icon="calendar-today" // Icon for people/group
              size={30}
              iconColor="white"
              // style={{marginLeft:-200,marginTop:-150}}
              onPress={() => navigation.navigate('ResultPatient')}
          />
  
          <Button style={styles.drBtn}   onPress={() => navigation.navigate('ResultPatient',{patientId})}>
               <Text style={{ fontSize: 20,color:'white',marginLeft:-60}}>Results</Text>
          </Button>
          
          </View>
  
  
  

  
          <View style={styles.iconText2}>
          
         
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
    
    
    
    
    <SafeAreaView style={styles.back}>

        <ScrollView contentContainerStyle={styles.scrollContainer}>

    <View style={styles.view1}>

    {/* <IconButton
    
        icon="arrow-left"
        size={28}
        iconColor="white"
        style={{marginLeft:0}}   
    
    /> */}

<Text style={{color:'white',fontWeight:'bold',fontSize:25,marginLeft:20,marginTop:14}}>Patient </Text>


<IconButton
        icon="bell"
        size={28}
        iconColor="white"
        style={{marginLeft:165}}
       
/>
    
<IconButton
        icon="menu"
        size={30}
        iconColor="white"
        style={{marginLeft:0}}
        onPress={() => drawer.current.openDrawer()} // Open drawer on click
       
/>

</View>

        <View style={styles.imageNum}>
        
        <View style={styles.image}>

        <Image
        source={{ uri: `${BaseURL}image/${imgPath}` }} // Replace with your image URL
        style={styles.image1}
        resizeMode="contain" // Optional: adjust how the image scales
      />
        </View>

        <IconButton
        icon="phone"
        size={30}
        iconColor="#7C0909"
      //  onPress={() => makeCall(contact)} // Replace with the desired number
        style={{marginTop:30}}
       
        />

        <Text style={{color:'#7C0909',fontWeight:'bold',fontSize:18,paddingTop:40,paddingLeft:4}}>{contact}</Text>
        </View>

        <View style={{height:20}}></View>
        <Table borderStyle={styles.border}>
           
            <Rows data={tableData} style={styles.text} />

        </Table>



        <View style={styles.btns}>
        
        {/* <Button style={styles.results} onPress={()=>navigation.navigate('ResultPatient',{patientId})}>
            <Text style={{color:'white',fontWeight:'bold',fontSize:20,paddingTop:5,alignContent:'center'}}>Results</Text>
        </Button> */}


        <Button style={styles.results} onPress={()=>navigation.navigate('PrescriptionForPatient',{patientId})}>
            <Text style={{color:'white',fontWeight:'bold',fontSize:20,paddingTop:5,alignContent:'center'}}>Medicine Info</Text>
        </Button>

        </View>



        <View style={styles.appoinments}>

            <Text style={{color:'#7C0909',fontWeight:'bold',fontSize:20,paddingTop:5,alignContent:'center'}}>Completed Appoinments</Text>

          
           
                       {loadingSessions ? (
             <View style={styles.loaderContainer}>
               <ActivityIndicator size="large" color="#7C0909" />
               <Text style={styles.loadingText}>Loading sessions...</Text>
             </View>
           ) : sessionData.length === 0 ? (
             <Text style={styles.noSessionsText}>
               No sessions available
             </Text>
           ) : (
             sessionData.map((item, index) => (
               <TouchableOpacity key={index} style={styles.appoin}>
                 <Button 
                   style={styles.sessionButton}
                   onPress={() => navigation.navigate("ExperimentsforPatient", {
                     session: item.sessionid,
                     appId: item.appid,
                     patientId
                   })}
                 >
                   <Text>Session {index + 1}</Text>
                 </Button>
               </TouchableOpacity>
             ))
           )}
             

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

    drawerContainer: {
        flex: 1,
        backgroundColor:'#7C0909',
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
      },


    image1: {
        width: 120,
        height: 140,
        borderRadius: 30,
        
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

    image:{
        width:140,
        height:120,
        backgroundColor:'transparent',
        position:'relative',
        top:-10,
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


    btns:{
        width:350,
        height:60,
        backgroundColor:'transparent',
        flexDirection:'row',
        position:'relative',
        top:15,
        left:10
    },

    results:{
        width:170,
        height:50,
        backgroundColor:'#7C0909',
        marginTop:10,
        marginLeft:5,
        borderRadius:20,
        alignSelf:'center',
        marginLeft:100
    },

    appoinments:{
        height:230,
        width:250,
        marginTop:30,
        marginLeft:20,
        alignSelf:'center',
        backgroundColor:'transparent'
    },

    appoin:{
        height:50,
        width:250,
        marginTop:13,
        marginLeft:0,
        backgroundColor:'#F9E0E0',
        borderRadius:10
    },
    scrollContainer: {
        paddingBottom: 1500 // Ensure some padding at the bottom
    },

    iconText2:{
        flexDirection:'row',
        width:280,
        height:60,
        marginLeft:0,
        marginTop:10,
        backgroundColor:'transparent'
    
      },

      drBtn:{
        width:230,
        height:50,
        backgroundColor:'transparent',
        marginTop:12,
        marginRight:0
    
      },

      iconText:{
        flexDirection:'row',
        width:160,
        height:60,
        marginRight:120,
        marginTop:-180,
        backgroundColor:'transparent'
    
      },
})