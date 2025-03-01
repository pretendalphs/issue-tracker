import IssueStatus from "@/app/components/IssueStatus";
import prisma from "@/prisma/client";
import { Box, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import delay from "delay";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface IssueDetailPageProps {
  params: {
    id: string;
  };
}

const IssueDetailPage = async ({ params }: IssueDetailPageProps) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue) {
    notFound();
  }
  await delay(2000);
  return (
    <Grid columns={"2"} gap="4">
      <Box>
        <Heading>{issue.title}</Heading>
        <Flex className="space-x-3 items-center" my={"2"}>
          <IssueStatus status={issue.status} />
          <Text>{issue.createdAt.toDateString()}</Text>
        </Flex>
        <Card>
          <ReactMarkdown>{issue.description}</ReactMarkdown>
        </Card>
      </Box>
      <Box>
        <Button>Close Issue</Button>
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;
