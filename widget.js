let widget = await createWidget();
if (!config.runsInWidget) {
    await widget.presentSmall();
}

Script.setWidget(widget);
Script.complete();

async function createWidget(items) {

    let req = new Request("https://$DOMAIN/api/states")
    req.headers = { "Authorization": "Bearer $BEARER", "content-type": "application/json" }
    let json = await req.loadJSON();

    /* Parse data received from API */
    let data = { livingroom: {} }

    data.livingroom = addData(json, data.livingroom, ['sensor.wood_stove_temperature']);

    /* Create the widget */
    const widget = new ListWidget();
    widget.backgroundColor = new Color("#03a9f4", 1.0);

    /* Add the sensor entries */
    const bodyStack = widget.addStack();

    /* Second, the temperature column */
    const tempStack = bodyStack.addStack();
    tempStack.centerAlignContent();
    tempStack.setPadding(0, 11, 0, 0);
    tempStack.borderWidth = 0;
    tempStack.size = new Size(0, 50);
    tempStack.layoutVertically();

    addTemp(tempStack, data.livingroom)

    /* Done: Widget is now ready to be displayed */
    return widget;
}

/* Adds the entries to the label column */
async function addLabel(labelStack, label) {
    const mytext = labelStack.addText(label);
    mytext.font = Font.semiboldSystemFont(40);
    mytext.textColor = Color.black();
}

/* Adds the entries to the temperature column */
async function addTemp(tempStack, data) {
    const mytext = tempStack.addText(data.temp + "°F");
    mytext.font = Font.heavyMonospacedSystemFont(13);
    mytext.textColor = Color.white();
}

/* Searches for the respective sensor values ('state') in the API response of Home Assistant */
function addData(json, room, sensors) {
    room.temp = "N/A";
    var i;
    for (i = 0; i < json.length; i++) {
        if (json[i]['entity_id'] == sensors[0]) {
            room.temp = Number(json[i]['state']);
            room.temp = room.temp.toFixed(1);
        }
    }
    return room;
}