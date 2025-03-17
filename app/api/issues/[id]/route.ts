import authOptions from "@/app/auth/authOption";
import { patchIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import delay from "delay";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface ParamsProps {
  params: Promise<{ id: string }>;
}
export async function PATCH(request: NextRequest, { params }: ParamsProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const validation = patchIssueSchema.safeParse(body);
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
  if (body.assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: body.assignedToUserId },
    });
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: parseInt(id) },
    data: {
      title: body.title,
      description: body.description,
      assignedToUserId: body.assignedToUserId,
    },
  });
  return NextResponse.json(updatedIssue);
}

export async function DELETE(request: NextRequest, { params }: ParamsProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
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
