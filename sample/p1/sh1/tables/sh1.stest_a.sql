CREATE TABLE sh1.stest_a (
    id integer NOT NULL DEFAULT nextval('sh1.stest_a_id_seq'::regclass),
    f1 text
);