package ec.edu.uce.safevoice.network

import android.content.Context
import android.util.Log
import ec.edu.uce.safevoice.BuildConfig
import ec.edu.uce.safevoice.network.dto.AlertRequest
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class AlertRepository(context: Context) {

    private val api: ApiService

    init {
        val logger = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val client = OkHttpClient.Builder()
            .addInterceptor(logger)
            .build()

        api = Retrofit.Builder()
            .baseUrl(BuildConfig.BASE_URL)
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

        val token = BuildConfig.AUTH_TOKEN.takeIf { it.isNotBlank() }?.let { "Bearer $it" }

        val response = api.createAlert(token, payload)

        if (!response.isSuccessful) {
            Log.e("AlertRepository", "Error enviando alerta: ${response.code()}")
        } else {
            Log.d("AlertRepository", "Alerta enviada correctamente")
        }
    }
}