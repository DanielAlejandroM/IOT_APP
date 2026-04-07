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

        val token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQG1haWwuY29tIiwiZXhwIjoxNzc1NDUzOTY0fQ.U7-FLfHBaiY0dkDLoGjPeaWgQlQuEwAMymmaoV49AWk"

        val authInterceptor = okhttp3.Interceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .addHeader("Content-Type", "application/json")
                .build()

            chain.proceed(request)
        }

        val client = OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
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