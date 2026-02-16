/**
 * Example API Route with Caching
 *
 * This is a template for creating cached API routes in Next.js App Router.
 * Delete this file if not needed, or use it as a reference.
 */

import { NextResponse } from "next/server";

// Configure caching for this route
// Use this for data that doesn't change frequently
export const revalidate = 3600; // Cache for 1 hour

// Or disable caching for real-time data
// export const dynamic = 'force-dynamic';

/**
 * GET handler - Example of cached API endpoint
 */
export async function GET(request) {
  try {
    // Example: Fetch data from external API
    const response = await fetch("https://api.example.com/data", {
      next: {
        revalidate: 3600, // Cache this fetch for 1 hour
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    // Return cached response
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

/**
 * POST handler - Example of non-cached endpoint
 * POST requests should never be cached
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Process the request
    // This will never be cached

    return NextResponse.json(
      { success: true, data: body },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
