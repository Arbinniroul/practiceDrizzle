import { relations } from "drizzle-orm";
import {
	AnyPgColumn,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import {  user } from "@/db/schema/user";
import {  post } from "@/db/schema/post";

export const comment = pgTable("comment", {
	id: serial("id").primaryKey(),
	parentId: integer("parent_id").references((): AnyPgColumn => comment.id),

	userId: integer("user_id")
		.references(() => user.id)
		.notNull(),
	content: text("content").notNull(),
	postId: integer("post_id")
    .references(()=>post.id)
    .notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const commentRelations = relations(comment, ({ one }) => ({
	user: one(user, {
		fields: [comment.userId],
		references: [user.id],
	}),
	post: one(post, {
		fields: [comment.postId],
		references: [post.id],
	}),
}));

export const commentSchema = createInsertSchema(comment, {
	postId: (schema) => schema.min(1),
	content: (schema) => schema.min(1),
	userId: (schema) => schema.min(1),
}).pick({
	postId: true,
	content: true,
	parentId: true,
	userId: true,
	id: true,
});
export type CommentSchema = z.infer<typeof commentSchema>;