CREATE TABLE public."Invoice" (
    "InvoiceId" integer NOT NULL,
    "CustomerId" integer NOT NULL,
    "InvoiceDate" timestamp without time zone NOT NULL,
    "BillingAddress" character varying(70),
    "BillingCity" character varying(40),
    "BillingState" character varying(40),
    "BillingCountry" character varying(40),
    "BillingPostalCode" character varying(10),
    "Total" numeric(10,2) NOT NULL
);