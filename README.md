# LogBook - Diving Logbook Online

Un'applicazione web per la gestione digitale del proprio diario di immersioni subacquee. Progetto sviluppato per il corso di Programmazione Web e Mobile presso l'Università degli Studi di Milano.

## Descrizione

LogBook è un'applicazione web che consente ai subacquei di registrare e gestire in modo digitale tutte le proprie immersioni. L'applicazione offre un sistema completo di autenticazione utente e permette di memorizzare dettagli tecnici importanti di ogni immersione, creando uno storico consultabile e modificabile.

## Documentazione

Per una descrizione dettagliata del progetto, dell'architettura e delle scelte implementative, consulta la [Relazione del Progetto](../Relazione_Ameglio.pdf).

## Funzionalità

- **Autenticazione Utente**
  - Registrazione di nuovi utenti
  - Login con email e password
  - Password crittografate con bcrypt
  - Sessioni persistenti

- **Gestione Immersioni**
  - Aggiunta di nuove immersioni con dettagli completi
  - Visualizzazione lista personale delle immersioni
  - Modifica immersioni esistenti
  - Eliminazione immersioni
  - Accesso privato: ogni utente vede solo le proprie immersioni

- **Dettagli Immersione**
  - Sito di immersione
  - Luogo
  - Nome del diving center
  - Indirizzo del diving
  - Profondità massima raggiunta (pmax)
  - Tempo totale di immersione (tmax)
  - Miscela di gas utilizzata (mixfondo)
  - Note e descrizione dettagliata

## Tecnologie Utilizzate

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Database NoSQL
- **Mongoose** - ODM per MongoDB

### Autenticazione e Sicurezza
- **Passport.js** - Middleware di autenticazione
- **Passport-Local** - Strategia di autenticazione locale
- **bcrypt.js** - Crittografia password
- **Express-Session** - Gestione sessioni

### Frontend
- **Handlebars** - Template engine
- **Express-Handlebars** - Integrazione Handlebars con Express

### Utilità
- **Body-Parser** - Parsing del body delle richieste
- **Method-Override** - Supporto per metodi HTTP PUT e DELETE
- **Connect-Flash** - Messaggi flash per feedback utente

## Requisiti

- Node.js (v8.0 o superiore)
- MongoDB (v3.0 o superiore)
- npm o yarn

## Installazione

1. **Clona il repository**
   ```bash
   git clone https://github.com/tuo-username/logbook.git
   cd logbook
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Avvia MongoDB**

   Assicurati che MongoDB sia in esecuzione sulla tua macchina locale:
   ```bash
   mongod
   ```

4. **Configura il database**

   L'applicazione si connetterà automaticamente a `mongodb://localhost/immersioni`

5. **Avvia l'applicazione**
   ```bash
   node app.js
   ```

6. **Accedi all'applicazione**

   Apri il browser e vai su: `http://localhost:3000`

## Configurazione

### Database
Il database MongoDB è configurato in `app.js`:
```javascript
mongoose.connect('mongodb://localhost/immersioni', {
    useMongoClient: true,
})
```

### Porta
Di default l'applicazione gira sulla porta 3000. Per modificarla, puoi impostare la variabile d'ambiente `PORT`:
```bash
PORT=8080 node app.js
```

### Secret Session
Per un ambiente di produzione, modifica il secret della sessione in `app.js`:
```javascript
app.use(session({
    secret: 'keyboard cat',  // Cambia questo valore
    resave: false,
    saveUninitialized: false,
}));
```

## Struttura del Progetto

```
LogBook/
├── app.js                      # File principale dell'applicazione
├── package.json                # Dipendenze e metadata del progetto
├── config/
│   └── passport.js            # Configurazione Passport.js
├── models/
│   ├── immersioni.js          # Schema Mongoose per le immersioni
│   └── utenti.js              # Schema Mongoose per gli utenti
├── helpers/
│   └── accesso_privato.js     # Middleware per protezione route
├── views/
│   ├── layouts/
│   │   └── main.handlebars    # Layout principale
│   ├── partials/
│   │   ├── _avvisi.handlebars
│   │   ├── _errori.handlebars
│   │   └── _navigazione.handlebars
│   ├── index.handlebars       # Pagina home
│   ├── info.handlebars        # Pagina informazioni
│   ├── login.handlebars       # Pagina login
│   ├── registrazione.handlebars
│   ├── lista_immersioni.handlebars
│   ├── aggiungi_immersione.handlebars
│   └── modifica_immersione.handlebars
└── assets/
    ├── css/                   # File CSS
    └── img/                   # Immagini
```

## Schema Database

### Collezione Immersioni
```javascript
{
  sito: String,          // Nome del sito di immersione
  luogo: String,         // Località
  diving: String,        // Nome del diving center
  indirizzo: String,     // Indirizzo del diving
  pmax: String,          // Profondità massima
  tmax: String,          // Tempo massimo
  mixfondo: String,      // Miscela di gas
  contenuto: String,     // Note e descrizione
  utente: String,        // ID utente proprietario
  data: Date             // Data di creazione
}
```

### Collezione Utenti
```javascript
{
  nome: String,
  cognome: String,
  email: String,         // Unique
  password: String       // Hash bcrypt
}
```

## Utilizzo

1. **Registrazione**: Crea un nuovo account dalla pagina di registrazione
2. **Login**: Accedi con le tue credenziali
3. **Aggiungi Immersione**: Compila il form con tutti i dettagli della tua immersione
4. **Visualizza Lista**: Consulta tutte le tue immersioni salvate
5. **Modifica/Elimina**: Gestisci le immersioni esistenti

## Note di Sicurezza

- Le password vengono crittografate con bcrypt prima del salvataggio
- Le route private sono protette dal middleware `accessoSicuro`
- Ogni utente può accedere solo alle proprie immersioni
- Le sessioni sono gestite in modo sicuro con express-session

## Possibili Miglioramenti Futuri

- Aggiunta di un calendario per visualizzare le immersioni per data
- Export dei dati in formato PDF o CSV
- Caricamento di foto e video delle immersioni
- Statistiche sulle immersioni (profondità media, numero totale, ecc.)
- Integrazione con API di meteo marino
- Mappa interattiva dei siti di immersione
- Condivisione immersioni con altri utenti
- Versione mobile/responsive migliorata

## Autore

**Alberto Ameglio**

Progetto sviluppato per il corso di Programmazione Web e Mobile - Università degli Studi di Milano (UNIMI)

## Licenza

ISC

---

## Contatti e Supporto

Per segnalare bug o proporre miglioramenti, apri una issue su GitHub.

## Ringraziamenti

Progetto realizzato nell'ambito del corso universitario di Programmazione Web e Mobile.
