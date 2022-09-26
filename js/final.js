var $brush = $('#brush')
var $canvas = $('#canvas')
var $brushSlider = $('#brush-slider')
var $indicator = $('#indicator')
var $drawing = $('#drawing')
var $brushSize = $('.brush-size')
var $brushP = $('#brush-p')
var color = '#000000', statusShape = 'circle', divCount = 0
const canvaPosition = { x: $canvas.offset().left, y: $canvas.offset().top }

//設定筆刷尺寸 ok
function brushStyle($target, size, shape) {
    $target.css({
        'width': size + 'px',
        'height': size + 'px',
    })
    var status
    if (shape) { status = shape } else { status = statusShape }
    if (status === 'circle') {
        $target.css({
            'border-radius': size / 2 + 'px'
        })
    } else {
        $target.css({
            'border-radius': 0
        })
    }
}

//清空畫布 ok
$('#clear').on('click', function () {
    $drawing.empty('.paint')
    totalStep = -1
    for (let i = totalStep + 1; i < temp.length; i++) {
        delete temp[i]

    }
    nowStep = -1
    divCount = 0
})

//加入筆畫 ok (但加入的筆畫會蓋掉canvas的border)
$canvas.on('click', function (event) {
    if (!btnStatus[4]) return
    if ($brush.val() == 0) return alert('invalid')
    var $newDiv = $('<div>').addClass('paint').attr('data-div', divCount)
    var left = event.pageX - $canvas.scrollLeft() - canvaPosition.x - ($brush.val()) / 2 - 1 + 'px'
    var top = event.pageY - $canvas.scrollTop() - canvaPosition.y - ($brush.val()) / 2 - 1 + 'px'
    $newDiv.css({
        'left': left,
        'top': top,
        'background-color': color
    })
    record('add', left, top, color, $brush.val(), statusShape, $newDiv)
    brushStyle($newDiv, $brush.val())
    $drawing.append($newDiv)
    divCount++
})

//顯示指標 ok (但螢幕都被黑色弄滿時會看不見指標)
$canvas.on('mouseover', function (event) {
    if (!$(event.target).is($canvas) && !$(event.target).is('.paint')) return
    if (!btnStatus[4]) { $canvas.css('cursor', 'default') } else {
        if (!cursor) { $canvas.css('cursor', 'none') } else { $canvas.css('cursor', 'default') }
        $indicator.addClass('display')
    }
})

//更新指標位置 ok
$canvas.on('mousemove', function (event) {
    $indicator.css({
        'left': (event.clientX - brush.value / 2) + 'px',
        'top': (event.clientY - brush.value / 2) + 'px'
    })
})

//滑鼠移出畫布外時隱藏指標 ok
$('#wrapper').on('mouseover', function (event) {
    if ($(event.target).is($canvas)) return
    if ($(event.target).is($indicator)) return
    if ($(event.target).is('.paint')) return
    $indicator.removeClass('display')
})

//偵測筆刷數值並更動 ok
$brush.on('input', function () {
    $(this).val(Math.floor($(this).val()))
    if ($(this).val() > 300) $(this).val(300)
    $brushSlider.val($(this).val())
    $brushP.text($(this).val())
    if ($brush.val() > 50) {
        brushStyle($brushSize.filter('#size'), 50)
    } else {
        brushStyle($brushSize.filter('#size'), $brush.val())
    }
    brushStyle($indicator, $brush.val())

})
$brushSlider.on('input', function () {
    $brush.val($(this).val())
    $brushP.text($(this).val())
    if ($brushSlider.val() > 50) {
        brushStyle($brushSize.filter('#size'), 50)
    } else {
        brushStyle($brushSize.filter('#size'), $brush.val())
    }
    brushStyle($indicator, $brush.val())

})

//變換筆刷顏色 ok
$('#color-picker').on('input', function () {
    color = $(this).val()
    $('#size').css('background-color', color)

})

