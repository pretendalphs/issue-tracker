import { createIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import delay from "delay";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = createIssueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { message: "Validation", errors: validation.error.format() },
      { status: 400 }
    );
  }
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });
  if (!issue) {
    return NextResponse.json("Issue not found", { status: 404 });
  }
  const updatedIssue = await prisma.issue.update({
    where: { id: parseInt(id) },
    data: { title: body.title, description: body.description },
  });
  return NextResponse.json(updatedIssue);
}

export async function DELETE(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  await delay(2000);
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });
  if (!issue) {
    return NextResponse.json("Issue not found", { status: 404 });
  }
  await prisma.issue.delete({ where: { id: parseInt(id) } });
  return NextResponse.json("Issue deleted", { status: 200 });
}
