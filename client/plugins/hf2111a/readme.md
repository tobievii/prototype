


Hardware: iotworkshop HF2111A

## Setup

Hardware needed: **RS232 Serial to USB**

Ubuntu install "Serial port monitor"/GtkTerm

Connect to /dev/ttyUSB0 115200 - 8 N 1
Send `+++`, device will reply `a` then send `a` back. Device will now be in configuration mode.

```
+++
a
```


# Configuration

```bash
# SET APN
AT+APN=AFRIHOST,,

# Get GSM network state.
AT+GSMST

# Get gprs network ip address.
AT+WANN

# Connect network.
AT+CONNECT

# test ping google
AT+PING=216.58.223.14

# test DNS get ip
AT+GETIP=google.com

# set TCP ip and port 
AT+NETP=A,1,TCP,169.239.129.76,12900,long

# modbus rtu tcp on
AT+MODBUS=1,on

# connect packet configuration
AT+NREGDT=A,HF2111A_%ICCID
AT+NREGEN=A,on
AT+NREGSND=A,both

# heartboard packet "HB" config
AT+HEART=A,10,HB

# restart
AT+Z
```


## Commands
```
AT+H                    show help
AT+PING                 General PING command.
AT+ENTM                 Goto Through MOde.
AT+WSMAC                Set/Get Module MAC Address.
AT+SRST                 Soft Reset the Module.
AT+SMEM                 show system memory stat
AT+GSMAT                Send internal at command.
AT+Z                    Reset the Module.
AT+WEL                  Set/Get welcome message.
AT+SLEEP                Set/Get sleep mode.
AT+SLEEPTM              Set/Get enter sleep mode time.
AT+VER                  Get application version.
AT+APPVER               Get user application version.
AT+RELD                 Reload the default setting and reboot.
AT+FCLR                 Clear Fsetting.
AT+CFGRD                Get current system config.
AT+CFGTF                Save Current Config to Default Config.
AT+UART                 Set/Get the UART0/UART1 Parameters.
AT+UARTTM               Set/Get the UART frame interval.
AT+MODBUS               Enable/Disable the UART MODBUS.
AT+GPIO                 Set/Get the gpio state.
AT+GPIOALARM            Set/Get the gpio alarm function.
AT+NDBGL                set/get debug level
AT+E                    Echo ON/Off, to turn on/off command line echo function. 
AT+CFGVER               Get the config version. 
AT+CMDPW                Set/Get command password. 
AT+HOST                 Get/Set Host name. 
AT+APN                  Set/Get apn parameters. 
AT+SMSID                . 
AT+WANN                 Get gprs network ip address.
AT+GSMST                Get GSM network state.
AT+GETIP                Get hostname ip address.
AT+UPGRADE              Upgrade firmware.
AT+IMSI                 Get SIM IMSI.
AT+SN                   Get the module serial number.
AT+ICCID                Get the module ICCID number.
AT+IMEI                 Get the module IMEI number.
AT+CNUM                 Read the module current number.
AT+GSLQ                 Get the link quality of the gprs.
AT+NTP                  Set/Get ntp server.
AT+IOTEN                Enable/Disable IOTBrdige.
AT+IOTUID               Get/Set the userid of IOTBrdige.
AT+IOTADDR              Get/Set the address of IOTBrdige.
AT+PID                  Get the product id.
AT+PCID                 Get/Set the user define product name.
AT+CONNECT              Connect network.
AT+DISCONNECT           Disconnect network.
AT+LOCATE               Get/Set current longitude and latitude.
AT+NETP                 Set/Get the Net Protocol Parameters.
AT+NETPLK               Set/Get the socket link state.
AT+NETPIDEN             Enable/Disable insert the id to send or recv socket data.
AT+NETPID               Set/Get insert the id to send or recv socket data.
AT+NETPID               Get total recv/send data length.
AT+NREGEN               Enable/Disable send register packet.
AT+NREGDT               Set/Get the register packet data.
AT+NREGSND              Set/Get the register packet send type.
AT+HEART                Set/Get the heart data .
AT+SMS                  Set/Get message config .
AT+SMSSND               Send message .
AT+HTPTP                Set/Get HTTP required type.
AT+HTPURL               Set/Get HTTP protocol head path.
AT+HTPHEAD              Set/Get HTTP protocol message.
AT+WEBSOCKET            Set/Get Websocket Parameters.
AT+MQTOPIC              Set/Get mqtt topic.
AT+MQLOGIN              Set/Get mqtt user paramter.
AT+MQID                 Set/Get mqtt client ID.
AT+TOPIC                Set/Get Ali-iot topic.
AT+DEVICE               Set/Get device paramter.
AT+PRODUCT              Set/Get product name.
AT+TCPTO                Set/Get tcp timeout.
```