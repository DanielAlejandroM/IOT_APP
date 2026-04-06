package com.safevoicemobile.network.dto

data class GeoRequest(
    val user_id: String,
    val lat: Double,
    val lon: Double,
    val description: String,
    val risk_analysis_id: String? = null
)