CREATE TABLE sh1.test_h (
    id integer NOT NULL DEFAULT nextval('sh1.test_h_id_seq'::regclass),
    f1 text
);