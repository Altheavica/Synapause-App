import {NativeEventEmitter, NativeModules,} from "react-native";
import {hasUsagePermission, openUsagePermissionSettings,} from "@sahil_sensei/react-native-app-usage";

const {ForegroundAppModule,} = NativeModules;



//=======GLOBAL=======//
let foregroundSubscription = null;
let timerSubscription = null;
let quizSubscription = null;

let onForegroundAppChanged = null;
let onTimerChanged = null;
let onQuizRequired = null;



//=======PERMISSION=======//
async function hasPermission(){
    try{
        return await hasUsagePermission();
    }

    catch(error){
        console.error(
            "Usage Permission Error:",
            error
        );

        return false;
    }
}

async function requestPermission(){
    try{
        const granted = await hasPermission();

        if(granted){
            return true;
        }

        await openUsagePermissionSettings();

        return false;
    }

    catch(error){
        console.error(
            "Usage Permission Request Error:",
            error
        );

        return false;
    }
}

async function hasOverlayPermission(){
    try{
        if(!ForegroundAppModule){
            console.error(
                "ForegroundAppModule not available."
            );

            return false;
        }

        return await ForegroundAppModule
            .hasOverlayPermission();
    }

    catch(error){
        console.error(
            "Overlay Permission Error:",
            error
        );

        return false;
    }
}


async function requestOverlayPermission(){
    try{
        if(!ForegroundAppModule){
            console.error(
                "ForegroundAppModule not available."
            );

            return false;
        }


        const granted =
            await hasOverlayPermission();


        if(granted){
            return true;
        }


        await ForegroundAppModule
            .requestOverlayPermission();


        return false;
    }

    catch(error){
        console.error(
            "Overlay Permission Request Error:",
            error
        );

        return false;
    }
}



//=======CALLBACK=======//
function setForegroundAppCallback(
    callback
){
    onForegroundAppChanged = callback;
}

function setTimerChangedCallback(
    callback
){
    onTimerChanged = callback;
}

function setQuizRequiredCallback(
    callback
){
    onQuizRequired = callback;
}



//=======HELPER=======//
async function consumePendingShowQuiz(){
    try{
        return await ForegroundAppModule
            .consumePendingShowQuiz();
    }

    catch(error){
        console.error(
            "Consume Pending Quiz Error:",
            error
        );

        return false;
    }
}



//=======EVENT=======//
function attachListeners(){
    const eventEmitter = new NativeEventEmitter(ForegroundAppModule);

    if(!foregroundSubscription){
        foregroundSubscription = eventEmitter.addListener(
            "ForegroundAppChanged",
            appId => {
                console.log(
                    "FOREGROUND APP:",
                    appId
                );

                if(
                    typeof onForegroundAppChanged === "function"
                ){
                    onForegroundAppChanged(
                        appId
                    );
                }
            }
        );
    }

    if(!timerSubscription){
        timerSubscription = eventEmitter.addListener(
            "TimerChanged",
            seconds => {
                console.log(
                    "Timer:",
                    seconds
                );

                if(
                    typeof onTimerChanged === "function"
                ){
                    onTimerChanged(
                        seconds
                    );
                }
            }
        );
    }

    if(!quizSubscription){
        quizSubscription = eventEmitter.addListener(
            "QuizRequired",
            () => {
                console.log(
                    "QUIZ REQUIRED"
                );

                if(
                    typeof onQuizRequired === "function"
                ){
                    onQuizRequired();
                }
            }
        );
    }
}



//=======MONITOR=======//
async function start(){
    const granted = await hasPermission();

    if(!granted){
        console.log(
            "Foreground Detector blocked. Usage Access required."
        );

        await requestPermission();

        return;
    }

    if(!ForegroundAppModule){
        console.error(
            "ForegroundAppModule not available."
        );

        return;
    }

    attachListeners();

    try{
        await ForegroundAppModule.startMonitoring();

        console.log(
            "Foreground Detector Started"
        );
    }

    catch(error){
        console.error(
            "Foreground Detector Start Error:",
            error
        );
    }
}

async function stop(){
    try{
        if(ForegroundAppModule){
            await ForegroundAppModule.stopMonitoring();
        }
    }

    catch(error){
        console.error(
            "Foreground Detector Stop Error:",
            error
        );
    }

    if(foregroundSubscription){
        foregroundSubscription.remove();
        foregroundSubscription = null;
    }

    if(timerSubscription){
        timerSubscription.remove();
        timerSubscription = null;
    }

    if(quizSubscription){
        quizSubscription.remove();
        quizSubscription = null;
    }

    console.log(
        "Foreground Detector Stopped"
    );
}



//=======TIMER=======//
async function restartTimer(){
    try{
        await ForegroundAppModule.restartTimer();
    }

    catch(error){
        console.error(
            "Native Timer Restart Error:",
            error
        );
    }
}



//=======EXPORT=======//
export default{
    hasPermission,
    requestPermission,
    hasOverlayPermission,
    requestOverlayPermission,
    start,
    stop,
    restartTimer,
    setForegroundAppCallback,
    setTimerChangedCallback,
    setQuizRequiredCallback,
    consumePendingShowQuiz,
};