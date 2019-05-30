# sudo apt install python-pip
# pip install paho-mqtt

# Import package
import paho.mqtt.client as mqtt

APIKEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
# Define Variables
MQTT_HOST = "prototype.iotnxt.io"
MQTT_PORT = 1883
#MQTT_PORT = 8883
MQTT_KEEPALIVE_INTERVAL = 45
MQTT_TOPIC = APIKEY
MQTT_user = "api"
MQTT_password="key-"+APIKEY
MQTT_MSG = """{ 
    "id": "yourdevice_mqtt_python",
    "data": { 
        "test": "asdf",
        "someval": 5.34 
    } 
	}"""

# Define on_publish event function
def on_publish(client, userdata, mid):
	print "Message Published..."

def on_connect(mosq, obj, rc):
     print('connected')

# Initiate MQTT Client
mqttc = mqtt.Client()

# Register publish callback function
mqttc.on_publish = on_publish
mqttc.on_connect = on_connect

#mqttc.username_pw_set('cvsbdnrs', 'RCApj-1abPZG')
mqttc.username_pw_set(MQTT_user, MQTT_password)

# Connect with MQTT Broker
mqttc.connect(MQTT_HOST, MQTT_PORT, MQTT_KEEPALIVE_INTERVAL)		

# Publish message to MQTT Broker	
mqttc.publish(MQTT_TOPIC,MQTT_MSG)

# Disconnect from MQTT_Broker
# mqttc.disconnect()
