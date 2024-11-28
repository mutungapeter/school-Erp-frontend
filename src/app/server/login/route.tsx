import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/login/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null); // Catch invalid JSON
      return NextResponse.json(
        { error: error?.message || "Invalid credentials" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const res = NextResponse.json(data);
    res.cookies.set("accessToken", data.accessToken, {
      httpOnly: true,
      sameSite: "strict", // Changed to lowercase
    });
    res.cookies.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      sameSite: "strict", // Changed to lowercase
    });

    return res;
  } catch (error) {
    console.error("Error in API Route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
