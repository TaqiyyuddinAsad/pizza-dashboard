# 🍕 Pizza Dashboard - Windows Installation

## 📋 Voraussetzungen installieren

### 1. Java 17
- Lade OpenJDK 17 von [adoptium.net](https://adoptium.net/) herunter
- Installiere mit Standardeinstellungen
- Teste: `java -version` in CMD

### 2. MySQL 8.0
- Lade MySQL Installer von [mysql.com](https://dev.mysql.com/downloads/installer/) herunter
- Installiere "Developer Default"
- Setze Root-Passwort (merke es dir!)
- Starte MySQL als Windows-Service

### 3. Node.js 18+
- Lade von [nodejs.org](https://nodejs.org/) herunter
- Installiere mit Standardeinstellungen
- Teste: `node --version` in CMD

## 🚀 Installation

### Schritt 1: Datenbank einrichten
```cmd
# MySQL öffnen
mysql -u root -p

# Datenbank erstellen
CREATE DATABASE pizza_db;
USE pizza_db;
exit;

# Schema importieren (im Projektordner)
mysql -u root -p pizza_db < database/schema.sql
```

### Schritt 2: Backend konfigurieren
```cmd
# Öffne: backend/src/main/resources/application.properties
# Ändere das Passwort:
spring.datasource.password=DEIN_MYSQL_PASSWORT
```

### Schritt 3: Frontend API-URL anpassen
```cmd
# Öffne: frontend/src/config/api.js
# Ändere zu:
export const API_BASE_URL = 'http://localhost:8080';
```

### Schritt 4: Anwendung starten

**Backend starten:**
```cmd
cd backend
mvnw.cmd spring-boot:run
```

**Frontend starten (neues CMD-Fenster):**
```cmd
cd frontend
npm install
npm run dev
```

### Schritt 5: Browser öffnen
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## 🔧 Troubleshooting

**Java nicht gefunden:**
- JAVA_HOME setzen: `set JAVA_HOME=C:\Program Files\Java\jdk-17`
- PATH prüfen: `echo %PATH%`

**MySQL Verbindungsfehler:**
- MySQL Service starten: `net start mysql80`
- Passwort prüfen in application.properties

**Port belegt:**
```cmd
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**npm Fehler:**
```cmd
npm cache clean --force
rmdir /s node_modules
npm install
```

## 📁 Projektstruktur
```
pizza-dashboard/
├── backend/          # Spring Boot (Port 8080)
├── frontend/         # React (Port 5173)
└── database/         # SQL Scripts
```

**Fertig! 🍕**