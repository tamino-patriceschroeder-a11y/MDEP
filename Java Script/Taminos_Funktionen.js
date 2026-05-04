setTimeout(() => {document.querySelector('button[onclick="checkDevCode()"]').addEventListener('click',(e) => {checkTamCode();});},100);

function checkTamCode(){
    const code = document.getElementById('devCode').value.trim();
    
    if(code === 'sepia'){taminosF.sepia();}else if(code === 'invert'){taminosF.invert();}else if(code === 'hue'){taminosF.hue(180);}else if(code === 'console'){taminosF.console();}else if(code === 'kontext'){taminosF.kontext();}
}

const taminosF = {
    sepia: () => {sepia();},
    invert: () => {invert();},
    hue: (wert) => {hueRot(wert);},
    console: () => {createDevOverlay();},
    kontext: () => {kontextAct();},
}
let sepiaE;
let invertE;
let hueE;
function sepia(){
    let test = document.createElement('div');
    test.id = 'sepiaDiv';
    document.body.appendChild(test);
    const sepia = document.getElementById('sepiaDiv');
    sepia.style = 'width: 200px; height: 200px; border: 1px solid #ccc; position: fixed; left: 10px; top: 10px; border-radius: 100%; -webkit-backdrop-filter: invert(100%); backdrop-filter: invert(100%); -webkit-backdrop-filter: sepia(100%); backdrop-filter: sepia(100%); pointer-events: none;';
    sepiaE = document.body.addEventListener('mousemove', (e) => {
        const koo = {X: e.clientX - 100, Y: e.clientY - 100}
        sepia.style.left = koo.X + 'px';
        sepia.style.top = koo.Y + 'px';
        //console.log('X: ' + koo.X + ', Y: ' + koo.Y);
    });
}
function invert(){
    let test = document.createElement('div');
    test.id = 'invertDiv';
    document.body.appendChild(test);
    const invert = document.getElementById('invertDiv');
    invert.style = 'width: 200px; height: 200px; border: 1px solid #ccc; position: fixed; left: 10px; top: 10px; border-radius: 100%; -webkit-backdrop-filter: invert(100%); backdrop-filter: invert(100%); pointer-events: none;';
    invertE = document.body.addEventListener('mousemove', (e) => {
        const koo = {X: e.clientX - 100, Y: e.clientY - 100}
        invert.style.left = koo.X + 'px';
        invert.style.top = koo.Y + 'px';
        //console.log('X: ' + koo.X + ', Y: ' + koo.Y);
    });
}
function hueRot(wert){
    let test = document.createElement('div');
    test.id = 'hueDiv';
    document.body.appendChild(test);
    const hue = document.getElementById('hueDiv');
    hue.style = 'width: 200px; height: 200px; border: 1px solid #ccc; position: fixed; left: 10px; top: 10px; border-radius: 100%; -webkit-backdrop-filter: hue-rotate(' + wert + 'deg); backdrop-filter: hue-rotate(' + wert + 'deg); pointer-events: none;';
    hueE = document.body.addEventListener('mousemove', (e) => {
        const koo = {X: e.clientX - 100, Y: e.clientY - 100}
        hue.style.left = koo.X + 'px';
        hue.style.top = koo.Y + 'px';
        //console.log('X: ' + koo.X + ', Y: ' + koo.Y);
    });
}
function createDevOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    
    // --- Start: Konsolen-Umleitung ---
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

// Hilfsfunktion zum Umleiten
const hookConsole = (originalFn, color) => {
    return function(...args) {
        // 1. In deine UI-Konsole schreiben
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        logToUI(`[System] ${message}`, color);
        
        // 2. Den originalen Befehl trotzdem ausführen (für F12-Konsole)
        originalFn.apply(console, args);
    };
};

