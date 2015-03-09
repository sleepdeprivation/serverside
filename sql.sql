create table User (uid int primary key auto_increment, username varchar(32), password varchar(32));
create table Message (mid int primary key auto_increment, content varchar(1024), lat float(10,6), lng float(10,6));
