// content.js - Komplette Datei mit Sidebar-Logik und Fehlerbehebung des Close-Buttons

// ===============================
// 1. Sidebar HTML-Struktur
// (Passt zur Diskussion und zum neuen Vercel-inspirierten CSS)
// ===============================
function createSidebarHtml() {
    return `
        <div id="sc-designer-sidebar">
            <button id="sc-designer-sidebar-close">x</button>
            <h2>SoundCloud Designer</h2>

            <h3>Custom Theme</h3>
            <label for="bgImage">Background Image URL:</label>
            <input type="text" id="bgImage" placeholder="Enter URL" value="">
            <label for="bgColor">Primary Button Color (Hex):</label>
            <input type="text" id="bgColor" placeholder="#000000ff" value="">
            
            <button id="applyBtn">Save & Apply Theme</button>
            
            <hr>

            <h3>Fullscreen Player Settings</h3>
            
            <div class="radio-group" style="margin-bottom: 20px;">
                <label>
                    <input type="radio" name="fsBgType" value="blurry" id="fsBgTypeBlurry" checked> Blurry
                </label>
                <label>
                    <input type="radio" name="fsBgType" value="transparent" id="fsBgTypeTransparent"> Transparent Color
                </label>
                <label>
                    <input type="radio" name="fsBgType" value="color" id="fsBgTypeColor"> Solid Color
                </label>
            </div>
            
            <div id="fsBlurryOptions" style="display: block;">
                <label for="fsBlurStrength">Blur Strength (px):</label>
                <input type="range" id="fsBlurStrength" min="0" max="30" value="10">
                <span id="fsBlurValue">10</span> px
            </div>
            
            <div id="fsTransparentOptions" style="display: none;">
                <label for="fsTransColor">Transparent Color (Hex):</label>
                <input type="text" id="fsTransColor" placeholder="#000000" value="#000000">
                <label for="fsTransStrength">Opacity (%):</label>
                <input type="range" id="fsTransStrength" min="0" max="100" value="40">
                <span id="fsTransValue">40</span> %
            </div>

            <div id="fsColorOptions" style="display: none;">
                <label for="fsNormalColor">Solid Color (Hex):</label>
                <input type="text" id="fsNormalColor" placeholder="#000000" value="#000000">
            </div>
            
            <button id="fsApplyBtn">Save Fullscreen Settings</button>
        </div>
    `;
}

// ===============================
// 2. UI-Helfer
// ===============================

/** Steuert die Sichtbarkeit der Fullscreen-Optionen basierend auf dem ausgewählten Typ. */
function setOptionVisibility(type) {
    document.getElementById("fsBlurryOptions").style.display = type === 'blurry' ? 'block' : 'none';
    document.getElementById("fsTransparentOptions").style.display = type === 'transparent' ? 'block' : 'none';
    document.getElementById("fsColorOptions").style.display = type === 'color' ? 'block' : 'none';
}

// ===============================
// 3. Speicher- und Sende-Funktionen
// ===============================

/** Speichert die Haupt-Theme-Einstellungen und wendet sie an. */
async function saveThemeSettings() {
    const bgImage = document.getElementById("bgImage").value;
    const bgColor = document.getElementById("bgColor").value;

    await browser.storage.local.set({ bgImage, bgColor });
    
    // Wende das Theme sofort an
    if (bgImage) setBackground(bgImage);
    if (bgColor) setPrimaryColor(bgColor);

    console.log("Theme settings saved and applied.");
}

/** Speichert alle Einstellungen (Theme und Fullscreen) und sendet ein Update. */
async function saveAllSettings() {
    // Theme-Werte
    const bgImage = document.getElementById("bgImage").value;
    const bgColor = document.getElementById("bgColor").value;

    // Fullscreen-Werte
    const fsBgType = document.querySelector('input[name="fsBgType"]:checked').value;
    const fsBlurStrength = document.getElementById("fsBlurStrength").value;
    const fsTransColor = document.getElementById("fsTransColor").value;
    const fsTransStrength = document.getElementById("fsTransStrength").value;
    const fsNormalColor = document.getElementById("fsNormalColor").value;

    // Alle Werte speichern
    await browser.storage.local.set({ 
        bgImage, 
        bgColor,
        fsBgType,
        fsBlurStrength,
        fsTransColor,
        fsTransStrength,
        fsNormalColor
    });

    // Wende das Theme sofort an
    if (bgImage) setBackground(bgImage);
    if (bgColor) setPrimaryColor(bgColor);

    // Sende eine Nachricht, damit fullscreen.js die Fullscreen-Einstellungen neu lädt
    browser.runtime.sendMessage({
        type: "updateThemeAndFullscreen",
        data: { fsBgType, fsBlurStrength, fsTransColor, fsTransStrength, fsNormalColor }
    });

    console.log("All settings saved and applied. Fullscreen scripts updated.");
}


