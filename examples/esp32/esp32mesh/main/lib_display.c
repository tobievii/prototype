#include <driver/gpio.h>
#include <driver/spi_master.h>
#include <esp_log.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <stdio.h>
#include <string.h>
#include <u8g2.h>

#include "sdkconfig.h"
#include "u8g2_esp32_hal.h"

#include "lib_display.h"

int nodecount = 1;

static const char *TAG = "ssd1306";

void setNodeCount(int nodecounttemp) {
	nodecount = nodecounttemp;
}



void task_test_SSD1306i2c(void *ignore) {
	
	u8g2_esp32_hal_t u8g2_esp32_hal = U8G2_ESP32_HAL_DEFAULT;
	u8g2_esp32_hal.sda   = PIN_SDA;
	u8g2_esp32_hal.scl  = PIN_SCL;
	u8g2_esp32_hal_init(u8g2_esp32_hal);

/*
u8g2_Setup_ssd1306_i2c_64x48_er_f(&u8g2, rotation, u8x8_byte_arduino_hw_i2c, u8x8_gpio_and_delay_arduino);
    u8x8_SetPin_HW_I2C(getU8x8(), reset, clock, data);
*/


	u8g2_t u8g2; // a structure which will contain all the data for one display
	u8g2_Setup_ssd1306_i2c_64x48_er_f(
		&u8g2,
		U8G2_R0,
		//u8x8_byte_sw_i2c,
		u8g2_esp32_i2c_byte_cb,
		u8g2_esp32_gpio_and_delay_cb);  // init u8g2 structure
	u8x8_SetI2CAddress(&u8g2.u8x8,0x78);

	ESP_LOGI(TAG, "u8g2_InitDisplay");
	u8g2_InitDisplay(&u8g2); // send init sequence to the display, display is in sleep mode after this,

	ESP_LOGI(TAG, "u8g2_SetPowerSave");
	u8g2_SetPowerSave(&u8g2, 0); // wake up display
	
	for (;;) {
		//ESP_LOGI(TAG, "u8g2_ClearBuffer");
		u8g2_ClearBuffer(&u8g2);
		//// ESP_LOGI(TAG, "u8g2_DrawBox");
		// u8g2_DrawBox(&u8g2, 0, 26, 80,6);
		// u8g2_DrawFrame(&u8g2, 0,26,100,6);

		//ESP_LOGI(TAG, "u8g2_SetFont");
		u8g2_SetFont(&u8g2, u8g2_font_5x7_tf);
		//ESP_LOGI(TAG, "u8g2_DrawStr");
		u8g2_DrawStr(&u8g2, 0,7,"IoT.nxt MESH");
		u8g2_DrawStr(&u8g2, 0,15,"Layer X");

		char strnodes[6]; 
		sprintf(strnodes, "%d", nodecount);

		u8g2_DrawStr(&u8g2, 0,23,"Nodes");
		u8g2_DrawStr(&u8g2, 26,23,strnodes);
		//ESP_LOGI(TAG, "u8g2_SendBuffer");
		u8g2_SendBuffer(&u8g2);
		//ESP_LOGI(TAG, "All done!");
		vTaskDelay(1000 / portTICK_RATE_MS);
	}
	

	vTaskDelete(NULL);
}