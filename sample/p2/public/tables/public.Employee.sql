CREATE TABLE public."Employee" (
    "EmployeeId" integer NOT NULL,
    "LastName" character varying(20) NOT NULL,
    "FirstName" character varying(20) NOT NULL,
    "Title" character varying(30),
    "ReportsTo" integer,
    "BirthDate" timestamp without time zone,
    "HireDate" timestamp without time zone,
    "Address" character varying(70),
    "City" character varying(40),
    "State" character varying(40),
    "Country" character varying(40),
    "PostalCode" character varying(10),
    "Phone" character varying(24),
    "Fax" character varying(24),
    "Email" character varying(60)
);