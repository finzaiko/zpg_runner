CREATE TABLE public.film (
    film_id integer NOT NULL DEFAULT nextval('film_film_id_seq'::regclass),
    title text NOT NULL,
    description text,
    release_year year,
    language_id integer NOT NULL,
    original_language_id integer,
    rental_duration smallint NOT NULL DEFAULT 3,
    rental_rate numeric(4,2) NOT NULL DEFAULT 4.99,
    length smallint,
    replacement_cost numeric(5,2) NOT NULL DEFAULT 19.99,
    rating mpaa_rating DEFAULT 'G'::mpaa_rating,
    last_update timestamp with time zone NOT NULL DEFAULT now(),
    special_features text[],
    fulltext tsvector NOT NULL
);