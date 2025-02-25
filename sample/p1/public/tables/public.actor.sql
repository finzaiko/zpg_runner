CREATE TABLE public.actor (
    actor_id integer NOT NULL DEFAULT nextval('actor_actor_id_seq'::regclass),
    first_name text NOT NULL,
    last_name text NOT NULL,
    last_update timestamp with time zone NOT NULL DEFAULT now()
);