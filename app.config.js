import "dotenv/config";

export default {
  expo: {
    name: "XCampo",
    slug: "XCampo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/XCampo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/XCampo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rojas.dev.XCampo",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/XCampo.png",
        backgroundColor: "#ffffff",
      },
      useNextNotificationsApi: true,
      googleServicesFile: "./google-services.json",
      package: "com.rojas.dev.XCampo",
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/XCampo.png",
    },
    plugins: [
      "expo-secure-store",
      [
        "expo-image-picker",
        {
          photosPermission:
            "La aplicación necesita acceso a tus fotos para seleccionar imágenes.",
          cameraPermission:
            "La aplicación necesita acceso a la cámara para tomar fotos.",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Permitir que esta aplicación acceda a tu ubicación incluso cuando no esté en uso.",
          locationWhenInUsePermission:
            "Permitir que esta aplicación acceda a tu ubicación mientras está en uso.",
        },
      ],
    ],
  },
};
