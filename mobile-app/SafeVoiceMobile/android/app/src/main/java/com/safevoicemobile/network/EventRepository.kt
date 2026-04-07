package com.safevoicemobile.network

import android.util.Log
import com.safevoicemobile.network.dto.AlertRequest
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class EventRepository {

    private val api: ApiService

    init {
        val logger = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val client = OkHttpClient.Builder()
            .addInterceptor(logger)
            .build()

        api = Retrofit.Builder()
            .baseUrl("http://192.168.3.178:8000/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }

    suspend fun sendAlert(
        eventType: String,
        alertType: String,
        lat: Double,
        lng: Double
    ) {
        try {
            val payload = AlertRequest(
                event_type = eventType,
                alert_type = alertType,
                lat = lat,
                lng = lng
            )

            Log.w("EventRepository", "POST /alerts -> body=$payload")

            val response = api.createAlert(payload)

            Log.w(
                "EventRepository",
                "POST /alerts -> code=${response.code()}, success=${response.isSuccessful}"
            )
        } catch (e: Exception) {
            Log.e("EventRepository", "Error enviando /alerts: ${e.message}", e)
        }
    }
}