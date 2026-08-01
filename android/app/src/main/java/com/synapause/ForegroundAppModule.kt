package com.synapause

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class ForegroundAppModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(
    reactContext
) {
    companion object {
        var pendingShowQuiz =
            false
    }



    //=======RECEIVER=======//
    private val foregroundReceiver = object : BroadcastReceiver(){
        override fun onReceive(
            context: Context?,
            intent: Intent?
        ){
            val appId = intent?.getStringExtra(
                ForegroundMonitorService.EXTRA_APP_ID
            )

            if(appId != null){
                emitEvent(
                    "ForegroundAppChanged",
                    appId
                )
            }
        }
    }

    private val timerReceiver = object : BroadcastReceiver(){
        override fun onReceive(
            context: Context?,
            intent: Intent?
        ){
            val seconds = intent?.getIntExtra(
                ForegroundMonitorService.EXTRA_SECONDS,
                0
            ) ?: 0

            emitEvent(
                "TimerChanged",
                seconds
            )
        }
    }

    private val quizReceiver = object : BroadcastReceiver(){
        override fun onReceive(
            context: Context?,
            intent: Intent?
        ){
            emitEvent(
                "QuizRequired",
                true
            )
        }
    }



    //=======MODULE=======//
    override fun getName(): String {
        return "ForegroundAppModule"
    }

    override fun initialize(){
        super.initialize()

        ContextCompat.registerReceiver(
            reactApplicationContext,
            foregroundReceiver,
            IntentFilter(
                ForegroundMonitorService.ACTION_FOREGROUND_APP_CHANGED
            ),
            ContextCompat.RECEIVER_NOT_EXPORTED
        )

        ContextCompat.registerReceiver(
            reactApplicationContext,
            timerReceiver,
            IntentFilter(
                ForegroundMonitorService.ACTION_TIMER_CHANGED
            ),
            ContextCompat.RECEIVER_NOT_EXPORTED
        )

        ContextCompat.registerReceiver(
            reactApplicationContext,
            quizReceiver,
            IntentFilter(
                ForegroundMonitorService.ACTION_QUIZ_REQUIRED
            ),
            ContextCompat.RECEIVER_NOT_EXPORTED
        )
    }

    override fun invalidate(){
        try{
            reactApplicationContext.unregisterReceiver(
                foregroundReceiver
            )
        }

        catch(error: Exception){
        }

        try{
            reactApplicationContext.unregisterReceiver(
                timerReceiver
            )
        }

        catch(error: Exception){
        }

        try{
            reactApplicationContext.unregisterReceiver(
                quizReceiver
            )
        }

        catch(error: Exception){
        }

        super.invalidate()
    }



    //=======EVENT=======//
    private fun emitEvent(
        eventName: String,
        value: Any
    ){
        if(
            reactApplicationContext.hasActiveReactInstance()
        ){
            reactApplicationContext.getJSModule(
                DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
            )
            .emit(
                eventName,
                value
            )
        }
    }



    //=======OVERLAY PERMISSION=======//
    @ReactMethod
    fun hasOverlayPermission(
        promise: Promise
    ){
        try{
            val granted =
                if(
                    Build.VERSION.SDK_INT >=
                    Build.VERSION_CODES.M
                ){
                    Settings.canDrawOverlays(
                        reactApplicationContext
                    )
                }

                else{
                    true
                }

            promise.resolve(
                granted
            )
        }

        catch(error: Exception){
            promise.reject(
                "OVERLAY_PERMISSION_ERROR",
                error
            )
        }
    }


    @ReactMethod
    fun requestOverlayPermission(
        promise: Promise
    ){
        try{
            if(
                Build.VERSION.SDK_INT <
                Build.VERSION_CODES.M
            ){
                promise.resolve(
                    true
                )

                return
            }


            if(
                Settings.canDrawOverlays(
                    reactApplicationContext
                )
            ){
                promise.resolve(
                    true
                )

                return
            }


            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse(
                    "package:${reactApplicationContext.packageName}"
                )
            )


            intent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
            )


            reactApplicationContext.startActivity(
                intent
            )


            promise.resolve(
                false
            )
        }

        catch(error: Exception){
            promise.reject(
                "OVERLAY_PERMISSION_REQUEST_ERROR",
                error
            )
        }
    }



    //=======SERVICE=======//
    @ReactMethod
    fun startMonitoring(
        promise: Promise
    ){
        try{
            val intent = Intent(
                reactApplicationContext,
                ForegroundMonitorService::class.java
            )

            if(
                Build.VERSION.SDK_INT >=
                Build.VERSION_CODES.O
            ){
                reactApplicationContext.startForegroundService(
                    intent
                )
            }

            else{
                reactApplicationContext.startService(
                    intent
                )
            }

            promise.resolve(
                true
            )
        }

        catch(error: Exception){
            promise.reject(
                "START_MONITOR_ERROR",
                error
            )
        }
    }

    @ReactMethod
    fun stopMonitoring(
        promise: Promise
    ){
        try{
            val intent = Intent(
                reactApplicationContext,
                ForegroundMonitorService::class.java
            )

            reactApplicationContext.stopService(
                intent
            )

            promise.resolve(
                true
            )
        }

        catch(error: Exception){
            promise.reject(
                "STOP_MONITOR_ERROR",
                error
            )
        }
    }

    @ReactMethod
    fun restartTimer(
        promise: Promise
    ){
        try{
            val intent = Intent(
                reactApplicationContext,
                ForegroundMonitorService::class.java
            )

            intent.action = ForegroundMonitorService.ACTION_RESTART_TIMER

            if(
                Build.VERSION.SDK_INT >=
                Build.VERSION_CODES.O
            ){
                reactApplicationContext.startForegroundService(
                    intent
                )
            }

            else{
                reactApplicationContext.startService(
                    intent
                )
            }

            promise.resolve(
                true
            )
        }

        catch(error: Exception){
            promise.reject(
                "RESTART_TIMER_ERROR",
                error
            )
        }
    }



    // Required by NativeEventEmitter
    @ReactMethod
    fun consumePendingShowQuiz(
        promise: Promise
    ){
        val pending =
            pendingShowQuiz

        pendingShowQuiz =
            false

        promise.resolve(
            pending
        )
    }

    @ReactMethod
    fun addListener(
        eventName: String
    ){
    }

    @ReactMethod
    fun removeListeners(
        count: Int
    ){
    }
}