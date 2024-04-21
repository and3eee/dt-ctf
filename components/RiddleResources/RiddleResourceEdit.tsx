import {
  Card,
  NumberInput,
  Divider,
  Grid,
  Textarea,
  Group,
  TextInput,
  Select,
  Center,
  Stack,
  Title,
  SegmentedControl,
  Flex,
  Switch,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Riddle, RiddleResource } from "@prisma/client";
import { CreateRiddleResource, EditRiddleResource } from "./RRController";

export default function RiddleResourceEdit(props: {
  resource: RiddleResource;
  createNew?: boolean;
  onClick?: () => void;
}) {
  const form = useForm<RiddleResource>({
    mode: "uncontrolled",
    initialValues: props.resource,
  });

  const submissionHandler = async (values: typeof form.values) => {
    const riddle: RiddleResource = values;
    if (props.createNew || props.resource.id == 0) {
      const reply = await CreateRiddleResource(riddle);
    } else {
      const reply = await EditRiddleResource(riddle);
    }
    if (props.onClick) props.onClick();
  };

  return (
    <form onSubmit={form.onSubmit(submissionHandler)}>
      <Card miw={"32rem"} maw={"48rem"} mah="40rem">
        <NumberInput
          disabled
          {...form.getInputProps("id")}
          label="ID"
          variant="bordered"
        />

        <Divider />
        <Grid p={8}>
          <Grid.Col span={12}>
            <Textarea
              label="Name"
              {...form.getInputProps("name")}
              placeholder="Name..."
              name="name"
              required
            />
            <Group grow>
              <TextInput
                label="Description"
                required
                name="description"
                {...form.getInputProps("description")}
              />
              <TextInput
                label="Owner"
                name="owner"
                {...form.getInputProps("owner")}
              />
            </Group>

            <Textarea
              label="Link"
              name="link"
              {...form.getInputProps("link")}
            />
          </Grid.Col>
        </Grid>

        <Divider />
        <Card.Section p={"1rem"}>
          <Center>
            <Button type="submit" color="green">
              Submit
            </Button>
          </Center>
        </Card.Section>
      </Card>
    </form>
  );
}
