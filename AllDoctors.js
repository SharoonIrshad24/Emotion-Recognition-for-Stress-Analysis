import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, ActivityIndicator,Alert } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Portal,Modal,TextInput } from "react-native-paper";
import { Image } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import BaseURL from "./BaseURL";

export default function AllDoctors({ navigation , route}) {


  const { patientId } = route.params;

  const [responseText, setResponseText] = useState('');
  const [status,setStatus]= useState("false")

  let [slots, setSlots] = useState([])

  

  const [selectedSlot, setSelectedSlot] = useState(null); // Selected slot value


  
  const time_slots = [
    { label: '10:00:00', value: '10:00:00' },
    { label: '11:00:00', value: '11:00:00' },
    { label: '12:00:00', value: '12:00:00' },
    { label: '01:00:00', value: '01:00:00' },
    { label: '02:00:00', value: '02:00:00' },
    { label: '03:00:00', value: '03:00:00' },
    { label: '04:00:00', value: '04:00:00' },
    { label: '05:00:00', value: '05:00:00' },
  ];  
  

    // const filteredUsers = time_slots.filter(user =>
    //   user.name.toLowerCase().includes(searchText.toLowerCase())
    // );

    const [emailName,setNameEmail]=useState('')
    const [iD,setID]=useState('')

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [imgpath,setImage]=useState('') // State to hold the image URL

  const [name,setName]=useState('')
  let [date,setDate]=useState('');
  let [time,setTime]=useState('')

 

  //////////////////////////////////////////////////  

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // State to control date picker visibility

    const [visible, setVisible] = React.useState(false);
      

        const showModal = () => setVisible(true);
        const hideModal = () => setVisible(false);
        const containerStyle = {backgroundColor: 'transparent', padding: 20};  

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
   
    const formattedDate=date.toLocaleDateString('en-CA');  // Format date as YYYY-MM-DD
    setDate(formattedDate)
    hideDatePicker();
   
    console.log(formattedDate)
   
    fetchSlots(formattedDate, iD); // Pass the doctor ID and selected date to fetch slots
    
    // Fetch time slots immediately after the date is selected
   
    // if (iD) {
    //   fetchSlots(formattedDate, iD); // Pass the doctor ID and selected date to fetch slots
    // } else {
    //   console.error("Doctor ID is not set");
    // }
   

  }

  const fetchSlots = async (date, iD) => {
    try {
      const formData = new FormData();
     
    
      formData.append("date", date);
      formData.append("doctor_id", iD);
      
      console.log("Date of Appointment : " , date)
      console.log("Doctor ki ID : ",iD)
  
      const requestOptions = {
        method: "POST",
        body: formData, // Pass formData directly as the body
        redirect: "follow",
      };
      
   console.log(formData)


      const response = await fetch(`${BaseURL}getTimeSlots`, requestOptions);

      // console.log(response)
     
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("API returned 404. Displaying default time slots.");
          setSlots(time_slots); // Set fallback slots if API returns 404
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
    const result = await response.json();
    console.log("Fetched Slots:", result);


    // Create a set for faster lookups
    const extractedTimes = result.map(slot => slot.time.split('.')[0].trim());
  console.log('Extracted Times:', extractedTimes);

  // Create a set for faster lookups
  const extractedSet = new Set(extractedTimes);
  console.log('Extracted Set:', extractedSet);

  // Filter time_slots to exclude extracted times
  const filteredSlots = time_slots.filter(slot => {
    const trimmedValue = slot.value.trim(); // Ensure trimmed comparison
    console.log(
      `Checking Slot: ${trimmedValue} - In ExtractedSet: ${extractedSet.has(trimmedValue)}`
    );
    return !extractedSet.has(trimmedValue);
  });

  console.log('Filtered Slots:', filteredSlots);

  // Update slots state
  setSlots(filteredSlots.length > 0 ? filteredSlots : time_slots);
} catch (error) {
  console.error('Error filtering slots:', error);

  // Fallback to default slots in case of error
  setSlots(time_slots);
}


  //   const extractedTimes = result.map(slot => slot.time.split('.')[0]);
  //   console.log("Extracted Times:", extractedTimes);

  //   const extractedSet = new Set(extractedTimes);
  //   const filteredSlots = time_slots.filter(slot => !extractedSet.has(slot.value));

  //   console.log("Filtered Slots:", filteredSlots);

  //   setSlots(filteredSlots); // Update the slots state
  // } catch (error) {
  //   console.error("Error fetching Slots:", error);
  //   setSlots(time_slots); // Fallback to default slots on error
  // }
  //     const result = await response.json();
    
  //     console.log("Fetched Slots:", result);

  


      
      
  //     const extractedTimes = result.map(slot => {
  //       // Split the time string by '.' to remove milliseconds and get only the time part
  //       return slot.time.split('.')[0];
  //     });

  //     console.log(extractedTimes)

      
  //     const filteredSlots = extractedTimes?.length > 0
  //     ? time_slots.filter(slot => !extractedTimes.includes(slot.value)) // Filter slots based on the API response
  //     : time_slots; // Use all slots if no slots are coming from the API
    
  //   console.log("Filtered Slots:", filteredSlots);
    
  //   // // Check if filteredSlots is empty and set fallback
  //   // if (filteredSlots.length === 0) {
  //   //   console.warn("No available slots from API. Displaying default time slots.");
  //   //   setSlots(time_slots); // Show all old slots
  //   // } else {
  //   //   setSlots(filteredSlots); // Display filtered slots
  //   // }

  //   // Assuming response and filteredSlots are variables you are working with



  // if (response.status === 404) {
  //   console.warn("API returned 404. Displaying default time slots.");
  //   setSlots(time_slots); // Set fallback slots if API returns 404
  //   return;
  // }

  // // Check if filteredSlots is empty and set fallback
  // if (!filteredSlots || filteredSlots.length === 0) {
  //   console.warn("No available slots from API. Displaying default time slots.");
  //   setSlots(time_slots); // Show all old slots
  // } else {
  //   setSlots(filteredSlots); // Display filtered slots
  // }






  //   } catch (error) {
  //     console.error("Error fetching Slots:", error);
  //   }
  }

 
 
 
   

  
  
  /////////////////////////////////////////////////////////////////////////////////////



  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        // Fetch the list of doctors from the API
        const response = await fetch(`${BaseURL}getAllDoctors`, requestOptions);
        const result = await response.json();
        
        setDoctors(result); // Set doctors' data
        console.log(result)

        
        //  Log each doctor's email to the console
      result.forEach((index) => {
        console.log(index.email); // Assuming each doctor object has an 'email' field
        
      });

      
        
        setLoading(false); // Stop the loading indicator
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoading(false); // Stop loading in case of an error
      }
    };

    fetchDoctors();
    
  }, []);


  
