import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createIssueSchema } from "../../validationSchema";
import authOptions from "@/app/auth/authOption";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validation = createIssueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { message: "Validation error", errors: validation.error.format() },
      { status: 400 }
    );
  }
  const newIssue = await prisma.issue.create({
    data: { title: body.title, description: body.description },
  });
  return new Response(JSON.stringify(newIssue), { status: 201 });
}
