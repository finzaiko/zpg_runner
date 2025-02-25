CREATE TABLE sh1.test_g (
    id integer NOT NULL DEFAULT nextval('sh1.test_g_id_seq'::regclass),
    f1 text
);