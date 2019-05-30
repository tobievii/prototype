# Import package
import paho.mqtt.client as mqtt


# Define Variables
APIKEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxx"
MQTT_HOST = "prototype.iotnxt.io"
MQTT_PORT = 1883
#MQTT_PORT = 8883
MQTT_KEEPALIVE_INTERVAL = 45
MQTT_TOPIC = APIKEY
MQTT_user = "api"
MQTT_password="key-"+APIKEY

# Initiate MQTT Client
mqttc = mqtt.Client()

# Define on connect event function
# We shall subscribe to our Topic in this function
def on_connect(client, userdata, flags, rc):
	print("connected")
	mqttc.subscribe(MQTT_TOPIC, 0)

# Define on_message event function. 
# This function will be invoked every time,
# a new message arrives for the subscribed topic 
def on_message(mosq, obj, msg):
	print "Topic: " + str(msg.topic)
	print "QoS: " + str(msg.qos)
	print "Payload: " + str(msg.payload)

def on_subscribe(client, userdata, mid, qos):
	print("subscribed")

# Assign event callbacks
mqttc.on_connect= on_connect
mqttc.on_subscribe= on_subscribe
mqttc.on_message= on_message

# Connect with MQTT Broker
mqttc.username_pw_set(MQTT_user, MQTT_password)
mqttc.connect(MQTT_HOST, MQTT_PORT, MQTT_KEEPALIVE_INTERVAL)

# Continue monitoring the incoming messages for subscribed topic
mqttc.loop_forever()
