// ===============================
// Fullscreen Background Setting Helpers
// ===============================

/**
 * Ruft die gespeicherten Fullscreen-Einstellungen ab und verwendet Standardwerte falls nicht vorhanden.
 * @returns {Promise<object>} Die Fullscreen-Einstellungen.
 */
async function getFullscreenSettings() {
    const defaultSettings = {
        fsBgType: "blurry",
        fsBlurStrength: 10,
        fsTransColor: "#000000",
        fsTransStrength: 40, // 40%
        fsNormalColor: "#000000"
    };
    const stored = await browser.storage.local.get([
        "fsBgType", "fsBlurStrength", "fsTransColor", "fsTransStrength", "fsNormalColor"
    ]);
    return { ...defaultSettings, ...stored };
}

/**
 * Konvertiert einen Hex-Farbcode und einen Opazitätswert (0-100) in einen RGBA-String.
 * @param {string} hex - Der Hex-Farbcode (z.B. "#000000").
 * @param {number} alpha - Der Opazitätswert in Prozent (0 bis 100).
 * @returns {string} Der RGBA-Farbstring.
 */
function hexToRgba(hex, alpha) {
    // Konvertiere alpha (0-100) zu Opazität (0.0-1.0)
    const opacity = parseFloat(alpha) / 100; 

    if (!hex || !hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) {
        hex = "#000000"; // Fallback
    }
    
    // Für kürzere Hex-Codes (z.B. #000)
    if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Wendet die Fullscreen-Stile basierend auf den Einstellungen auf das Overlay an.
 * @param {HTMLElement} overlay - Das Haupt-Overlay-Element (#sc-fs-overlay).
 * @param {HTMLElement} fsBg - Das Hintergrund-Element (#sc-fs-bg).
 * @param {object} settings - Die geladenen Einstellungen.
 */
function applyFullscreenStyle(overlay, fsBg, settings) {
    // Styles zurücksetzen
    overlay.style.backdropFilter = '';
    overlay.style.background = '';
    if (fsBg) {
        fsBg.style.background = '';
        fsBg.style.display = 'block'; // Sicherstellen, dass es sichtbar ist
    }
    
    if (settings.fsBgType === "blurry") {
        // Blurry: backdrop-filter auf das Overlay, Kontrast-Schleier auf fsBg
        overlay.style.backdropFilter = `blur(${settings.fsBlurStrength}px)`;
        overlay.style.background = `transparent`; 
        if (fsBg) fsBg.style.background = `rgba(0, 0, 0, 0.4)`; 
        
    } else if (settings.fsBgType === "transparent") {
        // Transparent Color
        const rgbaColor = hexToRgba(settings.fsTransColor, settings.fsTransStrength);
        overlay.style.backdropFilter = `none`;
        overlay.style.background = `transparent`;
        if (fsBg) fsBg.style.background = rgbaColor;
        
    } else if (settings.fsBgType === "color") {
        // Solid Color
        overlay.style.backdropFilter = `none`;
        overlay.style.background = settings.fsNormalColor;
        if (fsBg) fsBg.style.display = 'none'; // fsBg bei Vollfarbe ausblenden
    }
}

/**
 * Aktualisiert den Stil des bereits geöffneten Fullscreen-Overlays.
 */
async function updateFullscreenStyle() {
    const overlay = document.getElementById('sc-fs-overlay');
    const fsBg = document.getElementById('sc-fs-bg');
    if (!overlay) return; // Nur aktualisieren, wenn es offen ist

    const settings = await getFullscreenSettings();
    applyFullscreenStyle(overlay, fsBg, settings);
}


// ===============================
// SoundCloud Fullscreen Player Helper
// ===============================

// ---- Helper: Background-image URL extrahieren ----
function extractUrlFromBg(bgValue) {
    if (!bgValue) return null;
    const m = bgValue.match(/url\(["']?(.*?)["']?\)/);
    return m ? m[1] : null;
}

// ---- Artwork-URL aus Badge holen ----
function getArtworkUrlFromBadge(badgeEl) {
    if (!badgeEl) return null;
    const span = badgeEl.querySelector(
        '.playbackSoundBadge__avatar .image span.image__full, ' +
        '.playbackSoundBadge__avatar .image span[style*="background-image"]'
    );
    if (!span) return null;
    const bg = getComputedStyle(span).backgroundImage;
    const url = extractUrlFromBg(bg);
    if (!url) return null;
    // URL auf 500x500 Cover-Größe umstellen
    return url.replace(/-t\d+x\d+(\.jpg|\.png)?$/, '-t500x500.jpg');
}

// ---- Klick-Simulation für SC-Player ----
function clickSC(selector) {
    const el = document.querySelector(selector);
    if (el) el.click();
}

// ===============================
// Fullscreen Overlay erstellen
// ===============================
async function openFullscreenForBadge(badgeEl) {
    if (!badgeEl) return;

    // 1. Einstellungen laden
    const settings = await getFullscreenSettings();

    // 2. Vorhandenes Overlay entfernen
    const old = document.getElementById("sc-fs-overlay");
    if (old) old.remove();

    // 3. Overlay und Hintergrund-Elemente erstellen
    const overlay = document.createElement("div");
    overlay.id = "sc-fs-overlay";

    const fsBg = document.createElement("div");
    fsBg.id = "sc-fs-bg";
    overlay.appendChild(fsBg); // Wichtig: fsBg muss zuerst eingefügt werden

    // 4. Hintergrund-Styling basierend auf Einstellungen anwenden (NEU: Funktion aufrufen)
    applyFullscreenStyle(overlay, fsBg, settings);

    // Cover
    const cover = document.createElement("img");
    cover.id = "sc-fs-cover";

    // Controls
    const controls = document.createElement("div");
    controls.id = "sc-fs-controls";

    // Close-Button
    const closeBtn = document.createElement("button");
    closeBtn.id = "sc-fs-close";
    closeBtn.innerText = "✕";
    closeBtn.addEventListener("click", () => {
        try { document.exitFullscreen(); } catch (e) {}
        overlay.remove();
    });

    // ---- SVG Buttons ----
    const svgPrev = `<svg viewBox="0 0 24 24"><path d="M4.44444 3C4.19898 3 4 3.20147 4 3.45V20.55C4 20.7985 4.19898 21 4.44444 21H6.22222C6.46768 21 6.66667 20.7985 6.66667 20.55V12.5625L19.32 20.5697C19.616 20.757 20 20.5415 20 20.1881V3.81191C20 3.45847 19.616 3.24299 19.32 3.43031L6.66667 11.4375V3.45C6.66667 3.20147 6.46768 3 6.22222 3H4.44444Z"/></svg>`;
    const svgNext = `<svg viewBox="0 0 24 24"><path d="M17.7778 3C17.5323 3 17.3333 3.20147 17.3333 3.45V11.4375L4.68 3.43031C4.38398 3.24299 4 3.45847 4 3.81191V20.1881C4 20.5415 4.38398 20.757 4.68 20.5697L17.3333 12.5625V20.55C17.3333 20.7985 17.5323 21 17.7778 21H19.5556C19.801 21 20 20.7985 20 20.55V3.45C20 3.20147 19.801 3 19.5556 3H17.7778Z"/></svg>`;
    const svgPlay = `<svg viewBox="0 0 16 16"><path d="M12.322 7.576a.5.5 0 0 1 0 .848l-6.557 4.098A.5.5 0 0 1 5 12.098V3.902a.5.5 0 0 1 .765-.424l6.557 4.098Z"/></svg>`;
    const svgPause = `<svg viewBox="0 0 24 24"><path d="M10 4.5c0-.276-.252-.5-.563-.5H5.563C5.252 4 5 4.224 5 4.5v15c0 .276.252.5.563.5h3.875c.31 0 .562-.224.562-.5v-15ZM19 4.5c0-.276-.252-.5-.563-.5h-3.875c-.31 0-.562.224-.562.5v15c0 .276.252.5.563.5h3.874c.311 0 .563-.224.563-.5v-15Z"/></svg>`;
    
    function makeSvgButton(svg, extra = "") {
        const b = document.createElement("button");
        b.className = `sc-fs-btn ${extra}`;
        b.innerHTML = svg;
        return b;
    }
    
    const btnPrev = makeSvgButton(svgPrev, "sc-fs-prev");
    const btnPlay = makeSvgButton(svgPlay, "sc-fs-play");
    const btnPause = makeSvgButton(svgPause, "sc-fs-pause");
    const btnNext = makeSvgButton(svgNext, "sc-fs-next");
    btnPause.style.display = "none";
    
    btnPrev.addEventListener("click", () => {
        clickSC(".playControls__prev");
        clickSC(".skipControl__previous");
        setTimeout(updateCover, 200);
    });
    btnNext.addEventListener("click", () => {
        clickSC(".playControls__next");
        clickSC(".skipControl__next");
        setTimeout(updateCover, 200);
    });
    
    function togglePlay() {
        clickSC(".playControls__playPause");
        clickSC(".playControl");
        setTimeout(syncPlayPauseButtons, 150);
    }
    btnPlay.addEventListener("click", togglePlay);
    btnPause.addEventListener("click", togglePlay);
    
    controls.appendChild(btnPrev);
    controls.appendChild(btnPlay);
    controls.appendChild(btnPause);
    controls.appendChild(btnNext);
    
    // 5. Elemente dem DOM hinzufügen (Reihenfolge ist wichtig)
    // fsBg wurde bereits hinzugefügt
    overlay.appendChild(cover);
    overlay.appendChild(controls);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    function updateCover() {
        const url = getArtworkUrlFromBadge(badgeEl);
        if (url && cover.src !== url) cover.src = url;
        syncPlayPauseButtons();
    }
    updateCover();
    
    //overlay.requestFullscreen?.();
    overlay.style.opacity = "1";
    
    function syncPlayPauseButtons() {
        const playBtn = document.querySelector(".playControls__playPause, .playControl");
        const isPlaying = playBtn?.classList.contains("playing") || playBtn?.getAttribute("aria-pressed") === "true";
        btnPlay.style.display = isPlaying ? "none" : "flex";
        btnPause.style.display = isPlaying ? "flex" : "none";
    }
    syncPlayPauseButtons();
    
    // Hover → Controls sichtbar
    let hideTimer = null;
    function showControls() {
        controls.style.opacity = "1";
        closeBtn.style.opacity = "1";
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            controls.style.opacity = "0";
            closeBtn.style.opacity = "0";
        }, 2000);
    }
    overlay.addEventListener("mousemove", showControls);
    showControls();
    
    const obs = new MutationObserver(updateCover);
    obs.observe(badgeEl, { childList: true, subtree: true, attributes: true });
}

// ===============================
// Fullscreen-Button in Badges einfügen
// ===============================
function addButtonsToBadges() {
    const badges = document.querySelectorAll(".playbackSoundBadge");
    badges.forEach(badge => {
        const actions = badge.querySelector(".playbackSoundBadge__actions");
        if (!actions || actions.querySelector(".sc-fs-inserted")) return;
        
        const btn = document.createElement("button");
        btn.className = "sc-fs-inserted sc-button sc-button-secondary sc-button-small";
        btn.title = "Fullscreen Player";
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" fill="none"stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.33">  <path d="M33 6H42V15"/>  <path d="M42 33V42H33"/>  <path d="M15 42H6V33"/>  <path d="M6 15V6H15"/></svg>`;
        
        btn.addEventListener("click", e => {
            e.stopPropagation();
            openFullscreenForBadge(badge);
        });
        
        const queue = actions.querySelector(".playbackSoundBadge__showQueue");
        if (queue) queue.insertAdjacentElement("afterend", btn);
        else actions.appendChild(btn);
    });
}

// ===============================
// Nachricht-Listener (von content.js)
// ===============================

// Hört auf Nachrichten, die nach dem Speichern der Einstellungen gesendet werden
browser.runtime.onMessage.addListener(msg => {
    if (msg.type === "updateThemeAndFullscreen") {
        // Überprüfe, ob der Fullscreen-Player gerade sichtbar ist, und aktualisiere den Stil
        if (document.getElementById('sc-fs-overlay')) {
            updateFullscreenStyle(); 
        }
    }
});


// SPA-Observer
const mainObserver = new MutationObserver(addButtonsToBadges);
mainObserver.observe(document.body, { childList: true, subtree: true });

// Initial
addButtonsToBadges();
setTimeout(addButtonsToBadges, 800);
setTimeout(addButtonsToBadges, 2000);