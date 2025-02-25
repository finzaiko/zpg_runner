CREATE TABLE public.country (
    country_id integer NOT NULL DEFAULT nextval('country_country_id_seq'::regclass),
    country text NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);