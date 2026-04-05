#Librerias
"""

import tensorflow as tf
import tensorflow_hub as hub
import librosa
import numpy as np
from google.colab import files
from IPython.display import Audio, display

"""
#tflite"""

model = hub.load("https://tfhub.dev/google/yamnet/1")
print(model.signatures)

"""#MODELO

#Patrones
"""

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

    print(f"Valor Máximo: {np.max(audio):.4f}")
    print(f"Valor Mínimo: {np.min(audio):.4f}")

    return audio

def run_yamnet(audio):
    scores, embeddings, spectrogram = model(audio)
    return scores.numpy()

def clasificar_alertas_safevoice(scores, mapeo, threshold):
    """
    Analiza los scores de YAMNet y retorna el ID específico y la probabilidad
    de la categoría que superó el umbral.
    """
    resultados = []
    HOP_SECONDS=0.48

    for i, frame_scores in enumerate(scores):
        max_score_frame = 0.0
        categoria_detectada = None
        id_especifico = -1

        # Buscar categorias
        for nombre_cat, ids in mapeo.items():
            # filtrar scores solo para los IDs de este grupo
            scores_del_grupo = frame_scores[ids]

            # Encontrar el índice del valor más alto dentro de este sub-grupo
            idx_relativo = np.argmax(scores_del_grupo)
            valor_max = scores_del_grupo[idx_relativo]

            # Si este es el valor más alto del frame hasta ahora, guardar
            if valor_max > max_score_frame:
                max_score_frame = valor_max
                categoria_detectada = nombre_cat
                id_especifico = ids[idx_relativo] # Obtener el ID global de YAMNet

        # Solo registramos si supera el umbral configurado
        if categoria_detectada and max_score_frame >= threshold:
            resultados.append({
                "segundo": round(i * HOP_SECONDS, 2),
                "alerta": categoria_detectada,
                "id_activador": id_especifico,
                "probabilidad": round(float(max_score_frame), 4)
            })

    return resultados

"""#PRUEBA

"""

uploaded = files.upload()
file_path = list(uploaded.keys())[0]

print("Archivo cargado:", file_path)

display(Audio(file_path))

# Ejecutar la clasificación
# Procesar
audio = preprocess_audio(file_path)
scores = run_yamnet(audio)
alertas_detectadas = clasificar_alertas_safevoice(scores, MAPEO_SAFEVOICE, threshold=0.30)

# 3. Mostrar alertas encontradas
if not alertas_detectadas:

    print(f"No se detectaron eventos de emergencia")
else:
    print(f"{'TIEMPO':<10} | {'CATEGORÍA':<20} | {'ID YAMNET':<10} | {'PROBABILIDAD':<12}")
    print("-" * 65)
    for r in alertas_detectadas:

        # Imprime los datos frame por frame
        print(f"{r['segundo']:<10}s | {r['alerta']:<20} | {r['id_activador']:<10} | {r['probabilidad']:<12}")
