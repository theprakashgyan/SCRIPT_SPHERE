import { NextResponse } from "next/server";

type ExecutePayload = {
  language_id?: number;
  source_code?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ExecutePayload;
    const languageId = body?.language_id;
    const sourceCode = body?.source_code;

    if (!languageId || !sourceCode) {
      return NextResponse.json(
        { message: "language_id and source_code are required" },
        { status: 400 }
      );
    }

    const customApiUrl = process.env.JUDGE0_API_URL || process.env.NEXT_PUBLIC_JUDGE0_API_URL;
    const rapidApiKey = process.env.RAPIDAPI_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

    let apiUrl = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (customApiUrl) {
      apiUrl = customApiUrl;
    } else if (rapidApiKey) {
      apiUrl =
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
      headers["x-rapidapi-host"] = "judge0-ce.p.rapidapi.com";
      headers["x-rapidapi-key"] = rapidApiKey;
    } else {
      // Default to public Judge0 CE when no custom/local config exists.
      apiUrl = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";
    }

    const upstreamRes = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        language_id: languageId,
        source_code: sourceCode,
      }),
    });

    const data = await upstreamRes.json();
    return NextResponse.json(data, { status: upstreamRes.status });
  } catch {
    return NextResponse.json(
      {
        message:
          "Execution service is not reachable. Configure Judge0 env vars, or run local Judge0 on port 2358.",
      },
      { status: 502 }
    );
  }
}
