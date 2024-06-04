console.log("Reminders JS Working");
const reminderTime = document.getElementById('inputTime');
const remindersBtn = document.getElementById('addReminderBtn');
const upcomingDiv = document.getElementById('upcomingContainer');
const todayContainer = document.getElementById('todayContainer');

let reminders;
const savedReminders = JSON.parse(localStorage.getItem("reminders"))
let todayReminders;
const savedTodayReminders = JSON.parse(localStorage.getItem("todayReminders"));

if(Array.isArray(savedReminders)) {
    reminders = savedReminders;
} else {
    reminders = [{}];
}

reminders.sort(sortReminders)

if(Array.isArray(savedTodayReminders)) {
    todayReminders = savedTodayReminders;
} else {
    todayReminders = [{}];
}

todayReminders.sort(sortReminders)

function sortReminders(a, b) {
    let dateA = new Date(`${a.date}T${a.time}`)
    let dateB = new Date(`${b.date}T${b.time}`)
    return dateA - dateB;
}


reminderTime.onblur = () => {
    if(reminderTime.value.length == 1) {
        reminderTime.value = "0" + reminderTime.value + ':00'
    } else if(reminderTime.value.length == 2) {
        reminderTime.value = reminderTime.value + ':00'
    } else if(reminderTime.value.length == 3) {
        let time1 = reminderTime.value.slice(0, 1);
        let time23 = reminderTime.value.slice(1,3);
        reminderTime.value = '0' + time1 + ':' + time23;
    } else if(reminderTime.value.length == 4) {
        let time12 = reminderTime.value.slice(0, 2);
        let time34 = reminderTime.value.slice(2,4);
        reminderTime.value = time12 + ':' + time34;
    }
}

function addReminder() {
    const reminderInput = document.getElementById('addReminder');
    const reminderDate = document.getElementById('reminderDate');
    const errorDiv = document.getElementById('errorDiv');
    errorDiv.innerHTML = '';
    if(reminderInput.value.length <1){
        let p = document.createElement('p');
        p.textContent = "Enter Reminder Title";
        errorDiv.appendChild(p);
    } else if(reminderTime.value.length < 1) {
        let p = document.createElement('p');
        p.textContent = "Enter Reminder Time";
        errorDiv.appendChild(p);
    } else if(reminderDate.value.length < 1) {
        let p = document.createElement('p');
        p.textContent = "Enter Reminder Date";
        errorDiv.appendChild(p);
    } else {
        const titleInput = document.getElementById('addReminder');
        const title = titleInput.value;

        const dateInput = document.getElementById('reminderDate');
        const date = dateInput.value;

        const timeInput = document.getElementById('inputTime');
        const time = timeInput.value;

        createReminder(title, date, time);

        render();
    }
}

function createReminder(title, date, time) {
    const id = "" + new Date().getTime();

    reminders.push({
        title: title,
        date: date,
        time: time,
        id: id
    })

    //console.log(reminders);
    saveReminder();
    moveReminder(id);
    reminders.sort(sortReminders)
    todayReminders.sort(sortReminders)
}

function render() {
    upcomingDiv.innerHTML = ''

    reminders.forEach(function (reminder) {
        const reminderDiv = document.createElement('div');
        reminderDiv.setAttribute('id', reminder.id);
        reminderDiv.setAttribute('class', 'reminderDiv');
        reminderDiv.innerText = reminder.title + ' | ' + reminder.time + ' | ' + reminder.date;

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'deleteReminderBtn');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = deleteReminder;
        deleteButton.id = reminder.id;
        reminderDiv.appendChild(deleteButton);

        upcomingDiv.appendChild(reminderDiv);
    })

    todayContainer.innerHTML = ''

    todayReminders.forEach(function (todayRemidner) {
        const reminderDiv = document.createElement('div');
        reminderDiv.setAttribute('id', todayRemidner.id);
        reminderDiv.setAttribute('class', 'reminderDiv');
        reminderDiv.innerText = todayRemidner.title + ' | ' + todayRemidner.time + ' | ' + todayRemidner.date;

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'deleteReminderBtn');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = deleteReminder;
        deleteButton.id = todayRemidner.id;
        reminderDiv.appendChild(deleteButton);

        todayContainer.appendChild(reminderDiv);
    })
}

function deleteReminder(event) {
    console.log("deleting reminder")
    const deleteButton = event.target;
    const deleteId = deleteButton.id;

    removeReminder(deleteId);
    render();
}

function removeReminder(deleteId) {
    reminders = reminders.filter(function (reminder) {
        if(reminder.id === deleteId) {
            return false;
        } else {
            return true;
        }
    });

    todayReminders = todayReminders.filter(function (todayReminder) {
        if(todayReminder.id === deleteId) {
            return false;
        } else {
            return true;
        }
    });
    console.log(todayReminders);

    saveReminder();
    saveTodayReminder();
}

