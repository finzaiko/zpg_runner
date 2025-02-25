CREATE TABLE sh1.test_i (
    id integer NOT NULL DEFAULT nextval('sh1.test_i_id_seq'::regclass),
    f1 text
);