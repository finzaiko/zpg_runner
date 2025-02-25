CREATE TABLE public.inventory (
    inventory_id integer NOT NULL DEFAULT nextval('inventory_inventory_id_seq'::regclass),
    film_id integer NOT NULL,
    store_id integer NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);