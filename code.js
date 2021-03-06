
//#region ble controls

function set_ble_connected(value) {
    ble_connected = value;
    if(ble_connected) ble_btn.innerHTML = "BLE Disconnect";
    else ble_btn.innerHTML = "BLE Connect";
}

let ble_btn = document.getElementById("ble_btn");
ble_btn.addEventListener("click", e => {
    if(ble_connected) ble_disconnect();
    else ble_connect();
});

//#endregion

//#region robot controls

//#region robot commands
const COMMAND_FORWARD       = 10;
const COMMAND_BACKWARD      = 20;
const COMMAND_LEFT          = 30;
const COMMAND_RIGHT         = 40;
const COMMAND_STOP          = 50;
const COMMAND_SPEED_NORMAL  = 60;
const COMMAND_SPEED_SLOW    = 70;
const COMMAND_SPEED_FAST    = 80;
//#endregion

let btn_w = document.getElementById("btn_w");
let btn_s = document.getElementById("btn_s");
let btn_a = document.getElementById("btn_a");
let btn_d = document.getElementById("btn_d");
let btn_stop = document.getElementById("btn_stop");

let btn_speed1 = document.getElementById("btn_speed1");
let btn_speed2 = document.getElementById("btn_speed2");
let btn_speed3 = document.getElementById("btn_speed3");

let speed_range = document.getElementById("speed_range");
let btn_set_speed = document.getElementById("btn_set_speed");

btn_w.addEventListener("click", e => {
    send_command(COMMAND_FORWARD);
});
btn_s.addEventListener("click", e => {
    send_command(COMMAND_BACKWARD);
});
btn_a.addEventListener("click", e => {
    send_command(COMMAND_LEFT);
});
btn_d.addEventListener("click", e => {
    send_command(COMMAND_RIGHT);
});

btn_stop.addEventListener("click", e => {
    send_command(COMMAND_STOP);
});

btn_speed1.addEventListener("click", e => {
    send_command(COMMAND_SPEED_SLOW);
});
btn_speed2.addEventListener("click", e => {
    send_command(COMMAND_SPEED_NORMAL);
});
btn_speed3.addEventListener("click", e => {
    send_command(COMMAND_SPEED_FAST);
});

btn_set_speed.addEventListener("click", e=> {
    let v = speed_range.value;
    send_command(120);
    send_command(v);
});

//#endregion

//#region ble

let ble_connected;

let bluetooth_device;
let ble_characteristic;

const NAME = "Croduino Nova32 BLE";
const SERVICE_UUID = "a2bf82f9-36a0-458b-b41b-bdf3c2924de9";
const CHARACTERISTIC_UUID = "4a644eb4-2c92-429b-b022-d827fa83db5f";

function send_command(x) {
    if(!ble_connected) return;
    let value = Uint8Array.of(x);
    ble_characteristic.writeValue(value);
}

function ble_connect() {

    const options = {
        filters: [
            { name: NAME },
            { services: [SERVICE_UUID] }
        ]
    };

    navigator.bluetooth.requestDevice(options)
    .then(device => {
        bluetooth_device = device;
        return device.gatt.connect();
    })
    .then(server => {
        return server.getPrimaryService(SERVICE_UUID);
    })
    .then(service => {
        return service.getCharacteristic(CHARACTERISTIC_UUID);
    })
    .then(characteristic => {
        ble_characteristic = characteristic;
        set_ble_connected(true);
    })

}

function ble_disconnect() {
    if(bluetooth_device.gatt.connected) {
        bluetooth_device.gatt.disconnect();
    }
    set_ble_connected(false);
}

//#endregion
