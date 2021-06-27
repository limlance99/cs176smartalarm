CREATE TABLE users( id INT AUTO_INCREMENT, username VARCHAR(255), password VARCHAR(255), PRIMARY KEY (id) );

CREATE TABLE alarms( id INT AUTO_INCREMENT, userID INT, time VARCHAR(255), isActive BOOL, repetitions VARCHAR(255), ampm VARCHAR(255), PRIMARY KEY (id), FOREIGN KEY (userID) REFERENCES users(id)
ON DELETE CASCADE );

CREATE TABLE settings(id int AUTO_INCREMENT, userID int, difficulty int, mode int, PRIMARY KEY (id), FOREIGN KEY (userID) REFERENCES users(id)
ON DELETE CASCADE);

CREATE TABLE statistics(id int AUTO_INCREMENT, userID int, snoozes int, timeToWake VARCHAR(255), wakeUpTime VARCHAR(255), sleepQuality int, dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), FOREIGN KEY (userID) REFERENCES users(id)
ON DELETE CASCADE);