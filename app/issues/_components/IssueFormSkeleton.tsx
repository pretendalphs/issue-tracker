import { Box } from "@radix-ui/themes";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const IssueFormSkeleton = () => {
  return (
    <div>
      <Box className="max-w-3xl">
        <Skeleton height={"2rem"} />
        <Skeleton height={"20rem"} />
      </Box>
    </div>
  );
};

export default IssueFormSkeleton;
