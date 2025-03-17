import React from "react";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import IssueFormWrapper from "../../_components/IssueFormWrapper";

interface Props {
  params: Promise<{ id: string }>;
}

const EditIssuePage = async ({ params }: Props) => {
  const { id } = await params;

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issue) notFound();

  return <IssueFormWrapper issue={issue} />;
};

export default EditIssuePage;
