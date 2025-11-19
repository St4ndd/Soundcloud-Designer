// background.js

browser.action.onClicked.addListener(async (tab) => {
    const isSoundCloud = tab.url.includes("soundcloud.com");

    if (isSoundCloud) {
        // 1. Wenn es SoundCloud ist: Sende Nachricht zum Umschalten der Sidebar
        try {
            await browser.tabs.sendMessage(tab.id, {
                type: "toggleSidebar"
            });
        } catch (error) {
            // Fehler, falls Content Script noch nicht vollständig geladen ist.
            console.error("Fehler beim Senden der toggleSidebar Nachricht:", error);
        }
    } else {
        // 2. Wenn es NICHT SoundCloud ist: Führe ein Skript aus, das die Warnung anzeigt.
        try {
            // Die scripting API wird verwendet, um Code in den aktiven Tab einzufügen.
            await browser.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    alert("Go to SoundCloud to edit the theme.");
                }
            });
        } catch (error) {
            // Dies fängt Fehler ab, wenn die Erweiterung versucht,
            // auf eingeschränkten Seiten (z.B. about:addons) Code auszuführen.
            console.warn("Konnte Warnung auf eingeschränkter Seite nicht anzeigen:", error);
        }
    }
});