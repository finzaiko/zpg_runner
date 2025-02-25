CREATE TABLE public."Track" (
    "TrackId" integer NOT NULL,
    "Name" character varying(200) NOT NULL,
    "AlbumId" integer,
    "MediaTypeId" integer NOT NULL,
    "GenreId" integer,
    "Composer" character varying(220),
    "Milliseconds" integer NOT NULL,
    "Bytes" integer,
    "UnitPrice" numeric(10,2) NOT NULL
);