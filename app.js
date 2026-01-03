const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

const { accessoSicuro } = require('./helpers/accesso_privato');

const app = express();

//CARTELLE PER GESTIONE DELLE RISORSE STATICHE
app.use('/css', express.static(__dirname + '/assets/css'));
app.use('/img', express.static(__dirname + '/assets/img'));

//INTEGRAZIONE FILE CONFIG PASSPORT
require('./config/passport')(passport);

//CONNESSIONE A MONGOOSE
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/immersioni', {
    useMongoClient: true,
})
    .then(() => console.log(' Server connesso'))
    .catch(err => console.log(err));

//SCHEMA E MODELLO PER IMMERSIONI
require('./models/immersioni');
const Immersioni = mongoose.model('immersioni');

//SCHEMA E MODELLO PER UTENTI
require('./models/utenti');
const Utenti = mongoose.model('utenti');


//MIDDLEWARE PER HANDLEBARS
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//OVERRIDE MIDDLEWARE
app.use(methodOverride('_method'));

//MIDDLEWARE PER SESSIONE
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());


//MIDDLEWARE PER MESSAGGI FLASH
app.use(flash());

//VARIABILI GLOBALI PER MESSAGGI FLASH
app.use((req, res, next) => {
    res.locals.msg_successo = req.flash('msg_successo');
    res.locals.msg_errore = req.flash('msg_errore');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
});

//USO  DI BASE DI MIDDLEWARE
// app.use((req, res, next)=>{
// req.saluto = "Io sono la prima app in node, ciao";
// next();
// })

// app.get('/' , (req , res)=>{
//     res.send(req.saluto);
//      })

//ROUTE PER PAGINA INDEX
app.get('/', (req, res) => {
    const titolo = "LogBook Online";
    res.render('index', { titolo: titolo });
})

//ROUTE PER PAGINA INFO
app.get('/info', (req, res) => {
    res.render('info');
})

//ROUTE PER PAGINA LISTA IMMERSIONI
app.get('/lista_immersioni', accessoSicuro, (req, res) => {
    Immersioni.find({ utente: req.user.id })
        .sort({ date: 'desc' })
        .then(immersioni => {
            res.render('lista_immersioni', {
                immersioni: immersioni
            });
        });
});

//ROUTE PER PAGINA AGGIUNGI IMMERSIONI
app.get('/aggiungi_immersione', accessoSicuro, (req, res) => {
    res.render('aggiungi_immersione');
})

//ROUTE PER PAGINA LOGIN
app.get('/login', (req, res) => {
    res.render('login');
})

//ROUTE PER PAGINA REGISTRAZIONE
app.get('/registrazione', (req, res) => {
    res.render('registrazione');
})


//ROUTE PER PAGINA MODIFICA IMERSIONE   
app.get('/modifica_immersione/:id', accessoSicuro, (req, res) => {
    Immersioni.findOne({
        _id: req.params.id
    })
        .then(immersione => {
            if (immersione.utente != req.user.id) {
                req.flash('msg_errore', 'Non puoi vedere questi contenuti');
                res.redirect('/lista_immersioni');
            } else {
                res.render('modifica_immersione', {
                    immersione: immersione
                });
            }
        });
});

