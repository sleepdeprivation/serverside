Drop table if exists User;
Drop table if exists Message;

create table User 		(
							userID int primary key auto_increment,
							username varchar(32) unique not null,
							password varchar(32) not null
						);

create table Message	(
							messageID int not null primary key auto_increment,
							posterID int not null references User(userID),
							parentID int default null references Message(messageID),
							content varchar(1024),
							lat float(10,6),
							lon float(10,6),
							numUpvotes int default 0,
							numDownvotes int default 0
						); 
