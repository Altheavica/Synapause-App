import AsyncStorage from "@react-native-async-storage/async-storage";



//=======API=======//
const NEXT_QUESTION_API = "https://script.google.com/macros/s/AKfycby68KOeiPvpNscnSwTqtZa18eLCxLOsZLCSNaYEnJa7py1g9poZrDP4IT5jGKh0_nD0/exec";
const ANALYTICS_API = "https://script.google.com/macros/s/AKfycbzDvygssssnKnU79C_MYw9ozTz5xdvq5AE4HgmyMkwIGi9YBYRIfVsTNjyfzLYczR6y/exec";



//=======GLOBAL=======//
let USER_ID = "";
let USER_NAME = "";

let questions = [];
let SESSION_ID = "";

let questionStartTime = 0;
let currentQuestion = 0;

let quizSeconds = 30;
let quizCountdown = null;

let isPaused = false;

let onStateChanged = null;
let onQuestionChanged = null;
let onTimerChanged = null;
let onFeedback = null;
let onQuizFinished = null;
let onTimeUp = null;



//=======USER=======//
async function loadUser(){
    try{
        const storedUser = await AsyncStorage.getItem("synapauseUser");

        if(!storedUser){
            USER_ID = "";
            USER_NAME = "";

            console.log(
                "QUIZ USER NOT FOUND"
            );

            return null;
        }

        const user = JSON.parse(storedUser);

        USER_ID = user.id || "";
        USER_NAME = user.username || "";

        console.log("USER OBJECT");
        console.log(user);
        console.log("USERNAME =", USER_NAME);

        return user;
    }

    catch(error){
        console.error(
            "Load Quiz User Error:",
            error
        );

        USER_ID = "";
        USER_NAME = "";

        return null;
    }
}



//=======CALLBACK=======//
function setStateChangedCallback(
    callback
){
    onStateChanged = callback;
}

function setQuestionChangedCallback(
    callback
){
    onQuestionChanged = callback;
}

function setTimerChangedCallback(
    callback
){
    onTimerChanged = callback;
}

function setFeedbackCallback(
    callback
){
    onFeedback = callback;
}

function setQuizFinishedCallback(
    callback
){
    onQuizFinished = callback;
}

function setTimeUpCallback(
    callback
){
    onTimeUp = callback;
}



//=======STATE=======//
function getState(){
    return {
        questions,
        currentQuestion,
        SESSION_ID,
        quizSeconds,
        questionStartTime,
        isPaused,
    };
}

function getCurrentQuestion(){
    if(
        currentQuestion < 0 ||
        currentQuestion >= questions.length
    ){
        return null;
    }

    return questions[
        currentQuestion
    ];
}

function getUser(){
    return {
        id: USER_ID,
        username: USER_NAME,
    };
}

function notifyStateChanged(){
    if(
        typeof onStateChanged ===
        "function"
    ){
        onStateChanged(
            getState()
        );
    }
}

function notifyQuestionChanged(){
    if(
        typeof onQuestionChanged ===
        "function"
    ){
        onQuestionChanged(
            getCurrentQuestion(),
            currentQuestion,
            questions.length
        );
    }
}



//=======QUIZ STATE=======//
function saveQuizState(){
    const state = getState();

    console.log("SAVE STATE");
    console.log({currentQuestion, quizSeconds, isPaused,});

    notifyStateChanged();

    return state;
}

function restoreQuizState(
    state
){
    if(!state){
        return false;
    }

    questions = state.questions || [];
    currentQuestion = state.currentQuestion ?? 0;
    SESSION_ID = state.SESSION_ID || "";
    quizSeconds = state.quizSeconds ?? 30;
    questionStartTime = state.questionStartTime ?? 0;
    isPaused = state.isPaused ?? false;

    console.log("QUIZ STATE RESTORED");
    console.log(getState());

    notifyStateChanged();

    return true;
}



