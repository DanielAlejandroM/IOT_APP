package ec.edu.uce.safevoice.audio

import android.annotation.SuppressLint
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.isActive
import kotlinx.coroutines.withContext
import kotlin.math.max

class AudioRecorderManager {

    private val sampleRate = 16000
    private val channelConfig = AudioFormat.CHANNEL_IN_MONO
    private val audioFormat = AudioFormat.ENCODING_PCM_16BIT

    private var audioRecord: AudioRecord? = null

    @Volatile
    private var isRecording = false

    @SuppressLint("MissingPermission")
    suspend fun startRecording(
        onWindowReady: suspend (ShortArray) -> Unit
    ) = withContext(Dispatchers.IO) {

        val minBufferSize = AudioRecord.getMinBufferSize(
            sampleRate,
            channelConfig,
            audioFormat
        )

        if (minBufferSize == AudioRecord.ERROR || minBufferSize == AudioRecord.ERROR_BAD_VALUE) {
            throw IllegalStateException("No se pudo obtener un buffer válido para AudioRecord")
        }

        val bufferSize = max(minBufferSize, sampleRate * 2)

        val recorder = AudioRecord(
            MediaRecorder.AudioSource.MIC,
            sampleRate,
            channelConfig,
            audioFormat,
            bufferSize
        )

        if (recorder.state != AudioRecord.STATE_INITIALIZED) {
            throw IllegalStateException("AudioRecord no pudo inicializarse")
        }

        audioRecord = recorder

        val readBuffer = ShortArray(bufferSize / 2)
        val slidingWindow = ArrayList<Short>(sampleRate)

        recorder.startRecording()
        isRecording = true

        while (isActive && isRecording) {
            val read = recorder.read(readBuffer, 0, readBuffer.size)

            if (read > 0) {
                for (i in 0 until read) {
                    slidingWindow.add(readBuffer[i])
                }

                while (slidingWindow.size >= sampleRate) {
                    val chunk = slidingWindow.take(sampleRate).toShortArray()
                    onWindowReady(chunk)

                    repeat(sampleRate / 2) {
                        if (slidingWindow.isNotEmpty()) {
                            slidingWindow.removeAt(0)
                        }
                    }
                }
            }
        }
    }

    fun stopRecording() {
        isRecording = false

        try {
            audioRecord?.stop()
        } catch (_: Exception) {
        }

        try {
            audioRecord?.release()
        } catch (_: Exception) {
        }

        audioRecord = null
    }
}