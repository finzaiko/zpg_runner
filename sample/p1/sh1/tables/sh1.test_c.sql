CREATE TABLE sh1.test_c (
    id integer NOT NULL DEFAULT nextval('sh1.test_c_id_seq'::regclass),
    f1 text
);