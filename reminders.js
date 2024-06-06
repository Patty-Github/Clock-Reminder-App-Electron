console.log("Reminders JS Working");
const reminderTime = document.getElementById('inputTime');
const remindersBtn = document.getElementById('addReminderBtn');
const upcomingDiv = document.getElementById('upcomingContainer');
const todayContainer = document.getElementById('todayContainer');
const minimizeBtn = document.getElementById('minimizeBtn');

minimizeBtn.addEventListener('click', async () => {
    await window.remindersWindow.createRemindersWindow()
})

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

    const savedTodayContainerHTML = JSON.parse(localStorage.getItem('todayContainerHTML'));
    todayContainer.innerHTML = savedTodayContainerHTML;
    let counter = 0;
    let newRemindersContainer = document.createElement('div');

    todayReminders.forEach(function (todayReminder) {
        const oldReminderDiv = document.getElementById(todayReminder.id)

        const reminderDiv = document.createElement('div');
        reminderDiv.setAttribute('id', todayReminder.id);
        reminderDiv.setAttribute('class', 'reminderDiv');
        reminderDiv.innerText = todayReminder.title + ' | ' + todayReminder.time + ' | ' + todayReminder.date;

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'deleteReminderBtn');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = deleteReminder;
        deleteButton.id = todayReminder.id;
        reminderDiv.appendChild(deleteButton);

        if(oldReminderDiv != null) {
            if (oldReminderDiv.classList.contains('0notified')) {
                reminderDiv.classList.add('0notified');
            }
            if (oldReminderDiv.classList.contains('5notified')) {
                reminderDiv.classList.add('5notified');
            }
            if (oldReminderDiv.classList.contains('30notified')) {
                reminderDiv.classList.add('30notified');
            }
            if (oldReminderDiv.classList.contains('60notified')) {
                reminderDiv.classList.add('60notified');
            }
        }


        newRemindersContainer.appendChild(reminderDiv);
        counter++;
        //console.log(counter + '/' + todayReminders.length);
        if(counter === todayReminders.length) {
            todayContainer.innerHTML = '';
            todayContainer.appendChild(newRemindersContainer);
        }
    })
}
document.addEventListener('DOMContentLoaded', render);

function saveTodayContainerHTML() {
    localStorage.setItem('todayContainerHTML', JSON.stringify(todayContainer.innerHTML))
}

window.addEventListener('beforeunload', () => {
    saveTodayContainerHTML()
})

function deleteReminder(event) {
    const deleteButton = event.target;
    const deleteId = deleteButton.id;

    removeReminder(deleteId);
    render();
};

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
            removeNotification(todayReminder.id)
            return false;
        } else {
            return true;
        }
    });

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
            moveReminder(reminder.id);
        }
    })

    setTimeout(updateReminderDiv, 100);
}
document.addEventListener('DOMContentLoaded', updateReminderDiv);

remindersBtn.addEventListener('click', addReminder);


function notifyReminder() {
    todayReminders.forEach((todayReminder) => {
        let dateAndTime = todayReminder.date + " " + todayReminder.time;
        let scheduledTime = new Date(dateAndTime);
        let currentTime = new Date();
        let timeDifference = scheduledTime - currentTime;

        let todayReminderDiv = document.getElementById(todayReminder.id);

        const notificationAudio = new Audio('./audio/reminder-notification.mp3');
        notificationAudio.volume = 1;

        if(timeDifference < 1 && !todayReminderDiv.classList.contains("0notified")) {
            todayReminderDiv.classList.add("0notified");
            let p = todayReminder.title + ' Now';
            let pId = todayReminderDiv.id;
            window.electronAPI.sendChangeDivText(p, pId);
            notificationAudio.play();
        } else if(timeDifference < 300000 && !todayReminderDiv.classList.contains("5notified") && !todayReminderDiv.classList.contains("0notified")) { // < 5 mins
            todayReminderDiv.classList.add("5notified");
            let p = todayReminder.title + ' In 5 Minutes';
            let pId = todayReminderDiv.id;
            window.electronAPI.sendChangeDivText(p, pId);
            notificationAudio.play();
            setTimeout(() => removeNotification(todayReminderDiv.id), 10000);
        } else if(timeDifference < 1800000 && !todayReminderDiv.classList.contains("30notified") && !todayReminderDiv.classList.contains("5notified") && !todayReminderDiv.classList.contains("0notified")) { // < 30 mins
            todayReminderDiv.classList.add("30notified");
            let p = todayReminder.title + ' In 30 Minutes';
            let pId = todayReminderDiv.id;
            window.electronAPI.sendChangeDivText(p, pId);
            notificationAudio.play();
            setTimeout(() => removeNotification(todayReminderDiv.id), 10000);
        } else if(timeDifference < 3600000 && !todayReminderDiv.classList.contains("60notified") && !todayReminderDiv.classList.contains("30notified") && !todayReminderDiv.classList.contains("5notified") && !todayReminderDiv.classList.contains("0notified")) { // < an hour
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
document.addEventListener('DOMContentLoaded', notifyReminder)

function removeNotification(pId) {
    window.remindersDiv.removeReminderP(pId)
}

document.addEventListener('DOMContentLoaded', () => {  
    const remindersTextarea = document.getElementById('remindersTextareaId');
    const textSavedStatus = document.getElementById('textSavedStatus');
    const savedText = JSON.parse(localStorage.getItem('textarea'))
    remindersTextarea.style.height = remindersTextarea.scrollHeight + 'px';
    let saveTimeout;

    if(savedText) {
        remindersTextarea.value = savedText;
    }

    remindersTextarea.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        textSavedStatus.textContent = 'Unsaved'
        remindersTextarea.style.height = 'auto';
        remindersTextarea.style.height = remindersTextarea.scrollHeight + 'px';
    })

    remindersTextarea.onblur = () => {
        localStorage.setItem('textarea', JSON.stringify(remindersTextarea.value));
        textSavedStatus.textContent = 'Saving'
        saveTimeout = setTimeout(() => textSavedStatus.textContent = 'Saved', 10000)
    }
});


// save to local .JSON file instead of localStorage 