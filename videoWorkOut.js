import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import React, { Component, useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from 'react-native'; 
import * as Animatable from 'react-native-animatable';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Video, AVPlaybackStatus, Audio } from 'expo-av';
import { List } from 'react-native-paper';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Asset, useAssets } from 'expo-asset'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import SnackBar from 'rn-snackbar'
import * as Notifications from 'expo-notifications';
import * as Speech from 'expo-speech';
import SwitchSelector from "react-native-switch-selector";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const effortOptions = [ 
    { label: "Very Light", value: "Very Light" },
    { label: "Moderate", value: "Moderate" }, 
    { label: "Hard", value: "Hard" }, 
  ];
const locationOptions = [
    { label: "Gym", value: "Gym" },
    { label: "Home", value: "Home" },
    { label: "Outside", value: "Outside" } ,
  ];
 
const { width, height } = Dimensions.get('window')

export default function workOutVideoScreen ({route, navigation}){ 
    const { videos, token, user, workout } = route.params;  
    const [ bearerToken, setToken ] = useState(token);
    const [ userDetails, setUserDetails ] = useState(user); 
    const [ effort, setEffort ] = useState('');
    const [ location, setLocation ] = useState('');
    const [ useMUsic, setUseMusic ] = useState(true);
    const [ pauseVideo, setPauseVideo ] = useState(false);
    const [ durationSec, setDurationSec ] = useState('');
    const [ isReady, setIsReady ]= useState(false);
    const [ videoIndex, setvideoIndex ] = useState(0);
    const [ sectionIndex, setSectionIndex ] = useState(0);
    const [ currentVideo, setCurrentVideo ] = useState(videos.sections[sectionIndex].videos[videoIndex].url);
    const [ videoIndexing, setVideoIndexing ] = useState([]);
    const [ seconds, setSeconds ] = React.useState(0);
    const [ finishedWorkOut, setfinishedWorkOut ] = React.useState(false);
    const [ pauseVideoModal, setPauseVideoModal ] = useState(false);
    const video = useRef();  
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();   
    const soundPlaying = new Audio.Sound();
    // console.log(currentVideo);
    useEffect(() => {  
        setfinishedWorkOut(false)
        setvideoIndex(0) ;
        const timer = setInterval(() => {
            setSeconds(seconds => seconds + 1); 
        }, 1000);    
        navigation.addListener('beforeRemove', (e) => {      
            e.preventDefault(); 
            Alert.alert(
                'Discard changes?',
                'You have unsaved changes. Are you sure to discard them and leave the screen?',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => {} },
                    {
                        text: 'Discard',
                        style: 'destructive', 
                        onPress: async () => {
                            await soundPlaying.unloadAsync();
                            // await video;
                            navigation.dispatch(e.data.action)
                        },
                    },
                ]
            );
        }) 
        getUserDetails(); 
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token)); 
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        }); 
        return () => { 
            clearInterval(timer);
        };
    }, [])
  
    const getUserDetails = async () => {
        setPauseVideo(true);
        activateKeepAwake(); 
        var token = await AsyncStorage.getItem('token');
        var userDetails = await AsyncStorage.getItem('userDetails');  
        if(token !== null && userDetails !== null){ 
            setToken(JSON.parse(token));  
            setUserDetails(JSON.parse(userDetails)); 
            setPauseVideo(false);  
            const playMusicValue = await AsyncStorage.getItem('playMusic');  
            if(playMusicValue != null){ 
                updateCurrentVideo(JSON.parse(playMusicValue).playMusic);
            } else{
                updateCurrentVideo(false);
            } 
            setIsReady(true);  
        }else{
            deactivateKeepAwake(); 
            navigation.navigate('Login');
        }  
        return false;
    }  

    const updateCurrentVideo = async (canPlayMusic) => {          
        if(canPlayMusic === true) {
            playMusic();
            setUseMusic(true);
        }else{
            setUseMusic(false);
        }
        setIsReady(true); 
        sendPushNotification(expoPushToken, videos.name);
        return true;
    }

    const playMusic = async () =>{
        var playList = await AsyncStorage.getItem('workOut_audios');
        if(playList){
            var list = JSON.parse(playList); 
            list.map( async (item, index) => { 
                try {
                    await soundPlaying.loadAsync({ uri: item.uri });
                    await soundPlaying.playAsync(); 
                                // await soundPlaying.unloadAsync();
                } catch (error) {
                    console.log('Cant play music at', item.filename , error);
                }
            })
        }
    }

    const millisToMinutesAndSeconds = async (data) => {
        if(pauseVideo == true) {
            return false;
        }
        if(data.didJustFinish == true){ 
            setDurationSec(0); 
            var sectionLength = videos.sections.length;
            var videoLength = videos.sections[sectionIndex].videos.length; 
            var next = videoIndex + 1;
            var NextsectionIndex = sectionIndex + 1;
            if( videoLength == next && sectionLength == NextsectionIndex ){ 
                setfinishedWorkOut(true);
                return true;
            }
            if(videoLength == next){
                var NextvideoIndex = 0;  
                updateCurrentVideoPlaying(NextsectionIndex, NextvideoIndex);
            }else{  
                updateCurrentVideoPlaying(sectionIndex, next);
            }
        }  
        await video.current.getStatusAsync()
            .then(function(result){  
                if(result.durationMillis && result.positionMillis){   
                    var millis = result.positionMillis;
                    var minutes = Math.floor(millis / 60000);
                    var seconds = ((millis % 60000) / 1000).toFixed(0); 
                    setDurationSec(minutes + ":" + (seconds < 10 ? '0' : '') + seconds);
                }
            })  
            .catch((err) => console.log(''))
    }  

    const updateCurrentVideoPlaying = async (sectionIndex, videoIndex) => {  
        setCurrentVideo(videos.sections[sectionIndex].videos[videoIndex].url);
        setvideoIndex(videoIndex);
        setSectionIndex(sectionIndex);
        for (let index1 = 0; index1 < videos.sections.length; index1++) { 
            for (let index2 = 0; index2 < videos.sections[index1].videos.length; index2++) {  
                if(sectionIndex <= index1 && videoIndex <= index2){ 
                    return false;
                }else{
                    videos.sections[index1].videos[index2].confimed = true;
                }
            }
        }
    }

    const updatePauseVideo = async (value) => {
        setPauseVideo(value);  
        setPauseVideoModal(value);  
        value == true ? await soundPlaying.playAsync() :  await soundPlaying.paurseAsync() ;
    }

    const updateVideoLIst = async () =>{   
        videos.videos[videoIndex].confimed = true; 
        if(videos.videos.length == (videoIndex + 1) ){ 
            setfinishedWorkOut(true)
        }else{
            setCurrentVideo(videos.videos[videoIndex + 1].uri); 
            setvideoIndex(videoIndex + 1); 
        }
        return true;
    }

    const finishedSaveMyWorkOut = async () =>{  
        setIsReady(false);
        deactivateKeepAwake(); 
        video.current.stopAsync();
        var myLog = {
            work_out_id: workout.id,
            user_id: userDetails.id, 
            location: location,
            effort: effort,
            duration: (seconds/60).toFixed(1)
        }  
        await fetch(`https://quantumleaptech.org/getFit/api/v1/user_workout/add`,{
            method: 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}` 
            },
            body: JSON.stringify(myLog)
        })
        .then((response) => response.json())
        .then((json) => {  
            if(json.status === true){   
                alert('Work out completed');
                navigation.navigate('Browse');
            } 
        }) 
        .catch((error) => {    
            // console.error(error)
        });   
    }
 
    // if(isReady == false){
    //     return (
    //         <View style={styles.appLoading}>
    //             <ActivityIndicator color="#000" size="large" />
    //         </View>
    //     )
    // } 
 
    return(
        <View style={styles.container}>
             <StatusBar style="dark" />
             <View style={styles.videoPriview}>
                <View style={styles.control}>
                    <Text style={styles.durationVideo}>{ durationSec }</Text>
                    <Icon   
                            name={ pauseVideo ? 'ios-play-outline' : 'ios-pause-outline'} 
                            size={28} color="#FFF" 
                            onPress={() => updatePauseVideo(pauseVideo == true ? false : true) } 
                        />
                </View>
                <Video
                        ref={video}
                        style={styles.video}
                        source={{
                            uri: 'https://quantumleaptech.org/getFit'+currentVideo
                        }}
                        useNativeControls={false}
                        resizeMode={Video.RESIZE_MODE_CONTAIN}
                        isLooping={false} 
                        usePoster={true}
                        shouldPlay={!pauseVideo}
                        isMuted={useMUsic}
                        onPlaybackStatusUpdate={status => millisToMinutesAndSeconds(status) }
                    />
                </View> 
                <View style={styles.videoListCon}> 
                    {
                        videos.sections.map((item1, index1) => (
                            <View key={index1} style={{ width, padding: 10, justifyContent: 'center' }}>
                                <Text style={{ color: 'grey', fontSize: 12, fontFamily: 'Raleway-SemiBold' }}>{item1.name}</Text>
                                {
                                    item1.videos.map((item, index) => { 
                                        console.log(item.url) ;
                                        return( 
                                            <TouchableOpacity  
                                                    disabled={item.confimed === true}
                                                    easing={'linear'} 
                                                    onPress={() => { setDurationSec(0); updateCurrentVideoPlaying(index1, index); }} 
                                                    style={styles.videoList} key={index}
                                                >
                                                <Animatable.View animation="slideInRight" style={styles.durationCon}>
                                                    <Text style={styles.duration}>{ item.duration }</Text>
                                                </Animatable.View>
                                                <Animatable.View animation="slideInRight" style={styles.titleCon}> 
                                                    <Text style={styles.title}>{ item.name }</Text>
                                                </Animatable.View>
                                                <Animatable.View animation="slideInRight" style={[styles.titleCon, { width: '20%', alignItems: 'flex-end' }]}> 
                                                    { item.confimed &&  <Icon name="checkmark-done" size={24} color="green" /> }                                
                                                </Animatable.View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View> 
                        )) 
                    } 
                </View>
                            
                <Modal
                        animationType="slide"
                        transparent={true}
                        visible={pauseVideoModal} 
                    >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}> 
                            <View style={styles.bgImage}> 
                                <View  > 
                                    <View style={styles.controlsContainer}> 
                                        <View animation="slideInDown" easing={'linear'}  style={styles.controlsContainerHead}> 
                                            <TouchableOpacity style={styles.cardConControl}  onPress={() => { setPauseVideoModal(false);  navigation.navigate('workSettings') }} >
                                                <Icon name="ios-settings-outline" size={24} color="#fff" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => updatePauseVideo(pauseVideo == true ? false : true) } style={[styles.cardConControl, { width: 100, height: 100, borderRadius: 100 }]}>                                        
                                                <Icon name={pauseVideo ? 'ios-play-outline' : 'ios-pause-outline'} size={50} color="#fff" />  
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.cardConControl} onPress={() =>{  setPauseVideoModal(false); navigation.navigate('musicSettings') }} >
                                                <Icon name="ios-musical-notes-outline" size={24} color="#fff" />
                                            </TouchableOpacity>
                                        </View>  
                                        <View animation="slideInDown" easing={'linear'}  style={styles.controlsContainerHead}> 
                                            <TouchableOpacity style={styles.cardBTNControl}  onPress={() => { setPauseVideoModal(false); setfinishedWorkOut(true) } } >
                                                <Text style={{ color: '#FFF', fontFamily: 'Raleway-Bold', }}>End Workout</Text>
                                            </TouchableOpacity> 
                                        </View> 
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>  
             
                <Modal
                        animationType="slide"
                        transparent={true}
                        visible={finishedWorkOut} 
                    >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>   
                            <ImageBackground
                                    resizeMode="cover"
                                    source={{ uri: 'https://quantumleaptech.org/getFit'+workout.image }} 
                                    style={[styles.bgImage, {height: '60%'}]}>
                                    <View style={styles.overlay2}>
                                        <View style={styles.title}>
                                            <Text style={[styles.titleText, { color: '#fff', fontSize: 25, } ]}>{workout.name}</Text>
                                        </View> 
                                    </View>
                            </ImageBackground> 
                            <View style={styles.activityCon}>
                                <View style={{ flexDirection: 'row', padding: 20,borderBottomWidth: .5, borderColor: '#000' }}>
                                    <View style={{ alignItems: 'center', width: '50%' }}>
                                        <Text style={{ fontFamily: 'Raleway-Regular', top: 5 }}>{(seconds/60).toFixed(2) }</Text>
                                        <Text style={{ fontFamily: 'Raleway-Regular', top: 5 }}>Duration</Text>
                                    </View>
                                    {/* <View style={{ alignItems: 'center', width: '50%' }}>
                                        <Text style={{ fontFamily: 'Raleway-Regular', top: 5 }}>8</Text>
                                        <Text style={{ fontFamily: 'Raleway-Regular', top: 5 }}>Approx. Calories</Text>
                                    </View> */}
                                </View>
                                <View style={{ padding: 20, }}>
                                    <View style={{  width: '100%'}}>
                                        <Text style={{ textAlign: 'left',   fontSize: 15,  fontFamily: 'Raleway-Regular', }}>Efforts</Text>
                                        <SwitchSelector
                                            options={effortOptions}
                                            initial={0}
                                            fontSize={14}  
                                            textColor={'#000'}  
                                            selectedColor={'#fff'}
                                            buttonColor={'#000'}
                                            borderColor={'#000'}
                                            hasPadding
                                            onPress={value =>  setEffort(value) }
                                        />
                                    </View>
                                    <View style={{ width: '100%'}}>
                                        <Text style={{ textAlign: 'left', marginTop: 10, fontSize: 15,  fontFamily: 'Raleway-Regular', }}>Location</Text>
                                        <SwitchSelector
                                            options={locationOptions}
                                            initial={0}
                                            fontSize={14}
                                            textColor={'#000'}  
                                            selectedColor={'#fff'}
                                            buttonColor={'#000'}
                                            borderColor={'#000'}
                                            hasPadding
                                            onPress={value => setLocation(value) }
                                        />
                                    </View>
                                    
                                    <View animation="slideInDown" easing={'linear'}  style={{ width: '100%', marginTop: 10 }}> 
                                        <TouchableOpacity style={[styles.cardBTNControl, { width: '100%' }]}  onPress={() => finishedSaveMyWorkOut() } >
                                            <Text style={{ color: '#FFF', fontFamily: 'Raleway-Bold', }}> { isReady == false ? <ActivityIndicator color="white" /> : 'Save' }</Text>
                                        </TouchableOpacity> 
                                    </View> 
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>    
       </View>
    )
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken, workout) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Work 0ut in progress',
        body: workout,
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data; 
    } else {
        alert('Must use physical device for Push Notifications');
    }
    
    if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    
    return token;
}

const styles = StyleSheet.create({
    loadingCotainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container:{
        marginTop: 30,
        flex: 1,
    }, 
    videoPriview:{
        width, 
        backgroundColor: 'rgba(0,0,0,0.1)', 
        zIndex: -1,
        // margin: 0,
        // height: 0,
    },
    video:{ 
        width: '100%', 
        height: 220,
        zIndex: 1
    },
    control:{
        width,
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        zIndex: 10
    },
    durationVideo:{
        color: "#FFF",
        fontSize: 20,
        fontFamily: 'Raleway-Bold',
    },
    videoListCon:{ 
        width, 
        backgroundColor: 'rgba(0,0,0,0.02)', 
        zIndex: -1,
    },
    videoList:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: .2,
        borderColor: 'grey',
        marginVertical: 0
    },
    durationCon:{ 
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    duration:{
        color: '#000',
        fontFamily: 'Raleway-Bold',
        fontSize: 15
    },
    titleCon:{ 
        width: '60%',
        justifyContent: 'center',
        // alignItems: 'center',
    },
    title:{
        color: '#000',
        fontFamily: 'Raleway-Bold',
        fontSize: 15
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center", 
    },
    modalView: {
        width,
        height,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }, 
    bgImage:{
        width,
        height,
        justifyContent: 'center'
    },
    overlay:{
        flex: 1,
        justifyContent: 'flex-end', 
    }, 
    overlay2:{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    controlsContainer:{
        width,
        height: 100,
        alignItems: 'center', 
        marginBottom: "70%" 
    },
    controlsContainerHead:{
        width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 40
    },
    cardCon:{ 
        // width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    limitter:{ 
        color: '#FFF',
        opacity: 100,
        fontFamily: 'Raleway-Regular',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoH1:{
        color: '#FFF',
        fontFamily: 'Raleway-Bold',
    },
    infoH2:{
        color: '#FFF',
        opacity: 100,
        fontFamily: 'Raleway-Medium',
    },
    cardConControl:{ 
        width: 50,
        height: 50,
        borderWidth: .3,
        borderColor: '#fff',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBTNControl:{ 
        width: '70%',
        height: 50,
        borderWidth: .3,
        backgroundColor: '#000',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    activityCon:{
        width,
        height: 400,
        backgroundColor: '#FFF',
    }
});