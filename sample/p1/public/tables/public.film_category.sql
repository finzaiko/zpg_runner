CREATE TABLE public.film_category (
    film_id integer NOT NULL,
    category_id integer NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);