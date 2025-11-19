document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("openOptionsBtn");

    openBtn.addEventListener("click", () => {
        // Öffnet die in manifest.json unter 'options_ui' definierte Seite
        browser.runtime.openOptionsPage();

        // Optional: Schließt das Popup sofort, nachdem der Button geklickt wurde.
        // window.close();
    });
});