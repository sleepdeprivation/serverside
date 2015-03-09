create table User (uid int primary key auto_increment, username varchar(32) unique not null, password varchar(32) not null);
create table Message (mid int primary key auto_increment, content varchar(1024), lat float(10,6), lon float(10,6));
