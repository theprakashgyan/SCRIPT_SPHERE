import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSavedCode = mutation({
  args: {
    title: v.string(),
    language: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    let user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user) {
      const displayName = identity.name?.trim() || identity.email?.split("@")[0] || "User";
      const userId = await ctx.db.insert("users", {
        userId: identity.subject,
        email: identity.email || "",
        name: displayName,
        isPro: false,
      });
      user = await ctx.db.get(userId);
    }

    const savedCodeId = await ctx.db.insert("savedCodes", {
      userId: identity.subject,
      userName: user?.name || identity.name || "User",
      title: args.title,
      language: args.language,
      code: args.code,
    });

    return savedCodeId;
  },
});

export const createSavedCodeByUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    title: v.string(),
    language: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    let user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      const userDocId = await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        isPro: false,
      });
      user = await ctx.db.get(userDocId);
    }

    return await ctx.db.insert("savedCodes", {
      userId: args.userId,
      userName: user?.name || args.name || "User",
      title: args.title,
      language: args.language,
      code: args.code,
    });
  },
});

export const deleteSavedCode = mutation({
  args: {
    savedCodeId: v.id("savedCodes"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const savedCode = await ctx.db.get(args.savedCodeId);
    if (!savedCode) throw new Error("Saved code not found");

    if (savedCode.userId !== identity.subject) {
      throw new Error("Not authorized to delete this saved code");
    }

    const comments = await ctx.db
      .query("savedCodeComments")
      .withIndex("by_saved_code_id")
      .filter((q) => q.eq(q.field("savedCodeId"), args.savedCodeId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    const stars = await ctx.db
      .query("stars")
      .withIndex("by_saved_code_id")
      .filter((q) => q.eq(q.field("savedCodeId"), args.savedCodeId))
      .collect();

    for (const star of stars) {
      await ctx.db.delete(star._id);
    }

    await ctx.db.delete(args.savedCodeId);
  },
});

export const toggleSavedCodeStar = mutation({
  args: {
    savedCodeId: v.id("savedCodes"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("stars")
      .withIndex("by_user_id_and_saved_code_id")
      .filter(
        (q) =>
          q.eq(q.field("userId"), identity.subject) &&
          q.eq(q.field("savedCodeId"), args.savedCodeId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("stars", {
        userId: identity.subject,
        savedCodeId: args.savedCodeId,
      });
    }
  },
});

export const addSavedCodeComment = mutation({
  args: {
    savedCodeId: v.id("savedCodes"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.insert("savedCodeComments", {
      savedCodeId: args.savedCodeId,
      userId: identity.subject,
      userName: user.name,
      content: args.content,
    });
  },
});

export const deleteSavedCodeComment = mutation({
  args: { commentId: v.id("savedCodeComments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== identity.subject) {
      throw new Error("Not authorized to delete this comment");
    }

    await ctx.db.delete(args.commentId);
  },
});

export const getSavedCodes = query({
  handler: async (ctx) => {
    const savedCodes = await ctx.db.query("savedCodes").order("desc").collect();
    return savedCodes;
  },
});

export const getSavedCodeById = query({
  args: { savedCodeId: v.id("savedCodes") },
  handler: async (ctx, args) => {
    const savedCode = await ctx.db.get(args.savedCodeId);
    if (!savedCode) throw new Error("Saved code not found");

    return savedCode;
  },
});

export const getSavedCodeComments = query({
  args: { savedCodeId: v.id("savedCodes") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("savedCodeComments")
      .withIndex("by_saved_code_id")
      .filter((q) => q.eq(q.field("savedCodeId"), args.savedCodeId))
      .order("desc")
      .collect();

    return comments;
  },
});

export const isSavedCodeStarred = query({
  args: {
    savedCodeId: v.id("savedCodes"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const star = await ctx.db
      .query("stars")
      .withIndex("by_user_id_and_saved_code_id")
      .filter(
        (q) =>
          q.eq(q.field("userId"), identity.subject) &&
          q.eq(q.field("savedCodeId"), args.savedCodeId)
      )
      .first();

    return !!star;
  },
});

export const getSavedCodeStarCount = query({
  args: { savedCodeId: v.id("savedCodes") },
  handler: async (ctx, args) => {
    const stars = await ctx.db
      .query("stars")
      .withIndex("by_saved_code_id")
      .filter((q) => q.eq(q.field("savedCodeId"), args.savedCodeId))
      .collect();

    return stars.length;
  },
});

export const getStarredSavedCodes = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const stars = await ctx.db
      .query("stars")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    const savedCodes = await Promise.all(stars.map((star) => ctx.db.get(star.savedCodeId)));

    return savedCodes.filter((savedCode) => savedCode !== null);
  },
});
