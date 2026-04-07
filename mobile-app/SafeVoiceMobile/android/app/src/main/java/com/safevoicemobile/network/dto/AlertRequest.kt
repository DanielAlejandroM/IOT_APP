package com.safevoicemobile.network.dto

data class AlertRequest(
    val event_type: String,
    val alert_type: String,
    val lat: Double,
    val lng: Double
)