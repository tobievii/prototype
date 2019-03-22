#include <PubSubClient.h>
#include <WiFi.h>

WiFiClient espClient;
PubSubClient client(espClient);

int wifiStatusLast = 999;
int mqttStatus = 0;

// 0 = NOT CONNECTED
// 1 = CONNECTING
// 2 = FAILED ()
// 3 = SUCCESS

const char* mqttServer = "prototype.dev.iotnxt.io";
const int mqttPort = 1883;
String apikey = "dnjskllzve6xzv47l1mw72p74jqbjjz4p";
String deviceid = "microRaptor2";

unsigned long lastupdate = 0;

int lib_mqtt_status_get() {
  return mqttStatus;
}

void lib_mqtt_loop() {
  detectConnection();
  client.loop();  
  if (millis() - lastupdate > 15000) {
    lastupdate = millis();
    publishUpdate();
    //pub = true;
  }
}

void detectConnection() {
  if (lib_wifi_status_get() != wifiStatusLast) {
    if (lib_wifi_status_get() == 3) {
      wifiStatusLast = lib_wifi_status_get();
      lib_mqtt_connectMQTT();
    }
  }
}

void lib_mqtt_connectMQTT() {
  mqttStatus = 1;
  client.setServer(mqttServer, mqttPort);
  client.setCallback(handleMessages);
  connectMqtt();
  client.subscribe(apikey.c_str());
}

void connectMqtt() {
  Serial.print("reconnect");
  String clientId = "ESP8266Client-";
  clientId += String(random(0xffff), HEX);
  String mqttPassword = "key-"+apikey;
  //iotnxt = false;
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("clientid", "api", mqttPassword.c_str() )) {
      mqttStatus = 3;
      Serial.println("connected"); 
      publishUpdate();
      //iotnxt = true;
    } else {
      mqttStatus = 2; // FAILED
      Serial.print("failed with state ");
      Serial.print(client.state());
      lib_display_log("failed to connect.");

      /*
-4 : MQTT_CONNECTION_TIMEOUT - the server didn't respond within the keepalive time
-3 : MQTT_CONNECTION_LOST - the network connection was broken
-2 : MQTT_CONNECT_FAILED - the network connection failed
-1 : MQTT_DISCONNECTED - the client is disconnected cleanly
0 : MQTT_CONNECTED - the client is connected
1 : MQTT_CONNECT_BAD_PROTOCOL - the server doesn't support the requested version of MQTT
2 : MQTT_CONNECT_BAD_CLIENT_ID - the server rejected the client identifier
3 : MQTT_CONNECT_UNAVAILABLE - the server was unable to accept the connection
4 : MQTT_CONNECT_BAD_CREDENTIALS - the username/password were rejected
5 : MQTT_CONNECT_UNAUTHORIZED - the client was not authorized to connect
      */
      delay(2000); 
    }
  }
}

void publishUpdate() {
  //Serial.print("publishing!\n");
  String msg = "{\"id\":\""+deviceid+"_"+lib_id_getuuid()+"\",\"data\":{\"button\":false}}";
  client.publish(apikey.c_str(), msg.c_str());
}

void handleMessages(char* topic, byte* payload, unsigned int length) {
  //Serial.println(payload);
  Serial.println("MQTT recv");

  // StaticJsonDocument<200> requestDoc;
  // DeserializationError error = deserializeJson(requestDoc, payload);
  // JsonObject request = requestDoc.as<JsonObject>();

  // String jsontemp; 
  // serializeJson(request,jsontemp);
  // Serial.println("api call:");
  // Serial.println(jsontemp);
  // Serial.println("-----");

  // String display = request["data"]["display"];
  
  // Serial.println(display);
  // if (display) { log(display); }
  
  // if (request["data"]["digitalWrite"]) {
  //   pinMode(request["data"]["pin"], OUTPUT);
  //   digitalWrite(request["data"]["pin"], request["data"]["level"]);
  // }   
}