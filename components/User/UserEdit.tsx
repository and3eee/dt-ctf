import {
  Button,
  Divider,
  Group,
  Select,
  Slider,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { User } from "@prisma/client";
import { UpdateUser } from "./UserControl";

export default function UserEdit(props: { user: User; onClick?: () => void }) {
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
        <Group grow>
          <TextInput label="Name" {...form.getInputProps("name")} />
          <TextInput label="Email" {...form.getInputProps("email")} />
        </Group>
        <Group grow>
          <Select
            label="Bucket"
            placeholder="Pick a bucket"
            {...form.getInputProps("bucket")}
            data={["Agent", "Environment", "DEM", "Platform", "none"]}
          />
                    <Select
            label="Role"
            placeholder="Pick a role"
            {...form.getInputProps("role")}
            data={["USER", "FLAGMASTER", "ORGANIZER", "ADMIN"]}
          />
         
        </Group>
        <Slider
        mt={"2rem"}
            labelAlwaysOn
            min={1}
            max={10}
            label="Skill Level"
            {...form.getInputProps("skillLevel")}
          />
        <Button type="submit">Update User</Button>
      </Stack>
    </form>
  );
}
