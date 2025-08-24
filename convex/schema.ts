import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Table to store business data that users can query
  business_data: defineTable({
    table_name: v.string(),
    column_name: v.string(),
    data_type: v.string(),
    sample_values: v.array(v.string()),
    description: v.optional(v.string()),
  }).index("by_table", ["table_name"]),

  // Table to store actual business records (simplified example)
  customers: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    created_at: v.number(),
  }),

  orders: defineTable({
    customer_id: v.id("customers"),
    order_date: v.number(),
    total_amount: v.number(),
    status: v.string(),
    product_name: v.string(),
    quantity: v.number(),
  }),

  // Table to store training data for Vanna.ai
  training_data: defineTable({
    question: v.string(),
    sql: v.string(),
    explanation: v.optional(v.string()),
    created_at: v.number(),
  }),
});
