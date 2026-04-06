package com.safevoicemobile.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.safevoicemobile.R
import com.safevoicemobile.audio.AudioRecorderManager
import com.safevoicemobile.location.SafeVoiceLocationManager
import com.safevoicemobile.ml.AudioClassifierHelper
import com.safevoicemobile.network.EventRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

class AudioMonitoringService : Service() {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    private lateinit var audioRecorderManager: AudioRecorderManager
    private lateinit var locationManager: SafeVoiceLocationManager
    private lateinit var eventRepository: EventRepository
    private lateinit var classifier: AudioClassifierHelper

    @Volatile
    private var isRunning = false

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "onCreate() -> inicializando servicio")

        createNotificationChannel()

        audioRecorderManager = AudioRecorderManager()
        locationManager = SafeVoiceLocationManager(this)
        eventRepository = EventRepository()
        classifier = AudioClassifierHelper(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "onStartCommand() -> servicio recibido")

        startForeground(NOTIFICATION_ID, buildNotification())

        if (!isRunning) {
            isRunning = true
            startMonitoringLoop()
        }

        Log.d(TAG, "Servicio en foreground correctamente")
        return START_STICKY
    }

    private fun startMonitoringLoop() {
        Log.d(TAG, "startMonitoringLoop() -> iniciando monitoreo continuo")

        scope.launch {
            try {
                audioRecorderManager.startRecording { window ->
                    Log.d(TAG, "Nueva ventana recibida para clasificación: samples=${window.size}")

                    val prediction = classifier.classify(window) ?: return@startRecording

                    Log.d(TAG, "Predicción=${prediction.label}, score=${prediction.score}")

                    val highRisk = setOf(
                        "Explosion [rojo]",
                        "Gunshot, gunfire [rojo]",
                        "Machine gun [rojo]",
                        "Fusillade [rojo]",
                        "Artillery fire [rojo]",
                        "Boom [rojo]",
                        "Glass [rojo]",
                        "Shatter [rojo]",
                        "Bang [rojo]",
                        "Slap, smack [rojo]",
                        "Whack, thwack [rojo]",
                        "Breaking [rojo]"
                    )

                    val mediumRisk = setOf(
                        "Shout [naranja]",
                        "Bellow [naranja]",
                        "Yell [naranja]",
                        "Screaming [naranja]",
                        "Crying, sobbing [naranja]",
                        "Wail, moan [naranja]",
                        "Groan [naranja]",
                        "Gasp [naranja]",
                        "Alarm [naranja]",
                        "Siren [naranja]",
                        "Civil defense siren [naranja]",
                        "Smoke detector, smoke alarm [naranja]",
                        "Fire alarm [naranja]"
                    )

                    when {
                        prediction.label in highRisk && prediction.score >= 0.45f -> {
                            Log.w(TAG, "RIESGO ALTO DETECTADO -> ${prediction.label} (${prediction.score})")
                            triggerAlert("HIGH", prediction.label, prediction.score)
                        }

                        prediction.label in mediumRisk && prediction.score >= 0.35f -> {
                            Log.w(TAG, "RIESGO MEDIO DETECTADO -> ${prediction.label} (${prediction.score})")
                            triggerAlert("MEDIUM", prediction.label, prediction.score)
                        }

                        else -> {
                            Log.d(TAG, "Sin alerta -> ${prediction.label} (${prediction.score})")
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error en monitoreo: ${e.message}", e)
            }
        }
    }

    private suspend fun triggerAlert(severity: String, label: String, score: Float) {
        val location = locationManager.getCurrentLocation()

        Log.w(
            TAG,
            "PRE-API -> label=$label, score=$score, severity=$severity, lat=${location?.latitude}, lng=${location?.longitude}"
        )

        // TEMPORAL: usa un userId fijo para pruebas
        val userId = "uuid-123"

        eventRepository.sendDetectedEvent(
            userId = userId,
            detectedClass = label,
            score = score,
            severity = severity,
            latitude = location?.latitude,
            longitude = location?.longitude
        )
//        Log.d(TAG, "Nueva ventana recibida para clasificación: samples=${window.size}")
//        Log.d(TAG, "Predicción=${prediction.label}, score=${prediction.score}")
//        Log.w(TAG, "RIESGO ALTO DETECTADO -> ${prediction.label} (${prediction.score})")
//        Log.w(TAG, "RIESGO MEDIO DETECTADO -> ${prediction.label} (${prediction.score})")
//        Log.d(TAG, "Sin alerta -> ${prediction.label} (${prediction.score})")
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
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
        Log.d(TAG, "onDestroy() -> servicio detenido")
        isRunning = false
        audioRecorderManager.stopRecording()
        scope.cancel()
        super.onDestroy()
    }

    companion object {
        private const val TAG = "AudioMonitoringSvc"
        private const val CHANNEL_ID = "safevoice_monitoring_channel"
        private const val NOTIFICATION_ID = 1001
    }
}