# Bottin Consult — appended to android/app/proguard-rules.pro (R8).
# Expo modules ship their own consumer rules; this file adds common RN adjuncts.

# React Native bridge / JNI (often needed with minify)
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Reanimated & worklets
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.worklets.** { *; }

# OkHttp (RN networking)
-dontwarn okhttp3.**
-dontwarn okio.**

# Play-friendly stack traces (symbols still obfuscated; mapping file uploaded separately)
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
