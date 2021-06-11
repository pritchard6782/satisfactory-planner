
const resourceIcons = {}

for (const tab of window.mapData.options) {
    for (const resourceGroup of tab.options) {
        resourceIcons[resourceGroup.name] =  resourceGroup.options[0].icon
    }
}

console.log(resourceIcons)


    var canvas = new fabric.Canvas('design');
    
    var text = new fabric.Text("text", {
        fontSize: 16,
        originX: 'center',
        originY: 'center'
    });

    canvas.add(text);

    createInputNode("Hello", resourceIcons.Limestone, canvas)

    canvas.selectionColor = 'rgba(0,255,0,0.3)';
    canvas.selectionBorderColor = 'red';
    canvas.selectionLineWidth = 5;

////////////

function createInputNode(text, iconUrl, canvas) {
    var rect = new fabric.Rect({
        height: 100,
        width: 100,
        fill: '#eef',
        originX: 'center',
        originY: 'center'
    });

    var line = new fabric.Line({
        x1: 100,
        x2: 100,
        y1: 150,
        y2: 150,
        fill: '#333'
    });
    
    var text = new fabric.Text(text, {
        fontSize: 16,
        originX: 'center',
        originY: 'center'
    });

    fabric.Image.fromURL(iconUrl, icon => {
        icon.scaleToWidth(36)
        var group = new fabric.Group([ rect, line, text, icon ], {
            left: 150,
            top: 100
        });
        
        canvas.add(group);
    });
}
