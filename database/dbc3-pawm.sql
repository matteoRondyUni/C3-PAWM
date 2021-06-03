-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE public.utenti
(
    "id" serial NOT NULL,
    nome character varying(30) NOT NULL,
    cognome character varying(30) NOT NULL,
    email character varying(50) NOT NULL,
    password text NOT NULL,
	salt text NOT NULL,
    telefono character varying(20) NOT NULL,
    indirizzo text NOT NULL,
    tipo character varying(20) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.commercianti
(
    "id" serial NOT NULL,
    "id_negozio" serial NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.magazzinieri
(
    "id" serial NOT NULL,
    "id_magazzino" serial NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.attivita
(
    "id" serial NOT NULL,
    ragione_sociale character varying(50) NOT NULL,
    tipo character varying(20) NOT NULL,
    email character varying(30) NOT NULL,
    password text NOT NULL,
	salt text NOT NULL,
    telefono character varying(20) NOT NULL,
    indirizzo text NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.corrieri
(
    "id" serial NOT NULL,
    "id_ditta" serial NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.prodotti
(
    "id" serial NOT NULL,
    "id_negozio" serial NOT NULL,
    nome text NOT NULL,
    disponibilita integer NOT NULL,
    prezzo numeric NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.merci_ordine
(
    "id" serial NOT NULL,
    "id_prodotto" serial NOT NULL,
    "id_corriere" integer,
	"id_ordine" serial NOT NULL,
    quantita integer NOT NULL,
    prezzo_acquisto numeric NOT NULL,
    stato character varying(30) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.ordini
(
    "id" serial NOT NULL,
	"id_negozio" serial NOT NULL,
    "id_magazzino" integer,
    "id_cliente" serial NOT NULL,
	"id_ditta" integer,
	tipo character varying(15) NOT NULL,
    stato character varying(30) NOT NULL,
    codice_ritiro character varying(30) NOT NULL,
	data_ordine DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY ("id")
);

ALTER TABLE public.commercianti
    ADD FOREIGN KEY ("id")
    REFERENCES public.utenti ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;


ALTER TABLE public.magazzinieri
    ADD FOREIGN KEY ("id")
    REFERENCES public.utenti ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;


ALTER TABLE public.corrieri
    ADD FOREIGN KEY ("id")
    REFERENCES public.utenti ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;


ALTER TABLE public.corrieri
    ADD FOREIGN KEY ("id_ditta")
    REFERENCES public.attivita ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;


ALTER TABLE public.merci_ordine
    ADD FOREIGN KEY ("id_ordine")
    REFERENCES public.ordini ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;


ALTER TABLE public.merci_ordine
    ADD FOREIGN KEY ("id_prodotto")
    REFERENCES public.prodotti ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;


ALTER TABLE public.ordini
    ADD FOREIGN KEY ("id_cliente")
    REFERENCES public.utenti ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;
	
ALTER TABLE public.ordini
    ADD FOREIGN KEY ("id_negozio")
    REFERENCES public.attivita ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;
	

ALTER TABLE public.prodotti
    ADD FOREIGN KEY ("id_negozio")
    REFERENCES public.attivita ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;


ALTER TABLE public.magazzinieri
    ADD FOREIGN KEY ("id_magazzino")
    REFERENCES public.attivita ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;

ALTER TABLE public.commercianti
    ADD FOREIGN KEY ("id_negozio")
    REFERENCES public.attivita ("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE
    NOT VALid;

END;