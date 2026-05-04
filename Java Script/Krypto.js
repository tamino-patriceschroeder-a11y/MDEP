(function() {
    // 1. DYNAMISCHES STYLING
    const style = document.createElement('style');
    style.innerHTML = `
        .crypto-overlay { display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); font-family: 'Segoe UI', sans-serif; }
        .crypto-box { background: #fff; margin: 5% auto; padding: 25px; width: 90%; max-width: 550px; border-radius: 15px; position: relative; box-shadow: 0 15px 40px rgba(0,0,0,0.4); }
        .crypto-close { position: absolute; right: 20px; top: 15px; cursor: pointer; font-size: 28px; color: #999; }
        .crypto-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
        .crypto-input, .crypto-select, .crypto-btn { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #ddd; box-sizing: border-box; font-size: 14px; }
        .crypto-btn { background: #28a745; color: white; border: none; cursor: pointer; font-weight: 600; transition: 0.3s; margin-top: 10px; }
        .crypto-btn:hover { background: #218838; }
        .crypto-btn.decrypt { background: #dc3545; }
        .crypto-btn.decrypt:hover { background: #c82333; }
        .crypto-full { grid-column: span 2; }
        label { font-size: 12px; font-weight: bold; color: #555; text-transform: uppercase; }
    `;
    document.head.appendChild(style);

    // 2. HTML STRUKTUR
    const container = document.createElement('div');
    container.id = "megaCryptoApp";
    container.className = "crypto-overlay";
    container.innerHTML = `
        <div class="crypto-box">
            <span class="crypto-close" onclick="megaCrypto.close()">&times;</span>
            <h2 style="margin-top:0">All-in-One Crypto Tool</h2>
            
            <label>Eingabe / Quelltext</label>
            <textarea id="mc-in" class="crypto-input crypto-full" rows="4" placeholder="Text hier einfügen..."></textarea>
            
            <div class="crypto-grid">
                <div>
                    <label>Methode</label>
                    <select id="mc-method" class="crypto-select" onchange="megaCrypto.updateUI()">
                        <optgroup label="Klassisch">
                            <option value="caesar">Caesar (Shift)</option>
                            <option value="rot13">ROT13</option>
                            <option value="atbash">Atbash</option>
                        </optgroup>
                        <optgroup label="Encoding (Beidseitig)">
                            <option value="base64">Base64</option>
                            <option value="binary">Binär (1/0)</option>
                            <option value="hex">Hexadezimal</option>
                            <option value="morse">Morse Code</option>
                            <option value="url">URL Encoding</option>
                        </optgroup>
                        <optgroup label="Hashing (Einweg)">
                            <option value="sha256">SHA-256 (Nur Enc)</option>
                        </optgroup>
                    </select>
                </div>
                <div id="mc-param-box">
                    <label>Parameter (z.B. Shift)</label>
                    <input type="number" id="mc-param" class="crypto-input" value="3">
                </div>
                <button class="crypto-btn" onclick="megaCrypto.run(true)">Verschlüsseln / Encode</button>
                <button id="btn-decrypt" class="crypto-btn decrypt" onclick="megaCrypto.run(false)">Entschlüsseln / Decode</button>
                <button class="crypto-btn" style="background:#007bff" onclick="megaCrypto.copy()">Ergebnis kopieren</button>
<button class="crypto-btn" style="background:#ff0000" onclick="selfBoom(true)">Notfall zerstörung</button>
            </div>

            <label style="display:block; margin-top:20px;">Ergebnis</label>
            <textarea id="mc-out" class="crypto-input crypto-full" rows="4" readonly placeholder="Ergebnis erscheint hier..."></textarea>
        </div>
    `;
    document.body.appendChild(container);

    // 3. LOGIK & ALGORITHMEN
    const morse = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/' };
    const revMorse = Object.fromEntries(Object.entries(morse).map(([k, v]) => [v, k]));

    window.megaCrypto = {
        copy: () => {
            const out = document.getElementById('mc-out');
            out.select();
            document.execCommand('copy'); // Oder modern: navigator.clipboard.writeText(out.value);
            alert('In Zwischenablage kopiert!');
        },
        open: () => document.getElementById('megaCryptoApp').style.display = 'block',
        close: () => document.getElementById('megaCryptoApp').style.display = 'none',
        updateUI: () => {
            const m = document.getElementById('mc-method').value;
            document.getElementById('mc-param-box').style.visibility = (m === 'caesar') ? 'visible' : 'hidden';
            document.getElementById('btn-decrypt').disabled = (m === 'sha256');
        },
        run: async (isEnc) => {
            const input = document.getElementById('mc-in').value;
            const method = document.getElementById('mc-method').value;
            const param = parseInt(document.getElementById('mc-param').value) || 0;
            let out = "";

            try {
                switch(method) {
                    case 'caesar':
                        const s = isEnc ? param : -param;
                        out = input.replace(/[a-z]/gi, c => {
                            const b = c <= 'Z' ? 65 : 97;
                            return String.fromCharCode(((c.charCodeAt(0) - b + s) % 26 + 26) % 26 + b);
                        });
                        break;
                    case 'rot13':
                        out = input.replace(/[a-z]/gi, c => String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < 'n' ? 13 : -13)));
                        break;
                    case 'atbash':
                        out = input.replace(/[a-z]/gi, c => {
                            const b = c <= 'Z' ? 65 : 97;
                            return String.fromCharCode(b + (25 - (c.charCodeAt(0) - b)));
                        });
                        break;
                    case 'base64':
                        out = isEnc ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
                        break;
                    case 'binary':
                        out = isEnc ? input.split('').map(c => c.charCodeAt(0).toString(2).padStart(8,'0')).join(' ')
                                    : input.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
                        break;
                    case 'hex':
                        out = isEnc ? Array.from(input).map(c => c.charCodeAt(0).toString(16)).join(' ')
                                    : input.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
                        break;
                    case 'morse':
                        out = isEnc ? input.toUpperCase().split('').map(c => morse[c] || '?').join(' ')
                                    : input.split(' ').map(m => revMorse[m] || '').join('');
                        break;
                    case 'url':
                        out = isEnc ? encodeURIComponent(input) : decodeURIComponent(input);
                        break;
                    case 'sha256':
                        const msgUint8 = new TextEncoder().encode(input);
                        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
                        out = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
                        break;
                }
            } catch(e) { out = "FEHLER: Ungültiges Format für " + method; }
            document.getElementById('mc-out').value = out;
        }
    };
    megaCrypto.updateUI();
    const erwListe = document.getElementById('ErwListe');
    
    const knopf = document.createElement('button');
    knopf.onclick = () => {megaCrypto.open();};
    knopf.innerText = 'Ver- und Entschlüssler';
    erwListe.appendChild(knopf);
})();
