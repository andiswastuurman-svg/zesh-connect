CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`brief` text NOT NULL,
	`objective` varchar(120) NOT NULL,
	`status` enum('draft','active','review','completed') NOT NULL DEFAULT 'draft',
	`startAt` timestamp,
	`endAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creatorProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`handle` varchar(120) NOT NULL,
	`niche` varchar(120) NOT NULL,
	`location` varchar(120) NOT NULL,
	`audienceSize` varchar(32) NOT NULL,
	`engagementRate` varchar(16) NOT NULL,
	`rateRange` varchar(64) NOT NULL,
	`platforms` text NOT NULL,
	`bio` text,
	`managedBy` varchar(120),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creatorProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `creatorProfiles_handle_unique` UNIQUE(`handle`)
);
--> statement-breakpoint
CREATE TABLE `libraryAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`assetType` enum('copy','prompt','code','image','brief') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `libraryAssets_id` PRIMARY KEY(`id`)
);
