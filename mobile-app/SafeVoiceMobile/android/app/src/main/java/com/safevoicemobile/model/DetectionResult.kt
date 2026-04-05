package com.safevoicemobile.model

data class DetectionResult(
    val rms: Double,
    val db: Double,
    val consecutiveHits: Int,
    val isDangerous: Boolean,
    val level: String
)