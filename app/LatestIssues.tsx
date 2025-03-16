import prisma from "@/prisma/client";
import { Avatar, Flex, Table, Card, Heading } from "@radix-ui/themes";
import React from "react";
import Link from "next/link";
import { IssueStatus } from "./components";

const LatestIssues = async () => {
  const issues = await prisma.issue.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });
  return (
    <Card>
      <Heading size={"3"} className="pl-2">
        Latest Issues
      </Heading>
      <Table.Root>
        <Table.Body>
          {issues.map((issues) => (
            <Table.Row key={issues.id}>
              <Table.Cell>
                <Flex justify={"between"}>
                  <Flex direction="column" align="start" gap="2">
                    <Link href={`/issues/${issues.id}`} className="link">
                      {issues.title}
                    </Link>
                    <IssueStatus status={issues.status} />
                  </Flex>
                  {issues.assignedToUser && (
                    <Avatar
                      src={issues.assignedToUser.image!}
                      fallback="?"
                      width={10}
                      height={10}
                      radius="full"
                    />
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestIssues;
