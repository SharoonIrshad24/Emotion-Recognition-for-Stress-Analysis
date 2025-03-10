import React from "react";
import { PaperProvider} from "react-native-paper";
import StartEEG from "./StartEEG";
import SelectRole from "./SelectRole";
import DoctorSignUp from "./DoctorSignUp";
import PatientSignUp from "./PatientSignUp";
import SupervisorSignUp from "./SupervisorSignUp";
import LoginEEG from "./LoginEEG";
import NavigationEEG from "./NavigationEEG";
import DoctorDashboard from "./DoctorDashboard";
import drawerTest from "./drawerTest";
import Test from "./Test";
import UpcomingAppoinments from "./UpcomingAppoinments";
import TabNavigationEEG from "./TabNavigationEEG";
import RegisteredPatients from "./RegisteredPatients";
import PatientDetails from "./PatientDetails";
import Result from "./Result";
import PatientDashboard from "./PatientDashboard";
import AllDoctors from "./AllDoctors";
import APITest from "./APITest";
import Prescription from "./Prescription";
import PrescriptionForPatient from "./PrescriptionForPatient";
import SupervisorDashboard from "./SupervisorDashboard";
import SelectChannel from "./SelectChannel";
import SupervisorUpload from "./SupervisorUpload";
import GraphTest from "./GraphTest";
import LoadingScreen from "./LoadingScreen";
import FusionResult from "./FusionResult";
import MultiRecording from "./MultiRecording";
import ResultTask from "./ResultTask";


export default function Main(){

    return(<PaperProvider>






        {/* <LoadingScreen></LoadingScreen> */}
        {/* <GraphTest></GraphTest> */}
           
        <NavigationEEG></NavigationEEG>

        {/* <ResultTask></ResultTask> */}
{/* <MultiRecording></MultiRecording> */}
        {/* <FusionResult></FusionResult> */}

        {/* <StartEEG></StartEEG> */}

        {/* <SelectRole></SelectRole> */}


        {/* <DoctorSignUp></DoctorSignUp> */}
          {/* <PatientSignUp></PatientSignUp> */}
           {/* <SupervisorSignUp></SupervisorSignUp> */}

           {/* <LoginEEG></LoginEEG> */}



        {/* <DoctorDashboard></DoctorDashboard> */}
        {/* <UpcomingAppoinments></UpcomingAppoinments> */}
        {/* <RegisteredPatients></RegisteredPatients> */}

        
        
        {/* <PatientDetails></PatientDetails> */}
      
        {/* <AllDoctors></AllDoctors> */}
        
        

        {/* <SupervisorDashboard></SupervisorDashboard> */}
        {/* <SelectChannel></SelectChannel> */}
        {/* <SupervisorUpload></SupervisorUpload> */}


        {/* <Result></Result> */}

        {/* <Prescription></Prescription> */}


        {/* <PatientDashboard></PatientDashboard> */}
        {/* <PrescriptionForPatient></PrescriptionForPatient> */}


        {/* <drawerTest></drawerTest> */}

        {/* <TabNavigationEEG></TabNavigationEEG> */}

         {/* <Start></Start> */}

        {/* <MyComponent12></MyComponent12> */}
        {/* <Test></Test> */}
        {/* <NavigationEmo></NavigationEmo> */}
        {/* <StartEmo></StartEmo> */}
        



        {/* <APITest></APITest> */}


       
    
    
    </PaperProvider>)

}