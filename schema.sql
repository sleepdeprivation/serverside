Drop table if exists User;
Drop table if exists Message;
Drop table if exists HeadMessage;
Drop table if exists ReplyMessage;


create table H_User 		(
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
							timePosted TIMESTAMP
						);

create table ReplyMessage(
							messageID int not null primary key auto_increment,
							posterID int not null references User(userID),
							parentID int not null references HeadMessage(messageID),
							content varchar(1024),
							numUpvotes int default 0,
							numDownvotes int default 0,
							timePosted TIMESTAMP
						);

#insert garbage data
insert into User (username, password) values ("user1", "hashedPass");
insert into User (username, password) values ("user2", "hashedPass");
insert into User (username, password) values ("user3", "hashedPass");
insert into User (username, password) values ("user4", "hashedPass");
insert into User (username, password) values ("user5", "hashedPass");

insert into HeadMessage(posterID, content, lat, lon, numUpVotes, numDownVotes)
	values(1, "OP message 1", 31, 121, 30, 10);
insert into HeadMessage(posterID, content, lat, lon, numUpVotes, numDownVotes)
	values(2, "OP message 2", 40, 120, 2, 5);
insert into HeadMessage(posterID, content, lat, lon, numUpVotes, numDownVotes)
	values(3, "OP message 3", 50, 120, 40, 66);
insert into HeadMessage(posterID, content, lat, lon, numUpVotes, numDownVotes)
	values(4, "OP message 4", 30, 110, 90, 1);

insert into ReplyMessage(posterID, parentID, content, numUpVotes, numDownVotes)
	values(1, 1, "reply message 1-1", 12, 7);
insert into ReplyMessage(posterID, parentID, content, numUpVotes, numDownVotes)
	values(1, 1, "reply message 1-2", 59, 0);
insert into ReplyMessage(posterID, parentID, content, numUpVotes, numDownVotes)
	values(1, 3, "reply message 3-1", 12, 2);
insert into ReplyMessage(posterID, parentID, content, numUpVotes, numDownVotes)
	values(1, 3, "reply message 1-2", 34, 800);
insert into ReplyMessage(posterID, parentID, content, numUpVotes, numDownVotes)
	values(1, 89, "reply message 1-1", 63, 9);


