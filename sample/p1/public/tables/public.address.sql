CREATE TABLE public.address (
    address_id integer NOT NULL DEFAULT nextval('address_address_id_seq'::regclass),
    address text NOT NULL,
    address2 text,
    district text NOT NULL,
    city_id integer NOT NULL,
    postal_code text,
    phone text NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);