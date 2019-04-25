#include <string.h>
#include <sys/param.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event_loop.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include <errno.h>

#include "lwip/err.h"
#include "lwip/sockets.h"
#include "lwip/sys.h"
#include <lwip/netdb.h>

#include "lib_display.h"
#include "lib_serial.h"

#define PORT 8883 // 8883
static const char *TAG = "tcp";

#include "crypto/base64.h"

void tcp_server_handleSocket(void *pvParameters) {

}

void tcp_server_task(void *pvParameters)
{
    


    char rx_buffer[1280];
    char addr_str[1280];
    struct sockaddr_in clientAddress;
    struct sockaddr_in serverAddress;
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_addr.s_addr = htonl(INADDR_ANY);        
    serverAddress.sin_port = htons(PORT);

    
    inet_ntoa_r(serverAddress.sin_addr, addr_str, sizeof(addr_str) - 1);


    // Create socket
    int listen_sock = socket(AF_INET, SOCK_STREAM, IPPROTO_IP);
    if (listen_sock < 0) {
        ESP_LOGE(TAG, "Unable to create socket: errno %d", errno);
        return;
    }
    ESP_LOGI(TAG, "Socket created");



    int flag = 1;
    setsockopt(listen_sock, SOL_SOCKET, SO_REUSEADDR, &flag, sizeof(flag));

    //bind
    int err = bind(listen_sock, (struct sockaddr *)&serverAddress, sizeof(serverAddress));
    if (err != 0) {
        ESP_LOGE(TAG, "Socket unable to bind: errno %d", errno);
        return;
    }
    ESP_LOGI(TAG, "Socket binded");

    err = listen(listen_sock, 1);
    if (err != 0) {
        ESP_LOGE(TAG, "Error occured during listen: errno %d", errno);
        return;
    }
    ESP_LOGI(TAG, "Socket listening");
    
    while (1) {
        struct sockaddr_in6 sourceAddr; // Large enough for both IPv4 or IPv6
        uint addrLen = sizeof(sourceAddr);
        int sock = accept(listen_sock, (struct sockaddr *)&sourceAddr, &addrLen);
        if (sock < 0) {
            ESP_LOGE(TAG, "Unable to accept connection: errno %d", errno);
            break;
        }
        ESP_LOGI(TAG, "Socket accepted");

        while (1) {
            int len = recv(sock, rx_buffer, sizeof(rx_buffer) - 1, 0);
            // Error occured during receiving
            if (len < 0) {
                ESP_LOGE(TAG, "recv failed: errno %d", errno);
                break;
            }
            // Connection closed
            else if (len == 0) {
                ESP_LOGI(TAG, "Connection closed");
                break;
            }
            // Data received
            else {
                // Get the sender's ip address as string
                if (sourceAddr.sin6_family == PF_INET) {
                    inet_ntoa_r(((struct sockaddr_in *)&sourceAddr)->sin_addr.s_addr, addr_str, sizeof(addr_str) - 1);
                } else if (sourceAddr.sin6_family == PF_INET6) {
                    inet6_ntoa_r(sourceAddr.sin6_addr, addr_str, sizeof(addr_str) - 1);
                }

                ESP_LOG_BUFFER_HEX_LEVEL(TAG, rx_buffer, len, 0);

                rx_buffer[len] = 0; // Null-terminate whatever we received and treat like a string
                ESP_LOGI(TAG, "Received %d bytes from %s:", len, addr_str);
                //ESP_LOGI(TAG, "%s", rx_buffer);
                
                size_t outputLength;
                unsigned char * encoded = base64_encode((const unsigned char *)rx_buffer, len, &outputLength);

                ESP_LOGI(TAG, "%s", encoded);
                ESP_LOGI(TAG, "base64 length: %d", outputLength);

                //serial_port_writelen(rx_buffer, len);
                serial_port_writelen((char *)encoded, outputLength); // base64

                //int err = send(sock, rx_buffer, len, 0);
                // if (err < 0) {
                //     ESP_LOGE(TAG, "Error occured during sending: errno %d", errno);
                //     break;
                // }
            }
        }

        if (sock != -1) {
            ESP_LOGE(TAG, "Shutting down socket and restarting...");
            shutdown(sock, SHUT_RDWR);
            close(sock);
        }
    }
    vTaskDelete(NULL);
}



