const display = document.querySelector("#time");
const startButton = document.querySelector("#start");
const pauseStopButton = document.querySelector("#pause");
const resetButton = document.querySelector("#reset");
const lapButton = document.querySelector("#lap");
const lapDisplay = document.querySelector("#laps");
const themeToggler = document.querySelector(".theme_toggler");

let startTime = 0;
let timeElasped = 0;
let timeInterval = null;
let lapTime = 0;
let laps = []

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
    display.innerHTML = formatTime(timeElasped);
}

//start stop stop watch
const startStopWatch = () => {
    //avoid having the time go faster than expected
    if(!timeInterval){
        startTime = Date.now() - timeElasped;
    }

    //get time for every interval of 100ms to allow the milisecond change appropraitely
    timeInterval = setInterval(() => {
        const timeAtStop = Date.now();
        timeElasped = timeAtStop - startTime;
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

const currentTheme = themeToggler.getAttribute("data-theme");
console.log(currentTheme);

const toggleTheme = () => {

    if(!themeToggler) return;
    
    themeToggler.addEventListener("click", () => {
        
        //if the current theme is light, switch to dark and vice versa
        if(document.documentElement.setAttribute("data-theme", "dark")){
            themeToggler.setAttribute("data-theme", "dark");
            themeToggler.firstChild.classList.replace("fa-sun", "fa-moon");
            document.documentElement.setAttribute("data-theme", "dark");
        }
        if(themeToggler.firstChild.classList.contains("fa-moon")){
            themeToggler.setAttribute("data-theme", "light");
            themeToggler.firstChild.classList.replace("fa-moon", "fa-sun");
            document.documentElement.setAttribute("data-theme", "light");
            // console.log(document.documentElement.getAttribute("data-theme"));
        }else{
            themeToggler.setAttribute("data-theme", "dark");
            themeToggler.firstChild.classList.replace("fa-sun", "fa-moon");
            document.documentElement.setAttribute("data-theme", "dark");
            // console.log(document.documentElement.getAttribute("data-theme"));
        }
       
        themeToggler.classList.toggle("toggle");
        // function toggleIcon() {
        //    if(themeToggler.firstChild.classList.contains("fa-moon")){
        //         themeToggler.firstChild.classList.replace("fa-moon", "fa-sun");
        //     }else{
        //         themeToggler.firstChild.classList.replace("fa-sun", "fa-moon");
        //     }
          
        // }   
        //  toggleIcon();
    })
}
toggleTheme();