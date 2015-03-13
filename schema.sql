Drop table if exists User;
Drop table if exists Message;

create table User 		(
							userID int primary key auto_increment,
							username varchar(32) unique not null,
							password varchar(32) not null
						);

create table Message	(
							messageID int primary key auto_increment,
							posterID int references User(userID),
							parentID int references Message(messageID),
							content varchar(1024),
							lat float(10,6),
							lon float(10,6),
							numUpvotes int,
							numDownvotes int
						); 
