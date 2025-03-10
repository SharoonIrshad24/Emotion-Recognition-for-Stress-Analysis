import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { Text ,IconButton} from "react-native-paper";
import { SafeAreaView, StyleSheet, View,Switch, ScrollView } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { PermissionsAndroid, Platform, Alert } from "react-native";
import DocumentPicker from 'react-native-document-picker';

export default function SupervisorUploadFusion({navigation,route}){

    
      const { appid } = route.params;
    
      const { id } = route.params;
    
      const {pname} = route.params;
      console.log("Name : " ,pname)
    
      console.log("Appointment Id  :" , appid)
    
     // const { sessionId } = route.params;
    
      //console.log("Session Id::",sessionId)
      const [predict,setPredict]=useState('')
    
      let res;
      
      const [result1,setResult]=useState('')
    
      let EEGPath;
      
      const [loading, setLoading] = useState(false);
    
      const [fileName,setFileName]= useState('');
    
      let seId;
    
      const [sessionId,setSessionId]=useState('')
    

    
      // Request external write permission
async function requestExternalWritePermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission to upload files.',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        Alert.alert('Permission Error', err.message);
      }
      return false;
    } else {
      return true; // On iOS, no need for this permission
    }
  }
  
  // Function to handle file upload after permission is granted
  async function handleFileUpload() {
    const hasPermission = await requestExternalWritePermission();
    if (hasPermission) {
      try {
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles], // All file types
        });
        console.log('File selected:', result);
        Alert.alert('File Selected', result.name);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User canceled the picker');
        } else {
          console.log('Unknown error:', err);
        }
      }
    } else {
      Alert.alert('Permission Denied', 'Storage write permission is required to upload files.');
    }
  }
  


    return(<SafeAreaView>

        <View style={styles.bar}>
            <Text style={{fontSize:20,marginTop:15,color:"white",textAlign:"center"}}>Upload Your EEG and Video</Text>
        </View>
       
        <Text style={{fontSize:25,fontWeight:"bold",marginTop:30,marginLeft:10,color:"#7C0909"}}> {pname} </Text>

        <View style={styles.view1}>
            

            <View style={styles.view2}>

                <Text style={{fontSize:20,color:"#7C0909"}}>Upload EEG</Text>
                <IconButton
                    icon="upload"
                    size={30}
                    iconColor="#7C0909"
                    style={{ marginLeft: 120,marginTop:-10}}
                    onPress={handleFileUpload}
                />
            </View>
            


            <View style={styles.view2}>

            <Text style={{fontSize:20,color:"#7C0909"}}>Upload Video</Text>
                <IconButton
                 icon="upload"
                 size={30}
                 iconColor="#7C0909"
                 style={{ marginLeft: 110,marginTop:-10}}
                 onPress={handleFileUpload}
                />
                
            </View>


        </View>

        <Button style={styles.btn}>
            <Text style={{color:"white",fontSize:18}}>Submit</Text>
        </Button>

    </SafeAreaView>)
}


const styles = StyleSheet.create({
 
    bar:{
        backgroundColor:"#7C0909",
        height:60
    },
  view1:{
    height:300,
    width:330,
    marginTop:100,
    alignSelf:"center",
    backgroundColor:"#F3E1E1",
    borderRadius:20,
    elevation:20
  },

  view2:{
    flexDirection:"row",
    marginTop:60,
    marginLeft:20
  },

  btn:{
    marginTop:100,
    backgroundColor:"#7C0909",
    width:200,
    height:40,
    elevation:10,
    alignSelf:"center"
  }
});
