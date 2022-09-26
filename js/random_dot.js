function getNum(number) {
    return Math.floor(Math.random() * number)
}

function randomDot(times, size) {
    for (let i = 0; i < times; i++) {
        var left, top, red, green, blue
        left = getNum(960)
        top = getNum(540)
        red = getNum(256).toString(16)
        green = getNum(256).toString(16)
        blue = getNum(256).toString(16)
        var col = '#' + red + green + blue
        var $newDiv = $('<div>').addClass('paint').attr('data-div', divCount)
        $newDiv.css({
            'left': left,
            'top': top,
            'background-color': col
        })
        if (size) { brushStyle($newDiv, size) } else { brushStyle($newDiv, $brush.val()) }
        $drawing.append($newDiv)
        divCount++
    }
}
