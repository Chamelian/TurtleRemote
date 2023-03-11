os.loadAPI("json")
print("please enter websocket url ( wss://xyz )")
url = read()
ws,err = http.websocket(url)

function TurtEye(turnStatus)
    local FrontBool, FrontBlockdata = turtle.inspect()
    if FrontBool then
        ws.send(textutils.serialise(FrontBlockdata)..'front')
    else
        ws.send('front air')
    end
    if turnStatus == false then
        local TopBool, TopBlockdata = turtle.inspectUp()
        local BottomBool, BottomBlockdata = turtle.inspectDown()
        if TopBool then
            ws.send(textutils.serialise(TopBlockdata)..'top')
        else
            ws.send('top air')
        end
        if BottomBool then
            ws.send(textutils.serialise(BottomBlockdata)..'bottom')
        else
            ws.send('Bottom air')
        end
    end
end

if ws then
    print("\nconnecting...\n")
    sleep(3)
    term.clear()
    term.setCursorPos(1,1)
    while true do
        local obj = ws.receive()
        if obj == nil then
            ws,err = http.websocket(url)
        else
            local obj2 = json.decode(obj)
            local msg = obj2["func"]
            if msg == "forward" then
                turtle.forward()
                TurtEye(false)
            elseif msg == "back" then
                turtle.back()
                TurtEye(false)
            elseif msg == "left" then
                -- dont need bottom or top data for turns
                turtle.turnLeft()
                TurtEye(true)
            elseif msg == "right" then
                turtle.turnRight()
                TurtEye(true)
            elseif msg == "Test Connection" then
                ws.send("Connection Verified")
            elseif msg == 'up' then
                turtle.up()
                TurtEye(false)
            elseif msg == 'down' then
                turtle.down()
                TurtEye(false)
            elseif msg == 'getFuel' then
                ws.send(turtle.getFuelLevel()..'FUEL')
            end
        end
    end
end