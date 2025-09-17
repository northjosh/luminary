import { TRPCError } from "@trpc/server";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { gallery, image } from "../db/schema/gallery";
import { protectedProcedure, router } from "../lib/trpc";
import { generateId } from "better-auth";

const createGallerySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required").max(255).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional(),
  eventDate: z.string().datetime().optional(),
  eventLocation: z.string().optional(),
  isPasswordProtected: z.boolean().default(false),
  password: z.string().optional(),
  allowDownloads: z.boolean().default(true),
  allowComments: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  storageProvider: z.enum(['local', 'google_drive', 'dropbox', 's3', 'onedrive']).default('local'),
});

const updateGallerySchema = createGallerySchema.partial().extend({
  id: z.string(),
});

const galleryStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['draft', 'active', 'archived', 'private']),
});

export const galleryRouter = router({
  // Create a new gallery
  create: protectedProcedure
    .input(createGallerySchema)
    .mutation(async ({ input, ctx }) => {
      const { password, eventDate, ...galleryData } = input;
      
      // Check if slug is already taken by this photographer
      const existingGallery = await db.query.gallery.findFirst({
        where: and(
          eq(gallery.slug, input.slug),
          eq(gallery.photographerId, ctx.session.user.id)
        ),
      });

      if (existingGallery) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A gallery with this slug already exists",
        });
      }

      const galleryId = generateId();
      
      const newGallery = await db
        .insert(gallery)
        .values({
          id: galleryId,
          ...galleryData,
          eventDate: eventDate ? new Date(eventDate) : null,
          password: password || null, // Store password (you may want to hash this later)
          photographerId: ctx.session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return newGallery[0];
    }),

  // Get all galleries for the authenticated photographer
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(['draft', 'active', 'archived', 'private']).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const whereConditions = [eq(gallery.photographerId, ctx.session.user.id)];
      
      if (input.status) {
        whereConditions.push(eq(gallery.status, input.status));
      }

      const galleries = await db.query.gallery.findMany({
        where: and(...whereConditions),
        orderBy: [desc(gallery.updatedAt)],
        limit: input.limit,
        offset: input.offset,
        with: {
          images: {
            limit: 1, // Just get the first image for cover
            orderBy: [image.sortOrder],
          },
        },
      });

      return galleries;
    }),

  // Get a specific gallery by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const galleryData = await db.query.gallery.findFirst({
        where: and(
          eq(gallery.id, input.id),
          eq(gallery.photographerId, ctx.session.user.id)
        ),
        with: {
          images: {
            orderBy: [image.sortOrder, image.createdAt],
          },
        },
      });

      if (!galleryData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gallery not found",
        });
      }

      return galleryData;
    }),

  // Update gallery
  update: protectedProcedure
    .input(updateGallerySchema)
    .mutation(async ({ input, ctx }) => {
      const { id, password, eventDate, ...updateData } = input;

      // Verify ownership
      const existingGallery = await db.query.gallery.findFirst({
        where: and(
          eq(gallery.id, id),
          eq(gallery.photographerId, ctx.session.user.id)
        ),
      });

      if (!existingGallery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gallery not found",
        });
      }

      // Check slug uniqueness if it's being updated
      if (updateData.slug && updateData.slug !== existingGallery.slug) {
        const slugExists = await db.query.gallery.findFirst({
          where: and(
            eq(gallery.slug, updateData.slug),
            eq(gallery.photographerId, ctx.session.user.id)
          ),
        });

        if (slugExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A gallery with this slug already exists",
          });
        }
      }

      const updatedGallery = await db
        .update(gallery)
        .set({
          ...updateData,
          eventDate: eventDate ? new Date(eventDate) : existingGallery.eventDate,
          password: password || existingGallery.password,
          updatedAt: new Date(),
        })
        .where(eq(gallery.id, id))
        .returning();

      return updatedGallery[0];
    }),

  // Update gallery status
  updateStatus: protectedProcedure
    .input(galleryStatusSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const existingGallery = await db.query.gallery.findFirst({
        where: and(
          eq(gallery.id, input.id),
          eq(gallery.photographerId, ctx.session.user.id)
        ),
      });

      if (!existingGallery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gallery not found",
        });
      }

      const updatedGallery = await db
        .update(gallery)
        .set({
          status: input.status,
          publishedAt: input.status === 'active' ? new Date() : existingGallery.publishedAt,
          updatedAt: new Date(),
        })
        .where(eq(gallery.id, input.id))
        .returning();

      return updatedGallery[0];
    }),

  // Delete gallery
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const existingGallery = await db.query.gallery.findFirst({
        where: and(
          eq(gallery.id, input.id),
          eq(gallery.photographerId, ctx.session.user.id)
        ),
      });

      if (!existingGallery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gallery not found",
        });
      }

      await db.delete(gallery).where(eq(gallery.id, input.id));

      return { success: true };
    }),

  // Get gallery statistics
  getStats: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Verify ownership
      const existingGallery = await db.query.gallery.findFirst({
        where: and(
          eq(gallery.id, input.id),
          eq(gallery.photographerId, ctx.session.user.id)
        ),
      });

      if (!existingGallery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gallery not found",
        });
      }

      // Get image count
      const imageCount = await db.query.image.findMany({
        where: eq(image.galleryId, input.id),
      });

      // Get access count (you'll need to implement gallery access tracking)
      // const accessCount = await db.query.galleryAccess.findMany({
      //   where: eq(galleryAccess.galleryId, input.id),
      // });

      return {
        imageCount: imageCount.length,
        // accessCount: accessCount.length,
        // downloadCount: 0, // Implement based on imageDownload table
      };
    }),
});