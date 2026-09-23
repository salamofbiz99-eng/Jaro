import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey(),
  contentJson: text("content_json").notNull(),
  updatedBy: text("updated_by").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const quoteRequests = sqliteTable("quote_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  service: text("service").notNull(),
  propertyType: text("property_type").notNull(),
  postcode: text("postcode").notNull(),
  approximateSize: text("approximate_size").notNull(),
  preferredDate: text("preferred_date").notNull(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  details: text("details").notNull(),
  emailStatus: text("email_status").notNull(),
  createdAt: text("created_at").notNull(),
});
