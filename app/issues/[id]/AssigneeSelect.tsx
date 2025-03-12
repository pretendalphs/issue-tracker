"use client";

import { Select } from "@radix-ui/themes";
import { Issue, User } from "@prisma/client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get<User[]>("/api/users");
      return data;
    },
    staleTime: 1000 * 60,
    retry: 3,
  });
  if (error) return null;
  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId?.toString() || "false"}
        onValueChange={async (userId) => {
          try {
            await axios.patch(`/api/issues/${issue.id}`, {
              assignedToUserId: userId === "false" ? null : userId,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            toast.error("Failed to assign user");
          }
        }}
      >
        <Select.Trigger placeholder="Assign" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="false">Unassigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id.toString()}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

export default AssigneeSelect;
