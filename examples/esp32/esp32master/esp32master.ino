void setup()
{
  Serial.begin(115200);
  lib_display_init();
  lib_id_init();

  // unique Identifier
  String uuid = lib_id_getUuidString();
  Serial.println(uuid);
}

void loop()
{
  lib_serial_loop();

  // lib_battery_update();

  // //String test = "asdf";
  // //Serial.println(test);
  // lib_display_top();
  // lib_display_log( String( lib_battery_lastadc()) ); 
  // lib_display_log( String( lib_battery_volts(),2) );
  // lib_display_log( String( lib_battery_percentage(),2) ); 
  // lib_display_display();

  // delay(500);
}