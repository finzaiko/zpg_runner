CREATE TABLE public."InvoiceLine" (
    "InvoiceLineId" integer NOT NULL,
    "InvoiceId" integer NOT NULL,
    "TrackId" integer NOT NULL,
    "UnitPrice" numeric(10,2) NOT NULL,
    "Quantity" integer NOT NULL
);