const display = document.querySelector("#time");
const startButton = document.querySelector("#start");
const pauseStopButton = document.querySelector("#pause");
const resetButton = document.querySelector("#reset");
const lapButton = document.querySelector("#lap");
const lapDisplay = document.querySelector("#laps");
const themeToggler = document.querySelector(".theme_toggler");

let startTime = 0;
let timeElapsed = 0;
let timeInterval = null;
let lapTime = 0;

//format time gotten in ms to hours : minutes : seconds : miliseconds 
const formatTime = (dateTimeGotten) => {
    //convert miliseconds to seconds
    const totalSecondsGotten = Math.floor(dateTimeGotten / 1000);

    //convert the seconds to hours
    const hours = String(Math.floor(totalSecondsGotten / 3600)).padStart(2, "0");

    //convert seconds to minutes 
    const minutes = String(Math.floor((totalSecondsGotten % 3600)/60)).padStart(2, "0");

    //get seconds left after: hour(s) and minute(s)
    const seconds = String(Math.floor(totalSecondsGotten % 60)).padStart(2, "0");

    //get miliseconds left after: hour(s) and minute(s), second(s)
    const miliseconds = String(Math.floor(dateTimeGotten % 1000)).padStart(3, "0");
    return `${hours}:${minutes}:${seconds}:${miliseconds}`;
}

//display time in realtime
const displayTime = () => {
    display.innerHTML = formatTime(timeElapsed);
}

//start stop stop watch
const startStopWatch = () => {
    //avoid having the time go faster than expected
    if(!timeInterval){
        startTime = Date.now() - timeElapsed;
    }

    //get time for every interval of 100ms to allow the milisecond change appropraitely
    timeInterval = setInterval(() => {
        const timeAtStop = Date.now();
        timeElapsed = timeAtStop - startTime;
        displayTime();
    }, 100);

    startButton.disabled = true;
    pauseStopButton.disabled = false
}

const stopWatch = () => {
    //stop and pause the stop watch and clear the timeinterval ID from the variable "timeinterval" 
    // to avoid multiple instances
    if(timeInterval){
        clearInterval(timeInterval);
        timeInterval = null

        //reactivate the start button for future records
        startButton.disabled = false;

        //deactivate the stop button after each clicks
        pauseStopButton.disabled = true
    }

}

const resetStopWatch = () => {
   
    clearInterval(timeInterval);
    timeInterval = null;
    timeElapsed = 0;
    display.innerHTML = "00:00:00:000"
    lapDisplay.textContent = "";
    resetButton.disabled = false;

    //reactivate the start and stop button
    startButton.disabled = false
    pauseStopButton.disabled = true
 
}

const getlaps = () => {
    
    if(timeInterval){
        lapTime = timeElapsed;
        const eachLaps = document.createElement("li");
        eachLaps.textContent = formatTime(lapTime);
        lapDisplay.append(eachLaps);
        //console.log(eachLaps);
    }
    
}

startButton.addEventListener('click', startStopWatch);
pauseStopButton.addEventListener('click', stopWatch);
resetButton.addEventListener('click', resetStopWatch);
lapButton.addEventListener('click', getlaps);

let selectedTheme;
const currentPcTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
if(currentPcTheme === true){
    selectedTheme = "dark"
}else{selectedTheme = "light"}
// console.log(selectedTheme)

document.documentElement.setAttribute("data-theme", selectedTheme);

const toggleTheme = () => {
    if(!themeToggler) return;

    themeToggler.addEventListener("click", () => {
        const currentDataTheme = document.documentElement.getAttribute("data-theme");
        // console.log(currentPcTheme);

        const stopwatchTheme = currentDataTheme === "dark" ? "light" : "dark";
        // console.log(stopwatchTheme)
        document.documentElement.setAttribute("data-theme", stopwatchTheme);
        themeToggler.firstChild.classList.toggle("fa-sun");
        themeToggler.firstChild.classList.toggle("fa-moon");
       
        themeToggler.classList.toggle("toggle");
        // console.log(selectedTheme);
        // console.log(stopwatchTheme);
    })
}
toggleTheme();