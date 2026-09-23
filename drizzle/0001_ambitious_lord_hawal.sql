CREATE TABLE `quote_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service` text NOT NULL,
	`property_type` text NOT NULL,
	`postcode` text NOT NULL,
	`approximate_size` text NOT NULL,
	`preferred_date` text NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`details` text NOT NULL,
	`email_status` text NOT NULL,
	`created_at` text NOT NULL
);
