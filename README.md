# IOT_APP
Aplicación de detección de audio


# DESPLIEGUE DEL PROYECTO (GENERAL)

### Para levantar los servicios de Docker (Backend + BD)

- A través de un terminal
- Ingresamos a la ruta \IOT_APP\devops
- en la terminal ingresamos el comando:
    - docker compose up --build
    - Construye la imagen del backend
    - Descarga las imágenes necesarias
    - Crea contenedores

- *podemos ver las tablas de la base de datos con el comando: 
    - docker exec -it threat-db psql -U admin -d threat_detection


### Para levantar los servicios de React-Native (Frontend)
- abrimos otra terminal 
- Ingresamos a la ruta IOT_APP\mobile-app\SafeVoiceMobile
- instalamos todas las dependencias con: npm install

* para hacer pruebas con el teléfono (Android)
  se ingresa desde el "opciones de desarrollador"
  se activa la opción "Depuración con USB"

- se confirma que esté conectado el dispositivo con: adb devices
  debe aparecer algo así
  List of devices attached
  R58XX0R9KXX     device

  

- ejecutamos el siguiente comando: npx react-native run-android
    - se abre una ventana de Node
    - se inicializará la app en el teléfono

- Para capturar los logs de los servicios que están en Kotlin 
    - adb logcat | grep AudioClassifierHelper
    - adb logcat | grep EventRepository
 

## Desarrolladores del proyecto: SafeVoice
- Gutiérrez Johanna
- Jaramillo Francisco
- Miranda Christian
- Morocho Daniel
- Muñoz Katherine
