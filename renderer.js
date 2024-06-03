console.log("Renderer JS Working")
const clockText = document.getElementById("clockText");
const dateText = document.getElementById("dateText");
const remindersBtn = document.getElementById("remindersBtn");
const reminderNotificationDiv = document.getElementById('reminderNotificationDiv');

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

remindersBtn.addEventListener('click', async () => {
    await window.remindersWindow.createRemindersWindow()
})

remindersBtn.addEventListener('mouseover', async () => {
    await window.winMouseEvents.ignoreMouseEventsFalse()
})

remindersBtn.addEventListener('mouseleave', async () => {
    console.log("Leave")
    await window.winMouseEvents.ignoreMouseEventsTrue()
})

reminderNotificationDiv.addEventListener('mouseover', async () => {
    await window.winMouseEvents.ignoreMouseEventsFalse()
})

reminderNotificationDiv.addEventListener('mouseleave', async () => {
    await window.winMouseEvents.ignoreMouseEventsTrue()
})

// add time offset ???????

window.electronAPI.onUpdateDiv((p, pId) => {
    let para = document.createElement('p');
    para.setAttribute('id', pId);
    para.innerText = p;
    reminderNotificationDiv.appendChild(para);

    para.addEventListener('click', () => {
        reminderNotificationDiv.removeChild(para);
    })
});

window.remindersDiv.onRemoveReminderPMain((event, pId) => {
    console.log('removed');
    const pToDelete = document.getElementById(pId)
    remindersDiv.removeChild(pToDelete);
})