// ===============================
// 4. Sidebar Initialisierung (inkl. Close-Button-Fix)
// ===============================
function initDesignerSidebar() {
    const sidebarId = "sc-designer-sidebar";
    // Falls die Sidebar schon existiert, brechen wir ab.
    if (document.getElementById(sidebarId)) return;

    // 1. Sidebar HTML injizieren
    document.body.insertAdjacentHTML('beforeend', createSidebarHtml());
    
    const sidebar = document.getElementById(sidebarId);
    
    // 2. FIX: Event Listener für den Schließen-Button
    document.getElementById("sc-designer-sidebar-close").addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // 3. Message Listener für das Umschalten der Sidebar (von background.js)
    browser.runtime.onMessage.addListener(msg => {
        // Logik für den Action-Button (Browser-Icon)
        if (msg.type === "toggleSidebar") {
            sidebar.classList.toggle('open');
            return;
        }
        
        // Listener für allgemeine Theme-Updates
        if (msg.type === "updateTheme") {
            const { bgImage, bgColor } = msg.data;
            if (bgImage) setBackground(bgImage);
            if (bgColor) setPrimaryColor(bgColor);
        }
    });
    
    // 4. Lade gespeicherte Werte und setze die UI
    browser.storage.local.get([
        "bgImage", 
        "bgColor", 
        "fsBgType", 
        "fsBlurStrength", 
        "fsTransColor", 
        "fsTransStrength", 
        "fsNormalColor"
    ]).then(settings => {
        // Standardwert setzen
        settings.fsBgType = settings.fsBgType || "blurry";
        
        // Theme-Werte in Felder setzen
        if (settings.bgImage) document.getElementById("bgImage").value = settings.bgImage;
        if (settings.bgColor) document.getElementById("bgColor").value = settings.bgColor;

        // Fullscreen-Werte: Radio Button setzen
        const fsBgTypeRadio = document.getElementById(`fsBgType${settings.fsBgType.charAt(0).toUpperCase() + settings.fsBgType.slice(1)}`);
        if (fsBgTypeRadio) fsBgTypeRadio.checked = true;
        
        // Range-Slider und deren Wertanzeige initialisieren
        const rangeInputs = [
            { range: "fsBlurStrength", value: "fsBlurValue", defaultVal: 10 },
            { range: "fsTransStrength", value: "fsTransValue", defaultVal: 40 }
        ];

        rangeInputs.forEach(item => {
            const range = document.getElementById(item.range);
            const value = document.getElementById(item.value);
            if (range && value) {
                // Wert aus Settings oder Standardwert verwenden
                range.value = settings[item.range] || item.defaultVal; 
                value.textContent = range.value;
                range.addEventListener("input", (e) => {
                    value.textContent = e.target.value;
                });
            }
        });
        
        // Input-Werte für Farben
        document.getElementById("fsTransColor").value = settings.fsTransColor || "#000000";
        document.getElementById("fsNormalColor").value = settings.fsNormalColor || "#000000";

        // UI der Fullscreen-Optionen initialisieren
        setOptionVisibility(settings.fsBgType);

        // Event-Listener für Radio-Buttons
        document.querySelectorAll('input[name="fsBgType"]').forEach(radio => {
            radio.addEventListener("change", (e) => {
                setOptionVisibility(e.target.value);
            });
        });
    });


    // 5. Event Listener für Speichern-Buttons
    document.getElementById("applyBtn").addEventListener("click", saveThemeSettings);
    document.getElementById("fsApplyBtn").addEventListener("click", saveAllSettings);
}

// ===============================
// 5. Theme Apply Funktionen
// ===============================

/** Wendet das Hintergrundbild an */
function setBackground(url) {
    const root = document.querySelector(":root");
    root.style.setProperty("--bg-body", `url(\"${url}\")`);
    // Fallback/Direct-Apply auf Body
    document.body.style.setProperty("background-image", `url(\"${url}\")`, "important");
    document.body.style.setProperty("background-size", "cover", "important");
    document.body.style.setProperty("background-repeat", "no-repeat", "important");
    document.body.style.setProperty("background-position", "center", "important");
    document.body.style.setProperty("background-attachment", "fixed", "important");
}

/** Wendet die primäre Akzentfarbe an */
function setPrimaryColor(color) {
    const root = document.querySelector(":root");
    root.style.setProperty("--btn-primary", color);
}


// ===============================
// 6. Initialer Theme-Load und Sidebar-Start
// ===============================

// Theme beim Laden der Seite anwenden (für den ersten Render)
browser.storage.local.get(["bgImage", "bgColor"]).then(result => {
    if (result.bgImage) setBackground(result.bgImage);
    if (result.bgColor) setPrimaryColor(result.bgColor);
});

// WICHTIG: Die Initialisierung der Sidebar starten, sobald der DOM bereit ist
window.addEventListener('load', initDesignerSidebar);