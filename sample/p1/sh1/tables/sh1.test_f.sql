CREATE TABLE sh1.test_f (
    id integer NOT NULL DEFAULT nextval('sh1.test_f_id_seq'::regclass),
    f1 text
);