import { NextRequest, NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  supabaseAdmin,
} from "@/lib/supabase/client";
import { db } from "@/lib/supabase/db";
import { workspaces } from "@/lib/supabase/schema";
import { eq } from "drizzle-orm";

// Example route to get the current user and their workspaces
export async function GET(request: NextRequest) {
  try {
    // Get the session from Supabase using the server client
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user's workspaces from the database using Drizzle
    const workspacesData = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.workspaceOwner, session.user.id));

    return NextResponse.json({
      user: session.user,
      workspaces: workspacesData,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Example route to create a new workspace
export async function POST(request: NextRequest) {
  try {
    // Get the session from Supabase using the server client
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse request body
    const { title, iconId, logo, bannerUrl } = await request.json();

    // Create a new workspace using Drizzle
    const [newWorkspace] = await db
      .insert(workspaces)
      .values({
        title,
        iconId,
        workspaceOwner: session.user.id,
        data: JSON.stringify({}),
        inTrash: "false",
        logo,
        bannerUrl,
      })
      .returning();

    return NextResponse.json({
      workspace: newWorkspace,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
