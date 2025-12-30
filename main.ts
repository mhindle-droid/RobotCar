// Keyestudio KS4034F (mecanumRobotV2) - micro:bit V2
// Bluetooth UART control - NeoPixel removed (NeoPixel commonly breaks BLE advertising in MakeCode)
// LED matrix left enabled so pairing mode is visible for debugging

let speed_LF = 50
let speed_LB = 50
let speed_RF = 50
let speed_RB = 50

let ble_val = ""
let mode = "" // p/q/r/s modes triggered by command letters

let distance = 0
let distance_l = 0
let distance_r = 0

function car_forward() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, speed_LF)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, speed_LB)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, speed_RF)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, speed_RB)
}

function car_back() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Back, speed_LF)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Back, speed_LB)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Back, speed_RF)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Back, speed_RB)
}

function car_left() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Back, speed_LF)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Back, speed_LB)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, speed_RF)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, speed_RB)
}

function car_right() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, speed_LF)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, speed_LB)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Back, speed_RF)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Back, speed_RB)
}

function car_left_move() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Back, speed_LF)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, speed_LB)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, speed_RF)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Back, speed_RB)
}

function car_right_move() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, speed_LF)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Back, speed_LB)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Back, speed_RF)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, speed_RB)
}

function car_move_RF() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, speed_LF)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, 0)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, 0)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, speed_RB)
}

function car_move_RB() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Back, 0)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Back, speed_LB)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Back, speed_RF)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Back, 0)
}

function car_move_LB() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Back, speed_LF)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, 0)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, 0)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Back, speed_RB)
}

function car_move_LF() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Forward, 0)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, speed_LB)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Forward, speed_RF)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, 0)
}

function drift_left() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Back, 0)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Back, speed_LB)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Back, 0)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Forward, speed_RB)
}

function drift_right() {
    mecanumRobotV2.Motor(LR.Upper_left, MD.Back, 0)
    mecanumRobotV2.Motor(LR.Lower_left, MD.Forward, speed_LB)
    mecanumRobotV2.Motor(LR.Upper_right, MD.Back, 0)
    mecanumRobotV2.Motor(LR.Lower_right, MD.Back, speed_RB)
}

function tracking() {
    if (mecanumRobotV2.LineTracking(LT.Left) == 0 && (mecanumRobotV2.LineTracking(LT.Center) == 0 && mecanumRobotV2.LineTracking(LT.Right) == 0)) {
        mecanumRobotV2.state()
    } else if (mecanumRobotV2.LineTracking(LT.Left) == 0 && (mecanumRobotV2.LineTracking(LT.Center) == 0 && mecanumRobotV2.LineTracking(LT.Right) == 1)) {
        car_right()
    } else if (mecanumRobotV2.LineTracking(LT.Left) == 0 && (mecanumRobotV2.LineTracking(LT.Center) == 1 && mecanumRobotV2.LineTracking(LT.Right) == 0)) {
        car_forward()
    } else if (mecanumRobotV2.LineTracking(LT.Left) == 0 && (mecanumRobotV2.LineTracking(LT.Center) == 1 && mecanumRobotV2.LineTracking(LT.Right) == 1)) {
        car_right()
    } else if (mecanumRobotV2.LineTracking(LT.Left) == 1 && (mecanumRobotV2.LineTracking(LT.Center) == 0 && mecanumRobotV2.LineTracking(LT.Right) == 0)) {
        car_left()
    } else if (mecanumRobotV2.LineTracking(LT.Left) == 1 && (mecanumRobotV2.LineTracking(LT.Center) == 0 && mecanumRobotV2.LineTracking(LT.Right) == 1)) {
        car_forward()
    } else if (mecanumRobotV2.LineTracking(LT.Left) == 1 && (mecanumRobotV2.LineTracking(LT.Center) == 1 && mecanumRobotV2.LineTracking(LT.Right) == 0)) {
        car_left()
    } else if (mecanumRobotV2.LineTracking(LT.Left) == 1 && (mecanumRobotV2.LineTracking(LT.Center) == 1 && mecanumRobotV2.LineTracking(LT.Right) == 1)) {
        car_forward()
    }
}

