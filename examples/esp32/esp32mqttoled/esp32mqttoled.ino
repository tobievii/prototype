#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>


#include <WiFi.h>

#include <ArduinoJson.h>
#include <PubSubClient.h>

const char* ssid = "rouanwifi";
const char* password = "rouanwifi4321";
const char* mqttServer = "192.168.1.242";
const int mqttPort = 1883;


String apikey = "2m111tcbtxnmo8y4oedhlui7yy519v0w";
String deviceid = "microRaptor";

WiFiClient espClient;
PubSubClient client(espClient);

int LED_BUILTIN = 2; //LED for ESP32
 
unsigned long lastupdate = 0;
bool led = true;

bool wifi = false;
bool iotnxt = false;

//OLED
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 48 // OLED display height, in pixels
#define OLED_RESET     0 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// MQTT
void handleMessages(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message");
  Serial.print(topic);
  Serial.print("] ");

  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, payload);

  
  // TODO
  // led = doc["led"];

  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void setup() {

// SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  display.clearDisplay();

  pinMode(LED_BUILTIN, OUTPUT);
//   digitalWrite(LED_BUILTIN, LOW); // HIGH = OFF on esp8266
//   delay(1000);
//   digitalWrite(LED_BUILTIN, HIGH); // HIGH = OFF on esp8266
//   delay(1000);
//   digitalWrite(LED_BUILTIN, LOW); // HIGH = OFF on esp8266
//   delay(1000);
  
  randomSeed(micros());

  Serial.begin(115200);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
    wifi = true;
  }
 
  Serial.println("Connected to the WiFi network"); 
  client.setServer(mqttServer, mqttPort);
  client.setCallback(handleMessages);
  
  connectMqtt();
 
  //client.publish("glp5xm1jpwhtwdnsykv5nv4hhwrp1xy9", "{\"id\":\"esp32\",\"data\":{\"temperature\":34}}");
  client.subscribe(apikey.c_str());
}
 
void loop() {
    dashboard();

  digitalWrite(LED_BUILTIN, led);

  client.loop();

  if (!client.connected()) {
      iotnxt = false;
    connectMqtt();
  }

  if (millis() - lastupdate > 5000) {
    lastupdate = millis();
    publishUpdate();
  }
}

void publishUpdate() {
  Serial.print("publishing!\n");
  String msg = "{\"id\":\""+deviceid+"\",\"data\":{\"button\":false}}";
  client.publish(apikey.c_str(), msg.c_str());
}

void connectMqtt() {
  Serial.print("reconnect");
  String clientId = "ESP8266Client-";
  clientId += String(random(0xffff), HEX);
  String mqttPassword = "key-"+apikey;
    iotnxt = false;
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("clientid", "api", mqttPassword.c_str() )) {
      Serial.println("connected"); 
      iotnxt = true;
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000); 
    }
  }
}




void dashboard(void) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);  

  
display.setCursor(32,0);   
    if (iotnxt) {           
        display.println(F("CONNECTED"));
    } else {
        display.println(F("CONNECTING"));
    }

    display.setCursor(32,10);  
    if (wifi) {
        display.println(F("WIFI ON"));
    } else {
        display.println(F("WIFI OFF"));
    }
  

  display.setCursor(32,20);            
  display.println(F("READY"));
  display.display();
  delay(2000);
}
