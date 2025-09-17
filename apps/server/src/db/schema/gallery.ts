import {
  boolean,
  index,
  inet,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth';
import { integer } from 'drizzle-orm/gel-core';

export const galleryStatusEnum = pgEnum('gallery_status', [
  'draft',
  'active',
  'archived',
  'private',
]);

export const storageProviderEnum = pgEnum('storage_provider', [
  'local',
  'google_drive',
  'dropbox',
  's3',
  'onedrive',
]);

export const gallery = pgTable(
  'gallery',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    status: galleryStatusEnum('status').notNull().default('draft'),
    
    // Storage configuration
    storageProvider: storageProviderEnum('storage_provider').notNull().default('local'),
    storageConfig: jsonb('storage_config'), // Provider-specific config (credentials, paths, etc.)
    
    // Access control
    isPasswordProtected: boolean('is_password_protected').notNull().default(false),
    password: text('password'), // Hashed password for gallery access
    allowDownloads: boolean('allow_downloads').notNull().default(true),
    allowComments: boolean('allow_comments').notNull().default(false),
    
    // Branding & customization
    coverImageId: text('cover_image_id'),
    theme: jsonb('theme'), // Custom theme settings
    watermarkConfig: jsonb('watermark_config'), // Watermark settings
    
    // Client information
    clientName: text('client_name'),
    clientEmail: text('client_email'),
    eventDate: timestamp('event_date', { withTimezone: true }),
    eventLocation: text('event_location'),
    
    // SEO & metadata
    metaDescription: text('meta_description'),
    tags: jsonb('tags').$type<string[]>(),
    
    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    
    // Relations
    photographerId: text('photographer_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    photographerIdIdx: index('gallery_photographer_id_idx').on(table.photographerId),
    statusIdx: index('gallery_status_idx').on(table.status),
    slugIdx: index('gallery_slug_idx').on(table.slug),
  })
);

export const image = pgTable(
  'image',
  {
    id: text('id').primaryKey(),
    filename: text('filename').notNull(),
    originalName: text('original_name').notNull(),
    mimeType: text('mime_type').notNull(),
    size: integer('size').notNull(), // File size in bytes as string
    
    // Image metadata
    width: integer('width'),
    height: integer('height'),
    exifData: jsonb('exif_data'), // Camera settings, GPS, etc.
    
    // Storage information
    storagePath: text('storage_path').notNull(), // Path in the storage provider
    thumbnailPath: text('thumbnail_path'),
    previewPath: text('preview_path'), // Medium resolution for viewing
    
    // Display settings
    title: text('title'),
    description: text('description'),
    tags: jsonb('tags').$type<string[]>(),
    isHidden: boolean('is_hidden').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    
    // Processing status
    isProcessed: boolean('is_processed').notNull().default(false),
    processingError: text('processing_error'),
    
    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    capturedAt: timestamp('captured_at', { withTimezone: true }),
    
    // Relations
    galleryId: text('gallery_id')
      .notNull()
      .references(() => gallery.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    galleryIdIdx: index('image_gallery_id_idx').on(table.galleryId),
    isHiddenIdx: index('image_is_hidden_idx').on(table.isHidden),
    sortOrderIdx: index('image_sort_order_idx').on(table.sortOrder),
  })
);

export const galleryAccess = pgTable(
  'gallery_access',
  {
    id: text('id').primaryKey(),
    
    // Access tracking
    ipAddress: inet('ip_address'),
    userAgent: text('user_agent'),
    accessedAt: timestamp('accessed_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    
    // Client information (optional)
    clientName: text('client_name'),
    clientEmail: text('client_email'),
    
    // Relations
    galleryId: text('gallery_id')
      .notNull()
      .references(() => gallery.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    galleryIdIdx: index('gallery_access_gallery_id_idx').on(table.galleryId),
    accessedAtIdx: index('gallery_access_accessed_at_idx').on(table.accessedAt),
  })
);

export const imageDownload = pgTable(
  'image_download',
  {
    id: text('id').primaryKey(),
    
    // Download tracking
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    downloadedAt: timestamp('downloaded_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    
    // Client information (optional)
    clientName: text('client_name'),
    clientEmail: text('client_email'),
    
    // Relations
    imageId: text('image_id')
      .notNull()
      .references(() => image.id, { onDelete: 'cascade' }),
    galleryId: text('gallery_id')
      .notNull()
      .references(() => gallery.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    imageIdIdx: index('image_download_image_id_idx').on(table.imageId),
    galleryIdIdx: index('image_download_gallery_id_idx').on(table.galleryId),
    downloadedAtIdx: index('image_download_downloaded_at_idx').on(table.downloadedAt),
  })
);

// Relations
export const galleryRelations = relations(gallery, ({ one, many }) => ({
  photographer: one(user, {
    fields: [gallery.photographerId],
    references: [user.id],
  }),
  images: many(image),
  accesses: many(galleryAccess),
  downloads: many(imageDownload),
}));

export const imageRelations = relations(image, ({ one, many }) => ({
  gallery: one(gallery, {
    fields: [image.galleryId],
    references: [gallery.id],
  }),
  downloads: many(imageDownload),
}));

export const galleryAccessRelations = relations(galleryAccess, ({ one }) => ({
  gallery: one(gallery, {
    fields: [galleryAccess.galleryId],
    references: [gallery.id],
  }),
}));

export const imageDownloadRelations = relations(imageDownload, ({ one }) => ({
  image: one(image, {
    fields: [imageDownload.imageId],
    references: [image.id],
  }),
  gallery: one(gallery, {
    fields: [imageDownload.galleryId],
    references: [gallery.id],
  }),
}));