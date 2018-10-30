/*

  https://www.robotics.org.za/ESPDUINO?search=wifi
  http://www.elecrow.com/wiki/index.php?title=Elecrow_ESPduino_UNO%2BESP8266_Wifi_Board

*/

#include <SoftwareSerial.h>
 
#define DEBUG true
 
SoftwareSerial esp8266(7,8);

String ssid     = "YOURWIFI";
String password = "YOURPASSWORD";
String host = "192.168.8.102";
String port = "12009";

// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  
  esp8266.begin(9600);
  
  sendData("AT+RST\r\n",2000,DEBUG);        // reset module
  sendData("AT+CWMODE=1\r\n",1000,DEBUG);   // configure as access point
  sendData("AT+RST\r\n",2000,DEBUG);        // reset module
  
  // sendData("AT+CWLAP\r\n",1000,DEBUG);      // wifi list AP
  
  sendData("AT+CIPMUX=0\r\n",1000,DEBUG);      // single connection

  sendData("AT+CWJAP=\""+ssid+"\",\""+password+"\"\r\n",2000,DEBUG);      // wifi JOIN AP  
  sendData("AT+CIFSR\r\n",2000,DEBUG); // get ip address

  //send TCP data

  sendData("AT+CIPSTART=\"TCP\",\""+host+"\","+port+"\r\n", 2000, DEBUG);



  sendData("AT+CIPSEND=5\r\n", 2000, DEBUG);
  sendData("hello\r\n", 2000, DEBUG);
  sendData("AT+CIPCLOSE\r\n", 2000, DEBUG);
}

// the loop function runs over and over again forever
void loop() {
  handleWifi();
}



String sendData(String command, const int timeout, boolean debug) {
    String response = "";
    esp8266.print(command); 
    long int time = millis();
    while( (time+timeout) > millis()) {
      while(esp8266.available()) {      
        char c = esp8266.read();
        response+=c;
      }  
    }
    
    if(debug) { Serial.print(response); }    
    return response;
}



void handleWifi() {
  if(esp8266.available()) {
    while(esp8266.available()) {
      char c = esp8266.read(); 
      Serial.write(c);
    } 
  }
}