//GESTIONE DEL FORM : AGGIUNGI
app.post('/aggiungi_immersione', accessoSicuro, (req, res) => {
    let errori = [];
    if (!req.body.sito) {
        errori.push({ text: 'Devi aggiungere un sito di immersione' });
    }
    if (!req.body.luogo) {
        errori.push({ text: 'Devi aggiungere il luogo' });
    }
    if (!req.body.diving) {
        errori.push({ text: 'Devi aggiungere il diving' });
    }
    if (!req.body.indirizzo) {
        errori.push({ text: 'Devi aggiungere l indirizzo del diving' });
    }
    if (!req.body.pmax) {
        errori.push({ text: 'Devi aggiungere la profondità massima raggiunta' });
    }
    if (!req.body.tmax) {
        errori.push({ text: 'Devi aggiungere il tempo totale di durata dell immersione' });
    }
    if (!req.body.mixfondo) {
        errori.push({ text: 'Devi aggiungere la miscela di immersione' });
    }
    if (!req.body.testo) {
        errori.push({ text: 'Devi aggiungere un contenuto' });
    }

    if (errori.length > 0) {
        res.render('aggiungi_immersione', {
            errori: errori,
            sito: req.body.sito,
            luogo: req.body.luogo,
            diving: req.body.diving,
            indirizzo: req.body.indirizzo,
            pmax: req.body.pmax,
            tmax: req.body.tmax,
            mixfondo: req.body.mixfondo,
            dettagli: req.body.testo
        });
    } else {
        //res.send('ok, funziono!');
        const nuovaImmersione = {
            sito: req.body.sito,
            luogo: req.body.luogo,
            diving: req.body.diving,
            indirizzo: req.body.indirizzo,
            pmax: req.body.pmax,
            tmax: req.body.tmax,
            mixfondo: req.body.mixfondo,
            contenuto: req.body.testo,
            utente: req.user.id
        }
        new Immersioni(nuovaImmersione)
            .save()
            .then(immersione => {
                req.flash('msg_successo', 'Immersione aggiunta correttamente');
                res.redirect('/lista_immersioni');
            })
    }
});

//GESTIONE DEL FORM : AGGIORNA
app.post('/lista_immersioni/:id', accessoSicuro, (req, res) => {
    Immersioni.findOne({
        _id: req.params.id
    })
        .then(immersione => {
            immersione.sito = req.body.sito;
            immersione.luogo = req.body.luogo,
            immersione.diving = req.body.diving,
            immersione.indirizzo = req.body.indirizzo,
            immersione.pmax = req.body.pmax,
            immersione.tmax = req.body.tmax,
            immersione.mixfondo = req.body.mixfondo,
            immersione.contenuto = req.body.testo;
            immersione.save()
                .then(immersione => {
                    req.flash('msg_successo', 'Immersione modificata correttamente');
                    res.redirect('/lista_immersioni');
                });
        });
});

//GESTIONE PER ELIMINAZIONE DOCUMENTO
app.delete('/lista_immersioni/:id', accessoSicuro, (req, res) => {
    Immersioni.remove({
        _id: req.params.id
    })
        .then(() => {
            req.flash('msg_successo', 'Immersione cancellata correttamente');
            res.redirect('/lista_immersioni');
        });
});

//GESTIONE FORM REGISTRAZIONE
app.post('/registrazione', (req, res) => {
    let errori = [];
    if (req.body.password != req.body.conferma_psw) {
        errori.push({ text: 'password non corrispondenti' });
    }
    if (req.body.password.length < 6) {
        errori.push({ text: 'la password deve avere almeno 6 caratteri' });
    }
    if (errori.length > 0) {
        res.render('registrazione', {
            errori: errori,
            nome: req.body.nome,
            cognome: req.body.cognome,
            email: req.body.email,
            password: req.body.password,
            conferma_psw: req.body.conferma_psw
        });
    } else {
        Utenti.findOne({ email: req.body.email })
            .then(utente => {
                if (utente) {
                    req.flash('msg_errore', 'questa mail è già registrata');
                    res.redirect('/registrazione');
                } else {
                    const nuovoUtente = new Utenti({
                        nome: req.body.nome,
                        cognome: req.body.cognome,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(nuovoUtente.password, salt, (err, hash) => {
                            if (err) throw err;
                            nuovoUtente.password = hash;
                            nuovoUtente.save()
                                .then(utente => {
                                    req.flash('msg_successo', 'Bene, ti sei registrato');
                                    res.redirect('login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            });
    }
});

//GESTIONE FORM LOGIN
app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/lista_immersioni',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
})

//GESTIONE LOGOUT
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('msg_successo', 'Sei disconnesso. Ciao, alla prossima sessione');
    res.redirect('/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server attivato sulla porta: ${port}`);
})