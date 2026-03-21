import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // clerkId
    email: v.string(),
    name: v.string(),
    isPro: v.boolean(),
    proSince: v.optional(v.number()),
    lemonSqueezyCustomerId: v.optional(v.string()),
    lemonSqueezyOrderId: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  codeExecutions: defineTable({
    userId: v.string(),
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  savedCodes: defineTable({
    userId: v.string(),
    title: v.string(),
    language: v.string(),
    code: v.string(),
    userName: v.string(), // store user's name for easy access
  }).index("by_user_id", ["userId"]),

  savedCodeComments: defineTable({
    savedCodeId: v.id("savedCodes"),
    userId: v.string(),
    userName: v.string(),
    content: v.string(), // This will store HTML content
  }).index("by_saved_code_id", ["savedCodeId"]),

  stars: defineTable({
    userId: v.string(),
    savedCodeId: v.id("savedCodes"),
  })
    .index("by_user_id", ["userId"])
    .index("by_saved_code_id", ["savedCodeId"])
    .index("by_user_id_and_saved_code_id", ["userId", "savedCodeId"]),
});