//=======SESSION=======//
async function startSession(){
    console.log(
        "START SESSION USER_ID =",
        USER_ID
    );

    const response = await fetch(
        ANALYTICS_API,{
            method:"POST",

            headers:{
                "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",
            },

            body:new URLSearchParams({
                action:"startSession",

                userId:USER_ID,
            }).toString(),
        }
    );

    const result = await response.json();

    console.log("========== SESSION ==========");
    console.log(result);

    SESSION_ID = result.sessionId;

    console.log("Session:", SESSION_ID);

    saveQuizState();

    return result;
}

async function finishSession(){
    if(!SESSION_ID){
        return;
    }

    const response = await fetch(
        ANALYTICS_API,{
            method:"POST",

            headers:{
                "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",
            },

            body:new URLSearchParams({
                action:"finishSession",

                sessionId:SESSION_ID,
            }).toString(),
        }
    );

    const result = await response.json();

    console.log("========== FINISH ==========");
    console.log(result);

    return result;
}



//=======QUESTIONS=======//
async function loadQuestions(){
    try{
        const response = await fetch(
            NEXT_QUESTION_API +
            "?action=getQuiz" +
            "&userId=" +
            encodeURIComponent(USER_ID)
        );

        const result = await response.json();

        console.log(
            "========== RESULT =========="
        );

        console.log(result);
        console.log("========== QUESTIONS ==========");
        console.log(result.questions);
        console.log("========== FIRST QUESTION ==========");
        console.log(result.questions?.[0]);

        questions = result.questions || [];

        console.log("Quiz Questions:", questions);

        saveQuizState();

        return questions;
    }

    catch(error){
        console.error("Load Questions Error:", error);

        throw error;
    }
}

async function loadReplacementQuestion(){
    const q = questions[currentQuestion];

    if(!q){
        return null;
    }

    const url =
        NEXT_QUESTION_API +
        "?action=getNextQuestion" +
        "&userId=" +
        encodeURIComponent(
            USER_ID
        ) +
        "&category=" +
        encodeURIComponent(
            q.category
        ) +
        "&currentQuestionId=" +
        encodeURIComponent(
            q.id
        );


    const response = await fetch(url);
    const result = await response.json();

    questions[currentQuestion] = result.question;

    console.log("Replacement Question", result.question);

    saveQuizState();

    return result.question;
}



//=======QUESTION=======//
function loadQuestion(){

    console.log(
        "LOAD QUESTION USER_ID =",
        USER_ID
    );


    const question =
        getCurrentQuestion();


    if(!question){
        return null;
    }


    questionStartTime =
        Date.now();


    saveQuizState();

    notifyQuestionChanged();


    return question;
}



//=======TIMER=======//
function startQuizTimer(){

    if(quizSeconds <= 0){
        quizSeconds =
            30;
    }


    if(
        typeof onTimerChanged ===
        "function"
    ){
        onTimerChanged(
            quizSeconds
        );
    }


    if(quizCountdown){
        clearInterval(
            quizCountdown
        );
    }


    quizCountdown =
        setInterval(
            ()=>{

                if(isPaused){
                    return;
                }


                quizSeconds--;


                saveQuizState();


                if(
                    typeof onTimerChanged ===
                    "function"
                ){
                    onTimerChanged(
                        quizSeconds
                    );
                }


                if(
                    quizSeconds <= 0
                ){

                    clearInterval(
                        quizCountdown
                    );

                    quizCountdown =
                        null;


                    if(
                        typeof onTimeUp ===
                        "function"
                    ){
                        onTimeUp();
                    }
                }

            },
            1000
        );
}


function stopQuizTimer(){

    if(quizCountdown){

        clearInterval(
            quizCountdown
        );

        quizCountdown =
            null;
    }
}



