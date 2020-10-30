import React from 'react'
import { AsyncStorage, Text, View } from 'react-native'

import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'

export default class App extends React.Component {
    componentDidMount() {
        this.startListeningMessage()
    }
    
    render() {
        return (
            <View
                style = {{
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center'
                }}
            >
                <Text>
                    Firebase Messaging + Push Notification
                </Text>
            </View>
        )
    }
            
    async startListeningMessage() {
        const isPermitted = await this.getPermissionSuccessState()

        if (isPermitted) {
            const token = await messaging().getToken()

            await AsyncStorage.setItem('token', token)

            this.unsubcribeForegroundListener = messaging().onMessage(remoteMessage => {                    
                PushNotification.localNotification({
                    title: remoteMessage.notification?.title,
                    message: remoteMessage.notification?.body,
                    channelId: 'default',
                    playSound: true,
                    soundName: 'default',
                    importance: 'high',
                    priority: 'high',
                    vibrate: true,
                    userInfo: remoteMessage.data,
                    group: 'group',
                    groupSummary: true
                })          
            })
        }
    }    

    async getPermissionSuccessState() {
        let isPermitted = false 
        await messaging().hasPermission().then((hasPermission) => {
            isPermitted = hasPermission ? true : false
        })
        
        if (!isPermitted) {
            await messaging().requestPermission().then(() => isPermitted = true)
        }

        return isPermitted
    }
}
