BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Jessie', 'jessie@gmail.com', 5, '2018-01-01');
INSERT into login (hash, email) values ('$2a$10$ibhu0vMgnk1vvn1eFMRbEuh.8bfpY3nnu/.T/QPHywFBVsb77erUm', 'jessie@gmail.com');

COMMIT;