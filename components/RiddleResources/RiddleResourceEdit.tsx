import {
  Card,
  NumberInput,
  Divider,
  Grid,
  Textarea,
  Group,
  TextInput,
  Center,
  Text,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Riddle, RiddleResource } from "@prisma/client";
import {
  CreateRiddleResource,
  DeleteResource,
  EditRiddleResource,
} from "./RRController";
import { modals } from "@mantine/modals";

export default function RiddleResourceEdit(props: {
  resource: RiddleResource;
  createNew?: boolean;
  onClick?: () => void;
}) {
  const openModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          You are about to delete a resource, this will cause it to disconnect
          from ever related flag. This cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        DeleteResource(props.resource);
        if (props.onClick) props.onClick();
      },
    });

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

        <Textarea
          label="Name"
          {...form.getInputProps("name")}
          placeholder="Name..."
          name="name"
          required
        />
        <Group grow>
          <TextInput label="Link" name="link" {...form.getInputProps("link")} />
          <TextInput
            label="Owner"
            name="owner"
            {...form.getInputProps("owner")}
          />
        </Group>

        <Textarea
          label="Description"
          required
          name="description"
          {...form.getInputProps("description")}
          autosize
          maxRows={16}
        />

        <Textarea
          label="Access Info"
          required
          name="AuthInfo"
          {...form.getInputProps("AuthInfo")}
          autosize
          maxRows={16}
        />

        <Divider />
        <Card.Section p={"1rem"}>
          <Group grow gap="xl">
            <Button type="submit" color="green">
              Submit
            </Button>
            <Button color="red" onClick={openModal}>
              Delete
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  );
}
