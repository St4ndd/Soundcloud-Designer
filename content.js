// content.js - Komplette Datei mit Sidebar-Logik und Theme-Erweiterungen

// Sicherstellen, dass die Browser-API (z.B. Chrome oder Firefox) korrekt zugewiesen ist
const browser = (typeof chrome !== 'undefined') ? chrome : browser;


// ===============================
// 0. Hilfsfunktionen
// ===============================

/**
 * Konvertiert einen Hex-Farbcode und einen Opazitätswert (0-100) in einen RGBA-String.
 * @param {string} hex - Der Hex-Farbcode (z.B. "#000000").
 * @param {number} alpha - Der Opazitätswert in Prozent (0 bis 100).
 * @returns {string} Der RGBA-Farbstring.
 */
function hexToRgba(hex, alpha) {
    const opacity = parseFloat(alpha) / 100;
    
    let r = 0, g = 0, b = 0;
    const cleanHex = hex.startsWith('#') ? hex.substring(1) : hex;
    
    if (cleanHex.length === 3) { // RGB
        r = parseInt(cleanHex[0] + cleanHex[0], 16);
        g = parseInt(cleanHex[1] + cleanHex[1], 16);
        b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) { // RRGGBB
        r = parseInt(cleanHex.substring(0, 2), 16);
        g = parseInt(cleanHex.substring(2, 4), 16);
        b = parseInt(cleanHex.substring(4, 6), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
}

/** Steuert die Sichtbarkeit der Options-Gruppen (Blurry, Transparent, Color) für Player Bar und Header */
function setOptionVisibility(groupName, type) {
    const parentId = groupName === "playerBarBgType" ? "playerBar" : "header";

    const blurryOptions = document.getElementById(`${parentId}BlurryOptions`);
    const transparentOptions = document.getElementById(`${parentId}TransparentOptions`);
    const colorOptions = document.getElementById(`${parentId}ColorOptions`);

    if (blurryOptions) blurryOptions.style.display = type === "blurry" ? "block" : "none";
    if (transparentOptions) transparentOptions.style.display = type === "transparent" ? "block" : "none";
    if (colorOptions) colorOptions.style.display = type === "color" ? "block" : "none";
}


// ===============================
// 1. Sidebar HTML-Struktur
// ===============================
// (Diese Funktion bleibt unverändert)
function createSidebarHtml() {
    return `
        <div id="sc-designer-sidebar">
            <button id="sc-designer-sidebar-close">x</button>
            <h2>SoundCloud Designer</h2>

            <h3>Custom Theme</h3>
            <label for="bgImage">Background Image URL:</label>
            <input type="text" id="bgImage" placeholder="Enter URL" value="">
            <label for="bgColor">Primary Button Color (Hex):</label>
            <input type="text" id="bgColor" placeholder="#1761df" value="">
            
            <hr>
            
            <h4>Upgrade / Subscription Buttons</h4>
            <div class="checkbox-group">
                <label>
                    <input type="checkbox" id="hideUpgradeBtn"> Buttons ausblenden
                </label>
            </div>
            <label for="upgradeBtnColor">Button Farbe (Hex):</label>
            <input type="text" id="upgradeBtnColor" placeholder="#ff5500" value="">
            
            <hr>

            <h4>Bottom Bar / Play Controls</h4>
            <div class="radio-group" style="margin-bottom: 20px;">
                <label>
                    <input type="radio" name="playerBarBgType" value="blurry" id="playerBarBgTypeBlurry" checked> Blurry (Transparenz + Blur)
                </label>
                <label>
                    <input type="radio" name="playerBarBgType" value="transparent" id="playerBarBgTypeTransparent"> Transparente Farbe
                </label>
                <label>
                    <input type="radio" name="playerBarBgType" value="color" id="playerBarBgTypeColor"> Einfarbige Füllung
                </label>
            </div>
            
            <div id="playerBarBlurryOptions">
                <label for="playerBarBlurStrength">Blur Stärke (0-30): <span id="playerBarBlurValue">10</span></label>
                <input type="range" id="playerBarBlurStrength" min="0" max="30" value="10">
            </div>

            <div id="playerBarTransparentOptions" style="display: none;">
                <label for="playerBarTransColor">Farbe:</label>
                <input type="text" id="playerBarTransColor" placeholder="#000000" value="#000000">
                <label for="playerBarTransStrength">Transparenz (%): <span id="playerBarTransValue">50</span></label>
                <input type="range" id="playerBarTransStrength" min="0" max="100" value="50">
            </div>

            <div id="playerBarColorOptions" style="display: none;">
                <label for="playerBarNormalColor">Einfarbige Füllung:</label>
                <input type="text" id="playerBarNormalColor" placeholder="#000000" value="#000000">
            </div>
            
            <hr>

            <h4>Header (Top Navigation Bar)</h4>
            <div class="radio-group" style="margin-bottom: 20px;">
                <label>
                    <input type="radio" name="headerBgType" value="blurry" id="headerBgTypeBlurry" checked> Blurry (Transparenz + Blur)
                </label>
                <label>
                    <input type="radio" name="headerBgType" value="transparent" id="headerBgTypeTransparent"> Transparente Farbe
                </label>
                <label>
                    <input type="radio" name="headerBgType" value="color" id="headerBgTypeColor"> Einfarbige Füllung
                </label>
            </div>
            
            <div id="headerBlurryOptions">
                <label for="headerBlurStrength">Blur Stärke (0-30): <span id="headerBlurValue">8</span></label>
                <input type="range" id="headerBlurStrength" min="0" max="30" value="8">
            </div>

            <div id="headerTransparentOptions" style="display: none;">
                <label for="headerTransColor">Farbe:</label>
                <input type="text" id="headerTransColor" placeholder="#000000" value="#000000">
                <label for="headerTransStrength">Transparenz (%): <span id="headerTransValue">40</span></label>
                <input type="range" id="headerTransStrength" min="0" max="100" value="40">
            </div>

            <div id="headerColorOptions" style="display: none;">
                <label for="headerNormalColor">Einfarbige Füllung:</label>
                <input type="text" id="headerNormalColor" placeholder="#000000" value="#000000">
            </div>
            
            <hr>
            
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
                    <input type="radio" name="fsBgType" value="color" id="fsBgTypeColor"> Color
                </label>
            </div>

            <div id="fsBlurryOptions">
                <label for="fsBlurStrength">Blur Strength (0-30): <span id="fsBlurValue">10</span></label>
                <input type="range" id="fsBlurStrength" min="0" max="30" value="10">
            </div>

            <div id="fsTransparentOptions" style="display: none;">
                <label for="fsTransColor">Color:</label>
                <input type="text" id="fsTransColor" placeholder="#000000" value="#000000">
                <label for="fsTransStrength">Transparency (%): <span id="fsTransValue">40</span></label>
                <input type="range" id="fsTransStrength" min="0" max="100" value="40">
            </div>

            <div id="fsColorOptions" style="display: none;">
                <label for="fsNormalColor">Solid Color:</label>
                <input type="text" id="fsNormalColor" placeholder="#000000" value="#000000">
            </div>
            
            <button id="fsApplyBtn" style="display: none;">Save Fullscreen Settings</button>
        </div>
    `;
}

// ===============================
// 2. Sidebar Kontrollen
// ===============================

/** Fügt die Sidebar in das Dokument ein, falls sie nicht existiert. */
function ensureSidebarExists() {
    if (!document.getElementById("sc-designer-sidebar")) {
        const sidebarHtml = createSidebarHtml();
        document.body.insertAdjacentHTML('beforeend', sidebarHtml);
        setupListeners();
        // Lade die Einstellungen, nachdem die Elemente hinzugefügt wurden
        loadSettings();
    }
}

/** Zeigt oder versteckt die Sidebar. */
function toggleSidebar() {
    ensureSidebarExists();
    const sidebar = document.getElementById("sc-designer-sidebar");
    if (sidebar) {
        sidebar.classList.toggle("open");
    }
}


// ===============================
// 3. Einstellungen Speichern/Laden
// ===============================

/** Speichert alle Einstellungen und wendet das Theme an. */
async function saveAllSettings() {
    let bgImage = document.getElementById("bgImage") ? document.getElementById("bgImage").value.trim() : ""; 
    
    // KORREKTUR: Wenn das Feld leer ist, speichere den lokalen Dateinamen als Platzhalter. 
    if (!bgImage) {
        bgImage = "blue_space_8k.jpg";
    }
    
    const bgColor = document.getElementById("bgColor") ? document.getElementById("bgColor").value : "#1761df";

    // NEU: Upgrade Button
    const hideUpgradeBtn = document.getElementById("hideUpgradeBtn") ? document.getElementById("hideUpgradeBtn").checked : false;
    const upgradeBtnColor = document.getElementById("upgradeBtnColor") ? document.getElementById("upgradeBtnColor").value : "#ff5500";
    
    // NEU: Player Bar
    // Verwende den Standardwert als Fallback, falls das Radio-Element fehlt (sollte nicht passieren)
    const playerBarBgTypeElement = document.querySelector('input[name="playerBarBgType"]:checked');
    const playerBarBgType = playerBarBgTypeElement ? playerBarBgTypeElement.value : "blurry";
    
    const playerBarBlurStrength = document.getElementById("playerBarBlurStrength") ? document.getElementById("playerBarBlurStrength").value : 10;
    const playerBarTransColor = document.getElementById("playerBarTransColor") ? document.getElementById("playerBarTransColor").value : "#000000";
    const playerBarTransStrength = document.getElementById("playerBarTransStrength") ? document.getElementById("playerBarTransStrength").value : 50;
    const playerBarNormalColor = document.getElementById("playerBarNormalColor") ? document.getElementById("playerBarNormalColor").value : "#000000";
    
    // NEU: Header
    // Verwende den Standardwert als Fallback
    const headerBgTypeElement = document.querySelector('input[name="headerBgType"]:checked');
    const headerBgType = headerBgTypeElement ? headerBgTypeElement.value : "blurry";
    
    const headerBlurStrength = document.getElementById("headerBlurStrength") ? document.getElementById("headerBlurStrength").value : 8;
    const headerTransColor = document.getElementById("headerTransColor") ? document.getElementById("headerTransColor").value : "#000000";
    const headerTransStrength = document.getElementById("headerTransStrength") ? document.getElementById("headerTransStrength").value : 40;
    const headerNormalColor = document.getElementById("headerNormalColor") ? document.getElementById("headerNormalColor").value : "#000000";

    // Bestehende Fullscreen Settings (Unverändert)
    const fsBgTypeElement = document.querySelector('input[name="fsBgType"]:checked');
    const fsBgType = fsBgTypeElement ? fsBgTypeElement.value : "blurry";

    const fsBlurStrength = document.getElementById("fsBlurStrength") ? document.getElementById("fsBlurStrength").value : 10;
    const fsTransColor = document.getElementById("fsTransColor") ? document.getElementById("fsTransColor").value : "#000000";
    const fsTransStrength = document.getElementById("fsTransStrength") ? document.getElementById("fsTransStrength").value : 40;
    const fsNormalColor = document.getElementById("fsNormalColor") ? document.getElementById("fsNormalColor").value : "#000000";


    const settings = {
        bgImage, // Speichere den bereinigten/Standardwert
        bgColor,
        hideUpgradeBtn,
        upgradeBtnColor,
        playerBarBgType,
        playerBarBlurStrength,
        playerBarTransColor,
        playerBarTransStrength,
        playerBarNormalColor,
        headerBgType,
        headerBlurStrength,
        headerTransColor,
        headerTransStrength,
        headerNormalColor,
        fsBgType, // Fullscreen Settings
        fsBlurStrength,
        fsTransColor,
        fsTransStrength,
        fsNormalColor,
    };

    await browser.storage.local.set(settings);
    applyTheme(settings);
    
    // Sende Nachricht an andere Skripte (z.B. fullscreen.js), um Theme zu aktualisieren
    browser.runtime.sendMessage({ type: "updateThemeAndFullscreen" }).catch(err => console.log("Update message failed:", err));
}

/**
 * Lädt die gespeicherten Einstellungen aus dem Browser Storage und wendet alle Theme-Styles an.
 * Dies wird beim Start des Scripts und nach dem Speichern neuer Einstellungen aufgerufen.
 */
async function loadSettings() {
    // Standardwerte für alle dynamischen und gespeicherten Elemente
    const defaultSettings = {
        // Theme / Allgemein
        backgroundImage: "blue_space_8k.jpg",

        // Header
        headerBgType: "blurry",
        headerBlurStrength: 8,
        headerTransStrength: 70, // 70% Opazität für Blur/Trans
        headerColor: "#000000", // Farbe für Blur/Trans

        // Player Bar (FIX)
        playerBarBgType: "blurry",
        playerBarBlurStrength: 10,
        playerBarTransStrength: 70, // 70% Opazität für Blur/Trans
        playerBarColor: "#000000", // Farbe für Blur/Trans

        // Upgrade Button
        hideUpgradeButton: false,
        upgradeButtonColor: "#ff5500",
    };

    // Keys, die aus dem Storage abgerufen werden sollen
    const allKeys = [
        "backgroundImage",
        "headerBgType", "headerBlurStrength", "headerTransStrength", "headerColor",
        "playerBarBgType", "playerBarBlurStrength", "playerBarTransStrength", "playerBarColor",
        "hideUpgradeButton", "upgradeButtonColor"
    ];

    try {
        const stored = await browser.storage.local.get(allKeys);
        // Die gespeicherten Einstellungen mit den Standardwerten zusammenführen
        const settings = { ...defaultSettings, ...stored };

        // 1. Allgemeine Theme-Styles anwenden (falls vorhanden)
        // Muss existieren und z.B. das --bg-body setzen
        if (typeof applyThemeStyles === 'function') {
            applyThemeStyles(settings);
        } else {
            // Mindestens das Hintergrundbild direkt setzen
            document.documentElement.style.setProperty('--bg-body', `url("${settings.backgroundImage}")`);
        }

        // 2. Header Styles anwenden
        applyHeaderStyles(settings);

        // 3. Player Bar Styles anwenden (DIES IST DER FIX)
        applyPlayerBarStyles(settings);

        // 4. Upgrade Button Styles anwenden
        applyUpgradeButtonStyles(settings);

    } catch (err) {
        console.error("Fehler beim Laden oder Anwenden der Einstellungen:", err);
        // Fallback: Wende Standardeinstellungen an, wenn Storage fehlschlägt
        // Dies verhindert, dass der Player Bar komplett unsichtbar wird.
        applyPlayerBarStyles(defaultSettings);
        applyHeaderStyles(defaultSettings);
    }
}


// ===============================
// 4. Event Listener (MIT ROBUSTEN CHECKS)
// ===============================

function setupListeners() {
    // Schließen-Button
    const closeBtn = document.getElementById("sc-designer-sidebar-close");
    if(closeBtn) closeBtn.addEventListener("click", toggleSidebar);

    // Apply Button (speichert alle Einstellungen)
    const applyBtn = document.getElementById("applyBtn");
    if(applyBtn) applyBtn.addEventListener("click", saveAllSettings);
    
    // ==================
    // Player Bar Listeners
    // ==================
    
    // Player Bar Radio Listeners
    document.querySelectorAll('input[name="playerBarBgType"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            setOptionVisibility("playerBarBgType", e.target.value);
        });
    });
    
    // Sliders für Player Bar (mit Null-Checks)
    const pBarBlurRange = document.getElementById("playerBarBlurStrength");
    const pBarBlurVal = document.getElementById("playerBarBlurValue");
    if (pBarBlurRange && pBarBlurVal) {
        pBarBlurRange.addEventListener("input", (e) => { 
            pBarBlurVal.textContent = e.target.value; 
        });
    }

    const pBarTransRange = document.getElementById("playerBarTransStrength");
    const pBarTransVal = document.getElementById("playerBarTransValue");
    if (pBarTransRange && pBarTransVal) {
        pBarTransRange.addEventListener("input", (e) => { 
            pBarTransVal.textContent = e.target.value; 
        });
    }

    // ==================
    // Header Listeners
    // ==================

    // Header Radio Listeners
    document.querySelectorAll('input[name="headerBgType"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            setOptionVisibility("headerBgType", e.target.value);
        });
    });
    
    // Sliders für Header (mit Null-Checks)
    const headerBlurRange = document.getElementById("headerBlurStrength");
    const headerBlurVal = document.getElementById("headerBlurValue");
    if (headerBlurRange && headerBlurVal) {
        headerBlurRange.addEventListener("input", (e) => { 
            headerBlurVal.textContent = e.target.value; 
        });
    }

    const headerTransRange = document.getElementById("headerTransStrength");
    const headerTransVal = document.getElementById("headerTransValue");
    if (headerTransRange && headerTransVal) {
        headerTransRange.addEventListener("input", (e) => { 
            headerTransVal.textContent = e.target.value; 
        });
    }

    // ==================
    // Fullscreen Listeners (Unverändert, aber in Checks)
    // ==================

    // Logik für Fullscreen Options-Sichtbarkeit
    const fsSetOptionVisibility = (type) => {
        const blurryOptions = document.getElementById("fsBlurryOptions");
        const transparentOptions = document.getElementById("fsTransparentOptions");
        const colorOptions = document.getElementById("fsColorOptions");

        if (blurryOptions) blurryOptions.style.display = type === "blurry" ? "block" : "none";
        if (transparentOptions) transparentOptions.style.display = type === "transparent" ? "block" : "none";
        if (colorOptions) colorOptions.style.display = type === "color" ? "block" : "none";
    };

    document.querySelectorAll('input[name="fsBgType"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            fsSetOptionVisibility(e.target.value);
        });
    });

    // Slider-Wert Anzeige (Fullscreen)
    const fsBlurRange = document.getElementById("fsBlurStrength");
    const fsBlurVal = document.getElementById("fsBlurValue");
    if (fsBlurRange && fsBlurVal) {
        fsBlurRange.addEventListener("input", (e) => {
            fsBlurVal.textContent = e.target.value;
        });
    }
    const fsTransRange = document.getElementById("fsTransStrength");
    const fsTransVal = document.getElementById("fsTransValue");
    if (fsTransRange && fsTransVal) {
        fsTransRange.addEventListener("input", (e) => {
            fsTransVal.textContent = e.target.value;
        });
    }
}


