import AdminCheck from "./Auth/AdminCheck";
import {
  Chip,
  Kbd,
  NavLink,
  Paper,
  ScrollArea,
  Space,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import {
  RiBook2Fill,
  RiBook2Line,
  RiBook3Line,
  RiCalendar2Fill,
  RiHome2Fill,
  RiMessage3Line,
} from "react-icons/ri";
import ContributorCheck from "./Auth/ContributorCheck";
import RiddleSolutionGenerator from "./Riddle/RiddleSolutionGen";
import RiddleResourceList from "./RiddleResources/RiddleResourceList";

export const Navbar = () => {
  const searchInput = (
    <TextInput
      aria-label="Search"
      classNames={{
        input: "text-sm",
      }}
      placeholder="Search..."
      type="search"
    />
  );

  return (
    <Paper >
     
        <Stack gap={0}>
          <NavLink
            href="/"
            label="Go to Homepage"
            leftSection={<RiHome2Fill size="1rem" />}
          />
          <AdminCheck>
            <Space h={"1rem"} />
            <Title order={5}>Admin Utils</Title>

            <NavLink
              href="/admin/events"
              label="Event List"
              leftSection={<RiCalendar2Fill size="1rem" />}
            />
            <NavLink
              href="/admin/users"
              label="User List"
              leftSection={<RiCalendar2Fill size="1rem" />}
            />
          </AdminCheck>
          <ContributorCheck>
            <Space h={"1rem"} />
            <Title order={5}>Contributor Utils</Title>

            <NavLink
              href="/admin/riddles"
              label="Riddle List"
              leftSection={<RiMessage3Line size="1rem" />}
            />
            <NavLink
              href="/admin/docs/"
              label="Docs"
              leftSection={<RiBook2Line size="1rem" />}
            />
            
            <RiddleResourceList />

            <RiddleSolutionGenerator />
          </ContributorCheck>
        </Stack>
     
    </Paper>
  );
};
