CREATE TABLE public.rental (
    rental_id integer NOT NULL DEFAULT nextval('rental_rental_id_seq'::regclass),
    rental_date timestamp with time zone NOT NULL,
    inventory_id integer NOT NULL,
    customer_id integer NOT NULL,
    return_date timestamp with time zone,
    staff_id integer NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);