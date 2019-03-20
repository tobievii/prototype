


void setup()
{
  Serial.begin(115200);
  lib_display_init();
}

void loop()
{
  lib_battery_update();

  //String test = "asdf";
  //Serial.println(test);
  lib_display_top();
  lib_display_log( String( lib_battery_lastadc()) ); 
  lib_display_log( String( lib_battery_volts(),2) );
  lib_display_log( String( lib_battery_percentage(),2) ); 
  lib_display_display();
  
  delay(500);
}