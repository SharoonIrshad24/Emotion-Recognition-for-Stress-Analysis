import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { Text } from "react-native-paper";



export default function SelectRole({navigation}){

    return(
        <SafeAreaView style={styles.back}>

            <View style={styles.view1}>

                <Text style={styles.txt1}>
                    Select Your Role
                </Text>

            </View>

            <View style={styles.viewBtn}>

                <Button style={styles.btn} onPress={()=>navigation.navigate('DoctorSignUp')}>
                         <Text style={styles.txt2}>Doctor</Text>
                         
                </Button>


                <Button style={styles.btn} onPress={()=>navigation.navigate('PatientSignUp')}>
                         <Text style={styles.txt2}>Patient</Text>
                         
                </Button>
                
                {/* <Button style={styles.btn} onPress={()=>navigation.navigate('SupervisorSignUp')}>
                         <Text style={styles.txt2}>Supervisor</Text>
                         
                </Button> */}

                    <Text></Text>
                 <Text style={{alignSelf:'center',fontSize:14,marginTop:15,fontWeight:'bold'}}>
                                    
                                    Already have an account?
                                    
                                </Text>
                
                                <Button style={{marginTop:10 }} onPress={() => navigation.navigate('LoginEEG')}>
                                    <Text style={{color:'#7C0909',fontWeight:'bold',fontSize:17}}>
                                        Login
                                    </Text>
                                </Button>
            </View>

        </SafeAreaView>
    )
}

const styles=StyleSheet.create({

    back:{
        backgroundColor:'#FDF4F4'
    },

    view1:{
        height:350,
        width:385,
        backgroundColor:"#7C0909",
        borderBottomEndRadius:0,
        borderBottomLeftRadius:170
    },

    txt1:{
        color:'white',
        fontSize:40,
        fontWeight:'bold',
        alignSelf:'center',
        marginTop:160
    },

    viewBtn:{
        marginTop:30
    },

    btn:{
        backgroundColor:"#7C0909",
        width:360,
        height:70,
        marginTop:17,
        alignSelf:'center',
    },
    txt2:{
        color:'white',
        fontSize:18,
        marginTop:21
    }

})