import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, RadioButton, Text, TextInput, IconButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import BaseURL from "./BaseURL";

export default function DoctorSignUp() {
  let [fullName, setFullName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [gender, setGender] = useState("");
  let [dob, setDOB] = useState("");
  let [contact, setContact] = useState("");
  let [role, setRole] = useState("doctor");
  let [value, setValue] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


   

    const handleSignup = () => {
      const formdata = new FormData();
    
      // Create a JSON object for the form data
      const formDataJson = {
        name: fullName,
        email: email,
        password: password,
        gender: value, // Gender selected from RadioButton
        dob: dob,
        contact: contact,
        role: role,
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
      fetch(`${BaseURL}DoctorSignup`, requestOptions)
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
            Alert.alert("Signup Successful", "Welcome to the platform!");
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
console.log("Contact:", contact);
console.log("Role:", role);
console.log("Selected Image:", selectedImage);

    ////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////




    const openImagePicker = () => {
      Alert.alert(
        "Select Option",
        "Choose Image from gallery or camera",
        [
          { text: "Camera", onPress: () => openCamera() },
          { text: "Gallery", onPress: () => openGallery() },
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
      );
    };
  
    const openCamera = () => {
      const options = { mediaType: "photo", cameraType: "front", quality: 1 };
      launchCamera(options, (response) => {
        if (!response.didCancel && !response.errorMessage) {
          setSelectedImage(response.assets[0].uri);
        }
      });
    };
  
    const openGallery = () => {
      const options = { mediaType: "photo" };
      launchImageLibrary(options, (response) => {
        if (!response.didCancel && !response.errorMessage) {
          setSelectedImage(response.assets[0].uri);
        }
      });
    };
  
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirm = (date) => {
      setDOB(date.toISOString().split("T")[0]);
      hideDatePicker();
    };
  
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView style={styles.back}>
              <View style={styles.view1}>
                <Text style={styles.txt}>Doctor Signup</Text>
              </View>
  
              <View style={styles.imgInput}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.image} />
                ) : (
                  <IconButton
                    icon="camera"
                    size={30}
                    iconColor="#7C0909"
                    style={{ marginLeft: 50, marginTop: 45 }}
                    onPress={openImagePicker}
                  />
                )}
              </View>
  
              <Text style={styles.txt2}>Enter your Details</Text>
  
              <View style={styles.formView}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#888"
                  onChangeText={(a) => setFullName(a)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  onChangeText={(a) => setEmail(a)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  onChangeText={(a) => setPassword(a)}
                />
  
                <View
                  style={{
                    backgroundColor: "white",
                    marginLeft: 17,
                    marginTop: 20,
                  }}
                >
                  <Text style={{ fontSize: 19, color: "grey", backgroundColor: "#FDF4F4" }}>
                    Gender
                  </Text>
                </View>
  
                <View style={{ marginLeft: 10, marginTop: 10 }}>
                  <RadioButton.Group
                    onValueChange={(newValue) => setValue(newValue)}
                    value={value}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ alignItems: "center", flexDirection: "row" }}>
                        <RadioButton value="M" />
                        <Text>Male</Text>
                      </View>
                      <View style={{ alignItems: "center", flexDirection: "row" }}>
                        <RadioButton value="F" />
                        <Text>Female</Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
  
                <TextInput
                  style={styles.input}
                  placeholder="Date of Birth"
                  placeholderTextColor="#888"
                  value={dob}
                  editable={false}
                />
                <IconButton
                  icon="calendar-today"
                  size={30}
                  iconColor="#7C0909"
                  style={{ marginLeft: 290, marginTop: -50 }}
                  onPress={showDatePicker}
                />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
  
                <TextInput
                  style={styles.input}
                  placeholder="Contact"
                  placeholderTextColor="#888"
                  onChangeText={(a) => setContact(a)}
                />
              </View>
  
              <Button style={styles.btnSign} onPress={handleSignup}>
                <Text style={styles.sign}>Signup</Text>
              </Button>
            </SafeAreaView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    back: { backgroundColor: "#FDF4F4", flex: 1 },
    view1: { height: 100, width: 385, backgroundColor: "#7C0909" },
    txt: { color: "white", fontSize: 30, fontWeight: "bold", alignSelf: "center", marginTop: 33 },
    imgInput: { width: 85, height: 85, borderWidth: 1, borderColor: "black", marginTop: 10, marginLeft: 15, borderRadius: 50 },
    image: { width: 85, height: 85, borderRadius: 50 },
    txt2: { alignSelf: "center", fontSize: 28, fontWeight: "bold", color: "#7C0909", marginTop: 10, marginLeft: 5 },
    formView: { width: 340, marginLeft: 17, borderWidth: 0 },
    input: { borderBottomWidth: 1, backgroundColor: "transparent", fontSize: 18, marginTop: 5 },
    btnSign: { backgroundColor: "#7C0909", width: 340, height: 50, marginTop: 20, alignSelf: "center" },
    sign: { color: "white", fontSize: 17, fontWeight: "bold", textAlign: "center", marginVertical: 13 },
  });