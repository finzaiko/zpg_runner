CREATE TABLE public.film_actor (
    actor_id integer NOT NULL,
    film_id integer NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);