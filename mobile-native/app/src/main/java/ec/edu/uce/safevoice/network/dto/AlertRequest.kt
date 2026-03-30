package ec.edu.uce.safevoice.network.dto

data class AlertRequest(
    val type: String,
    val rms: Double,
    val db: Double,
    val severity: String,
    val latitude: Double?,
    val longitude: Double?,
    val source: String = "android-edge",
    val audioTransmitted: Boolean = false
)