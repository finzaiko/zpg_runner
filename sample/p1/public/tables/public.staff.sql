CREATE TABLE public.staff (
    staff_id integer NOT NULL DEFAULT nextval('staff_staff_id_seq'::regclass),
    first_name text NOT NULL,
    last_name text NOT NULL,
    address_id integer NOT NULL,
    email text,
    store_id integer NOT NULL,
    active boolean NOT NULL DEFAULT true,
    username text NOT NULL,
    password text,
    last_update timestamp with time zone NOT NULL DEFAULT now(),
    picture bytea
);