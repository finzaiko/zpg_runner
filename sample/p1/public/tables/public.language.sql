CREATE TABLE public.language (
    language_id integer NOT NULL DEFAULT nextval('language_language_id_seq'::regclass),
    name character(20) NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);