function follow() {
    mecanumRobotV2.setServo(90)
    basic.pause(200)
    if (mecanumRobotV2.ultra() <= 10) {
        car_back()
    } else if (mecanumRobotV2.ultra() > 20 && mecanumRobotV2.ultra() <= 40) {
        car_forward()
    } else {
        mecanumRobotV2.state()
    }
}

function avoid() {
    distance = mecanumRobotV2.ultra()
    if (distance < 15) {
        mecanumRobotV2.state()
        basic.pause(300)

        mecanumRobotV2.setServo(160)
        basic.pause(300)
        distance_l = mecanumRobotV2.ultra()
        basic.pause(100)

        mecanumRobotV2.setServo(20)
        basic.pause(300)
        distance_r = mecanumRobotV2.ultra()
        basic.pause(100)

        mecanumRobotV2.setServo(90)
        basic.pause(300)

        if (distance_l > distance_r) {
            car_left()
            basic.pause(400)
        } else {
            car_right()
            basic.pause(400)
        }
    } else {
        car_forward()
    }
}

// Handle each complete UART command (terminated by '#') without a blocking while-loop
function handleCommand(cmd: string) {
    ble_val = cmd

    if (cmd == "a") {
        mode = ""
        car_forward()
    } else if (cmd == "b") {
        mode = ""
        car_left()
    } else if (cmd == "c") {
        mode = ""
        car_back()
    } else if (cmd == "d") {
        mode = ""
        car_right()
    } else if (cmd == "k") {
        mode = ""
        car_left_move()
    } else if (cmd == "h") {
        mode = ""
        car_right_move()
    } else if (cmd == "g") {
        mode = ""
        car_move_RF()
    } else if (cmd == "i") {
        mode = ""
        car_move_RB()
    } else if (cmd == "j") {
        mode = ""
        car_move_LB()
    } else if (cmd == "l") {
        mode = ""
        car_move_LF()
    } else if (cmd == "e") {
        mode = ""
        drift_left()
    } else if (cmd == "f") {
        mode = ""
        drift_right()
    } else if (cmd == "s") {
        mode = ""
        mecanumRobotV2.state()
        mecanumRobotV2.setServo(90)
    } else if (cmd == "t") {
        mecanumRobotV2.setLed(LedCount.Left, LedState.ON)
        mecanumRobotV2.setLed(LedCount.Right, LedState.ON)
    } else if (cmd == "u") {
        mecanumRobotV2.setLed(LedCount.Left, LedState.OFF)
        mecanumRobotV2.setLed(LedCount.Right, LedState.OFF)
    } else if (cmd == "p" || cmd == "q" || cmd == "r") {
        // autonomous modes driven in forever loop
        mode = cmd
    } else if (cmd == "v" || cmd == "w" || cmd == "x" || cmd == "y") {
        // speed update commands: expect another numeric payload terminated by '#'
        // Use a short deferred read so the next payload has time to arrive
        control.inBackground(function () {
            let payload = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
            let n = parseFloat(payload)

            if (!isNaN(n)) {
                if (cmd == "v") speed_LF = n
                if (cmd == "w") speed_LB = n
                if (cmd == "x") speed_RF = n
                if (cmd == "y") speed_RB = n
            }
        })
    }
}

// ---- Bluetooth setup ----
// Start UART service explicitly
bluetooth.startUartService()

// Optional: send debug to USB when connected to computer (harmless on battery)
serial.redirectToUSB()

// Keep LED matrix enabled for pairing/debug visibility
led.enable(true)

// Receive each UART message (terminated by '#') as an event
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Hash), function () {
    let cmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
    // cmd may include empty strings if delimiters are doubled; ignore empties
    if (cmd.length > 0) {
        handleCommand(cmd)
        serial.writeString(cmd)
        serial.writeLine("")
    }
})

// Optional: show a simple icon when BLE connects/disconnects (visible because LED is enabled)
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
    basic.pause(200)
    basic.clearScreen()
})

bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
    basic.pause(200)
    basic.clearScreen()
    mecanumRobotV2.state()
})

// ---- Main loop for autonomous modes ----
basic.forever(function () {
    if (mode == "p") {
        tracking()
    } else if (mode == "q") {
        follow()
    } else if (mode == "r") {
        avoid()
    } else {
        // no autonomous mode
        basic.pause(20)
    }
})
