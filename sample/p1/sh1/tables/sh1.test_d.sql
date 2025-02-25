CREATE TABLE sh1.test_d (
    id integer NOT NULL DEFAULT nextval('sh1.test_d_id_seq'::regclass),
    f1 text
);