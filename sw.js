self.addEventListener("install", event => {
    console.log("Service Worker instalado");
});

self.addEventListener("fetch", event => {
    // Permite que la aplicación funcione normalmente
});