//變換筆刷形狀 ok
function brushShape($target, size) {
    if (statusShape === 'circle') {
        $target.css('border-radius', size / 2 + 'px')
    } else {
        $target.css('border-radius', 0)
    }
}
$('#circle').on('click', function () {
    if (statusShape !== 'circle') {
        $('#circle-1').addClass('hidden')
        $('#circle-2').removeClass('hidden')
        $('#square-1').removeClass('hidden')
        $('#square-2').addClass('hidden')
        statusShape = 'circle'
        $(this).addClass('btn-on')
        $('#square').removeClass('btn-on')
        brushShape($indicator, $brush.val())
        if ($brush.val() > 50) {
            brushShape($brushSize.filter('#size'), 50)
        } else {
            brushShape($brushSize.filter('#size'), $brush.val())
        }
    }
})
$('#square').on('click', function () {
    if (statusShape !== 'square') {
        $('#circle-1').removeClass('hidden')
        $('#circle-2').addClass('hidden')
        $('#square-1').addClass('hidden')
        $('#square-2').removeClass('hidden')
        statusShape = 'square'
        $(this).addClass('btn-on')
        $('#circle').removeClass('btn-on')
        brushShape($indicator, $brush.val())
        if ($brush.val() > 50) {
            brushShape($brushSize.filter('#size'), 50)
        } else {
            brushShape($brushSize.filter('#size'), $brush.val())
        }
    }
})

//記錄動作 ok
var totalStep = -1
var nowStep = -1
var temp = new Object()
function record(a, b, c, d, e, f, g) {
    temp.length = totalStep + 2
    totalStep = nowStep + 1
    for (let i = totalStep; i < temp.length; i++) {
        delete temp[i]

    }
    switch (a) {
        case 'add':
            temp[totalStep] = {
                "type": a,
                "left": b,
                "top": c,
                "color": d,
                "brushsize": e,
                "statusshape": f,
                "target": g
            }
            break
        case 'move':
            temp[totalStep] = {
                "type": a,
                "leftbefore": b,
                "topbefore": c,
                "leftafter": d,
                "topafter": e,
                "target": f
            }
            break
        case 'remove':
            temp[totalStep] = {
                "type": a,
                "target": b
            }
            break
        case 'coloring':
            temp[totalStep] = {
                "type": a,
                "colorbefore": b,
                "colorafter": c,
                "target": d
            }
            break
    }
    nowStep++
}

//上一步 ok
$('#previous').on('click', function () {
    if (nowStep === -1) return
    var previous = temp[nowStep]
    switch (previous.type) {
        case 'add':
            $(previous.target).addClass('hidden')
            break
        case 'move':
            $(previous.target).css({
                'left': previous.leftbefore,
                'top': previous.topbefore,
            })
            break
        case 'remove':
            $(previous.target).removeClass('hidden')
            break
        case 'coloring':
            previous.target.css('background-color', previous.colorbefore)
            break
    }
    nowStep--
})

//下一步
$('#next').on('click', function () {
    if (!temp[nowStep + 1]) return
    nowStep++
    var next = temp[nowStep]
    switch (next.type) {
        case 'add':
            $(next.target).removeClass('hidden')
            break
        case 'move':
            $(next.target).css({
                'left': next.leftafter,
                'top': next.topafter,
            })
            break
        case 'remove':
            $(next.target).addClass('hidden')
            break
        case 'coloring':
            next.target.css('background-color', next.colorafter)
            break
    }
    // switch (temp[nowStep].type) {
    //     case 'add':
    //         var $newDiv = $('<div>').addClass('paint').attr('data-div', divCount)
    //         $newDiv.css({
    //             'left': temp[nowStep].left,
    //             'top': temp[nowStep].top,
    //             'background-color': temp[nowStep].color
    //         })
    //         brushStyle($newDiv, temp[nowStep].brushsize, temp[nowStep].statusshape)
    //         $drawing.append($newDiv)
    // }
    // lastNext = true
    // lastPrevious = false

})

//顯示游標 ok
var cursor = false
$('#cursor').on('click', function () {
    if (!cursor) {
        cursor = true
        $('#cursor').addClass('btn-on')
    } else {
        cursor = false
        $('#cursor').removeClass('btn-on')
    }
})

