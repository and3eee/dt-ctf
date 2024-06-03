import {
  Button,
  Divider,
  Group,
  Select,
  Slider,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { User } from "@prisma/client";
import { UpdateUser } from "./UserControl";
import AdminCheck from "../Auth/AdminCheck";

export default function UserEdit(props: { user: User; onClick?: () => void; isEventLinked? :boolean }) {
  const form = useForm<User>({
    mode: "uncontrolled",
    initialValues: props.user,
  });

  const submissionHandler = async (values: typeof form.values) => {
    const reply = await UpdateUser(values);
    if (props.onClick) props.onClick();
  };

  return (
    <form onSubmit={form.onSubmit(submissionHandler)}>
      <Stack>
        {!props.isEventLinked && <Group grow>
          <TextInput label="Name" {...form.getInputProps("name")} />
          <TextInput disabled label="Email" {...form.getInputProps("email")} />
        </Group>}
        <Group grow>
          <Select
            label="Bucket"
            placeholder="Pick a bucket"
            {...form.getInputProps("bucket")}
            data={["Agent", "Environment", "DEM", "Platform", "none"]}
          />
          <AdminCheck>
            <Select
              label="Role"
              placeholder="Pick a role"
              {...form.getInputProps("role")}
              data={["USER", "FLAGMASTER", "ORGANIZER", "ADMIN"]}
            />
          </AdminCheck>
        </Group>
        <Stack gap={0}>
          <Text>Skill Level</Text>
          <Text c="dimmed" size="xs">
            1-10, 10 being SME
          </Text>
          <Slider
            mt={"2rem"}
            labelAlwaysOn
            min={1}
            max={10}
            {...form.getInputProps("skillLevel")}
          />
        </Stack>
        <Button type="submit">Update User</Button>
      </Stack>
    </form>
  );
}
