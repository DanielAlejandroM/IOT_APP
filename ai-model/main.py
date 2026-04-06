

#Librerias
"""

import tensorflow as tf
import librosa
import numpy as np
from google.colab import files
from IPython.display import Audio, display

"""
#MODELO"""

import os
import tensorflow as tf
from google.colab import files

print("Selecciona tu archivo de modelo YAMNet (.tflite):")
uploaded_model = files.upload()
tflite_path = list(uploaded_model.keys())[0]

# OBTENER EL PESO DEL ARCHIVO
file_size_bytes = os.path.getsize(tflite_path)
file_size_mb = file_size_bytes / (1024 * 1024)

# Configurar el intérprete de TFLite
interpreter = tf.lite.Interpreter(model_path=tflite_path)
interpreter.allocate_tensors()

# Obtener detalles de entrada y salida
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

print(f"\nModelo '{tflite_path}' cargado exitosamente.")
print(f"Peso del modelo: {file_size_mb:.2f} MB")

"""#Patrones"""

# Configuración de categorías SafeVoice con IDs oficiales de YAMNet
MAPEO_SAFEVOICE = {
    "Disturbio/Incidente": [6, 7, 9, 11, 19, 22, 33, 39,382, 390, 391, 393, 394],
    "Alerta_critica": [420, 421, 422, 423, 424, 430, 435, 437,460,461,462,464]
}

"""#funciones

"""

def preprocess_audio(file_path):
    audio, sr = librosa.load(file_path, sr=16000, mono=True)
    audio = audio.astype(np.float32)
    abs_max = np.max(np.abs(audio))
    if abs_max > 1.0:
        audio = audio / abs_max
    return audio

def run_yamnet(audio):
    REQUIRED_SAMPLES = 15600
    all_scores = []

    # Recorre el audio haciendo la predicción por cada bloque (casi 1 segundo cada uno)
    for i in range(0, len(audio), REQUIRED_SAMPLES):
        chunk = audio[i:i + REQUIRED_SAMPLES]

        if len(chunk) < REQUIRED_SAMPLES:
            chunk = np.pad(chunk, (0, REQUIRED_SAMPLES - len(chunk)), mode='constant')

        interpreter.set_tensor(input_details[0]['index'], chunk)
        interpreter.invoke()

        scores = interpreter.get_tensor(output_details[0]['index'])
        all_scores.append(scores.flatten())

    return np.array(all_scores)

def clasificar_alertas_safevoice(scores, mapeo, threshold):
    resultados = []
    # 15600 muestras a 16kHz equivale a un paso de 0.975 segundos
    TIME_STEP = 0.975

    for i, frame_scores in enumerate(scores):
        max_score_frame = 0.0
        categoria_detectada = None
        id_especifico = -1

        for nombre_cat, ids in mapeo.items():
            scores_del_grupo = frame_scores[ids]
            idx_relativo = np.argmax(scores_del_grupo)
            valor_max = scores_del_grupo[idx_relativo]

            if valor_max > max_score_frame:
                max_score_frame = valor_max
                categoria_detectada = nombre_cat
                id_especifico = ids[idx_relativo]

        if categoria_detectada and max_score_frame >= threshold:
            resultados.append({
                "segundo": round(i * TIME_STEP, 2),
                "alerta": categoria_detectada,
                "id_activador": id_especifico,
                "probabilidad": round(float(max_score_frame), 4)
            })
    return resultados

"""#PRUEBA

"""

from google.colab import files
from IPython.display import Audio, display

# Subir archivo desde tu PC
uploaded = files.upload()

# Obtener nombre del archivo
file_path = list(uploaded.keys())[0]

print("Archivo cargado:", file_path)

# Reproducir audio
display(Audio(file_path))

# Ejecución
audio_data = preprocess_audio(file_path)
scores_matrix = run_yamnet(audio_data)

alertas = clasificar_alertas_safevoice(scores_matrix, MAPEO_SAFEVOICE, threshold=0.50)

if not alertas:
    print("\nNo se detectaron eventos de emergencia.")
else:
    print(f"\n{'TIEMPO':<10} | {'CATEGORÍA':<20} | {'ID YAMNET':<10} | {'PROBABILIDAD':<12}")
    print("-" * 65)
    for r in alertas:
        print(f"{r['segundo']:<10}s | {r['alerta']:<20} | {r['id_activador']:<10} | {r['probabilidad']:<12}")
