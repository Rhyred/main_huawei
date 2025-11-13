import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password, connectionType } = await request.json()

    // Simple authentication logic
    if (username === "admin" && password === "admin") {
      return NextResponse.json({
        success: true,
        message: "Authentication successful",
        connectionType,
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials",
      },
      { status: 401 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
      },
      { status: 500 },
    )
  }
}

// Default export for Next.js API route compatibility
export default function handler(request: NextRequest) {
  if (request.method === "POST") {
    return POST(request)
  }

  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}
