import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from "react-native";
import { Button, RadioButton, Text, TextInput, IconButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import BaseURL from "./BaseURL";

export default function PatientSignUp() {
  let [fullName, setFullName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [gender, setGender] = useState("");
  let [dob, setDOB] = useState("");
  let [height, setHeight] = useState("");
  let [weight, setWeight] = useState("");
  let [contact, setContact] = useState("");
  let [role, setRole] = useState("patient");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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
    gender: gender, // Gender selected from RadioButton
    dob: dob,
    weight:weight,
    height:height,
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
  fetch(`${BaseURL}PatientSignup`, requestOptions)
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
console.log("Gender:", gender);
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
            <Text style={styles.txt}>Patient Signup</Text>
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
              secureTextEntry
              onChangeText={(a) => setPassword(a)}
            />

            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender</Text>
              <RadioButton.Group
                onValueChange={(newValue) => setGender(newValue)}
                value={gender}
              >
                <View style={styles.genderOptions}>
                  <View style={styles.genderOption}>
                    <RadioButton value="M" />
                    <Text>Male</Text>
                  </View>
                  <View style={styles.genderOption}>
                    <RadioButton value="F" />
                    <Text>Female</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Height"
              placeholderTextColor="#888"
              onChangeText={(a) => setHeight(a)}
            />

            <TextInput
              style={styles.input}
              placeholder="Weight"
              placeholderTextColor="#888"
              onChangeText={(a) => setWeight(a)}
            />

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
              style={styles.datePickerIcon}
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
view1: { height: 70, width: "100%", backgroundColor: "#7C0909" },
txt: { color: "white", fontSize: 30, fontWeight: "bold", alignSelf: "center", marginTop: 18 },
imgInput: {
  width: 85,
  height: 85,
  borderWidth: 1,
  borderColor: "black",
  marginTop: 10,
  marginLeft: 10,
  borderRadius: 50,
},
txt2: { alignSelf: "center", fontSize: 27, fontWeight: "bold", color: "#7C0909", marginTop: 6 },
image: { width: 85, height: 85, borderRadius: 50 },
formView: { width: "90%", alignSelf: "center", marginTop: 20 },
input: {
  borderBottomWidth: 1,
  backgroundColor: "transparent",
  fontSize: 17,
  marginBottom: 10,
},
genderContainer: { marginTop: 10 },
genderLabel: { fontSize: 19, color: "grey" },
genderOptions: { flexDirection: "row", marginTop: 5 },
genderOption: { flexDirection: "row", alignItems: "center", marginRight: 20 },
datePickerIcon: { marginLeft: "85%", marginTop: -60 },
btnSign: { backgroundColor: "#7C0909", width: "90%", height: 50, alignSelf: "center", marginTop: 23 ,marginBottom:15},
sign: { color: "white", fontSize: 17, fontWeight: "bold", textAlign: "center", marginTop: 13 },
});