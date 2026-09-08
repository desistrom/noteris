CREATE TABLE "akta_counters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prefix" varchar(20) NOT NULL,
	"year" integer NOT NULL,
	"last_number" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "akta_templates" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "akta_templates" ADD COLUMN "prefix" varchar(20) DEFAULT 'AKT' NOT NULL;--> statement-breakpoint
ALTER TABLE "akta_templates" ADD COLUMN "template_file_path" text;--> statement-breakpoint
ALTER TABLE "akta_templates" ADD COLUMN "template_file_name" varchar(255);--> statement-breakpoint
ALTER TABLE "akta_templates" ADD COLUMN "template_file_size" integer;--> statement-breakpoint
ALTER TABLE "akta_templates" ADD COLUMN "template_mime" varchar(100);