package com.safevoicemobile.network

import android.util.Log
import com.safevoicemobile.network.dto.AlertRequest
import com.safevoicemobile.service.AudioMonitoringService
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class AlertRepository(service: AudioMonitoringService) {

    private val api: ApiService

    init {
        val logger = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val client = OkHttpClient.Builder()
            .addInterceptor(logger)
            .build()

        api = Retrofit.Builder()
            .baseUrl("http://192.168.1.50:8080/api/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }

    suspend fun sendAlert(
        rms: Double,
        db: Double,
        severity: String,
        latitude: Double?,
        longitude: Double?
    ) {
        val payload = AlertRequest(
            type = "ACOUSTIC_ANOMALY",
            rms = rms,
            db = db,
            severity = severity,
            latitude = latitude,
            longitude = longitude
        )

        val response = api.createAlert(null, payload)

        if (!response.isSuccessful) {
            Log.e("AlertRepository", "Error enviando alerta: ${response.code()}")
        } else {
            Log.d("AlertRepository", "Alerta enviada correctamente")
        }
    }
}