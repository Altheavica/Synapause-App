package com.synapause

import android.os.Bundle
import android.util.Log
import android.content.Intent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
    override fun onCreate(
        savedInstanceState: Bundle?
    ) {
        Log.d(
            "SynapauseActivity",
            "onCreate showQuiz=" +
            intent?.getBooleanExtra(
                "showQuiz",
                false
            )
        )

        super.onCreate(
            savedInstanceState
        )
    }

  override fun getMainComponentName(): String = "Synapause"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onNewIntent(
      intent: Intent
  ) {
    Log.d(
            "SynapauseActivity",
            "onNewIntent showQuiz=" +
            intent.getBooleanExtra(
                "showQuiz",
                false
            )
        )

      super.onNewIntent(
          intent
      )

      setIntent(
          intent
      )

      if(
          intent.getBooleanExtra(
              "showQuiz",
              false
          )
      ){
          ForegroundAppModule
              .pendingShowQuiz =
              true
      }
  }

  override fun onResume() {
    Log.d(
            "SynapauseActivity",
            "onResume showQuiz=" +
            intent?.getBooleanExtra(
                "showQuiz",
                false
            )
        )
      
      super.onResume()

      if(
          intent?.getBooleanExtra(
              "showQuiz",
              false
          ) == true
      ){
          ForegroundAppModule
              .pendingShowQuiz =
              true

          intent.removeExtra(
              "showQuiz"
          )
      }
  }
}
