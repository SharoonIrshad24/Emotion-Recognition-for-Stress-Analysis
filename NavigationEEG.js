import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartEEG from "./StartEEG";
import LoginEEG from "./LoginEEG";
import SelectRole from "./SelectRole";
import DoctorSignUp from "./DoctorSignUp";
import PatientSignUp from "./PatientSignUp";
import SupervisorSignUp from "./SupervisorSignUp";
import UpcomingAppoinments from "./UpcomingAppoinments";
import DoctorDashboard from "./DoctorDashboard";
import RegisteredPatients from "./RegisteredPatients";
import Result from "./Result";
import AllDoctors from "./AllDoctors";
import PatientDashboard from "./PatientDashboard";
import PatientDetails from "./PatientDetails";
import Prescription from "./Prescription";
import ResultPatient from "./ResultPatient";
import SupervisorUpload from "./SupervisorUpload";
import SelectChannel from "./SelectChannel";
import PrescriptionForPatient from "./PrescriptionForPatient";
import SupervisorDashboard from "./SupervisorDashboard";
import LoadingScreen from "./LoadingScreen";
import Experiments from "./Experiments";
import ExperimentsforPatient from "./ExperimentsforPatient";
import SupervisorUploadFusion from "./SupervisorUploadFusion";
import FusionResult from "./FusionResult";
import ResultTask from "./ResultTask";
import ResultTask2 from "./ResultTask2";



const Stack = createNativeStackNavigator()  

export default function NavigationEEG(){

    return(<NavigationContainer>

        <Stack.Navigator initialRouteName="LoadingScreen">

        <Stack.Screen name="StartEEG" component={StartEEG} 
             options={{
                headerShown: false, // Hide the default header
              }}    
        />

        
        <Stack.Screen name="LoginEEG" component={LoginEEG}

options={{
    headerShown: false, // Hide the default header
  }}   
        />


        <Stack.Screen name="SelectRole" component={SelectRole}
        
        options={{
          headerShown: false
        }}
        />


        <Stack.Screen name="DoctorSignUp" component={DoctorSignUp}
        
        options={{
          headerShown: false
        }}
        />


        <Stack.Screen name="PatientSignUp" component={PatientSignUp}
        
        options={{
          headerShown: false
        }}
        />


       <Stack.Screen name="SupervisorSignUp" component={SupervisorSignUp}
        
        options={{
          headerShown: false
        }}
        />

<Stack.Screen name="DoctorDashboard" component={DoctorDashboard}
        
        options={{
          headerShown: false
        }}
        />
       

<Stack.Screen name="UpcomingAppoinments" component={UpcomingAppoinments}
        
        options={{
          headerShown: false
        }}
        />

<Stack.Screen name="Experiments" component={Experiments}
        
        options={{
          headerShown: false
        }}
        />

<Stack.Screen name="RegisteredPatients" component={RegisteredPatients}
        
        options={{
          headerShown: false
        }}
        />

<Stack.Screen name="PatientDetails" component={PatientDetails}
        
        options={{
          headerShown: false
        }}
        />
       

       <Stack.Screen name="Result" component={Result}
        
        options={{
          headerShown: false
        }}
        />


<Stack.Screen name="FusionResult" component={FusionResult}
        
        options={{
          headerShown: false
        }}
        />
       
       <Stack.Screen name="Prescription" component={Prescription}
        
        options={{
          headerShown: false
        }}
        />
       

       <Stack.Screen name="AllDoctors" component={AllDoctors}
        
        options={{
          headerShown: false
        }}
        />


      <Stack.Screen name="PatientDashboard" component={PatientDashboard}
        
        options={{
          headerShown: false
        }}
        />


<Stack.Screen name="ResultPatient" component={ResultPatient}
        
        options={{
          headerShown: false
        }}
        />

<Stack.Screen name="ResultTask" component={ResultTask}
        
        options={{
          headerShown: false
        }}
        />

<Stack.Screen name="ResultTask2" component={ResultTask2}
        
        options={{
          headerShown: false
        }}
        />

        
<Stack.Screen name="ResultTask3" component={ResultTask3}
        
        options={{
          headerShown: false
        }}
        />

<Stack.Screen name="ExperimentsforPatient" component={ExperimentsforPatient}
        
        options={{
          headerShown: false
        }}
        />

     

<Stack.Screen name="LoadingScreen" component={LoadingScreen}
        
        options={{
          headerShown: false
        }}
        />

        

<Stack.Screen name="PrescriptionForPatient" component={PrescriptionForPatient}
        
        options={{
          headerShown: false
        }}
        />

<Stack.Screen name="SupervisorDashboard" component={SupervisorDashboard}
        
        options={{
          headerShown: false
        }}
        />
       
       <Stack.Screen name="SelectChannel" component={SelectChannel}
        
        options={{
          headerShown: false
        }}
        />

       <Stack.Screen name="SupervisorUpload" component={SupervisorUpload}
        
        options={{
          headerShown: false
        }}
        />
       
      

       <Stack.Screen name="SupervisorUploadFusion" component={SupervisorUploadFusion}
        
        options={{
          headerShown: false
        }}
        />

        
       
      
       
        </Stack.Navigator>

    </NavigationContainer>)

}

const styles = StyleSheet.create({
    header: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: 'white',
      elevation: 4, // Adds a shadow on Android for header appearance
    },
    backButton: {
      padding: 10,
    },
    backText: {
      fontSize: 24,
      color: 'black',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });