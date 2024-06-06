console.log("Renderer JS Working")
const container = document.getElementById('container')
const clockText = document.getElementById("clockText");
const dateText = document.getElementById("dateText");
const remindersBtn = document.getElementById("remindersBtn");
const reminderNotificationDiv = document.getElementById('reminderNotificationDiv');

let fontSize = 16;
const savedFontSize = JSON.parse(localStorage.getItem('font-size'));
if(savedFontSize != null) {
    console.log('not null')
    fontSize = savedFontSize;
    clockText.style.fontSize = fontSize + 'px';
    dateText.style.fontSize = fontSize + 'px';
} else if(savedFontSize == null) {
    console.log('null')
}

window.clockFontSizeChange.onFontChange((value) => {
    fontSize = fontSize + value;
    console.log(fontSize);
    clockText.style.fontSize = fontSize + 'px';
    dateText.style.fontSize = fontSize + 'px';

    saveFontSize(fontSize);
})

function saveFontSize(i) {
    localStorage.setItem('font-size', JSON.stringify(i))
}

function updateTime() {
    const time = new Date();
    let weekday = time.getDay();
    weekday = setWeekDay(weekday);
    let day = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    dateText.textContent = weekday + " " + day + "/" + month + "/" + year;

    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    let ms = time.getMilliseconds().toString();
    m = checkTime(m);
    s = checkTime(s);
    ms = checkTime(ms);
    ms = ms.slice(0, 2);
    clockText.textContent = h + ":" + m + ":" + s + ":" + ms;
    setTimeout(updateTime, 10);
}

updateTime();

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

function setWeekDay(i) {
    switch(i) {
        case i = 0:
            i = "Sunday";
            return i;
        case i = 1:
            i = "Monday";
            return i;
        case i = 2:
            i = "Tuesday";
            return i;
        case i = 3:
            i = "Wednesday";
            return i;
        case i = 4:
            i = "Thursday";
            return i;
        case i = 5:
            i = "Friday";
            return i;
        case i = 6:
            i = "Saturday";
            return i;
    }
}

let mouseOverNoti = false;

remindersBtn.addEventListener('click', async () => {
    await window.remindersWindow.createRemindersWindow()
})

remindersBtn.addEventListener('mouseover', async () => {
    mouseOverNoti = true;
    await window.winMouseEvents.ignoreMouseEventsFalse()
})

remindersBtn.addEventListener('mouseleave', async () => {
    mouseOverNoti = false;
    await window.winMouseEvents.ignoreMouseEventsTrue()
})

container.addEventListener('mouseover', async () => {
    if(mouseOverNoti == false) {
        await window.winMouseEvents.ignoreMouseEventsTrue()
    }
})

clockText.addEventListener('mouseover', async () => {
    await window.winMouseEvents.ignoreMouseEventsTrue()
})

dateText.addEventListener('mouseover', async () => {
    await window.winMouseEvents.ignoreMouseEventsTrue()
})

reminderNotificationDiv.addEventListener('mouseover', async () => {
    mouseOverNoti = true;
    await window.winMouseEvents.ignoreMouseEventsFalse()
})

reminderNotificationDiv.addEventListener('mouseleave', async () => {
    mouseOverNoti = false;
    await window.winMouseEvents.ignoreMouseEventsTrue()
})

// add time offset ???????

window.electronAPI.onUpdateDiv((p, pId) => {
    if(!document.getElementById(pId)){
        let para = document.createElement('p');
        para.setAttribute('id', pId);
        para.innerText = p;
        reminderNotificationDiv.appendChild(para);

        para.addEventListener('click', () => {
            mouseOverNoti = false;
            reminderNotificationDiv.removeChild(para);
        })
    }
});

window.remindersDiv.onRemoveReminder((event, pId) => {
    const pToDelete = document.getElementById(pId)
    if(pToDelete) {
        reminderNotificationDiv.removeChild(pToDelete);
    }
})