CREATE TABLE sh1.test_e (
    id integer NOT NULL DEFAULT nextval('sh1.test_e_id_seq'::regclass),
    f1 text
);