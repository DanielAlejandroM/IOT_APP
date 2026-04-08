package com.safevoicemobile.nativebridge

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*
import com.safevoicemobile.service.AudioMonitoringService


class SafeVoiceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "SafeVoiceModule"

    @ReactMethod
    fun startMonitoring(token: String, promise: Promise) {
        try {
            val hasMic = ContextCompat.checkSelfPermission(
                reactContext,
                Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED

            if (!hasMic) {
                promise.reject("NO_PERMISSION", "No hay permiso de micrófono")
                return
            }

            // 🔥 AQUÍ YA TIENES EL TOKEN
            val intent = Intent(reactContext, AudioMonitoringService::class.java)
            intent.putExtra("ACCESS_TOKEN", token)

            ContextCompat.startForegroundService(reactContext, intent)

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("START_ERROR", e)
        }
    }

    @ReactMethod
    fun stopMonitoring(promise: Promise) {
        try {
            val intent = Intent(reactContext, AudioMonitoringService::class.java)
            reactContext.stopService(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STOP_ERROR", e)
        }
    }
}