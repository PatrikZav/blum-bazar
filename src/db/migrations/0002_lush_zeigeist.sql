CREATE TABLE `listing` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`price` integer,
	`isFree` integer DEFAULT false NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'Dostupné' NOT NULL,
	`contact` text NOT NULL,
	`createdAt` integer NOT NULL
);
