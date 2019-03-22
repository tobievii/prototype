
// version: 0.0.1 

void setup()
{
  Serial.begin(115200);
  
  lib_id_init();
  lib_display_init();
  lib_wifi_init();

  //lib_uwb_init();
  // unique Identifier
  String uuid = lib_id_getUuidString();
  Serial.println(uuid);
}

void loop()
{
  lib_display_loop();  
  lib_serial_loop();
  //lib_uwb_loop();  
  lib_wifi_loop();  
  lib_mqtt_loop();
}