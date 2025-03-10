import React ,{useState} from "react";
import { Alert, SafeAreaView ,StyleSheet , View} from "react-native";
import { Modal, Portal, Text, Button, IconButton, TextInput } from 'react-native-paper';
import BaseURL from "./BaseURL";


export default function Prescription({route}){

    const { patientId } = route.params || {};
    const { appId } = route.params || {};

    const [text, setText] = useState("");
    const [appStatus,setStatus]=useState("true")

    const addPrescription = async () => {
        try {
            const data = {
                prescribtion: text,  
                appStatus: appStatus,
                appId: appId,
            };
    
            console.log("Sending Data : ", data);
    
            const response = await fetch(`${BaseURL}/prescribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),  
            });
    
            console.log("Response:", response);
    
            if (!response.ok) throw new Error(`Error: ${response.status}`);
    
            const result = await response.json();
            console.log("Success:", result);

            Alert.alert("Prescrbtion Added")
    
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };
    
      

    return(
        <SafeAreaView>

            <View style={styles.view1}>

                <IconButton
                    icon="arrow-left"
                    size={28}
                    iconColor="white"
                    style={{marginLeft:0}}
                    onPress={()=>navigation.navigate('PatientDashboard')}
       
                />

                <Text style={{color:'white',fontWeight:'bold',fontSize:20,marginTop:14}}>Prescription</Text>


                <IconButton
                    icon="bell"
                    size={28}
                    iconColor="white"
                    style={{marginLeft:110}}
       
                />
    
                <IconButton
                    icon="menu"
                    size={30}
                    iconColor="white"
                    style={{marginLeft:0}}
       
                />

            </View>

            <Text style ={{color:"#7C0909",fontSize:20,fontWeight:'bold',marginTop:20,marginLeft:20}}> Doctor's Note </Text>

            <View style={styles.write}>

            <TextInput
        style={[styles.textInput]}
        placeholder="Type here..."
        value={text}
        onChangeText={setText}
        multiline
      />

            </View>


            <Button style={styles.btn} onPress={addPrescription}>
                <Text style={{color:'white',fontSize:17,paddingTop:5,fontWeight:'bold'}}>Add Prescription</Text>
            </Button>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
   
    view1: {
      backgroundColor: "#7C0909",
      height: 60,
      width: 400,
      flexDirection:'row'
    },

    write:{
        height:500,
        marginTop:40
    },

    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        height: 370,
        fontSize: 18,
        alignSelf:'center',
        width:320
      },

    btn:{
        width:210,
        height:55,
        backgroundColor:"#7C0909",
        alignSelf:'center',
        justifyContent: 'space-around',
    }

})