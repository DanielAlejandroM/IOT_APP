package com.safevoicemobile.network.dto

data class AlertRequest(
    val type: String,
    val detectedClass: String,
    val score: Float,
    val severity: String,
    val latitude: Double?,
    val longitude: Double?,
    val source: String = "android-edge",
    val audioTransmitted: Boolean = false
)