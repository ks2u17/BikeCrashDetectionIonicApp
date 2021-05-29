# Bike Crash Detection App
This project contains a cross platform codebase for a bike crash detection app. An android application has been developed to receive the crash notification and ride data from the node via Bluetooth Low Energy. Bike ride details are to be displayed on the App whereas a text message with location is sent on the reception of a crash detection signal. Different pages of the app have been created using different folders which have been described below. These folders are located in src/app folder.

# home
This is the login page where a user is supposed to enter their details to use the app. 

# Registration
First time users need to enter their details such as Bike wheel radius, Name and emergency contact numbers which will be stored in phone's secure storage.

# Forgot-password
Page to reset the password when a user forgets their login information. 

# ble
When the user logs in with correct login details, app is directed to this page. The node gets scanned using BLE plugin. The node I have used is Arduino Nano 33 IoT. The BLE service UUID needs to be modified depending on the node used. The node gets scanned and once selected, app is directed to the 'detail' page. 

# detail
This page displays the cycling data from the node via BLE and sends the location of the crash to the emergency contacts if a crash detection signal is received from the node.

