import React from "react";
import { Button } from "react-native-paper";
import { Text } from "react-native-paper";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

export default function StartEEG({navigation}){

    return(
        <SafeAreaView style={styles.back}>


            <View style={styles.view1}>

                    <Text style={styles.txt}>
                            Decode Your Emotions 
                    </Text>

                    <Text style={styles.txt1}>
                             with EEG Technology 
                    </Text>
                   
                    <Image style={styles.img}
                source={{uri:'brain2'}}
                    
                    />

            </View>

        <View style={styles.view2}>

        <Button style={styles.btn} onPress={() => navigation.navigate('LoginEEG')}>
         
          <Text style={{color:'white',fontWeight:'bold',fontSize:20,marginTop:25}}>
             Login
           </Text>



        </Button>

        <Button style={styles.btn} onPress={() => navigation.navigate('SelectRole')}>
           
           <Text style={{color:'white',fontWeight:'bold',fontSize:20,marginTop:27}}>
             Create an Account
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
            height:500,
            width:390,
            backgroundColor:"#7C0909"
            
    },

    txt:{
            color:'white',
            fontSize:30,
            fontWeight:'bold',
            marginLeft:20,
            marginTop:50
            
    },
    txt1:{
        color:'white',
        fontSize:30,
        fontWeight:'bold',
        marginLeft:35,
        marginTop:10
       
        
    },

    view2:{

           marginTop:15
    },
    btn:{
            backgroundColor:"#7C0909",
            width:360,
            height:70,
            marginTop:27,
            alignSelf:'center',
            
    },

    img:{
        alignSelf:'center',
        width:230,
        height:280,
        marginTop:30,
        borderRadius:60
    }

})