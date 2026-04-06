package com.safevoicemobile.network.dto

data class CommentRequest(
    val user_id: String,
    val text: String,
    val risk: String,
    val risk_analysis_id: String? = null
)