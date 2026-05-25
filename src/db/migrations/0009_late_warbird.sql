CREATE TABLE `review` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`sellerId` integer NOT NULL,
	`listingId` integer,
	`rating` integer NOT NULL,
	`comment` text,
	`listingTitle` text,
	`createdAt` integer NOT NULL
);