//////////////////////////////////////////////////////////////////////////////
// get Doctor by Email

//is me doctor ki Id bhi aye gii

const fetchDoctorInfo = async (email) => {
  try {
      const response = await fetch(`${BaseURL}getDoctorByEmail/${email}`);
      if (!response.ok) {
          throw new Error(`Error fetching doctor data: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Doctor data:', result);
      setNameEmail(result.email);
      
      const {id}=result
      setID(id)
      console.log(id)
      
  } catch (error) {
      console.error('Error:', error);
  } finally {
      setLoading(false);
  }
};

///////////////////////////////////////////////////////////////////////////////


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }


  console.log(patientId)


  ///////////////////////////////////////////////////////////////////////////
  //add appointment

  const addAppointment = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      date: date,
      time: selectedSlot,
      status: status,
      doctorid: iD,
      patientid: patientId,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(`${BaseURL}/addAppointment`, requestOptions);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.text();
      setResponseText(result);
      console.log(result);

      Alert.alert("Appoinment Added")
    } catch (error) {
      console.error('Error:', error);
      setResponseText(`Error: ${error.message}`);
      Alert.alert("Not Added , " , {error})
    }
  }

    ////////////////////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.back}>

      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.view1}>
        
          <IconButton
            icon="arrow-left"
            size={28}
            iconColor="white"
            style={{ marginLeft: 0 }}
           
          />
        
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20, marginTop: 14 }}>Doctors</Text>
        
          <IconButton icon="bell" size={28} iconColor="white" style={{ marginLeft: 145 }} />
        
          <IconButton icon="menu" size={30} iconColor="white" />
        
        </View>


        <Text style={{ color: "black", fontWeight: "bold", fontSize: 20, marginTop: 14, marginLeft: 10 }}>
          Schedule your Appointment
        </Text>



        {/* Map through the doctors array and display each doctor's info */}
        {doctors.map((doctor, index) => (
          
            <View key={index} style={styles.patientDetail}>
            
            <View style={styles.image}>

            <Image
        source={{ uri: `${BaseURL}/image/${doctor.imgpath}` }} // Replace with your image URL
        style={styles.image1}
        resizeMode="cover" // Optional: adjust how the image scales
      />

            </View>
            
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 17, paddingTop: 15, paddingLeft: 10 }}>
              {doctor.name} {/* Display the doctor's name */}
            </Text>
            {/* <Text>{doctor.email}</Text> */}
            
            <Button style={styles.detail} onPress={async () => {
  showModal();
  await fetchDoctorInfo(doctor.email);
}} >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 15, paddingTop: 5 }}>
                Schedule Appointment
              </Text>
            
            </Button>
         
          </View>
        
        ))}
      
      </ScrollView>

      <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
              <View style={styles.schedule}>
                  <Text style={{color:"#7C0909",fontWeight:'bold',fontSize:23,paddingTop:30,textAlign:'center'}}>Schedule Appointment</Text>

                  <View style={{height:50}}></View>

            <TextInput
                  
                  style={{backgroundColor:'white',borderRadius:20,width:330,alignSelf:'center',borderWidth:0}}
                   placeholder="Date"
                   placeholderTextColor="#888" 
                   value={date} // Display the selected date
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


            <View style={{height:10}}></View>

            <Text>
                  

            </Text>
           
            {/* <Dropdown
                style={styles.dropdown}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder='Time'
                data={slots} // Pass the filtered slots here
                value={null} // Initially no value selected
                onChange={item => console.log('Selected:', item)} // Log selected value
             />  */}
             <Dropdown
  style={styles.dropdown}
  maxHeight={300}
  labelField="label"
  valueField="value"
  placeholder="Select a Time Slot"
  data={slots || []} // Ensure data is always an array
  value={selectedSlot} // Controlled state for the selected value
  onChange={item => {
    console.log('Selected:', item);
    setSelectedSlot(item.value); // Update selected slot
  }}
/>




            <Button style={styles.setAppoint} onPress={()=>{
              addAppointment(),
              hideModal()
            }}
              >
                <Text style={{color:"white",fontWeight:'bold',fontSize:20,paddingTop:10,textAlign:'center'}}>Schedule</Text>
            </Button>

            <Button style={styles.setAppoint} onPress={hideModal}>
                <Text style={{color:"white",fontWeight:'bold',fontSize:20,paddingTop:10,textAlign:'center'}}>Cancel</Text>
            </Button>


        

              </View>

              
         
          </Modal>
      </Portal>
      
    
    </SafeAreaView>
  );


}

const styles = StyleSheet.create({



  image1: {
    width: 85,
    height: 85,
    borderRadius: 30,
    
  },

  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom:10,
  },
  
  back: {
    backgroundColor: "#FDF4F4",
    flex: 1, // Ensure the SafeAreaView takes up the entire screen
  },
  view1: {
    height: 65,
    width: 385,
    backgroundColor: "#7C0909",
    flexDirection: "row",
  },
  patientDetail: {
    height: 130,
    width: 340,
    marginTop: 40,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
    
    borderRadius: 50,
  },
  detail: {
    width: 225,
    height: 45,
    position:'absolute',
    top: 65,
    left:100,
    backgroundColor: "#7C0909",
    borderRadius: 15,
  },

  schedule:{
    height:650,
    width:340,
    borderRadius:50,
    backgroundColor:"#FDF4F4"
  },

  setAppoint:{
    height:60,
    width:200,
    marginTop:50,
    alignSelf:'center',
    borderRadius:15,
    backgroundColor:"#7C0909"
  },
  dropdown: {
    height: 60,
    width:330,
    marginLeft:0,
    alignSelf:'center',
    marginTop:9,
    backgroundColor:"white",
    borderColor: 'gray',
    borderRadius: 8,
    margin:5,
    paddingHorizontal:10,
  }

});

