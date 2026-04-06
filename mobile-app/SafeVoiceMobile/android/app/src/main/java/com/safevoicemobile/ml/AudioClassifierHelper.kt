package com.safevoicemobile.ml

import android.content.Context
import android.util.Log
import org.tensorflow.lite.support.audio.TensorAudio
import org.tensorflow.lite.task.audio.classifier.AudioClassifier

data class AudioPrediction(
    val label: String,
    val score: Float,
    val allResults: List<Pair<String, Float>>
)

class AudioClassifierHelper(context: Context) {

    private val TAG = "AudioClassifierHelper"

    private val classifier: AudioClassifier
    private val tensorAudio: TensorAudio

    init {
        val options = AudioClassifier.AudioClassifierOptions.builder()
            .setScoreThreshold(0.3f)
            .setMaxResults(5)
            .build()

        classifier = AudioClassifier.createFromFileAndOptions(
            context,
            "reconocimiento_metadata.tflite",
            options
        )

        tensorAudio = classifier.createInputTensorAudio()

        Log.d(TAG, "Modelo cargado correctamente: reconocimiento_metadata.tflite")
    }

    fun classify(audioData: ShortArray): AudioPrediction? {
        tensorAudio.load(audioData)

        val results = classifier.classify(tensorAudio)
        val output = mutableListOf<Pair<String, Float>>()

        for (classification in results) {
            for (category in classification.categories) {
                output.add(Pair(category.label, category.score))
            }
        }

        val sorted = output.sortedByDescending { it.second }
        val top = sorted.firstOrNull() ?: return null

        Log.d(TAG, "Top prediction -> ${top.first} (${top.second})")
        sorted.take(5).forEachIndexed { index, item ->
            Log.d(TAG, "Top ${index + 1}: ${item.first} -> ${item.second}")
        }

        return AudioPrediction(
            label = top.first,
            score = top.second,
            allResults = sorted
        )
    }
}