import React, {useEffect, useState,} from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import QuizService from "../services/QuizService";
import BackgroundService from "../services/BackgroundService";



//=======HELPER=======//
function formatTime(seconds){
    return (
        "00:" +
        String(seconds)
            .padStart(
                2,
                "0"
            )
    );
}



//=======SCREEN=======//
export default function QuizScreen({
    savedState = null,
    onQuizFinished,
}){

    //=======STATE=======//
    const [phase, setPhase] =
        useState("loading");

    const [question, setQuestion] =
        useState(null);

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [questionCount, setQuestionCount] =
        useState(0);

    const [quizSeconds, setQuizSeconds] =
        useState(30);

    const [feedback, setFeedback] =
        useState(null);

    const [answerLocked, setAnswerLocked] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [userName, setUserName] =
        useState("");



    //=======INITIALIZE=======//
    useEffect(()=>{

        let mounted =
            true;

        QuizService.setQuestionChangedCallback(
            (
                nextQuestion,
                index,
                total
            ) => {

                if(!mounted){
                    return;
                }

                setQuestion(
                    nextQuestion
                );

                setCurrentQuestion(
                    index
                );

                setQuestionCount(
                    total
                );

                setFeedback(
                    null
                );

                setAnswerLocked(
                    false
                );
            }
        );


        QuizService.setTimerChangedCallback(
            seconds => {

                if(!mounted){
                    return;
                }

                setQuizSeconds(
                    seconds
                );
            }
        );


        QuizService.setFeedbackCallback(
            result => {

                if(!mounted){
                    return;
                }

                setFeedback(
                    result
                );

                setAnswerLocked(
                    true
                );
            }
        );


        QuizService.setTimeUpCallback(
            ()=>{

                if(!mounted){
                    return;
                }

                setFeedback({
                    timeUp: true,
                    title: "Time's Up!",
                });
            }
        );


        QuizService.setQuizFinishedCallback(
            async ()=>{

                if(
                    typeof onQuizFinished ===
                    "function"
                ){
                    await onQuizFinished();
                }
            }
        );

        QuizService.setStateChangedCallback(
            state => {

                if(!mounted){
                    return;
                }

                BackgroundService
                    .saveQuizState(
                        state
                    );

                setQuizSeconds(
                    state.quizSeconds
                );
            }
        );

        async function initializeQuiz(){

            try{

                const state =
                    await QuizService.initialize(
                        savedState
                    );


                if(!mounted){
                    return;
                }


                const user =
                    QuizService.getUser();


                setUserName(
                    user.username || ""
                );


                setQuizSeconds(
                    state.quizSeconds
                );


                setCurrentQuestion(
                    state.currentQuestion
                );


                setQuestionCount(
                    state.questions.length
                );


                setPhase(
                    "halo"
                );
            }

            catch(initError){

                console.error(
                    "Quiz Initialize Error:",
                    initError
                );


                if(!mounted){
                    return;
                }


                setError(
                    "Quiz gagal dimuat."
                );

                setPhase(
                    "error"
                );
            }
        }


        initializeQuiz();


        return ()=>{

            mounted =
                false;

            QuizService.stopQuizTimer();
        };

    }, []);



    //=======CONTINUE=======//
    function continueToQuiz(){

        const firstQuestion =
            QuizService.continueToQuiz();


        if(!firstQuestion){

            setError(
                "Question tidak tersedia."
            );

            setPhase(
                "error"
            );

            return;
        }


        setQuestion(
            firstQuestion
        );


        const state =
            QuizService.getState();


        setCurrentQuestion(
            state.currentQuestion
        );


        setQuestionCount(
            state.questions.length
        );


        setPhase(
            "quiz"
        );
    }



    //=======ANSWER=======//
    async function answerQuestion(
        index
    ){

        if(answerLocked){
            return;
        }


        setAnswerLocked(
            true
        );


        try{

            await QuizService.checkAnswer(
                index
            );
        }

        catch(answerError){

            console.error(
                "Answer Error:",
                answerError
            );


            setAnswerLocked(
                false
            );
        }
    }



    //=======LOADING=======//
    if(phase === "loading"){

        return(
            <SafeAreaView
                style={styles.root}
            >
                <View
                    style={styles.center}
                >
                    <ActivityIndicator
                        size="large"
                    />

                    <Text
                        style={styles.loadingText}
                    >
                        Loading Quiz...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }



    //=======ERROR=======//
    if(phase === "error"){

        return(
            <SafeAreaView
                style={styles.root}
            >
                <View
                    style={styles.center}
                >
                    <Text
                        style={styles.errorTitle}
                    >
                        Quiz Error
                    </Text>

                    <Text
                        style={styles.message}
                    >
                        {error}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }



    //=======HALO=======//
    if(phase === "halo"){

        return(
            <SafeAreaView
                style={styles.root}
            >
                <ScrollView
                    contentContainerStyle={
                        styles.haloContainer
                    }
                >

                    <View
                        style={styles.haloContent}
                    >

                        <Text
                            style={styles.haloIcon}
                        >
                            🧠
                        </Text>


                        <Text
                            style={styles.haloTitle}
                        >
                            Halo!
                        </Text>


                        <View
                            style={styles.divider}
                        />


                        <Text
                            style={styles.lighter}
                        >
                            Sebelum lanjut, lu bakal ngerjain quiz singkat buat bantu otak lu balik fokus.
                        </Text>


                        {
                            userName
                            ? (
                                <Text
                                    style={styles.author}
                                >
                                    {userName}
                                </Text>
                            )
                            : null
                        }


                        <View
                            style={styles.divider}
                        />


                        <Text
                            style={styles.message}
                        >
                            Sebelum lanjut, lu bakal ngerjain quiz singkat buat bantu otak lu balik fokus.
                        </Text>


                        <Pressable
                            style={
                                styles.continueButton
                            }
                            onPress={
                                continueToQuiz
                            }
                        >
                            <Text
                                style={
                                    styles.continueButtonText
                                }
                            >
                                Lanjut ke Quiz
                            </Text>
                        </Pressable>

                    </View>

                </ScrollView>
            </SafeAreaView>
        );
    }



    //=======QUIZ=======//
    const isStroop =
        question?.category ===
        "Stroop";

    const isVisual =
        question?.category ===
        "Visual";

    const textOptions = [
        question?.optionA,
        question?.optionB,
        question?.optionC,
        question?.optionD,
    ];

    const imageOptions = [
        question?.imageA,
        question?.imageB,
        question?.imageC,
        question?.imageD,
    ];

    const answerOptions =
        isVisual
            ? imageOptions
            : textOptions;


    return(
        <SafeAreaView
            style={styles.root}
        >

            <ScrollView
                contentContainerStyle={
                    styles.quizContainer
                }
            >

                <View
                    style={styles.quizHeader}
                >

                    <Text
                        style={styles.headerText}
                    >
                        {
                            currentQuestion + 1
                        }
                        /
                        {
                            questionCount
                        }
                    </Text>


                    <Text
                        style={styles.headerText}
                    >
                        {
                            formatTime(
                                quizSeconds
                            )
                        }
                    </Text>

                </View>


                {
                    isStroop
                    ? (
                        <Text
                            style={[
                                styles.stroopWord,
                                {
                                    color:
                                        question?.inkColor ||
                                        "#000000",
                                },
                            ]}
                        >
                            {
                                question?.targetWord
                            }
                        </Text>
                    )
                    : null
                }


                {
                    question?.question
                    ? (
                        <Text
                            style={styles.questionText}
                        >
                            {
                                question.question
                            }
                        </Text>
                    )
                    : null
                }


                {
                    isVisual &&
                    question?.questionImage
                    ? (
                        <Image
                            source={{
                                uri:
                                    question.questionImage,
                            }}
                            style={
                                styles.questionImage
                            }
                            resizeMode="contain"
                        />
                    )
                    : null
                }


                <View
                    style={[
                        styles.answers,

                        isVisual
                            ? styles.visualAnswers
                            : null,
                    ]}
                >

                    {
                        answerOptions.map(
                            (
                                option,
                                index
                            ) => {

                                const selected =
                                    feedback?.selectedIndex ===
                                    index;

                                const correct =
                                    feedback?.correctIndex ===
                                    index;

                                let feedbackStyle =
                                    null;


                                if(feedback){

                                    if(correct){

                                        feedbackStyle =
                                            styles.correctAnswer;
                                    }

                                    else if(selected){

                                        feedbackStyle =
                                            styles.wrongAnswer;
                                    }
                                }


                                return(
                                    <Pressable
                                        key={
                                            index
                                        }
                                        disabled={
                                            answerLocked
                                        }
                                        style={[
                                            styles.answerButton,

                                            isVisual
                                                ? styles.visualAnswerButton
                                                : null,

                                            feedbackStyle,
                                        ]}
                                        onPress={
                                            () =>
                                                answerQuestion(
                                                    index
                                                )
                                        }
                                    >

                                        {
                                            isVisual
                                            ? (
                                                <Image
                                                    source={{
                                                        uri:
                                                            option,
                                                    }}
                                                    style={
                                                        styles.answerImage
                                                    }
                                                    resizeMode="contain"
                                                />
                                            )
                                            : (
                                                <Text
                                                    style={
                                                        styles.answerText
                                                    }
                                                >
                                                    {
                                                        option
                                                    }
                                                </Text>
                                            )
                                        }

                                    </Pressable>
                                );
                            }
                        )
                    }

                </View>


                {
                    feedback
                    ? (
                        <View
                            style={styles.feedbackBox}
                        >
                            <Text
                                style={styles.feedbackTitle}
                            >
                                {
                                    feedback.title
                                }
                            </Text>

                            {
                                feedback.timeUp
                                ? (
                                    <Text
                                        style={
                                            styles.feedbackText
                                        }
                                    >
                                        Waktu quiz habis.
                                    </Text>
                                )
                                : null
                            }
                        </View>
                    )
                    : null
                }

            </ScrollView>

        </SafeAreaView>
    );
}



//=======STYLE=======//
const styles =
    StyleSheet.create({

        root:{
            flex: 1,
            backgroundColor:
                "#FFFFFF",
        },

        center:{
            flex: 1,
            justifyContent:
                "center",
            alignItems:
                "center",
            padding: 24,
        },

        loadingText:{
            marginTop: 16,
            fontSize: 16,
        },

        errorTitle:{
            fontSize: 26,
            fontWeight:
                "700",
            marginBottom: 12,
        },

        haloContainer:{
            flexGrow: 1,
            justifyContent:
                "center",
            padding: 24,
        },

        haloContent:{
            width: "100%",
            maxWidth: 520,
            alignSelf:
                "center",
            alignItems:
                "center",
        },

        haloIcon:{
            fontSize: 54,
            marginBottom: 16,
        },

        haloTitle:{
            fontSize: 30,
            fontWeight:
                "700",
            textAlign:
                "center",
        },

        divider:{
            width: "100%",
            height: 1,
            backgroundColor:
                "#D9D9D9",
            marginVertical: 22,
        },

        lighter:{
            fontSize: 16,
            textAlign:
                "center",
            opacity: 0.7,
            lineHeight: 24,
        },

        author:{
            marginTop: 12,
            fontSize: 14,
            textAlign:
                "center",
        },

        message:{
            fontSize: 17,
            textAlign:
                "center",
            lineHeight: 25,
        },

        continueButton:{
            marginTop: 30,
            minWidth: 180,
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 10,
            backgroundColor:
                "#111111",
        },

        continueButtonText:{
            color:
                "#FFFFFF",
            fontSize: 16,
            fontWeight:
                "600",
            textAlign:
                "center",
        },

        quizContainer:{
            flexGrow: 1,
            padding: 24,
        },

        quizHeader:{
            flexDirection:
                "row",
            justifyContent:
                "space-between",
            alignItems:
                "center",
            marginBottom: 30,
        },

        headerText:{
            fontSize: 17,
            fontWeight:
                "600",
        },

        stroopWord:{
            fontSize: 42,
            fontWeight:
                "700",
            textAlign:
                "center",
            marginBottom: 28,
        },

        questionText:{
            fontSize: 24,
            fontWeight:
                "600",
            textAlign:
                "center",
            marginBottom: 28,
        },

        questionImage:{
            width: "100%",
            height: 220,
            marginBottom: 24,
        },

        answers:{
            width: "100%",
            gap: 14,
        },

        visualAnswers:{
            flexDirection:
                "row",
            flexWrap:
                "wrap",
            justifyContent:
                "space-between",
        },

        answerButton:{
            width: "100%",
            minHeight: 58,
            justifyContent:
                "center",
            alignItems:
                "center",
            padding: 14,
            borderWidth: 1,
            borderColor:
                "#CCCCCC",
            borderRadius: 10,
        },

        visualAnswerButton:{
            width: "48%",
            minHeight: 150,
        },

        answerText:{
            fontSize: 17,
            textAlign:
                "center",
        },

        answerImage:{
            width: "100%",
            height: 120,
        },

        correctAnswer:{
            borderWidth: 3,
        },

        wrongAnswer:{
            borderWidth: 3,
            opacity: 0.55,
        },

        feedbackBox:{
            marginTop: 28,
            alignItems:
                "center",
        },

        feedbackTitle:{
            fontSize: 22,
            fontWeight:
                "700",
        },

        feedbackText:{
            marginTop: 8,
            fontSize: 16,
        },
    });