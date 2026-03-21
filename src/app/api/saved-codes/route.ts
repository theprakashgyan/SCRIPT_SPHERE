import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

type SaveCodePayload = {
  title?: string;
  language?: string;
  code?: string;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Please sign in to save code." }, { status: 401 });
    }

    const body = (await req.json()) as SaveCodePayload;
    const title = body?.title?.trim();
    const language = body?.language?.trim();
    const code = body?.code;

    if (!title || !language || !code) {
      return NextResponse.json(
        { message: "title, language, and code are required." },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const displayName =
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "User";
    const email = user?.emailAddresses?.[0]?.emailAddress || "";

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    await convex.mutation(api.savedCodes.createSavedCodeByUser, {
      userId,
      email,
      name: displayName,
      title,
      language,
      code,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Failed to save code." }, { status: 500 });
  }
}