//=======ANSWER=======//
async function checkAnswer(
    selected
){

    const question =
        getCurrentQuestion();


    if(!question){
        return null;
    }


    const correct =
        question.answer;


    const selectedAnswer =
        ["A","B","C","D"][
            selected
        ];


    if(!selectedAnswer){
        return null;
    }


    const correctIndex =
        ["A","B","C","D"]
        .indexOf(
            correct
        );


    const isCorrect =
        selectedAnswer ===
        correct;


    isPaused =
        true;


    saveQuizState();


    if(isCorrect){

        console.log(
            "Correct"
        );
    }

    else{

        console.log(
            "Wrong"
        );
    }


    const feedback = {
        selectedIndex:
            selected,

        correctIndex:
            correctIndex,

        selectedAnswer:
            selectedAnswer,

        correctAnswer:
            correct,

        isCorrect:
            isCorrect,

        title:
            isCorrect
                ? "Correct!"
                : "Incorrect!",
    };


    if(
        typeof onFeedback ===
        "function"
    ){
        onFeedback(
            feedback
        );
    }


    saveAnswer(
        question,
        selectedAnswer,
        isCorrect
    ).catch(
        console.error
    );


    await delay(
        1800
    );


    await nextQuestion(
        isCorrect
    );


    return feedback;
}



//=======NEXT QUESTION=======//
async function nextQuestion(
    isCorrect
){

    if(isCorrect){

        currentQuestion++;
    }

    else{

        await loadReplacementQuestion();
    }


    if(
        currentQuestion <
        questions.length
    ){

        isPaused =
            false;


        saveQuizState();


        loadQuestion();


        saveQuizState();


        return getCurrentQuestion();
    }


    await finishQuiz();

    return null;
}



//=======ANALYTICS=======//
async function saveAnswer(
    question,
    selected,
    isCorrect
){

    const responseTime =
        Date.now() -
        questionStartTime;


    const response =
        await fetch(
            ANALYTICS_API,
            {
                method:
                    "POST",

                headers:{
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8",
                },

                body:
                    new URLSearchParams({

                        action:
                            "saveAnswer",

                        sessionId:
                            SESSION_ID,

                        userId:
                            USER_ID,

                        questionId:
                            question.id,

                        category:
                            question.category,

                        selectedAnswer:
                            selected,

                        correctAnswer:
                            question.answer,

                        isCorrect:
                            String(
                                isCorrect
                            ),

                        responseTimeMS:
                            String(
                                responseTime
                            ),

                        isReplacement:
                            String(
                                !isCorrect
                            ),

                    }).toString(),
            }
        );


    const result =
        await response.json();


    console.log(
        "========== SAVE ANSWER =========="
    );


    console.log(
        result
    );


    return result;
}



//=======START QUIZ=======//
async function initialize(
    savedState = null
){

    await loadUser();


    console.log(
        "Saved State:"
    );

    console.log(
        savedState
    );


    if(savedState){

        restoreQuizState(
            savedState
        );
    }

    else{

        await startSession();

        await loadQuestions();

        currentQuestion =
            0;

        quizSeconds =
            30;

        questionStartTime =
            0;

        isPaused =
            false;


        saveQuizState();
    }


    return getState();
}


function continueToQuiz(){

    const question =
        loadQuestion();


    startQuizTimer();

    return question;
}



//=======FINISH QUIZ=======//
async function finishQuiz(){
    stopQuizTimer();

    await finishSession();

    console.log(
        "Quiz Finished"
    );


    if(
        typeof onQuizFinished ===
        "function"
    ){
        await onQuizFinished();
    }
}



//=======HELPER=======//
function delay(ms){
    return new Promise(
        resolve => setTimeout(
             resolve,
             ms
        )
    );
}



//=======EXPORT=======//
export default{
    initialize,
    continueToQuiz,

    loadUser,

    getUser,
    getState,
    getCurrentQuestion,

    saveQuizState,
    restoreQuizState,

    startSession,
    finishSession,

    loadQuestions,
    loadReplacementQuestion,
    loadQuestion,

    startQuizTimer,
    stopQuizTimer,

    checkAnswer,
    nextQuestion,
    saveAnswer,

    finishQuiz,

    setStateChangedCallback,
    setQuestionChangedCallback,
    setTimerChangedCallback,
    setFeedbackCallback,
    setQuizFinishedCallback,
    setTimeUpCallback,
};