package ec.edu.uce.safevoice.audio

import ec.edu.uce.safevoice.model.DetectionResult
import kotlin.math.ln
import kotlin.math.pow
import kotlin.math.sqrt

class RmsDetector(
    private val dangerThresholdDb: Double = -18.0,
    private val consecutiveWindowsRequired: Int = 3
) {

    private var consecutiveDanger = 0

    fun analyze(buffer: ShortArray): DetectionResult {
        val rms = calculateRms(buffer)
        val db = toDbfs(rms)

        val dangerousNow = db >= dangerThresholdDb

        consecutiveDanger = if (dangerousNow) {
            consecutiveDanger + 1
        } else {
            0
        }

        val level = when {
            db >= -10.0 -> "HIGH"
            db >= dangerThresholdDb -> "MEDIUM"
            else -> "LOW"
        }

        return DetectionResult(
            rms = rms,
            db = db,
            consecutiveHits = consecutiveDanger,
            isDangerous = consecutiveDanger >= consecutiveWindowsRequired,
            level = level
        )
    }

    private fun calculateRms(buffer: ShortArray): Double {
        if (buffer.isEmpty()) return 0.0

        var sum = 0.0
        for (sample in buffer) {
            val normalized = sample / 32768.0
            sum += normalized.pow(2.0)
        }
        return sqrt(sum / buffer.size)
    }

    private fun toDbfs(rms: Double): Double {
        if (rms <= 0.0) return -100.0
        return 20 * ln(rms) / ln(10.0)
    }
}