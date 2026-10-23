-- Content expansion migration for Cloudflare D1 (mirror of 20261023_040800_content_expansion.ts)
-- Adds: posts, tools, services, inquiries, clients, invoices + SiteSettings editorial columns

CREATE TABLE `posts_tags` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`tag` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
  );

CREATE INDEX `posts_tags_order_idx` ON `posts_tags` (`_order`);

CREATE INDEX `posts_tags_parent_id_idx` ON `posts_tags` (`_parent_id`);

CREATE TABLE `posts` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`slug` text,
  	`excerpt` text,
  	`content` text NOT NULL,
  	`cover_image_id` integer,
  	`author_id` integer,
  	`published_date` text,
  	`featured` integer DEFAULT false,
  	`published` integer DEFAULT true,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (`cover_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
  );

CREATE INDEX `posts_cover_image_idx` ON `posts` (`cover_image_id`);

CREATE INDEX `posts_author_idx` ON `posts` (`author_id`);

CREATE INDEX `posts_updated_at_idx` ON `posts` (`updated_at`);

CREATE INDEX `posts_created_at_idx` ON `posts` (`created_at`);

CREATE TABLE `tools` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`category` text DEFAULT 'software',
  	`description` text,
  	`url` text,
  	`icon_id` integer,
  	`order` numeric DEFAULT 0,
  	`published` integer DEFAULT true,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (`icon_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );

CREATE INDEX `tools_icon_idx` ON `tools` (`icon_id`);

CREATE INDEX `tools_updated_at_idx` ON `tools` (`updated_at`);

CREATE INDEX `tools_created_at_idx` ON `tools` (`created_at`);

CREATE TABLE `services_deliverables` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`item` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
  );

CREATE INDEX `services_deliverables_order_idx` ON `services_deliverables` (`_order`);

CREATE INDEX `services_deliverables_parent_id_idx` ON `services_deliverables` (`_parent_id`);

CREATE TABLE `services` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`slug` text,
  	`key` text,
  	`summary` text NOT NULL,
  	`description` text,
  	`price_label` text,
  	`order` numeric DEFAULT 0,
  	`published` integer DEFAULT true,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );

CREATE INDEX `services_updated_at_idx` ON `services` (`updated_at`);

CREATE INDEX `services_created_at_idx` ON `services` (`created_at`);

CREATE TABLE `inquiries` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`email` text NOT NULL,
  	`company` text,
  	`website` text,
  	`service` text DEFAULT 'design_engineering',
  	`budget` text,
  	`message` text NOT NULL,
  	`status` text DEFAULT 'new',
  	`intent_label` text DEFAULT 'unscored',
  	`intent_score` numeric,
  	`ai_score_overridden` integer,
  	`posthog_distinct_id` text,
  	`posthog_session_url` text,
  	`top_viewed_project_id` integer,
  	`ai_summary` text,
  	`ai_draft_pitch` text,
  	`notes` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (`top_viewed_project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null
  );

CREATE INDEX `inquiries_top_viewed_project_idx` ON `inquiries` (`top_viewed_project_id`);

CREATE INDEX `inquiries_updated_at_idx` ON `inquiries` (`updated_at`);

CREATE INDEX `inquiries_created_at_idx` ON `inquiries` (`created_at`);

CREATE TABLE `clients_onboarding_checklist` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`task` text NOT NULL,
  	`completed` integer DEFAULT false,
  	FOREIGN KEY (`_parent_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE cascade
  );

CREATE INDEX `clients_onboarding_checklist_order_idx` ON `clients_onboarding_checklist` (`_order`);

CREATE INDEX `clients_onboarding_checklist_parent_id_idx` ON `clients_onboarding_checklist` (`_parent_id`);

CREATE TABLE `clients` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`company` text NOT NULL,
  	`name` text NOT NULL,
  	`email` text NOT NULL,
  	`website` text,
  	`status` text DEFAULT 'active_client',
  	`currency` text DEFAULT 'GBP',
  	`stripe_customer_id` text,
  	`lifetime_revenue` numeric DEFAULT 0,
  	`billing_address` text,
  	`notes` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );

CREATE INDEX `clients_updated_at_idx` ON `clients` (`updated_at`);

