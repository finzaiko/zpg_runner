CREATE TABLE public.store (
    store_id integer NOT NULL DEFAULT nextval('store_store_id_seq'::regclass),
    manager_staff_id integer NOT NULL,
    address_id integer NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);