// ===============================
// 5. Theme Apply Funktionen
// ===============================

/** Kombinierte Funktion, um alle Theme-Einstellungen anzuwenden */
function applyTheme(settings) {
    setBackground(settings.bgImage);
    setPrimaryColor(settings.bgColor);
    applyUpgradeButtonStyles(settings); // <-- Upgrade Button Logic
    applyPlayerBarStyles(settings);     // <-- Player Bar Logic
    applyHeaderStyles(settings);        // <-- Header Logic
}

/** Wendet das Hintergrundbild an */
function setBackground(url) {
    let finalUrl = url;
    if (url === "blue_space_8k.jpg") {
        finalUrl = browser.runtime.getURL(url);
    }
    
    const root = document.querySelector(":root");
    root.style.setProperty("--bg-body", `url("${finalUrl}")`);
    // Fallback/Direct-Apply auf Body
    document.body.style.setProperty("background-image", `url("${finalUrl}")`, "important");
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

/**
 * Wendet die dynamischen Stile für die Player Bar unten an.
 * Setzt die CSS-Variablen --player-bar-bg-color und --player-bar-backdrop-filter.
 * @param {object} settings - Die gespeicherten Theme-Einstellungen.
 */
function applyPlayerBarStyles(settings) {
    const root = document.documentElement;
    const { playerBarBgType, playerBarBlurStrength, playerBarTransStrength, playerBarColor } = settings;

    let bgColor = 'initial';
    let backdropFilter = 'none';

    if (playerBarBgType === 'blurry') {
        bgColor = hexToRgba(playerBarColor, playerBarTransStrength);
        backdropFilter = `blur(${playerBarBlurStrength}px)`;
    } else if (playerBarBgType === 'transparent') {
        bgColor = hexToRgba(playerBarColor, playerBarTransStrength);
        backdropFilter = 'none';
    } else if (playerBarBgType === 'normal') {
        bgColor = playerBarColor;
        backdropFilter = 'none';
    }

    root.style.setProperty('--player-bar-bg-color', bgColor);
    root.style.setProperty('--player-bar-backdrop-filter', backdropFilter);
}

// --------------------------------------------------------------------------------

/**
 * Wendet die dynamischen Stile für den Header oben an.
 * Setzt die CSS-Variablen --header-bg-color und --header-backdrop-filter.
 * @param {object} settings - Die gespeicherten Theme-Einstellungen.
 */
function applyHeaderStyles(settings) {
    const root = document.documentElement;
    const { headerBgType, headerBlurStrength, headerTransStrength, headerColor } = settings;

    let bgColor = 'initial';
    let backdropFilter = 'none';

    if (headerBgType === 'blurry') {
        bgColor = hexToRgba(headerColor, headerTransStrength);
        backdropFilter = `blur(${headerBlurStrength}px)`;
    } else if (headerBgType === 'transparent') {
        bgColor = hexToRgba(headerColor, headerTransStrength);
        backdropFilter = 'none';
    } else if (headerBgType === 'normal') {
        bgColor = headerColor;
        backdropFilter = 'none';
    }

    root.style.setProperty('--header-bg-color', bgColor);
    root.style.setProperty('--header-backdrop-filter', backdropFilter);
}

// --------------------------------------------------------------------------------

/**
 * Wendet die dynamischen Stile für den Upgrade-Button an.
 * @param {object} settings - Die gespeicherten Theme-Einstellungen.
 */
function applyUpgradeButtonStyles(settings) {
    const root = document.documentElement;
    
    // Sichtbarkeit (block/none)
    const displayValue = settings.hideUpgradeButton ? 'none' : 'block';
    root.style.setProperty('--upgrade-btn-visibility', displayValue);
    
    // Farbe
    root.style.setProperty('--upgrade-btn-custom-color', settings.upgradeButtonColor);
}


// ===============================
// 6. Messaging und Initialisierung
// ===============================

/** Beobachter für die Seiten-Container, um die Klasse zum Z-Index Fix anzuwenden */
function setupObserver() {
    const observer = new MutationObserver((mutationsList, observer) => {
        // Suche nach dem Element, das den Inhalt überdeckt
        const overlayContainer = document.querySelector(".sc-design-overlay-container");
        if (overlayContainer) {
            // Dies ist ein alter Fix, der hier beibehalten wird, um die Sidebar sichtbar zu halten
            if (!overlayContainer.classList.contains('designer-active')) {
                overlayContainer.classList.add('designer-active');
            }
        }
    });

    // Beginne mit der Beobachtung des 'body' Elements für Änderungen der Unterstruktur
    observer.observe(document.body, { childList: true, subtree: true });
}


/** Initialisiert die Skript-Logik */
function init() {
    // 1. Nachrichten-Listener für das Öffnen/Schließen der Sidebar vom Background-Script
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "toggleSidebar") {
            toggleSidebar();
        }
    });

    // 2. Initiales Theme laden und anwenden (schnell, bevor Observer startet)
    loadSettings().catch(err => console.error("Fehler beim initialen Laden der Einstellungen:", err));

    // 3. Observer starten
    setupObserver();
}

// Skript-Start
init();