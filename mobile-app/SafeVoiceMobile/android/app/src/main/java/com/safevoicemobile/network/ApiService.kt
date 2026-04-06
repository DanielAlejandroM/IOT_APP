package com.safevoicemobile.network

import com.safevoicemobile.network.dto.CommentRequest
import com.safevoicemobile.network.dto.GeoRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("/comments")
    suspend fun createComment(
        @Body request: CommentRequest
    ): Response<Unit>

    @POST("/geo")
    suspend fun createGeoEvent(
        @Body request: GeoRequest
    ): Response<Unit>
}