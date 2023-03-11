local function is_in (array, value)
    for index, value in ipairs(array) do
        if value == val then
            return true
        end
    end
    return false
end

modem = peripheral.wrap("back")
modem.open(6)
modem.transmit(5, 6, "confirm")
local event, modemSide, senderChannel, replyChannel, message, senderDistance = os.pullEvent("modem_message")
if message == nil then
    print("Failed to connect")
    return
elseif message == "confirmed" then
    print(message)
end
modem.close(6)
local valid_commands = {"forward", "back", "left", "right", "down", "up", "refuel", "getFuel"}
while true do
    print("") -- newline
    print("forward | back | left | right | down | up | refuel | getFuel : ")
    command = read()
    print('') -- newline
    print("Enter value")
    value = read()
    if is_in(valid_commands, command) then
        if command == "getFuel" then
            modem.transmit(5, 6, "turtle.getFuelLevel()")
        else
            modem.transmit(5, 6, "turtle."..command.."("..value..")")
        end
    end
end