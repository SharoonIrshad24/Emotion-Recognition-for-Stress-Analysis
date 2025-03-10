import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View ,Alert,Image} from "react-native";
import { Button, RadioButton } from "react-native-paper";
import { Text,TextInput } from "react-native-paper";
import { IconButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import BaseURL from "./BaseURL";



export default function SupervisorSignUp({route}){

    const { id } = route.params || {};

    let [fullName,setFullName]=useState('')
    let [email,setEmail]=useState('')
    let [password,setPassword]=useState('')
    let [gender,setGender]=useState('')
    let [dob,setDOB]=useState('')
    let [role,setRole]=useState('supervisor')

    let [value,setValue]=useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');


    const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // State to control date picker visibility




    const [selectedImage, setSelectedImage] = useState(null);



       /////////////////////////////////////////////////////////////////
    //API Calling
 // Function to handle form submission
 const handleSignup = () => {
  const formdata = new FormData();

  // Create a JSON object for the form data
  const formDataJson = {
    name: fullName,
    email: email,
    password: password,
    gender: value, // Gender selected from RadioButton
    dob:dob,
    role: role,
    doctor_id:id
  };

  // Append the JSON object as a string in FormData
  formdata.append("user", JSON.stringify(formDataJson));

  // If an image is selected, append the image file to FormData
  if (selectedImage) {
    const filename = selectedImage.substring(selectedImage.lastIndexOf("/") + 1); // Extract filename
    const fileType = filename.split('.').pop(); // Extract file extension to set MIME type
    formdata.append("image", {
      uri: selectedImage,
      name: filename, // Image name
      type: `image/${fileType}`, // Set the image MIME type, e.g., 'image/jpeg' or 'image/png'
    });
  }

  // Debugging: Log each form field manually
  console.log("FormData for user:", JSON.stringify(formDataJson));
  console.log("Selected Image:", selectedImage);

  // Prepare request options
  const requestOptions = {
    method: "POST",
    body: formdata, // Send the FormData
    headers: {
      'Content-Type': 'multipart/form-data',  // Ensure the correct content type for form data
    },
  };

  // Send the API request
  fetch(`${BaseURL}SupervisorSignup`, requestOptions)
    .then(async (response) => {
      console.log("Response Status:", response.status);

      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        const rawResponse = await response.text();
        console.log("Raw Response:", rawResponse);
        throw new Error("Expected JSON response but got something else");
      }

      return response.json();
    })
    .then((result) => {
      console.log("API Response:", result);
      if (result.status === "User with the same email already exists") {
        Alert.alert("Signup Failed", result.status);
      } else {
        Alert.alert("Supervisor Registered Successfully");
      }
    })
    .catch((error) => {
      console.error("Error during signup:", error);
      Alert.alert("Signup Failed", `An error occurred: ${error.message}`);
    });
};


console.log("FormData values:");
console.log("FullName:", fullName);
console.log("Email:", email);
console.log("Password:", password);
console.log("Gender:", value);
console.log("DOB:", dob);
console.log("Role:", role);
console.log("Doctor's Id:", id);

console.log("Selected Image:", selectedImage);

////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////



  const openImagePicker = () => {
    Alert.alert(
      "Select Option",
      "Choose Image from gallery or camera",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
        },
        {
          text: "Gallery",
          onPress: () => openGallery(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  // Open Camera to capture image
  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'front',
      quality: 1,
    };
    
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  // Open Gallery to pick image
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };




  // Function to show the date picker modal
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Function to hide the date picker modal
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Function to handle the selected date
  const handleConfirm = (date) => {
    setDOB(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    hideDatePicker();
  };





    return(
        <SafeAreaView style={styles.back}>
            
            <View style={styles.view1}>

                <Text style={styles.txt}>
                        Supervisor Signup
                </Text>

            </View>

            <View style={styles.imgInput}>
                
            {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (                

            <IconButton
                icon="camera"
                size={30}
                iconColor="#7C0909"
                style={{marginLeft:50,marginTop:45}}
                onPress={openImagePicker}
              
            />     
        )}
            </View>

                <Text style={styles.txt2}> Enter your Details</Text>

            <View style={styles.formView}>

            <TextInput
                  
                  style={styles.input}
                   placeholder="Full Name"
                   placeholderTextColor="#888" 
                   onChangeText={a => setFullName(a)}
            
            />

<TextInput
                  
                  style={styles.input}
                   placeholder="Email"
                   placeholderTextColor="#888" 
                   onChangeText={a => setEmail(a)}
            
            />

<TextInput
                  
                  style={styles.input}
                   placeholder="Password"
                   placeholderTextColor="#888" 
                   onChangeText={a => setPassword(a)}
            />

<View   style={{ 
                    backgroundColor:'white',
                    marginLeft:17,
                    marginTop:20,
                }}>  

                <Text style={{ 
                    fontSize:19,
                    color:'grey',
                    backgroundColor:'#FFFAFA'
                }}>Gender</Text>
            
     </View>

     <View style={{
       
        marginLeft:10,
        marginTop:10
                
     }}>
              <RadioButton.Group onValueChange={newValue=>setValue(newValue)} value={value}>

              <View style={{flexDirection:'row'}}>
                
                <View style={{alignItems:'center',flexDirection:'row'}}>
    
                    <RadioButton value="M" />
         
                         <Text>Male</Text>
                
                </View>

                <View style={{alignItems:'center',flexDirection:'row'}}>
 
                    <RadioButton value="M" />
 
                         <Text>Female</Text>
 
                 </View>

    </View>

</RadioButton.Group>

</View>

            <View style={{width:336,height:1,borderWidth:1,borderColor:'grey',marginLeft:5,marginTop:5}}></View>
           

            <TextInput
                  
                  style={styles.input}
                   placeholder="Date of Birth"
                   placeholderTextColor="#888" 
                   onChangeText={a => setDOB(a)}
                   value={dob} // Display the selected date
                   editable={false} // Disable manual editing
            />
             <IconButton
                icon="calendar-today"
                size={30}
                iconColor="#7C0909"
                style={{marginLeft:290,marginTop:-50}}
                onPress={showDatePicker} // Open the date picker when icon is clicked
               
        />
           {/* Date Picker Modal */}
           <DateTimePickerModal 
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
           
          />

            </View>
            
          <Button style={styles.btnSign} onPress={handleSignup}>

                <Text style={styles.sign}>Register</Text>

          </Button>
      
            
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({



    back:{
        backgroundColor:'#FDF4F4'
    },

    view1:{
        height:100,
        width:385,
        backgroundColor:"#7C0909",
    },
    txt:{
        color:'white',
        fontSize:30,
        fontWeight:'bold',
        alignSelf:'center',
        marginTop:33
    },
    imgInput:{
        width:85,
        height:85,
        borderWidth:1,
        borderColor:'black',
        marginTop:15,
        marginLeft:15,
        borderRadius:50
        
    },

    image: {
        width: 85,
        height: 85,
        borderRadius: 50,
      },

    txt2:{
        alignSelf:'center',
        fontSize:28,
        fontWeight:'bold',
        color:'#7C0909',
        marginTop:25,
        marginLeft:5
    },

    formView:{
        position:'absolute',
        width:340,
        height:400,
        top:270,
        left:17,
        borderWidth:0
    },

    input:{
        borderBottomWidth:1,
        backgroundColor:'#FFFAFA',
        marginLeft:5,
        fontSize:18,
        marginTop:5
    },

    btnSign:{
        backgroundColor:"#7C0909",
        borderColor:'white',
        width:340,
        height:50,
        marginTop:420,
        alignSelf:'center',
    },

    sign:{
        color:'white',
        fontSize:17,
        fontWeight:'bold',
        marginTop:13
    }



})