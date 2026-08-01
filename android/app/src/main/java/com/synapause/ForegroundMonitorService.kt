package com.synapause

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat

class ForegroundMonitorService : Service() {
    companion object {
        const val CHANNEL_ID = "synapause_monitor_channel"
        const val NOTIFICATION_ID = 1001
        const val ACTION_FOREGROUND_APP_CHANGED = "com.synapause.FOREGROUND_APP_CHANGED"
        const val ACTION_TIMER_CHANGED = "com.synapause.TIMER_CHANGED"
        const val ACTION_QUIZ_REQUIRED = "com.synapause.QUIZ_REQUIRED"
        const val ACTION_RESTART_TIMER = "com.synapause.RESTART_TIMER"
        const val EXTRA_APP_ID = "appId"
        const val EXTRA_SECONDS = "seconds"
    }



    //=======GLOBAL=======//
    private val monitoredApps = setOf(
        "com.google.android.youtube",
        "com.instagram.android",
        "com.zhiliaoapp.musically"
    )

    private val handler = Handler(
        Looper.getMainLooper()
    )

    private var lastAppId:String? = null
    private var currentAppId:String? = null
    private var timerSeconds = 0
    private var timerRunning = false
    private var quizRequired = false



    //=======MONITOR LOOP=======//
    private val monitorRunnable = object : Runnable {
        override fun run() {
            detectForegroundApp()

            handler.postDelayed(
                this,
                1000
            )
        }
    }



    //=======TIMER LOOP=======//
    private val timerRunnable = object : Runnable {
        override fun run() {
            if(!timerRunning){
                return
            }

            timerSeconds++

            Log.d(
                "SynapauseMonitor",
                "Timer: $timerSeconds"
            )

            sendTimerChanged()

            if(timerSeconds >= 15){
                timerRunning = false
                quizRequired = true

                showOverlay()

                Log.d(
                    "SynapauseMonitor",
                    "=========="
                )

                Log.d(
                    "SynapauseMonitor",
                    "TIMER FINISHED"
                )

                Log.d(
                    "SynapauseMonitor",
                    "Quiz Required: $quizRequired"
                )

                Log.d(
                    "SynapauseMonitor",
                    "=========="
                )

                sendQuizRequired()

                return
                }

            handler.postDelayed(
                this,
                1000
            )
        }
    }



    //=======SERVICE=======//
    override fun onCreate() {
        super.onCreate()

        createNotificationChannel()

        val notification = NotificationCompat.Builder(
            this,
            CHANNEL_ID
        )
        
        .setContentTitle("Synapause")
        .setContentText("Focus monitoring is active")
        .setSmallIcon(applicationInfo.icon)
        .setOngoing(true)
        .setPriority(NotificationCompat.PRIORITY_LOW)
        .build()

        startForeground(
            NOTIFICATION_ID,
            notification
        )

        handler.post(
            monitorRunnable
        )

        Log.d(
            "SynapauseMonitor",
            "Foreground Monitor Service Started"
        )
    }

    override fun onStartCommand(
        intent: Intent?,
        flags: Int,
        startId: Int
    ): Int {
        if(
            intent?.action ==
            ACTION_RESTART_TIMER
        ){
            restartTimer()
        }

        return START_STICKY
    }

    override fun onDestroy() {
        handler.removeCallbacks(
            monitorRunnable
        )

        handler.removeCallbacks(
            timerRunnable
        )

        timerRunning =false

        Log.d(
            "SynapauseMonitor",
            "Foreground Monitor Service Stopped"
        )

        super.onDestroy()
    }


    override fun onBind(
        intent: Intent?
    ): IBinder? {

        return null
    }



    //=======FOREGROUND DETECTOR=======//
    private fun detectForegroundApp() {
        try {
            val usageStatsManager = getSystemService(
                Context.USAGE_STATS_SERVICE
            ) as UsageStatsManager

            val endTime = System.currentTimeMillis()
            val startTime = endTime - 10000
            val usageEvents = usageStatsManager.queryEvents(
                startTime,
                endTime
            )

            val event = UsageEvents.Event()
            var foregroundPackage:String? = null
            var latestTimestamp = 0L
            while(
                usageEvents.hasNextEvent()
            ){
                usageEvents.getNextEvent(
                    event
                )

                val isForegroundEvent =
                if(
                    Build.VERSION.SDK_INT >=
                    Build.VERSION_CODES.Q
                ){
                    event.eventType == UsageEvents.Event.ACTIVITY_RESUMED
                }

                else{
                    event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND
                }

                if(
                    isForegroundEvent &&
                    event.timeStamp >= latestTimestamp
                ){
                    latestTimestamp = event.timeStamp
                    foregroundPackage = event.packageName
                }
            }

            if(foregroundPackage == null){
                return
            }

            currentAppId = foregroundPackage

            if(
                foregroundPackage != lastAppId
            ){
                lastAppId = foregroundPackage

                Log.d(
                    "SynapauseMonitor",
                    "FOREGROUND APP: $foregroundPackage"
                )

                sendForegroundAppChanged(
                    foregroundPackage
                )
            }

            updateTimerForCurrentApp(
                foregroundPackage
            )
        }

        catch(error: Exception){
            Log.e(
                "SynapauseMonitor",
                "Foreground detection failed",
                error
            )
        }
    }



