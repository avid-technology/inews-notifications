# Example that shows how subscription to MediaCentral | Newsroom Management (formally known as iNEWS) queue can be implemented to get notifications from story/rundown



### Introduction
This example shows how you can subscribe to a Newsroom Management queue and get notifications about story changes.

To subscribe using the CTMS API the ia:queue-notifications call is used. ia:queue-notifications is a resource that represents a subscription object and provides links to manage it. 

Please start with the CTMS Registry to get the ia:queue-notifications link as an entry point to the interface and then follow the links provided in responses.
After subscribing to an INEWS queue to get notifications and messages from the server you need to establish a WebSocket connection to the notifications endpoint.

#### Important
To subscribe to a Newsroom Management queue you need to use CTMS call with OAth2.0 authorization. When you are authorized you will get an access token which is valid for 900s. During this time, after subscribing to a queue you will get notifications about story changes. To be able to subscribe for more than 900 seconds please request appid with a refresh possibility. 

##### Notification endpoint:
- https://`<host>`/notifications, where `<host>` is the host name or IP address of the CloudUX.

##### Example of messages received through WebSocket:
after successfull subscribtion to queue:
```
{
   "channel":"avid.notification",
   "subject":"avid.notification.ready",
   "data":{
      "consumerId":"e75aac1f-2a22-4101-bf76-299ecdec2115",
      "subscriptions":[
         {
            "id":"450c96f5-35c8-4c53-a45a-5481a64cd754",
            "status":"active"
         }
      ]
   }
}
```
when story has changed:
```
{
   "channel":"avid.inews.notifications.INEWS.SHOW.6AM.RUNDOWN",
   "subject":"queue.change",
   "data":{
      "queueId":"SHOW.6AM.RUNDOWN",
      "modified":[
         {
            "storyId":"SHOW.6AM.RUNDOWN..346212464.11407.17",
            "storyUuid":"745276c5-2269-4e14-ac06-0b3ab06cc74d"
         }
      ]
   }
}
```
### How to use CloudUX plugin
Appearance of the plugin:
![inews_appearance](/uploads/d40f4facc5447f6d17750d2188750c38/inews_appearance.PNG)
To subscribe to the specific queue add the queue ID into the field and click the "Subscribe" button:
![subscribe](/uploads/b00cea206e8438a4c3e472cf9d487eee/subscribe.PNG)
Make changes in the INEWS story of the queue you've subscribed to see the notification:
![notifications](/uploads/70dbde9a529c48869a02554669e72073/notifications.PNG)
Click "Clear all" button to delete all notifications from the list.

### Prerequisite
1. Fill in the variables with your values:
Variables for authorization:

``` const client_id = 'CLIENT_ID';
    const client_sercet = 'CLIENT_SECRET';
    const cloud_ux_ip = 'CLOUDUX_HOST_IP';
    const details = {
        grant_type : 'password',
        username : 'username',
        password : 'password',
    };
```
