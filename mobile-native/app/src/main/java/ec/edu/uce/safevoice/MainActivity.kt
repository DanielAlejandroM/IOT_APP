package ec.edu.uce.safevoice

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import ec.edu.uce.safevoice.databinding.ActivityMainBinding
import ec.edu.uce.safevoice.service.AudioMonitoringService
import ec.edu.uce.safevoice.util.PermissionUtils

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.RECORD_AUDIO),
                1
            )
        }
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnRequestPermissions.setOnClickListener {
            PermissionUtils.requestRuntimePermissions(this)
        }

        binding.btnStartMonitoring.setOnClickListener {
            if (!PermissionUtils.hasRequiredPermissions(this)) {
                Toast.makeText(
                    this,
                    "Debes conceder permisos de micrófono y ubicación",
                    Toast.LENGTH_LONG
                ).show()
                PermissionUtils.requestRuntimePermissions(this)
                return@setOnClickListener
            }

            val intent = Intent(this, AudioMonitoringService::class.java)
            ContextCompat.startForegroundService(this, intent)
            binding.tvStatus.text = "Estado: monitoreo iniciado"
        }

        binding.btnStopMonitoring.setOnClickListener {
            stopService(Intent(this, AudioMonitoringService::class.java))
            binding.tvStatus.text = "Estado: monitoreo detenido"
        }
    }

}