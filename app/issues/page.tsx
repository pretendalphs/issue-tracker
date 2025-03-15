import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import IssueStatus from "../components/IssueStatus";
import Link from "../components/Link";
import IssueActions from "./list/IssueActions";
import { Issue, Status } from "@prisma/client";
import NextLink from "next/link";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import Pagination from "../components/Pagination";
import { Metadata } from "next";

interface IssuesPageProps {
  searchParams: Promise<{
    status?: Status;
    orderBy?: keyof Issue;
    order?: "asc" | "desc";
    page?: string;
  }>;
}

const IssuesPage = async ({ searchParams }: IssuesPageProps) => {
  try {
    const columns: { label: string; value: keyof Issue; className?: string }[] =
      [
        { label: "Issue", value: "title" },
        { label: "Status", value: "status", className: "hidden md:table-cell" },
        {
          label: "Created",
          value: "createdAt",
          className: "hidden md:table-cell",
        },
      ];

    const { status, orderBy, order, page } = await searchParams;
    const pageSize = 10;
    const currentPage = parseInt(page || "1");

    const issues = await prisma.issue.findMany({
      where: {
        ...(status && { status }),
      },
      orderBy: {
        [orderBy || "createdAt"]: order || "desc",
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    const issueCount = await prisma.issue.count({
      where: {
        ...(status && { status }),
      },
    });

    return (
      <div>
        <IssueActions />
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              {columns.map((column) => (
                <Table.Cell key={column.label} className={column.className}>
                  <NextLink
                    href={{
                      query: {
                        status,
                        orderBy: column.value,
                        order:
                          orderBy === column.value && order === "asc"
                            ? "desc"
                            : "asc",
                      },
                    }}
                  >
                    {column.label}
                  </NextLink>
                  {column.value === orderBy &&
                    (order === "asc" ? (
                      <ArrowUpIcon className="inline" />
                    ) : (
                      <ArrowDownIcon className="inline" />
                    ))}
                </Table.Cell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {issues.map((issue) => (
              <Table.Row key={issue.id}>
                <Table.Cell>
                  <Link href={`/issues/${issue.id}`} className="link">
                    {issue.title}
                  </Link>
                  <div className="block md:hidden">
                    <IssueStatus status={issue.status} />
                  </div>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  <IssueStatus status={issue.status} />
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  {issue.createdAt.toDateString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <div className="mt-5">
          <Pagination
            pageSize={pageSize}
            currentPage={currentPage}
            itemCount={issueCount}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering IssuesPage:", error);
    return <div>Error loading issues.</div>;
  }
};

export const dynamic = "force-dynamic";

export default IssuesPage;

export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all Project issues",
};
