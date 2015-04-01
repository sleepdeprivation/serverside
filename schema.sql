Drop table if exists H_User;
Drop table if exists Message;
Drop table if exists HeadMessage;
Drop table if exists ReplyMessage;


create table H_User (
					userID int primary key auto_increment,
					uname varchar(32) unique not null,
					pass varchar(32) not null
					);

-- after reading about GSON, separated into 2 message types for easiness
-- while these may be redundant and essentially the same, only OP should have a lat/lon
-- and only replies should have a parent
-- if this proves to be a problem we can migrate later fairly easily I think
create table HeadMessage	(
							messageID int primary key auto_increment,
							posterID int not null references H_User(userID),
							content varchar(1024),
							lat float(10,6),
							lon float(10,6),
							numUpvotes int default 0,
							numDownvotes int default 0,
							timePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
						);

create table ReplyMessage(
							messageID int not null primary key auto_increment,
							posterID int not null references H_User(userID),
							parentID int not null references HeadMessage(messageID),
							content varchar(1024),
							numUpvotes int default 0,
							numDownvotes int default 0,
							timePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
						);

#insert garbage data
insert into H_User (uname, pass) values	("user1", "hashedPass"),
										("user2", "hashedPass"),
										("user3", "hashedPass"),
										("user4", "hashedPass"),
										("user5", "hashedPass");

insert into HeadMessage(posterID, content, lat, lon, numUpVotes, numDownVotes)
	values	(1, "OP message 1", 38.340124, -122.676891, 30, 10),
			(2, "OP message 2", 38.337524, -122.677503, 2, 5),
			(3, "THIS IS A BAD POST", 38.336809, -122.679337, 4, 66),
			(4, "OP message 4", 38.338197, -122.669134, 90, 1);

insert into ReplyMessage(posterID, parentID, content, numUpVotes, numDownVotes)
	values	(1, 1, "reply message 1-1", 12, 7),
			(1, 1, "reply message 1-2", 59, 0),
			(1, 3, "THIS POST GAVE ME CANCER", 12, 2),
			(2, 3, "THIS IS A BAD REPLY", 34, 800),
			(2, 1, "reply message 1-1", 63, 9);

-- verify inserts
SELECT * FROM H_User;
SELECT * FROM HeadMessage;
SELECT * FROM ReplyMessage;
