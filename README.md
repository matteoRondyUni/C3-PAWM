# **C3-PAWM**

## Autori: Matteo Rondini, Tommaso Catervi
#
Questo progetto è stato realizzato per il conseguimento dell'esame di [Progettazione di Applicazioni Web e Mobili](http://didattica.cs.unicam.it/doku.php?id=didattica:triennale:pawm:ay_2021:main), del corso di [Laurea in Informatica L-31](http://didattica.cs.unicam.it/doku.php?id=didattica:triennale:main) presso l'[Università di Camerino](https://www.unicam.it/).

<br>

C3-PAWM è un'app rivolta ai centri abitati medi della provincia italiana dove le attività commerciali del centro soffrono la concorrenza dei grandi centri commerciali situati nelle periferie.

L’idea di fondo è considerare il trasporto della merce, una volta acquistata, una delle scomodità principali dello shopping in centro, oltre al doversi spostare di più a piedi per raggiungere i diversi punti vendita.

Il progetto si pone dunque come obiettivo quello di fornire un supporto tramite punti di prelievo per rendere l’esperienza degli acquisti in centro più facile e interessante.

***
## **Funzionalità**:
La piattaforma prevede la creazione di 3 tipi principali di utenti:
* **Attività**: un profilo di tipo aziendale (Negozi, Ditte di Trasporti o Magazzini); 
* **Dipendente**: Commercianti, Corrieri o Magazzinieri collegati ad una Attività;
* **Cliente**: l’utente che effettua acquisti. 

<br>

Le funzionalità sono suddivise nel seguente modo:
* *Negozi:* tramite C3-PAWM un negozio ha la possibilità di creare un Ordine collegato ad un Cliente e di farlo spedire da una certa Ditta di Trasporti presso un determinato Magazzino, entrambi convenzionati con la piattaforma. Inoltre è possibile gestire l’Inventario e la Merce al suo interno, nonché la lista dei dipendenti (Commercianti), che avranno le stesse funzionalità del Negozio.

* *Ditte di Trasporti:* tramite C3-PAWM un Ditta di Trasporti ha la possibilità di visualizzare l’elenco degli Ordini ed assegnare la consegna di ogni Merce ad un corriere. Inoltre ogni Ditta ha la possibilità di creare l’account dei propri dipendenti (Corrieri).

* *Corrieri:* tramite C3-PAWM un Corriere di una Ditta di Trasporti ha la possibilità di vedere la lista delle Merci da consegnare e gestirne la consegna.

* *Magazzini:* tramite C3-PAWM un Magazzino ha la possibilità di gestire in sicurezza il ritiro degli Ordini dei Clienti: *il cliente che arriva dovrà fornire il codice univoco corretto affinchè il ritiro della Merce possa essere effettuato.* Inoltre ogni Magazzino ha la possibilità di creare l’account dei propri dipendenti (Magazzinieri), che avranno le sue stesse funzionalità.

* *Clienti:* tramite C3-PAWM un Cliente ha la possibilità di seguire l’avanzamento della consegna degli Ordini effettuati e di compiere il ritiro a Domicilio o presso il Magazzino scelto, comunicando al Magazziniere il Codice di Sicurezza collegato all’Ordine.

La piattaforma offre ad ogni Utente la possibilità di visualizzare le informazioni di tutti i Negozi, Ditte di Trasporti e Magazzini convenzionati.

***
## **Sviluppo**:

Puntando soprattutto su performance e user experience per l’utente finale, abbiamo scelto di sviluppare una _Progressive Web App (PWA)_, soluzione che vuole unire il meglio delle app native e della tecnologia Web, ottenendo così una piattaforma:
+ **Progressive** – Ben funzionante a prescindere dal browser utilizzato dai vari utenti, poiché costruita alla base con principi di miglioramento progressivo.
+ **App-like** – Avente le sembianze di un app nativa, in termini di interazione e navigazione.
+ **Responsive** – Veloce e adattabile alle varie dimensioni dello schermo: desktop, mobile, ecc.
+ **Sicura** – esposta con protocollo HTTPS onde evitare l’esposizione delle informazioni e/o l’alterazione dei contenuti..
+ **Aggiornata** – L’utente non ha bisogno di aggiornarla manualmente essendo una web app.
+ **Priva di installazione** – L’utente può comodamente “salvare” l’app aggiungendola alla home screen del proprio cellulare come semplice collegamento (di fatto aggiungendovi l’icona) senza effettuare dunque la classica procedura di installazione tramite un app store.

<br>

Per lo sviluppo del front-end è stato adottato un approccio _Single Page Application_ ed è stato realizzato in [TypeScript](https://www.typescriptlang.org/), [HTML](https://it.wikipedia.org/wiki/HTML) e SCSS tramite i framework [Ionic Framework](https://ionicframework.com/) ed [Angular](https://angular.io/).

Il back-end dell’app è stato invece sviluppato in [JavaScript](https://www.javascript.com/) tramite [Node.js](https://nodejs.org/it/) con framework [Express.js](https://expressjs.com/it/).

<br>

Le funzionalità dell’app sono state sviluppate tramite l’uso di chiamate _REST_ per far dialogare back-end e front-end e la sicurezza dello scambio dei messaggi è garantita dall’utilizzo di [JSON Web Token](https://jwt.io/): 
* **GET**: per ottenere le diverse informazioni dei vari utenti, come ad esempio gli ordini associati, i dipendenti di un’attività, i prodotti all’interno dell’inventario di un negozio, ecc.
* **PUT**: per modificare informazioni nel database, come i dettagli di ogni account, dei Prodotti all’interno dell’inventario di un Negozio, dello stato di consegna delle merci di un ordine, ecc.
* **POST**: per poter effettuare registrazione e login, nonché per la creazione di un prodotti e ordini.
* **DELETE**: per eliminare un dipendente dal database.


L'hosting e il Database sono stati offerti dalla piattaforma [Heroku](https://www.heroku.com/).

### **Database**:
Il Database è stato realizzato con [PostgreSQL](https://www.postgresql.org/), di seguito la lista delle tabelle utilizzate:

 * **attivita**: contenente le Informazioni delle Attività (Negozi, Magazzini, Ditte di Trasporti).
 * **commercianti**: contenente le Informazioni dei Commercianti.
 * **corrieri**: contenente le Informazioni dei Corrieri.
 * **magazzinieri**: contenente le Informazioni dei Magazzinieri.
 * **merci_ordine**: contenente le Informazioni delle Merci collegate ad un Ordine.
 * **ordini**: contenente le Informazioni degli Ordini.
 * **prodotti**: contenente le Informazioni dei Prodotti all'interno dell'Inventario di un Negozio.
 * **utenti**: contenente le Informazioni degli Utenti.

***
Immagini ed icone varie utilizzate nel progetto sono state reperite rispettivamente da [Unsplash](https://unsplash.com/) e [Flaticon](https://www.flaticon.com/).