//move, remove, color, picker, btn-brush
var btnStatus = [false, false, false, false, true]
var btnName = ['#move', '#remove', '#color', '#picker', '#btn-brush']
var currentBtn = 4
var btnPicOff = ['#move-1', '#remove-1', '#color-1', '#picker-1', '#brush-1']
var btnPicOn = ['#move-2', '#remove-2', '#color-2', '#picker-2', '#brush-2']
function btnOn(num) {
    btnStatus[num] = true
    btnStatus[currentBtn] = false
    $(btnName[num]).addClass('btn-on')
    $(btnName[currentBtn]).removeClass('btn-on')
    $(btnPicOn[num]).removeClass('hidden')
    $(btnPicOn[currentBtn]).addClass('hidden')
    $(btnPicOff[num]).addClass('hidden')
    $(btnPicOff[currentBtn]).removeClass('hidden')
    currentBtn = num
}
function btnOff(num) {
    btnStatus[num] = false
    currentBtn = 4
    btnStatus[currentBtn] = true
    $(btnName[num]).removeClass('btn-on')
    $(btnName[currentBtn]).addClass('btn-on')
    $(btnPicOn[num]).addClass('hidden')
    $(btnPicOn[currentBtn]).removeClass('hidden')
    $(btnPicOff[num]).removeClass('hidden')
    $(btnPicOff[currentBtn]).addClass('hidden')
}
//移動 (bug: 已知有時候當滑鼠游標出現禁止圖樣時，不用按下滑鼠div就會跟著動)
$('#move').on('click', function () {
    if (!btnStatus[0]) {
        btnOn(0)
    } else {
        btnOff(0)
    }
})
var nowMove = false
var leftbefore, topbefore
$drawing.on('mousedown', function (event) {
    if (!btnStatus[0]) return
    nowMove = true
    var $target = $(event.target)
    var width = $target.css('width').replace('px', '')
    leftbefore = $target.css('left')
    topbefore = $target.css('top')
    $canvas.on('mousemove', function (event) {
        if (!nowMove) return
        var left = event.pageX - $canvas.scrollLeft() - canvaPosition.x - width / 2 - 1 + 'px'
        var top = event.pageY - $canvas.scrollTop() - canvaPosition.y - width / 2 - 1 + 'px'
        $target.css({
            'left': left,
            'top': top
        })
    })

})
$drawing.on('mouseup', function (event) {
    if (!btnStatus[0]) return
    nowMove = false
    var $target = $(event.target)
    record('move', leftbefore, topbefore, $target.css('left'), $target.css('top'), $target)
    $canvas.off('mousemove')
    $canvas.on('mousemove', function (event) {
        $indicator.css({
            'left': (event.clientX - brush.value / 2) + 'px',
            'top': (event.clientY - brush.value / 2) + 'px'
        })
    })
})

//移除 ok
$('#remove').on('click', function () {
    if (!btnStatus[1]) {
        btnOn(1)
    } else {
        btnOff(1)
    }
})
$drawing.on('click', function (event) {
    if (!btnStatus[1]) return
    var $target = $(event.target)
    record('remove', $target)
    $target.addClass('hidden')
})

//填色 ok
$('#color').on('click', function () {
    if (!btnStatus[2]) {
        btnOn(2)
    } else {
        btnOff(2)
    }
})
$drawing.on('click', function (event) {
    if (!btnStatus[2]) return
    var $target = $(event.target)
    record('coloring', $target.css('background-color'), color, $target)
    $target.css('background-color', color)
})

//取色 ok
$('#picker').on('click', function () {
    if (!btnStatus[3]) {
        btnOn(3)
    } else {
        btnOff(3)
    }
})
$drawing.on('click', function (event) {
    if (!btnStatus[3]) return
    var $target = $(event.target)
    color = $target.css('background-color')
    color = rgb2hex(color)
    $('#color-picker').val(color)
    $('#size').css('background-color', color)
})

//convert rgb to hex 
// reference: https://stackoverflow.com/questions/55016750/how-can-i-convert-rgb-value-to-hex-color-using-jquery/55017285
var hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
var hex = function (x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

//筆刷 ok
$('#btn-brush').on('click', function () {
    if (btnStatus[4]) return
    btnOn(4)
})

//顯示作品資訊 ok
$('#btn-information').on('click', function () {
    $('#about').show(300)
    $('#cover').show()
})

//關閉作品資訊 ok
$('#close-about').on('click', function () {
    $('#about').hide(400)
    $('#cover').hide()
})