package com.safevoicemobile.network

import com.safevoicemobile.network.dto.AlertRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface ApiService {

    @POST("alerts")
    suspend fun createAlert(
        @Header("Authorization") authorization: String?,
        @Body request: AlertRequest
    ): Response<Unit>
}