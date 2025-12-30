// KS4034 - Bluetooth UART Mecanum Car (micro:bit V2)
// IMPORTANT: Do NOT add NeoPixel / WS2812 packages. They disable BLE in MakeCode.

bluetooth.setTransmitPower(7)
bluetooth.startUartService()
serial.redirectToUSB()

let speed_LF = 50
let speed_LB = 50
let speed_RF = 50
let speed_RB = 50

let color_num = 0
let mode = ""          // "p" line tracking, "q" follow, "r" avoid, "" none
let lastCmd = ""       // last received command

// ---------- Motion helpers ----------
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

// ---------- Autonomous modes ----------
function tracking() {
    if (mecanumRobotV2.LineTracking(LT.Left) == 0 && mecanumRobotV2.LineTracking(LT.Center) == 0 && mecanumRobotV2.LineTracking(LT.Right) == 0) {
        mecanumRobotV2.state()
    } else if (mecanumRobotV2.LineTracking(LT.Right) == 1 && mecanumRobotV2.LineTracking(LT.Center) == 0) {
        car_right()
    } else if (mecanumRobotV2.LineTracking(LT.Left) == 1 && mecanumRobotV2.LineTracking(LT.Center) == 0) {
        car_left()
    } else {
        car_forward()
    }
}

function follow() {
    mecanumRobotV2.setServo(90)
    basic.pause(200)
    const d = mecanumRobotV2.ultra()
    if (d <= 10) {
        car_back()
    } else if (d > 20 && d <= 40) {
        car_forward()
    } else {
        mecanumRobotV2.state()
    }
}

function avoid() {
    let distance = mecanumRobotV2.ultra()
    if (distance < 15) {
        mecanumRobotV2.state()
        basic.pause(200)
        mecanumRobotV2.setServo(160)
        basic.pause(200)
        const distance_l = mecanumRobotV2.ultra()
        mecanumRobotV2.setServo(20)
        basic.pause(200)
        const distance_r = mecanumRobotV2.ultra()
        mecanumRobotV2.setServo(90)
        basic.pause(200)

        if (distance_l > distance_r) {
            car_left()
        } else {
            car_right()
        }
        basic.pause(400)
        mecanumRobotV2.state()
    } else {
        car_forward()
    }
}

// ---------- BLE command handling ----------
function applyCommand(cmd: string) {
    lastCmd = cmd

    if (cmd == "a") car_forward()
    else if (cmd == "b") car_left()
    else if (cmd == "c") car_back()
    else if (cmd == "d") car_right()
    else if (cmd == "k") car_left_move()
    else if (cmd == "h") car_right_move()
    else if (cmd == "g") car_move_RF()
    else if (cmd == "i") car_move_RB()
    else if (cmd == "j") car_move_LB()
    else if (cmd == "l") car_move_LF()
    else if (cmd == "e") drift_left()
    else if (cmd == "f") drift_right()
    else if (cmd == "s") { mode = ""; mecanumRobotV2.state(); mecanumRobotV2.setServo(90) }
    else if (cmd == "t") { mecanumRobotV2.setLed(LedCount.Left, LedState.ON); mecanumRobotV2.setLed(LedCount.Right, LedState.ON) }
    else if (cmd == "u") { mecanumRobotV2.setLed(LedCount.Left, LedState.OFF); mecanumRobotV2.setLed(LedCount.Right, LedState.OFF) }
    else if (cmd == "p" || cmd == "q" || cmd == "r") { mode = cmd }
}

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Hash), function () {
    const msg = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
    if (msg.length == 0) return

    // speed messages are two-part: "v#<num>#", "w#<num>#", etc.
    if (msg == "v" || msg == "w" || msg == "x" || msg == "y") {
        basic.pause(20)
        const nStr = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
        const n = parseFloat(nStr)
        if (!isNaN(n)) {
            if (msg == "v") speed_LF = n
            else if (msg == "w") speed_LB = n
            else if (msg == "x") speed_RF = n
            else if (msg == "y") speed_RB = n
        }
        return
    }

    applyCommand(msg)
})

bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
})

bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
    mode = ""
    mecanumRobotV2.state()
})

// ---------- Main loop for autonomous modes ----------
basic.showIcon(IconNames.Heart)
basic.forever(function () {
    if (mode == "p") tracking()
    else if (mode == "q") follow()
    else if (mode == "r") avoid()
    else basic.pause(20)
})
