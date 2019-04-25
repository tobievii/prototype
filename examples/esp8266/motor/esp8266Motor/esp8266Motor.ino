#include <WiFi.h>
#include <PubSubClient.h>

// const char *ssid = "ORIONDOMINIQUE";
// const char *password = "admin123.";

// //const char* mqttServer = "prototype.iotnxt.io";
// //const char *mqttServer = "10.0.4.27";
// const char *mqttServer = "http://localhost:8080/";

// const int mqttPort = 1883;
// const char *mqttUser = "api";
// const char *mqttPassword = "key-jjtg33gs2igvncdoqu8ushfjzts5ovot";

int pwm_a = 3;  //PWM control for motor outputs 1 and 2 is on digital pin 3
int pwm_b = 11; //PWM control for motor outputs 3 and 4 is on digital pin 11
int dir_a = 12; //direction control for motor outputs 1 and 2 is on digital pin 12
int dir_b = 13; //direction control for motor outputs 3 and 4 is on digital pin 13
int val = 0;    //value for fade

// WiFiClient espClient;
// PubSubClient client(espClient);

void setup()
{
    // pinMode(LED_BUILTIN, OUTPUT);
    // digitalWrite(LED_BUILTIN, LOW);

    // Serial.begin(115200);
    // WiFi.begin(ssid, password);

    // while (WiFi.status() != WL_CONNECTED)
    // {
    //     delay(500);
    //     Serial.println("Connecting to WiFi..");
    // }

    // Serial.println("Connected to the WiFi network");
    // client.setServer(mqttServer, mqttPort);
    // client.setCallback(handleMessages);

    // while (!client.connected())
    // {
    //     Serial.println("Connecting to MQTT...");

    //     if (client.connect("clientid", mqttUser, mqttPassword))
    //     {
    //         digitalWrite(LED_BUILTIN, HIGH);
    //         Serial.println("connected");
    //     }
    //     else
    //     {

    //         Serial.print("failed with state ");
    //         Serial.print(client.state());
    //         delay(2000);
    //     }

    pinMode(pwm_a, OUTPUT); //Set control pins to be outputs
    pinMode(pwm_b, OUTPUT);
    pinMode(dir_a, OUTPUT);
    pinMode(dir_b, OUTPUT);

    analogWrite(pwm_a, 100); //set both motors to run at (100/255 = 39)% duty cycle (slow)
    analogWrite(pwm_b, 100);

    // Serial.print("publishing!");
    // //client.publish("glp5xm1jpwhtwdnsykv5nv4hhwrp1xy9", "{\"id\":\"esp32\",\"data\":{\"temperature\":34,\"doorOpen\":false,\"gps\":{\"lat\":25.123,\"lon\":28.125}}}");
    // //client.publish("glp5xm1jpwhtwdnsykv5nv4hhwrp1xy9", "{\"id\":\"esp32\",\"data\":{\"temperature\":34}}");
    // client.subscribe("jjtg33gs2igvncdoqu8ushfjzts5ovot");
}

void loop()
{

    // client.loop();

    forw();   //Set Motors to go forward Note : No pwm is defined with the for function, so that fade in and out works
    fadein(); //fade in from 0-255
    delay(2000);
    //forward();      //continue full speed forward
    delay(2000);
    fadeout();   //Fade out from 255-0
    delay(2000); //Wait one second

    //stopped();      // stop for 2 seconds
    //delay(500);

    back();   //Set motors to revers. Note : No pwm is defined with the back function, so that fade in and out works
    fadein(); //fade in from 0-255
    delay(3000);
    backward(); //full speed backward
    delay(3000);
    fadeout(); //Fade out from 255-0
    delay(3000);
}

void forw() // no pwm defined
{
    digitalWrite(dir_a, LOW);  //Reverse motor direction, 1 high, 2 low
    digitalWrite(dir_b, HIGH); //Reverse motor direction, 3 low, 4 high
}

void back() // no pwm defined
{
    digitalWrite(dir_a, HIGH); //Set motor direction, 1 low, 2 high
    digitalWrite(dir_b, LOW);  //Set motor direction, 3 high, 4 low
}

void forward() //full speed forward
{
    digitalWrite(dir_a, HIGH); //Reverse motor direction, 1 high, 2 low
    digitalWrite(dir_b, HIGH); //Reverse motor direction, 3 low, 4 high
    analogWrite(pwm_a, 255);   //set both motors to run at (100/255 = 39)% duty cycle
    analogWrite(pwm_b, 255);
}

void backward() //full speed backward
{
    digitalWrite(dir_a, LOW); //Set motor direction, 1 low, 2 high
    digitalWrite(dir_b, LOW); //Set motor direction, 3 high, 4 low
    analogWrite(pwm_a, 255);  //set both motors to run at 100% duty cycle (fast)
    analogWrite(pwm_b, 255);
}

void stopped() //stop
{
    digitalWrite(dir_a, LOW); //Set motor direction, 1 low, 2 high
    digitalWrite(dir_b, LOW); //Set motor direction, 3 high, 4 low
    analogWrite(pwm_a, 0);    //set both motors to run at 100% duty cycle (fast)
    analogWrite(pwm_b, 0);
}

void fadein()
{
    // fade in from min to max in increments of 5 points:
    for (int fadeValue = 0; fadeValue <= 255; fadeValue += 5)
    {
        // sets the value (range from 0 to 255):
        analogWrite(pwm_a, fadeValue);
        analogWrite(pwm_b, fadeValue);
        // wait for 30 milliseconds to see the dimming effect
        delay(30);
    }
}

void fadeout()
{
    // fade out from max to min in increments of 5 points:
    for (int fadeValue = 255; fadeValue >= 0; fadeValue -= 5)
    {
        // sets the value (range from 0 to 255):
        analogWrite(pwm_a, fadeValue);
        analogWrite(pwm_b, fadeValue);
        // wait for 30 milliseconds to see the dimming effect
        delay(30);
    }
}

void astop() //stop motor A
{
    analogWrite(pwm_a, 0); //set both motors to run at 100% duty cycle (fast)
}

void bstop() //stop motor B
{
    analogWrite(pwm_b, 0); //set both motors to run at 100% duty cycle (fast)
}

// void handleMessages(char *topic, byte *payload, unsigned int length)
// {
//     Serial.print("Message arrived [");
//     Serial.print(topic);
//     Serial.print("] ");
//     for (int i = 0; i < length; i++)
//     {
//         Serial.print((char)payload[i]);
//     }
//     Serial.println();
// }