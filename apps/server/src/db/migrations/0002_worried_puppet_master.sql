CREATE TYPE "public"."gallery_status" AS ENUM('draft', 'active', 'archived', 'private');--> statement-breakpoint
CREATE TYPE "public"."storage_provider" AS ENUM('local', 'google_drive', 'dropbox', 's3', 'onedrive');--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"slug" varchar(255) NOT NULL,
	"status" "gallery_status" DEFAULT 'draft' NOT NULL,
	"storage_provider" "storage_provider" DEFAULT 'local' NOT NULL,
	"storage_config" jsonb,
	"is_password_protected" boolean DEFAULT false NOT NULL,
	"password" text,
	"allow_downloads" boolean DEFAULT true NOT NULL,
	"allow_comments" boolean DEFAULT false NOT NULL,
	"cover_image_id" text,
	"theme" jsonb,
	"watermark_config" jsonb,
	"client_name" text,
	"client_email" text,
	"event_date" timestamp with time zone,
	"event_location" text,
	"meta_description" text,
	"tags" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"photographer_id" text NOT NULL,
	CONSTRAINT "gallery_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_access" (
	"id" text PRIMARY KEY NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"accessed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"client_name" text,
	"client_email" text,
	"gallery_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" text NOT NULL,
	"width" text,
	"height" text,
	"exif_data" jsonb,
	"storage_path" text NOT NULL,
	"thumbnail_path" text,
	"preview_path" text,
	"title" text,
	"description" text,
	"tags" jsonb,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"sort_order" text DEFAULT '0' NOT NULL,
	"is_processed" boolean DEFAULT false NOT NULL,
	"processing_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"captured_at" timestamp with time zone,
	"gallery_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image_download" (
	"id" text PRIMARY KEY NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"downloaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"client_name" text,
	"client_email" text,
	"image_id" text NOT NULL,
	"gallery_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_photographer_id_user_id_fk" FOREIGN KEY ("photographer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_access" ADD CONSTRAINT "gallery_access_gallery_id_gallery_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "image_gallery_id_gallery_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_download" ADD CONSTRAINT "image_download_image_id_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."image"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_download" ADD CONSTRAINT "image_download_gallery_id_gallery_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gallery_photographer_id_idx" ON "gallery" USING btree ("photographer_id");--> statement-breakpoint
CREATE INDEX "gallery_status_idx" ON "gallery" USING btree ("status");--> statement-breakpoint
CREATE INDEX "gallery_slug_idx" ON "gallery" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "gallery_access_gallery_id_idx" ON "gallery_access" USING btree ("gallery_id");--> statement-breakpoint
CREATE INDEX "gallery_access_accessed_at_idx" ON "gallery_access" USING btree ("accessed_at");--> statement-breakpoint
CREATE INDEX "image_gallery_id_idx" ON "image" USING btree ("gallery_id");--> statement-breakpoint
CREATE INDEX "image_is_hidden_idx" ON "image" USING btree ("is_hidden");--> statement-breakpoint
CREATE INDEX "image_sort_order_idx" ON "image" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "image_download_image_id_idx" ON "image_download" USING btree ("image_id");--> statement-breakpoint
CREATE INDEX "image_download_gallery_id_idx" ON "image_download" USING btree ("gallery_id");--> statement-breakpoint
CREATE INDEX "image_download_downloaded_at_idx" ON "image_download" USING btree ("downloaded_at");