

#Librerias
"""

import tensorflow as tf
import tensorflow_hub as hub
import librosa
import numpy as np

"""#Modelo"""

model = hub.load("https://tfhub.dev/google/yamnet/1")
print(model.signatures)

"""#Patrones"""

ids = [
    6, 7, 9, 11, 19, 22, 33, 39,
    382, 390, 391, 393, 394,
    420, 421, 422, 423, 424,
    430, 435, 437, 460, 461, 462, 464
]

nombres = [
    "Grito",
    "Brama / Voz fuerte",
    "Gritar",
    "Gritando",
    "Llanto, sollozo",
    "Lamento, gemido",
    "Gemido",
    "Jadeo",
    "Alarma",
    "Sirena",
    "Sirena de defensa civil",
    "Detector de humo, alarma de humo",
    "Alarma de incendio",
    "Explosión",
    "Disparo, fuego de arma",
    "Ametralladora",
    "Ráfaga de disparos",
    "Fuego de artillería",
    "Boom (explosión fuerte)",
    "Vidrio",
    "Estallido de vidrio",
    "Golpe fuerte",
    "Bofetada",
    "Golpe seco",
    "Rompiéndose"
]

"""#funciones

"""

def preprocess_audio(file_path):
    audio, sr = librosa.load(file_path, sr=16000, mono=True)

    audio = audio.astype(np.float32)

    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val

    return audio

def run_yamnet(audio):
    scores, embeddings, spectrogram = model(audio)
    return scores.numpy()

def pico_por_frame(scores, ids, nombres, threshold=0.19):

    resultados = []

    total_frames = len(scores)

    FRAME_HOP_SECONDS = 0.48  # tiempo real por frame

    for i in range(total_frames):

        frame_scores = scores[i]
        selected_scores = frame_scores[ids]

        idx_max = np.argmax(selected_scores)
        mejor_score = selected_scores[idx_max]
        mejor_clase = nombres[idx_max]

        #Umbral
        if mejor_score >= threshold:

            tiempo = i * FRAME_HOP_SECONDS

            resultados.append({
                "tiempo": tiempo,
                "clase": mejor_clase,
                "confianza": float(mejor_score)
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

# Procesar
audio = preprocess_audio(file_path)
scores = run_yamnet(audio)

# Analizar
resultados = pico_por_frame(scores, ids, nombres, threshold=0.19)

for r in resultados:
    print(f"t={r['tiempo']:.2f}s → {r['clase']} ({r['confianza']:.2f})")
