CREATE TABLE public."Customer" (
    "CustomerId" integer NOT NULL,
    "FirstName" character varying(40) NOT NULL,
    "LastName" character varying(20) NOT NULL,
    "Company" character varying(80),
    "Address" character varying(70),
    "City" character varying(40),
    "State" character varying(40),
    "Country" character varying(40),
    "PostalCode" character varying(10),
    "Phone" character varying(24),
    "Fax" character varying(24),
    "Email" character varying(60) NOT NULL,
    "SupportRepId" integer
);