# Teamkraft Bewertungs-App

Eine interaktive Web-Anwendung zur Bewertung von Teamkraft nach Veranstaltungen.

## Features

- ✅ Sprachauswahl (Deutsch/Englisch)
- ✅ 5 Bewertungsoptionen mit visuellen Indikatoren
- ✅ 0,7 Sekunden Verzögerung zwischen Abstimmungen
- ✅ Live-Anzeige der Gesamtstimmen
- ✅ Detaillierte Ergebnisseite mit Prozentangaben
- ✅ Druckfunktion für Ergebnisse
- ✅ Responsive Design für Desktop, Tablet und Handy

## Dateien

- `index.html` - Hauptseite mit allen Bildschirmen
- `styles.css` - Styling und Animationen
- `app.js` - Anwendungslogik
- `netlify.toml` - Netlify-Konfiguration
- `Teamkraft-Formel.jpg` - Deutsche Formel
- `Teamkraft-Formel-1024-eng.jpg` - Englische Formel

## Deployment auf Netlify

### Option 1: Netlify Drop (Einfachste Methode)

1. Besuche [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Ziehe alle Dateien in diesen Ordner (oder zippe sie und ziehe den Ordner)
3. Netlify deployed die App automatisch
4. Du erhältst eine URL wie `https://random-name.netlify.app`

### Option 2: Git-Repository

1. Erstelle ein neues Git-Repository und pushe alle Dateien
2. Gehe zu [https://app.netlify.com](https://app.netlify.com)
3. Klicke auf "New site from Git"
4. Verbinde dein Repository
5. Build-Einstellungen:
   - Build command: (leer lassen)
   - Publish directory: `.` (Punkt)
6. Klicke auf "Deploy site"

### Option 3: Netlify CLI

```bash
# Installiere Netlify CLI
npm install -g netlify-cli

# Navigiere zum Projektordner
cd /pfad/zum/projektordner

# Deploy
netlify deploy --prod
```

## Verwendung

1. **Sprachauswahl**: Beim Start Deutsch oder Englisch wählen
2. **Abstimmen**: Teilnehmer drücken die entsprechenden Buttons
   - Rot: Teamkraft gesunken
   - Gelb: Gleich geblieben
   - Hellgrün: Leicht gestiegen
   - Mittelgrün: Mittel gestiegen
   - Dunkelgrün: Stark gestiegen
3. **Beenden**: "Zählung beenden" klicken
4. **Ergebnisse**: Ansicht der detaillierten Statistiken
5. **Neue Abstimmung**: Button zum Zurücksetzen und Neustart

## Technische Details

- Keine externen Abhängigkeiten außer Google Fonts
- Reine HTML/CSS/JavaScript
- Funktioniert offline nach dem ersten Laden
- Optimiert für Touch-Geräte
- Druckoptimiertes Layout

## Browser-Unterstützung

- Chrome/Edge (neueste Versionen)
- Firefox (neueste Versionen)
- Safari (neueste Versionen)
- Mobile Browser (iOS Safari, Chrome Mobile)

## Anpassungen

### Verzögerung ändern
In `app.js` die Variable `VOTE_DELAY` anpassen (in Millisekunden):
```javascript
const VOTE_DELAY = 700; // 0.7 Sekunden
```

### Farben ändern
In `styles.css` die CSS-Variablen anpassen:
```css
:root {
    --red: #E53E3E;
    --yellow: #F6B93B;
    --light-green: #78E08F;
    --medium-green: #38ADA9;
    --dark-green: #079992;
}
```

## Support

Bei Fragen oder Problemen bitte ein Issue im Repository erstellen.

## Lizenz

Dieses Projekt ist frei verwendbar für den persönlichen und kommerziellen Gebrauch.
