modem = peripheral.wrap("left")
modem.open(5)

while true do
    local event, modemSide, senderChannel, replyChannel, message, senderDistance = os.pullEvent("modem_message")
    if "message" == "confirm" then
        modem.transmit(6, 5, "confirmed")
    end
    action = loadstring(message)
    if action == nil then
        print("nil value")
    else
        action()
    end
end