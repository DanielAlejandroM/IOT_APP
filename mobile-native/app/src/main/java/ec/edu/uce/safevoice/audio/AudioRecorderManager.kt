package ec.edu.uce.safevoice.audio

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

    suspend fun startRecording(onWindowReady: suspend (ShortArray) -> Unit) = withContext(Dispatchers.IO) {
        val minBufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)
        val bufferSize = max(minBufferSize, sampleRate * 2)

        val recorder = AudioRecord(
            MediaRecorder.AudioSource.MIC,
            sampleRate,
            channelConfig,
            audioFormat,
            bufferSize
        )

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
        audioRecord?.release()
        audioRecord = null
    }
}