function moveReminder(reminderId) {
    reminders = reminders.filter(function (reminder) {
        if(reminder.id === reminderId) {
            let dateAndTime = reminder.date + " " + reminder.time;
            let scheduledTime = new Date(dateAndTime);
            let currentTime = new Date();
            let timeDifference = scheduledTime - currentTime;

            if(timeDifference <= 86400000) {
                let reminderDiv = document.getElementById(reminderId);
                todayContainer.insertAdjacentHTML('afterbegin', reminderDiv);
                todayReminders.push({
                    title: reminder.title,
                    date: reminder.date,
                    time: reminder.time,
                    id: reminder.id
                })
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    })

    saveReminder();
    saveTodayReminder();
    render();
}

function saveReminder() {
    localStorage.setItem("reminders", JSON.stringify(reminders));
}

function saveTodayReminder() {
    localStorage.setItem("todayReminders", JSON.stringify(todayReminders));
}

function updateReminderDiv() {
    reminders.forEach((reminder) => {
        let dateAndTime = reminder.date + " " + reminder.time;
        let scheduledTime = new Date(dateAndTime);
        let currentTime = new Date();
        let timeDifference = scheduledTime - currentTime;

        if(timeDifference <= 86400000) {
            console.log("reminder is today");
            moveReminder(reminder.id);
        }
    })

    setTimeout(updateReminderDiv, 100);
}
updateReminderDiv();

render();

remindersBtn.addEventListener('click', addReminder);


function notifyReminder() {
    todayReminders.forEach((todayReminder) => {
        let dateAndTime = todayReminder.date + " " + todayReminder.time;
        let scheduledTime = new Date(dateAndTime);
        let currentTime = new Date();
        let timeDifference = scheduledTime - currentTime;

        let todayReminderDiv = document.getElementById(todayReminder.id);

        const notificationAudio = new Audio('./audio/reminder-notification.mp3');
        notificationAudio.volume = 0.75;

        if(timeDifference < 1 && !todayReminderDiv.classList.contains("0notified")) {
            console.log(timeDifference);
            todayReminderDiv.classList.add("0notified");
            let p = todayReminder.title + ' Now';
            let pId = todayReminderDiv.id;
            window.electronAPI.sendChangeDivText(p, pId);
            notificationAudio.play();
            //setTimeout(() => removeNotification(todayReminderDiv.id), 5000);
        } else if(timeDifference < 300000 && !todayReminderDiv.classList.contains("5notified") && !todayReminderDiv.classList.contains("0notified")) { // < 5 mins
            console.log(timeDifference);
            todayReminderDiv.classList.add("5notified");
            let p = todayReminder.title + ' In 5 Minutes';
            let pId = todayReminderDiv.id;
            window.electronAPI.sendChangeDivText(p, pId);
            notificationAudio.play();
            setTimeout(() => removeNotification(todayReminderDiv.id), 10000);
        } else if(timeDifference < 1800000 && !todayReminderDiv.classList.contains("30notified") && !todayReminderDiv.classList.contains("5notified") && !todayReminderDiv.classList.contains("0notified")) { // < 30 mins
            console.log(timeDifference);
            todayReminderDiv.classList.add("30notified");
            let p = todayReminder.title + ' In 30 Minutes';
            let pId = todayReminderDiv.id;
            window.electronAPI.sendChangeDivText(p, pId);
            notificationAudio.play();
            setTimeout(() => removeNotification(todayReminderDiv.id), 10000);
        } else if(timeDifference < 3600000 && !todayReminderDiv.classList.contains("60notified") && !todayReminderDiv.classList.contains("30notified") && !todayReminderDiv.classList.contains("5notified") && !todayReminderDiv.classList.contains("0notified")) { // < an hour
            console.log(timeDifference);
            todayReminderDiv.classList.add("60notified");
            let p = todayReminder.title + ' In 1 Hour';
            let pId = todayReminderDiv.id;
            window.electronAPI.sendChangeDivText(p, pId);
            notificationAudio.play();
            setTimeout(() => removeNotification(todayReminderDiv.id), 10000);
        } 
    });
    setTimeout(notifyReminder, 1000);
}
notifyReminder();

window.addEventListener('beforeunload', () => {
    todayReminders.forEach((todayReminder) => {
        removeNotification(todayReminder.id)
    })
})

function removeNotification(p, pId) {
    window.remindersDiv.removeReminderP(p, pId)
}

function saveReminderClasses() {
    let reminderClassNames = {};
    let todayReminderClassNames = {};

    reminders.forEach((reminder) => {
        const reminderDiv = document.getElementById(reminder.id)
        reminderClassNames[reminder.id] = reminderDiv.className;
    })
    console.log(reminderClassNames)
    localStorage.setItem('reminderClasses', JSON.stringify(reminderClassNames));

    todayReminders.forEach((todayReminder) => {
        const todayReminderDiv = document.getElementById(todayReminder.id)
        todayReminderClassNames[todayReminder.id] = todayReminderDiv.className;
    })
    console.log(todayReminderClassNames)
    localStorage.setItem('todayReminderClasses', JSON.stringify(todayReminderClassNames));
}

function loadReminderClasses() {
    let reminderClassNames = JSON.parse(localStorage.getItem('reminderClasses'));

    console.log(reminderClassNames)

    for(let i = 1; i < todayReminders.length; i++) {

        todayReminders.forEach((todayReminder) => {

            let TodayreminderClassNames = JSON.parse(localStorage.getItem('todayReminderClasses'))
            console.log(TodayreminderClassNames);
            
            if(todayReminder.id == localStorage.key[i]) {
                console.log(todayReminder.id);
            }
            
        })

    }
}

document.addEventListener('DOMContentLoaded', () => {  
    const remindersTextarea = document.getElementById('remindersTextareaId');
    const textSavedStatus = document.getElementById('textSavedStatus');
    remindersTextarea.addEventListener('input', () => {
        console.log('change');
        textSavedStatus.textContent = 'Unsaved'
        remindersTextarea.style.height = remindersTextarea.scrollHeight + 'px';
    })
});


// Save classes when notifyReminder() is called
// Have reminders window always open, button just shows it. (maybe. this was because it wasn't showing reminder when minimized)
// have notes at the bottom.
// add settings for font size, volume, alwaysOnTop,
// save to local .JSON file instead of localStorage

// have reminders app open on launch.
// have reminderButton switch skipTaskbar = false, minimise: false
// remove frame
// create new frame with only minimise tab
// when minimise is clicked, skipTaskbar = true.

// Fix
// reminders refreshing (unsure if fixable, it is cleared from local storeage)