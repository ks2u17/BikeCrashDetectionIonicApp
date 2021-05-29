# Bike Crash Detection App
This project contains a cross platform codebase for a bike crash detection app. An android application has been developed to receive the crash notification and ride data from the node via Bluetooth Low Energy. Bike ride details are to be displayed on the App whereas a text message is sent on the reception of a crash detection signal. Different pages of the app have been created using different folders which have been described below. These folders are located in src/app folder.

# home
This is the login page where a user is supposed to enter their details to use the app. 

# Registration
First time users need to enter their details such as Bike wheel radius, Name and emergency contact numbers which will be stored in phone's secure storage.

# Forgot-password
Page to reset the password when a user forgets their login information. 

# ble
when the user logs in with correct login details, app is directed to this page. The node 