// Standard-Methoden überschreiben
console.log = hookConsole(originalLog, '#888');       // Grau für normale Logs
console.error = hookConsole(originalError, '#f44747'); // Rot für Fehler
console.warn = hookConsole(originalWarn, '#ffca28');  // Gelb für Warnungen
// --- Ende: Konsolen-Umleitung ---

    // Grundstyling für das Fenster-Gefäß
    Object.assign(overlay.style, {
        position: "absolute",
        width: "400px",
        background: "#1e1e1e",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
    });

    // Struktur mit Header, Output-Bereich und Input-Leiste
    overlay.innerHTML = `
        <div class="drag-handle" style="background: #333; padding: 10px; cursor: move; display: flex; justify-content: flex-end; align-items: center;">
            <span style="color: #888; font-family: sans-serif; font-size: 12px; margin-right: auto; pointer-events: none;">JS Konsole 2026</span>
            <span class="close-btn" style="color: white; cursor: pointer; font-family: sans-serif; font-weight: bold;">✕</span>
        </div>
        <div class="overlay-content" style="display: flex; flex-direction: column; height: 300px;">
            <div class="console-output" style="flex: 1; overflow-y: auto; padding: 10px; color: #d4d4d4; font-family: monospace; font-size: 13px; line-height: 1.4;">
                <div style="color: #666; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 10px;">-- Konsole gestartet --</div>
            </div>
            <div class="input-bar" style="display: flex; background: #252526; padding: 10px; border-top: 1px solid #333;">
                <span style="color: #569cd6; font-family: monospace; margin-right: 8px;">&gt;</span>
                <input class="js-input" type="text" placeholder="Code..." style="background: transparent; border: none; color: #d4d4d4; outline: none; flex: 1; font-family: monospace; font-size: 14px;">
                <button class="send-btn" style="background: #007acc; color: white; border: none; padding: 4px 10px; cursor: pointer; border-radius: 3px; font-family: sans-serif; font-size: 12px; margin-left: 8px;">Run</button>
            </div>
        </div>
    `;

    // Elemente referenzieren
    const input = overlay.querySelector(".js-input");
    const output = overlay.querySelector(".console-output");
    const sendBtn = overlay.querySelector(".send-btn");
    const closeBtn = overlay.querySelector(".close-btn");

    // Schließen-Funktion
    closeBtn.onclick = () => overlay.remove();

    // Konsolen-Logik
    function executeCommand() {
        const cmd = input.value.trim();
        if (!cmd) return;

        // Befehl anzeigen
        logToUI(cmd, '#569cd6');
        
        try {
            // "let/const" am Anfang entfernen, um globale Variablen im window zu erlauben
            let cleanCmd = cmd.replace(/^(let|const|var)\s+/, '');
            const result = window.eval(cleanCmd);
            
            if (result !== undefined) {
                logToUI(JSON.stringify(result) || String(result), '#b5cea8');
            }
        } catch (err) {
            logToUI(err.message, '#f44747');
        }

        input.value = '';
        output.scrollTop = output.scrollHeight;
    }

    function logToUI(msg, color) {
        const div = document.createElement('div');
        div.style.marginBottom = '5px';
        div.style.borderLeft = `3px solid ${color}`;
        div.style.paddingLeft = '8px';
        div.style.color = color;
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordBreak = 'break-all';
        div.textContent = msg;
        output.appendChild(div);
    }

    // Event Listener
    sendBtn.addEventListener('click', executeCommand);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeCommand();
    });

    // Positionierung
    overlay.style.top = (Math.random() * 200 + 50) + "px";
    overlay.style.left = (Math.random() * 200 + 50) + "px";

    document.body.appendChild(overlay);
    
    // Drag & Drop aktivieren
    makeElementDraggable(overlay, overlay.querySelector(".drag-handle"));
    overlay.style.zIndex = 1000 + document.querySelectorAll('.overlay').length;

}
function makeElementDraggable(elmnt, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    handle.onmousedown = function(e) {
        // Verhindert Textauswahl während des Ziehens
        e.preventDefault();
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        document.onmousemove = elementDrag;
        document.onmouseup = closeDragElement;
        
        // Optisches Feedback: Fenster leicht hervorheben beim Ziehen
        elmnt.style.boxShadow = "0 12px 48px rgba(0, 0, 0, 0.7)";
        elmnt.style.borderColor = "rgba(255, 255, 255, 0.3)";
    };

    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmousemove = null;
        document.onmouseup = null;
        // Schatten zurücksetzen
        elmnt.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.5)";
        elmnt.style.borderColor = "rgba(255, 255, 255, 0.1)";
    }
}

function kontextAct(){
    const style = document.createElement('style');
    style.innerHTML=`
        .KM{
            border: 1px solid #ccc;
            background-color: #3e3e3e80;
            color: white;
            padding: 2.5px;
            width: 200px;
            height: 250px;
            overflow-x: auto;
            display: none;
            position: fixed;
            top: 0px;
            left: 0px;
            -webkit-backdrop-filter: blur(15px);
            backdrop-filter: blur(15px);
            border-radius: 10px;
         }
        .KM-Part{
            border: 1px solid #ccc;
            width: 192.5px;
            padding: 2.5px;
            margin-top: 5px;
            border-radius: 10px;
        }
        .KM-Part:hover{
            border: 1px dashed #ccc;
        }
        .KM .hideButton{color: transparent; filter: opacity(0%); transition: filter 5s;}
        .KM .hideButton:hover{color: red; filter: opacity(100%); transition: filter 5s; border: 1px solid #ccc;}
    `;
    document.head.appendChild(style);
    const KM = document.createElement('div'); // KM = Kontext Menü
    KM.id = 'kontextMenu';
    KM.className = 'KM';
    KM.innerHTML = `<div class="griff" style="margin: -2.5; background: #333; padding: 10px; cursor: move; display: flex; justify-content: flex-end; align-items: center;"><span>Taminos Smarte Funktionen</span></div><br><button onclick="document.getElementById('kontextMenu').style.display = 'none';">X</button><br><hr><div class="KM-Part"><a href="dev()">Developer Mode</a></div><br><hr><div class="KM-Part"><a href="selfBoom(true)">Boom</a></div><br><hr><div contenteditable="true" placeholder="Notizen die Nicht gespeichert werden" style="overflow-x: auto;max-height: 150px;">Notizen...</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><span><button onclick="document.getElementById('kontextMenu').style.display = 'none';" class="hideButton">X</button>  </span>`;
    makeElementDraggable(KM, KM.querySelector('.griff'));
    KM.style.zIndex = 100;
    document.body.appendChild(KM);
    
    document.body.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        KMShow(e.clientX,e.clientY);
        addMessage('Debug: X: ' + e.clientX + ', Y: ' + e.clientY, 'dev');
});
}

function KMShow(x,y){
    document.querySelector('div[id="kontextMenu"]').style.left = x + 'px';
    document.querySelector('div[id="kontextMenu"]').style.top = y + 'px';
    document.querySelector('div[id="kontextMenu"]').style.display = 'block';
}

document.body.addEventListener('keydown',(e) => {
    if(e.key === 'x'){
        document.querySelectorAll('div[id="sepiaDiv"]').forEach((b) => {b.remove();});
        document.querySelectorAll('div[id="invertDiv"]').forEach((b) => {b.remove();});
        document.querySelectorAll('div[id="hueDiv"]').forEach((b) => {b.remove();});
    }
});