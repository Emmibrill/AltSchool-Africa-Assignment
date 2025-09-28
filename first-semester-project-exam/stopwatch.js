const display = document.querySelector("#time");
const startButton = document.querySelector("#start");
const pauseStopButton = document.querySelector("#pause");
const resetButton = document.querySelector("#reset");
const lapButton = document.querySelector("#lap");
const lapDisplay = document.querySelector("#laps");
let startTime = 0;
let timeElasped = 0;
let timeInterval = null;
let lapTime = 0;
let laps = []

//format time gotten in ms to hours : minutes : seconds : miliseconds 
const formatTime = (dateTimeGotten) => {
    const totalSecondsGotten = Math.floor(dateTimeGotten / 1000);
    const hours = String(Math.floor(totalSecondsGotten / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSecondsGotten % 3600)/60)).padStart(2, "0");
    const seconds = String(Math.floor(totalSecondsGotten % 60)).padStart(2, "0");
    const miliseconds = String(Math.floor(dateTimeGotten % 1000)).padStart(3, "0");
    return `${hours}:${minutes}:${seconds}:${miliseconds}`;
}

//display time in realtime
const displayTime = () => {
    display.innerHTML = formatTime(timeElasped);
}

//start stop stop watch
const startStopWatch = () => {
    //avoid having the time go faster than expected
    if(!timeInterval){
        startTime = Date.now() - timeElasped;
        // lapTime = Date.now() - timeElasped
    }

    //get time for every 100ms to allow the milisecond change appropraitely
    timeInterval = setInterval(() => {
        const now = Date.now();
        timeElasped = now - startTime;
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
    timeElasped = 0;
    time.innerHTML = "00:00:00:000"
    lapDisplay.textContent = "";
    resetButton.disabled = false;

    //reactivate the start and stop button
    startButton.disabled = false
    pauseStopButton.disabled = false
 
}

const getlaps = () => {
    
    if(timeInterval){
        lapTime = timeElasped;
        const eachLaps = document.createElement("li");
        eachLaps.innerHTML = formatTime(lapTime);
        lapDisplay.append(eachLaps);
        console.log(eachLaps);
    }
    
}

startButton.addEventListener('click', startStopWatch);
pauseStopButton.addEventListener('click', stopWatch);
resetButton.addEventListener('click', resetStopWatch);
lapButton.addEventListener('click', getlaps);


//stop and pause the stop watch and clear the timeinterval ID from the variable "timeinterval" 
// to avoid multiple instances
// const stopWatch = () => {
//     if(timeInterval){
//         clearInterval(timeInterval)
//         timeInterval = null
//     }
// }

// startStopWatch()