CREATE INDEX `clients_created_at_idx` ON `clients` (`created_at`);

CREATE TABLE `invoices_line_items` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`description` text NOT NULL,
  	`quantity` numeric DEFAULT 1 NOT NULL,
  	`rate` numeric NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE cascade
  );

CREATE INDEX `invoices_line_items_order_idx` ON `invoices_line_items` (`_order`);

CREATE INDEX `invoices_line_items_parent_id_idx` ON `invoices_line_items` (`_parent_id`);

CREATE TABLE `invoices` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`invoice_number` text NOT NULL,
  	`client_id` integer NOT NULL,
  	`title` text DEFAULT 'Design Engineering Sprint' NOT NULL,
  	`status` text DEFAULT 'draft',
  	`issue_date` text,
  	`due_date` text,
  	`currency` text DEFAULT 'GBP',
  	`total_amount` numeric NOT NULL,
  	`stripe_payment_intent_id` text,
  	`payment_terms` text DEFAULT 'Payable within 14 days of issue. Accepted via Card, Apple Pay, or Direct Wire.',
  	`notes` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE set null
  );

CREATE UNIQUE INDEX `invoices_invoice_number_idx` ON `invoices` (`invoice_number`);

CREATE INDEX `invoices_client_idx` ON `invoices` (`client_id`);

CREATE INDEX `invoices_updated_at_idx` ON `invoices` (`updated_at`);

CREATE INDEX `invoices_created_at_idx` ON `invoices` (`created_at`);

ALTER TABLE `payload_locked_documents_rels` ADD `posts_id` integer REFERENCES posts(id);

ALTER TABLE `payload_locked_documents_rels` ADD `tools_id` integer REFERENCES tools(id);

ALTER TABLE `payload_locked_documents_rels` ADD `services_id` integer REFERENCES services(id);

ALTER TABLE `payload_locked_documents_rels` ADD `inquiries_id` integer REFERENCES inquiries(id);

ALTER TABLE `payload_locked_documents_rels` ADD `clients_id` integer REFERENCES clients(id);

ALTER TABLE `payload_locked_documents_rels` ADD `invoices_id` integer REFERENCES invoices(id);

CREATE INDEX `payload_locked_documents_rels_posts_id_idx` ON `payload_locked_documents_rels` (`posts_id`);

CREATE INDEX `payload_locked_documents_rels_tools_id_idx` ON `payload_locked_documents_rels` (`tools_id`);

CREATE INDEX `payload_locked_documents_rels_services_id_idx` ON `payload_locked_documents_rels` (`services_id`);

CREATE INDEX `payload_locked_documents_rels_inquiries_id_idx` ON `payload_locked_documents_rels` (`inquiries_id`);

CREATE INDEX `payload_locked_documents_rels_clients_id_idx` ON `payload_locked_documents_rels` (`clients_id`);

CREATE INDEX `payload_locked_documents_rels_invoices_id_idx` ON `payload_locked_documents_rels` (`invoices_id`);

ALTER TABLE `site_settings` ADD `intro_first_name` text DEFAULT 'Hamza';

ALTER TABLE `site_settings` ADD `intro_last_name` text DEFAULT 'Shaebi';

ALTER TABLE `site_settings` ADD `about_anti` text DEFAULT 'anti-
  disciplinary';

ALTER TABLE `site_settings` ADD `about_design` text DEFAULT '& design
  engineer';

ALTER TABLE `site_settings` ADD `about_for_word` text DEFAULT 'for';

ALTER TABLE `site_settings` ADD `about_arrows` text DEFAULT '→ →';

ALTER TABLE `site_settings` ADD `about_cultural` text DEFAULT 'cultural
  & creative';

ALTER TABLE `site_settings` ADD `about_practices` text DEFAULT 'based
  practices';

ALTER TABLE `site_settings` ADD `footer_cta_text` text DEFAULT 'let''s build
  or chat
  about
  something';

ALTER TABLE `site_settings` ADD `footer_cta_highlight_word` text DEFAULT 'chat';

INSERT INTO `payload_migrations` (`name`, `batch`) VALUES ('20261023_040800_content_expansion', 1);
