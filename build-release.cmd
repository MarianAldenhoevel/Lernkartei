@ECHO OFF
REM Build a releaseapk and prepare it for upload to the Google Playstore

CALL ionic build android --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "Lernkartei.keystore" "platforms/android/build/outputs/apk/android-release-unsigned.apk" "Lernkartei-release" -storepass Lernkartei -keypass Lernkartei 
C:\Users\Visionhall\AppData\Local\Android\sdk\build-tools\25.0.3\zipalign -v 4 "platforms/android/build/outputs/apk/android-release-unsigned.apk" "build/android-release.apk"
del "platforms\android\build\outputs\apk\android-release-unsigned.apk" 