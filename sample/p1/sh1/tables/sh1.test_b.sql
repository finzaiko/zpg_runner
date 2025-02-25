CREATE TABLE sh1.test_b (
    id integer NOT NULL DEFAULT nextval('sh1.test_b_id_seq'::regclass),
    f1 text
);