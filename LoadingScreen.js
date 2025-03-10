import React, { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import { Text } from "react-native-paper";
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";




export default function LoadingScreen({navigation}){

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
          try {
            const userData = await AsyncStorage.getItem('@user_data');
            if (userData) {
              const { userName, role, status } = JSON.parse(userData);
                // Navigate based on role
                if (role === 'doctor') {
                  navigation.replace('DoctorDashboard', { userName });
                } else if (role === 'patient') {
                  navigation.replace('PatientDashboard', { userName });
                } else if (role === 'supervisor') {
                  navigation.replace('SupervisorDashboard', { userName });
                }
               else {
                navigation.replace('LoginEEG'); // Invalid status, go to Login
              }
            } else {
              navigation.replace('LoginEEG'); // No session found, go to Login
            }
          } catch (error) {
            console.error("Error reading session:", error);
            navigation.replace('LoginEEG'); // Fallback to Login
          }
        };
    
        checkSession();
      }, [navigation]);
    
    return(
        <SafeAreaView style={styles.back}>


            <View style={styles.view1}>

                    <Text style={styles.txt}>
                            Decode Your Emotions 
                    </Text>

                    <Text style={styles.txt1}>
                             with EEG Technology 
                    </Text>
                   
                    <Image style={styles.img}
                source={{uri:'brain2'}}
                    
                    />

            </View>

        <View style={styles.view2}>
            {loading &&
        <ActivityIndicator size={'large'} color={'black'} />
            }
        </View>
            


        </SafeAreaView>
    )
}

const styles=StyleSheet.create({

    back:{
        backgroundColor:'#FDF4F4'
    },
    view1:{
            height:500,
            width:390,
            backgroundColor:"#7C0909"
            
    },

    txt:{
            color:'white',
            fontSize:30,
            fontWeight:'bold',
            marginLeft:20,
            marginTop:50
            
    },
    txt1:{
        color:'white',
        fontSize:30,
        fontWeight:'bold',
        marginLeft:35,
        marginTop:10
       
        
    },

    view2:{

           marginTop:15
    },
    btn:{
            backgroundColor:"#7C0909",
            width:360,
            height:70,
            marginTop:27,
            alignSelf:'center',
            
    },

    img:{
        alignSelf:'center',
        width:230,
        height:280,
        marginTop:30,
        borderRadius:60
    }

})