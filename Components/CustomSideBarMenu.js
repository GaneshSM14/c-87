import * as React from 'react'
import { ImagePickerIOS, Text,TouchableOpacity,View} from 'react-native'
import { DrawerItems} from 'react-navigation-drawer'
import Welcome from '../Screens/Welcome';
import firebase from 'firebase'
import {Avatar} from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
export default class CustomSideBarMenu extends React.Component{
    constructor(){
        super()
        this.state={
            image:'',
Userid:firebase.auth().currentUser.email
        }
    }
    selectpicture=async()=>{
        const{cancelled,uri}=await ImagePicker.launchImageLibraryAsync({
mediatypes:ImagePicker.mediatypesOptions.all,
allowsEditing:true,
aspect:[4,3],
quality:1
        })
        if(!cancelled){
            this.uploadImage(uri,this.state.Userid)
        }
    }
    uploadImage=async(uri,email)=>{
         var ref = firebase.storage().ref().child("UserProfile/"+email)
        var response=await fetch(uri);
        var blob=await response.blob()
        return ref.put(blob).then((response)=>{
            this.fetchimage(email)
        })
    }
    fetchimage=(email)=>{
        var storageref =firebase.storage().ref().child("UserProfile/"+email)
        storageref.getDownloadURL().then((url)=>{
            this.setState({image:url})
        })
    }
    render(){
        return(
            <View style={{flex:1}}>
                <Avatar 
                rounded
                source={{uri:this.state.image}}
                size="medium"
                onPress={()=>{this.selectpicture()}}
                showEditButton
                />
                <DrawerItems {...this.props}/>
                <TouchableOpacity onPress={()=>{firebase.auth().signOut();this.props.navigation.navigate('Welcome')}}>
                    <Text>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}