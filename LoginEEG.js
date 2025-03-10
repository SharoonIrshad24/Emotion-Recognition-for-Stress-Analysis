import React, { useState } from "react";
import { Button } from "react-native-paper";
import { Text ,IconButton} from "react-native-paper";
import { Image, SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseURL from "./BaseURL";


export default function LoginEEG({navigation}){

    let [userName,setUserName]=useState('')
    let [password,setPassword]=useState('')

    const [isFocused, setIsFocused] = React.useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);


    const handleLogin = async () => {
        
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
    
      const raw = JSON.stringify({
        id: userName,
        password: password,
      });
    
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
    
      try {
        const response = await fetch(`${BaseURL}login`, requestOptions);
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const result = await response.json();
    
        // Check the API response structure
        console.log("API result:", result);
    
        // Store user data in AsyncStorage after login
         // Extract role and status from result
      const {role, status } = result;

      // Prepare userData object
      const userData = {
        userName,
        role,
        status,
      };

      // Save userData to AsyncStorage
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));

        Alert.alert("Login Successful", JSON.stringify(result));
         console.log(result.userName)
            
       // const { role } = result;
        if (role === 'doctor') {
            // navigation.replace('DoctorDashboard', { userName });
            navigation.navigate('DoctorDashboard', { userName });
        } else if (role === 'patient') {
          navigation.navigate('PatientDashboard', { userName });
        }
         else if (role === 'supervisor') {
        navigation.navigate('SupervisorDashboard', { userName });
      }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Login Failed", "Network request failed");
      }
    };


    
      ////////////////////////////////////////

    return(
        <SafeAreaView style={styles.back}>

            <View style={styles.view1}>

                <Image style={styles.img}
                    source={{uri:'brain2'}}

                />
                </View>

            <View style={styles.view2}>

                <Text style={styles.txtLogin}> LOGIN </Text>

                <View style={styles.viewInput}>

                <TextInput 
                    style={[
                        styles.input,
                        { borderColor: isFocused ? '#7C0909' : '#cccccc',
                            width:300
                         } // Change border color when focused
                      ]}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    // style={styles.input}
                    placeholder="Enter email or username"
                    onChangeText={(a)=>setUserName(a)}
                
                ></TextInput>

            <View>
                <TextInput
                   style={[
                    styles.input,
                    { borderColor: isFocused ? '#7C0909' : '#cccccc' ,
                        width:300
                    } // Change border color when focused
                  ]}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                    placeholder="Password"

                    onChangeText={(a)=>setPassword(a)}
                
                   
                ></TextInput>

                <IconButton
                  icon={passwordVisible ? "eye-off" : "eye"}
                  size={24}
                  iconColor="#7C0909"
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.icon}
                />
                
                </View>
    

                <Text style={{marginLeft:175,fontSize:14,marginTop:10,color:"#7C0909"}}>Forgot Password?</Text>

                </View>

                <Button style={styles.btnLogin} onPress={handleLogin}>
                    <Text style={{color:'white',fontSize:18,fontWeight:"bold",paddingTop:6}}>Login</Text>
                </Button>

                <Text style={{alignSelf:'center',fontSize:14,marginTop:15,fontWeight:'bold'}}>
                    
                    Don't have an Account?
                    
                </Text>

                <Button style={{marginTop:10 }} onPress={() => navigation.navigate('SelectRole')}>
                    <Text style={{color:'#7C0909',fontWeight:'bold',fontSize:17}}>
                        Signup
                    </Text>
                </Button>
            </View>



        </SafeAreaView>
    )
}


const styles=StyleSheet.create({

    back:{
        backgroundColor:'#FDF4F4'
    },

    view1:{
            height:400,
            width:390,
            backgroundColor:"#7C0909",
            borderBottomLeftRadius:150,
            borderBottomRightRadius:150
    },


    img:{
        alignSelf:'center',
        width:160,
        height:190,
        marginTop:30,
        borderRadius:16
    },

    view2:{
        height:480,
        width:340,
        marginTop:-140,
        alignSelf:'center',
        backgroundColor:'white',
        borderColor:'black',
        borderRadius:17,
        elevation:7
    },

    txtLogin:{
        textAlign:'center',
        fontSize:40,
        paddingTop:15,
        color:"#7C0909",
        fontWeight:'bold'
    },

    viewInput:{
        marginTop:40,
        widhth:10,
        height:150,
        marginLeft:20
    },

    input:{
        marginTop:10,
        marginLeft:0,
        fontSize:17,
        borderColor: '#cccccc', // Border color
    borderWidth: 1,          // Border width
    borderRadius: 8,         // Border radius for rounded corners
    paddingHorizontal: 12,   // Padding inside the input
    fontSize: 16,            // Font size
    backgroundColor: '#ffffff', // Background color
        
    },

    
    btnLogin:{
        backgroundColor:"#7C0909",
        
        width:300,
        height:50,
        marginTop:50,
        alignSelf:'center',
    },
   




    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
      },
      input1: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
      },
      icon: {
        position: 'absolute',
        right: 0,
        left:250,
        bottom:-2
      },



})