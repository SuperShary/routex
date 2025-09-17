CREATE TABLE `lessons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`bullets` text NOT NULL,
	`next_time_try` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`org_id` integer DEFAULT 1 NOT NULL,
	`task_spec_id` integer NOT NULL,
	`model` text NOT NULL,
	`tokens` integer NOT NULL,
	`cost_usd` real NOT NULL,
	`latency_ms` integer NOT NULL,
	`output` text NOT NULL,
	`verdict` text,
	`learn` text,
	`status` text DEFAULT 'succeeded' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`task_spec_id`) REFERENCES `task_specs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `task_specs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`org_id` integer DEFAULT 1 NOT NULL,
	`family` text NOT NULL,
	`goal` text NOT NULL,
	`context` text,
	`inputs` text NOT NULL,
	`constraints` text NOT NULL,
	`audience` text,
	`format` text,
	`acceptance_criteria` text NOT NULL,
	`privacy` text,
	`user_prefs` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`org_id` integer DEFAULT 1 NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`task_spec_id` integer,
	`tags` text NOT NULL,
	`proven` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`task_spec_id`) REFERENCES `task_specs`(`id`) ON UPDATE no action ON DELETE no action
);
