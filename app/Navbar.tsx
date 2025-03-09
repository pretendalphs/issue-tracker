"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillBug } from "react-icons/ai";
import classnames from "classnames";
import {
  Container,
  Flex,
  Box,
  DropdownMenu,
  Avatar,
  Text,
} from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const Navbar = () => {
  const currentPath = usePathname();
  console.log(currentPath);
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];
  const { status, data: session } = useSession();
  return (
    <nav className="flex space-x-6 px-5 items-center justify-between mb-5 border-b h-14">
      <Container>
        <Flex align="center" justify="between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <AiFillBug />
            </Link>
            <ul className="flex space-x-4">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={classnames({
                      "text-zinc-900": currentPath === link.href,
                      "text-zinc-500": currentPath !== link.href,
                      "hover:text-zinc-800": true,
                    })}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Box>
            {status === "authenticated" && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Avatar
                    src={session.user!.image!}
                    fallback="?"
                    size={"3"}
                    radius="full"
                    className="cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Label>
                    <Text size="2">{session.user!.email}</Text>
                  </DropdownMenu.Label>
                  <DropdownMenu.Item>
                    <Link href="/api/auth/signout">Log Out</Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
            {status === "unauthenticated" && (
              <Link href="/api/auth/signin">Log In</Link>
            )}
            {status === "loading" && <Skeleton width={30} height={30} />}
          </Box>
        </Flex>
      </Container>
    </nav>
  );
};

export default Navbar;
