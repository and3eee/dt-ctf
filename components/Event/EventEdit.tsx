"use client";
import { Event } from "@prisma/client";
import { CreateEvent, EditEvent } from "./EventControl";
import { useRouter } from "next/navigation";
import {
  Divider,
  Textarea,
  Switch,
  Button,
  TextInput,
  Stack,
  Group,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";

export default function EventEdit(props: {
  event: Event;
  onClick?: () => void;
  createMode?: boolean;
}) {
  const router = useRouter();

  const form = useForm({ mode: "uncontrolled", initialValues: props.event });

  const updateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (props.createMode) await CreateEvent(formData);
    else await EditEvent(formData);

    router.refresh();
  };


  const deleteModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          This action is permanent and cannot be reversed. Please ensure that you want to proceed before continuing.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => {},
      onConfirm: () => {
        DeleteEvent(props.event);
        if (props.onClick) props.onClick();
      },
    });

  return (
    <form onSubmit={updateEvent}>
      <Stack miw="20rem">
        <TextInput
          disabled
          name="id"
          defaultValue={props.event.id}
          label="Event ID"
          variant="bordered"
          {...form.getInputProps("id")}
        />

        <Divider />

        <TextInput
          label="Name"
          name="name"
          placeholder="name"
          defaultValue={props.event.name}
          required
          {...form.getInputProps("name")}
        />

        <NumberInput
          label="Team Size"
          name="teamSize"
          placeholder="Team Size"
          defaultValue={props.event.teamSize}
          required
          {...form.getInputProps("teamSize")}
        />

        <Textarea
          label="Prize"
          name="prize"
          placeholder="Prize"
          defaultValue={props.event.prize ?? ""}
          {...form.getInputProps("prize")}
          autosize
          maxRows={5}
        />
        <Group grow>
          <DateTimePicker
            required
            label="Start Date & Time"
            placeholder="Pick date and time"
            {...form.getInputProps("start")}
          />
          <DateTimePicker
            required
            label="End Date & Time"
            placeholder="Pick date and time"
            {...form.getInputProps("end")}
          />
        </Group>
        <Textarea
          label="Description"
          name="description"
          placeholder="Description"
          defaultValue={props.event.description}
          required
          autosize
          maxRows={5}
          {...form.getInputProps("description")}
        />
        <Switch.Group label="Attendee settings">
          <Group mt="xs">
            <Switch
              value="showTeams"
              label="Show Teams"
              name="showTeams"
              defaultChecked={props.event.showTeams ?? true}
              {...form.getInputProps("showTeams")}
            >
              Show Teams
            </Switch>
            <Switch
              value="showParticipants"
              label="Show Participants"
              name="showParticipants"
              defaultChecked={props.event.showParticipants ?? false}
              {...form.getInputProps("showParticipants")}
            >
              Show Participants
            </Switch>

            <Switch
              value="useTeams"
              name="useTeams"
              label="Use Teams"
              defaultChecked={props.event.useTeams ?? true}
              {...form.getInputProps("useTeams")}
            />
            <Switch
              value="useAssignedTeams"
              name="useAssignedTeams"
              label="Use Assigned Teams"
              defaultChecked={props.event.useAssignedTeams ?? true}
              {...form.getInputProps("useAssignedTeams")}
            />
          </Group>
        </Switch.Group>
        <Switch.Group label="Event Settings">
          <Group mt="xs">
            <Switch
              value="urls"
              label="Require URLs"
              name="urls"
              defaultChecked={props.event.requireURL ?? false}
              {...form.getInputProps("requireURL")}
            >
              Require URLs
            </Switch>
            <Switch
              value="screenshot"
              label="Require Screenshot"
              name="screenshot"
              defaultChecked={props.event.requireScreenshot ?? false}
              {...form.getInputProps("requireScreenshot")}
            >
              Require Screenshot
            </Switch>

            <Switch
              value="public"
              name="public"
              label="Public"
              defaultChecked={props.event.public}
              {...form.getInputProps("public")}
            >
              Public
            </Switch>

            <Switch
              value="active"
              name="active"
              label="Active"
              defaultChecked={props.event.active ?? false}
              {...form.getInputProps("active")}
            >
              Active
            </Switch>
          </Group>
        </Switch.Group>

        <Divider />

        <Button
          type="submit"
          color="Green"
          onClick={props.onClick ? props.onClick : undefined}
        >
          {props.createMode ? "Create Event" : "Save Changes"}
        </Button>
      </Stack>
    </form>
  );
}
