CREATE TABLE public.test_a (
    id integer NOT NULL DEFAULT nextval('test_a_id_seq'::regclass),
    f1 text
);