package com.safevoicemobile.network

import android.util.Log
import com.safevoicemobile.network.dto.CommentRequest
import com.safevoicemobile.network.dto.GeoRequest
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.UUID

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
            .baseUrl("http://192.168.1.50:8000/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }

    suspend fun sendDetectedEvent(
        userId: String,
        detectedClass: String,
        score: Float,
        severity: String,
        latitude: Double?,
        longitude: Double?
    ) {
        val riskAnalysisId = UUID.randomUUID().toString()

        val text = "Detección local: clase=$detectedClass, score=$score"

        try {
            val commentResponse = api.createComment(
                CommentRequest(
                    user_id = userId,
                    text = text,
                    risk = severity,
                    risk_analysis_id = riskAnalysisId
                )
            )

            Log.d(
                "EventRepository",
                "POST /comments -> code=${commentResponse.code()}, success=${commentResponse.isSuccessful}"
            )
        } catch (e: Exception) {
            Log.e("EventRepository", "Error enviando /comments: ${e.message}", e)
        }

        if (latitude != null && longitude != null) {
            try {
                val geoResponse = api.createGeoEvent(
                    GeoRequest(
                        user_id = userId,
                        lat = latitude,
                        lon = longitude,
                        description = "Evento detectado: $detectedClass ($severity)",
                        risk_analysis_id = riskAnalysisId
                    )
                )

                Log.d(
                    "EventRepository",
                    "POST /geo -> code=${geoResponse.code()}, success=${geoResponse.isSuccessful}"
                )
            } catch (e: Exception) {
                Log.e("EventRepository", "Error enviando /geo: ${e.message}", e)
            }
        } else {
            Log.w("EventRepository", "No se envió /geo porque la ubicación es null")
        }
    }
}