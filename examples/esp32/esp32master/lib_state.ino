String lib_state_version() {
  return "0.0.2";
}

String lib_state_deviceid() {
  String uuid = lib_id_getuuid();
  String output = String("microRaptor2_"+uuid);
  return output;
}

String lib_state_packet() {  
  StaticJsonDocument<200> packet;
  
  packet["id"] = lib_state_deviceid();
  JsonObject data = packet.createNestedObject("data");
  data["version"] = lib_state_version();
  data["ip"] = lib_wifi_ip();
  //packet.prettyPrintTo(Serial);

  String output;
  serializeJson(packet, output);
  return output;
}