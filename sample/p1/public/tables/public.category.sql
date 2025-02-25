CREATE TABLE public.category (
    category_id integer NOT NULL DEFAULT nextval('category_category_id_seq'::regclass),
    name text NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);