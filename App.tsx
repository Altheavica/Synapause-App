import React, {useEffect, useState,} from "react";
import {AppState,} from "react-native";
import AppNavigator from './src/navigation/AppNavigator';
import BackgroundService from "./src/services/BackgroundService";
import DetectorService from "./src/services/DetectorService";
import QuizScreen from "./src/screens/QuizScreen";

export default function App() {
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    async function testOverlayPermission(){

        const granted =
            await DetectorService
                .hasOverlayPermission();


        console.log(
            "OVERLAY PERMISSION:",
            granted
        );


        if(!granted){

            console.log(
                "REQUESTING OVERLAY PERMISSION"
            );


            await DetectorService
                .requestOverlayPermission();
        }
    }

    testOverlayPermission();

      DetectorService.setForegroundAppCallback(
          BackgroundService.onForegroundAppChanged
      );


      DetectorService.setTimerChangedCallback(
          BackgroundService.syncTimer
      );


      DetectorService.setQuizRequiredCallback(
          ()=>{
              BackgroundService.requireQuiz();

              setShowQuiz(
                  true
              );
          }
      );


      BackgroundService.setMonitorCallback(
          DetectorService.start
      );


      BackgroundService.initialize();


      async function checkPendingQuiz(){

          const pending =
              await DetectorService
                  .consumePendingShowQuiz();


          if(pending){

              setShowQuiz(
                  true
              );
          }
      }


      checkPendingQuiz();


      const subscription =
          AppState.addEventListener(
              "change",
              state => {

                  if(
                      state ===
                      "active"
                  ){
                      checkPendingQuiz();
                  }
              }
          );


      return () => {

          subscription.remove();

          DetectorService.stop();
      };

  }, []);

  if(showQuiz){

      return(
          <QuizScreen
              savedState={
                  BackgroundService
                      .getQuizState()
              }

              onQuizFinished={
                  async ()=>{

                      BackgroundService
                          .clearQuizState();


                      await DetectorService
                          .restartTimer();


                      setShowQuiz(
                          false
                      );
                  }
              }
          />
      );
  }

  return(
      <AppNavigator />
  );
}