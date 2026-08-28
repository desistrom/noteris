CREATE TABLE "akta_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"akta_type" varchar(100) NOT NULL,
	"category" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"stages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "akta_templates_akta_type_unique" UNIQUE("akta_type")
);
--> statement-breakpoint
CREATE TABLE "aktas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracking_code" varchar(50) NOT NULL,
	"akta_type" varchar(100) NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"client_email" varchar(255),
	"client_phone" varchar(50),
	"form_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"template_version" integer DEFAULT 1 NOT NULL,
	"current_stage" varchar(100) DEFAULT 'draft' NOT NULL,
	"status" varchar(30) DEFAULT 'in_progress' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"document_path" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "aktas_tracking_code_unique" UNIQUE("tracking_code")
);
--> statement-breakpoint
CREATE TABLE "progress_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"akta_id" uuid NOT NULL,
	"stage_id" varchar(100) NOT NULL,
	"stage_name" varchar(255) NOT NULL,
	"status" varchar(30) NOT NULL,
	"notes" text,
	"completed_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"label" varchar(255) NOT NULL,
	"type" varchar(50) DEFAULT 'text' NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"options" jsonb,
	"placeholder" varchar(255),
	"validation" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" varchar(20) DEFAULT 'admin' NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "progress_history" ADD CONSTRAINT "progress_history_akta_id_aktas_id_fk" FOREIGN KEY ("akta_id") REFERENCES "public"."aktas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_fields" ADD CONSTRAINT "template_fields_template_id_akta_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."akta_templates"("id") ON DELETE cascade ON UPDATE no action;