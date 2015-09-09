

use quiz;

DROP TABLE USERS;
DROP TABLE USER;

CREATE TABLE USERS
(
uname varchar(15),
pwd varchar(15) NOT NULL,
PRIMARY KEY(uname)
);

CREATE TABLE USER 
(
name varchar(15),
answer1 int NOT NULL,
answer2 int NOT NULL,
answer3 int NOT NULL,
feedback1 varchar(5) NOT NULL,
feedback2 varchar(5) NOT NULL,
feedback3 varchar(5) NOT NULL,
PRIMARY KEY(name),
FOREIGN KEY(name) REFERENCES USERS(uname)
);

insert into USERS values("hsmith","smith");
insert into USERS values("tbucktoo","bucktoo");
insert into USERS values("jadmin","admin");