    //=======TIMER=======//
    private fun updateTimerForCurrentApp(
        appId: String
    ){
        val monitored = monitoredApps.contains(appId)

        if(monitored){
            if(quizRequired){
                Log.d(
                    "SynapauseMonitor",
                    "Waiting Quiz..."
                )

                return
            }

            startTimer()
        }

        else{
            pauseTimer()
        }
    }

    private fun startTimer(){
        if(quizRequired){
            Log.d(
                "SynapauseMonitor",
                "Waiting Quiz..."
            )

            return
        }

        if(timerRunning){
            return
        }

        timerRunning = true

        handler.removeCallbacks(
            timerRunnable
        )

        handler.postDelayed(
            timerRunnable,
            1000
        )

        Log.d(
            "SynapauseMonitor",
            "Timer Started"
        )
    }

    private fun pauseTimer(){
        if(!timerRunning){
            return
        }

        handler.removeCallbacks(
            timerRunnable
        )

        timerRunning = false

        Log.d(
            "SynapauseMonitor",
            "Timer Paused"
        )
    }

    private fun resetTimer(){
        handler.removeCallbacks(
            timerRunnable
        )

        timerRunning = false
        timerSeconds = 0
        quizRequired = false

        sendTimerChanged()

        Log.d(
            "SynapauseMonitor",
            "Timer Reset"
        )
    }

    private fun restartTimer(){
        resetTimer()

        val monitored = currentAppId != null && monitoredApps.contains(currentAppId)

        if(monitored){
            startTimer()
        }

        Log.d(
            "SynapauseMonitor",
            "Timer Restarted"
        )
    }



    //=======OVERLAY=======//
    private fun showOverlay(){
        try{
            val intent =
                Intent(
                    this,
                    MainActivity::class.java
                )


            intent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
            )


            intent.addFlags(
                Intent.FLAG_ACTIVITY_SINGLE_TOP
            )


            intent.addFlags(
                Intent.FLAG_ACTIVITY_CLEAR_TOP
            )


            intent.putExtra(
                "showQuiz",
                true
            )


            startActivity(
                intent
            )


            Log.d(
                "SynapauseMonitor",
                "SHOW OVERLAY"
            )
        }

        catch(error: Exception){

            Log.e(
                "SynapauseMonitor",
                "SHOW OVERLAY FAILED",
                error
            )
        }
    }



    //=======BROADCAST=======//
    private fun sendForegroundAppChanged(
        appId: String
    ){
        val broadcast = Intent(ACTION_FOREGROUND_APP_CHANGED)

        broadcast.setPackage(
            packageName
        )

        broadcast.putExtra(
            EXTRA_APP_ID,
            appId
        )

        sendBroadcast(
            broadcast
        )
    }


    private fun sendTimerChanged(){
        val broadcast = Intent(ACTION_TIMER_CHANGED)

        broadcast.setPackage(
            packageName
        )

        broadcast.putExtra(
            EXTRA_SECONDS,
            timerSeconds
        )

        sendBroadcast(
            broadcast
        )
    }


    private fun sendQuizRequired(){
        val broadcast = Intent(ACTION_QUIZ_REQUIRED)

        broadcast.setPackage(
            packageName
        )

        sendBroadcast(
            broadcast
        )
    }



    //=======NOTIFICATION=======//
    private fun createNotificationChannel(){
        if(
            Build.VERSION.SDK_INT >=
            Build.VERSION_CODES.O
        ){
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Synapause Monitoring",
                NotificationManager.IMPORTANCE_LOW
            )

            channel.description = "Synapause focus monitoring"

            val manager = getSystemService(
                NotificationManager::class.java
            )

            manager.createNotificationChannel(
                channel
            )
        }
    }
}