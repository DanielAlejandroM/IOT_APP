package com.safevoicemobile.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import android.util.Log.d
import androidx.core.app.NotificationCompat
import com.safevoicemobile.R
import com.safevoicemobile.audio.AudioRecorderManager
import com.safevoicemobile.audio.RmsDetector
import com.safevoicemobile.location.SafeVoiceLocationManager
import com.safevoicemobile.network.AlertRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

class AudioMonitoringService : Service() {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    private lateinit var audioRecorderManager: AudioRecorderManager
    private lateinit var rmsDetector: RmsDetector
    private lateinit var locationManager: SafeVoiceLocationManager
    private lateinit var alertRepository: AlertRepository

    @Volatile
    private var isRunning = false

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()

        audioRecorderManager = AudioRecorderManager()
        rmsDetector = RmsDetector()
        locationManager = SafeVoiceLocationManager(this)
        alertRepository = AlertRepository(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(NOTIFICATION_ID, buildNotification())

        if (!isRunning) {
            isRunning = true
            startMonitoringLoop()
        }

        return START_STICKY
    }

    private fun startMonitoringLoop() {
        scope.launch {
            try {
                audioRecorderManager.startRecording { window ->
                    val result = rmsDetector.analyze(window)

                    d(
                        TAG,
                        "RMS=${result.rms}, dBFS=${result.db}, hits=${result.consecutiveHits}, dangerous=${result.isDangerous}"
                    )

                    if (result.isDangerous) {
                        val location = locationManager.getCurrentLocation()

                        alertRepository.sendAlert(
                            rms = result.rms,
                            db = result.db,
                            severity = result.level,
                            latitude = location?.latitude,
                            longitude = location?.longitude
                        )

                        d(TAG, "Alerta enviada al backend")
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error en monitoreo: ${e.message}", e)
            }
        }
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("SAFEVOICE activo")
            .setContentText("Monitoreando audio en segundo plano")
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "SAFEVOICE Monitoring",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        isRunning = false
        audioRecorderManager.stopRecording()
        scope.cancel()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        private const val TAG = "AudioMonitoringSvc"
        private const val CHANNEL_ID = "safevoice_monitoring_channel"
        private const val NOTIFICATION_ID = 1001
    }
}