CREATE TABLE public.city (
    city_id integer NOT NULL DEFAULT nextval('city_city_id_seq'::regclass),
    city text NOT NULL,
    country_id integer NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);