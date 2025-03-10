import React, { useState, useEffect,useRef ,useCallback} from "react";
import { SafeAreaView, StyleSheet, View,Alert,Image ,DrawerLayoutAndroid ,TouchableOpacity } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Text } from "react-native-paper";
import { ScrollView } from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import BaseURL from "./BaseURL";


///////////////////////////////////////////////////////


export default function Experiments({navigation,route}){

    const { session, appId } = route.params;
    const { patientId } = route.params;

    console.log("Session id : ",session)
    console.log("Appointment id : ",appId)
    console.log("Patient id : ",patientId)

    const [exp,setExp]=useState([])


    
useEffect(()=>{
    const getExperiments=async()=>{

         try {
                const response = await fetch(`${BaseURL}/GetExperiments/${session}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    redirect: "follow",
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const result = await response.json();
                console.log("Experiment Data:", result);
               

               // Validate session data structure
      const validData = Array.isArray(result) 
      ? result.filter(item => item?.EEGPath && item?.Result && item?.SessionID && item?.id)
      : [];

    setExp(validData.map(item => ({
      EEGPath: item.EEGPath,
      Result: item.Result,
      SessionID:item.SessionID,
      id:item.id
    })));
        console.log(exp)

    } catch (error) {
        console.error("Error fetching Experiment data:", error);
    }
    }
    getExperiments()

},[])
///////////////////////////////////////////////////////


    return(
        <SafeAreaView>

            <View style={styles.view1}>
            
            <IconButton
                    icon="arrow-left"
                    size={28}
                    iconColor="white"
                    style={{marginLeft:0}}
                    
                   
            />
            
            <Text style={{color:'white',fontWeight:'bold',fontSize:20,marginTop:14}}>Experiments</Text>
            
            
            <IconButton
                    icon="bell"
                    size={28}
                    iconColor="white"
                    style={{marginLeft:105}}
                   
            />
                
            <IconButton
                    icon="menu"
                    size={30}
                    iconColor="white"
                    style={{marginLeft:0}}
                  //  onPress={() => drawer.current.openDrawer()}
            />
            
            </View>


        {exp.length === 0 ? (
           <Text style={{ color: 'black', textAlign: 'center', marginTop: 20 }}>
               No experiments available
           </Text>
           ) : (
               exp.map((experiment, index) => (

                <TouchableOpacity key={index} style={styles.appoin}
                
                onPress={()=>navigation.navigate('Result',{
                    EEGPath:experiment.EEGPath,
                    Result:experiment.Result,
                    SessionID:experiment.SessionID,
                    id:experiment.id,
                    patientId,
                    appId
                })}

                // onPress={()=>navigation.navigate('FusionResult',{
                //     EEGPath:experiment.EEGPath,
                //     Result:experiment.Result,
                //     SessionID:experiment.SessionID,
                //     id:experiment.id,
                //     patientId,
                //     appId
                // })}
                
                >
                      
                    <Text style={{color:"white",textAlign:"center",paddingTop:13,fontSize:17,fontWeight:"bold"}}>Experiment {index +1}-Id: {experiment.id}</Text> 
               
                </TouchableOpacity>
                

            ))
            
           )}
    
    </SafeAreaView>

    )   
}


const styles=StyleSheet.create({

    view1:{
        height:65,
        width:385,
        backgroundColor:"#7C0909",
        flexDirection:'row'
    },
    appoin:{
        height:50,
        width:250,
        marginTop:40,
        alignSelf:"center",
        borderRadius:17,
        backgroundColor:'#7C0909'
    },
    btnExp:{
        paddingTop: 5,
        borderRadius:10,
        width:90
    }
})