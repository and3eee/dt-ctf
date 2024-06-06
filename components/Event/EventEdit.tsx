'use client';
import { Event } from "@prisma/client";
import { CreateEvent, DeleteEvent, EditEvent } from "./EventControl";
import { useRouter } from "next/navigation";
import {
  Divider,
  Textarea,
  Button,
  TextInput,
  Stack,
  Group,
  Text,
  NumberInput,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { EventProps } from "@/types";

export default function EventEdit(props: {
  event: Event;
  onClick?: () => void;
  createMode?: boolean;
}) {
  const router = useRouter();

  const form = useForm({ mode: "uncontrolled", initialValues: props.event });

  const updateEvent = async (e: Event) => {
    

    if (props.createMode) await CreateEvent(e);
    else await EditEvent(e);

    router.refresh();
  };

  const deleteModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          This action is permanent and cannot be reversed. Please ensure that
          you want to proceed before continuing.
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
    <form
      onSubmit={form.onSubmit((values) => {
        updateEvent(values);
      })}
    >
      <Stack miw="20rem">
        <TextInput
          disabled
          name="id"
          label="Event ID"
          variant="bordered"
          key={form.key("id")}
          {...form.getInputProps("id")}
        />

        <Divider />

        <TextInput
          label="Name"
          name="name"
          placeholder="name"
          required
          key={form.key("name")}
          {...form.getInputProps("name")}
        />

        <NumberInput
          label="Team Size"
          name="teamSize"
          placeholder="Team Size"
          required
          {...form.getInputProps("teamSize")}
        />

        <Textarea
          label="Prize"
          name="prize"
          placeholder="Prize"
          key={form.key("prize")}
          {...form.getInputProps("prize")}
          autosize
          maxRows={5}
        />
        <Group grow>
          <DateTimePicker
            required
            label="Start Date & Time"
            placeholder="Pick date and time"
            key={form.key("start")}
            {...form.getInputProps("start")}
          />
          <DateTimePicker
            required
            label="End Date & Time"
            placeholder="Pick date and time"
            key={form.key("end")}
            {...form.getInputProps("end")}
          />
        </Group>
        <Textarea
          label="Description"
          name="description"
          placeholder="Description"
          required
          autosize
          maxRows={5}
          key={form.key("description")}
          {...form.getInputProps("description")}
        />


          <Group mt="xs">
            <Checkbox
              label="Show Teams"
              name="showTeams"  defaultChecked={props.event.showTeams?? false}
              key={form.key("showTeams")}
              {...form.getInputProps("showTeams")}
            >
              Show Teams
            </Checkbox>

            <Checkbox
              label="Show Participants"
              name="showParticipants"
              defaultChecked={props.event.showParticipants ?? false}
              key={form.key("showParticipants")}
              {...form.getInputProps("showParticipants")}
            >
              Show Participants
            </Checkbox>
            <Checkbox
              name="useTeams"
              label="Use Teams"
              key={form.key("useTeams")}  defaultChecked={props.event.useTeams??false}
              {...form.getInputProps("useTeams")}
            />
            <Checkbox
              name="useAssignedTeams"
              label="Use Assigned Teams"  defaultChecked={props.event.useAssignedTeams ?? false}
              key={form.key("useAssignedTeams")}
              {...form.getInputProps("useAssignedTeams")}
            />
          </Group>

          <Group mt="xs">
            <Checkbox
              label="Require URLs"
              name="urls"  defaultChecked={props.event.requireURL ?? false}
              key={form.key("requireURL")}
              {...form.getInputProps("requireURL")}
            >
              Require URLs
            </Checkbox>
            <Checkbox
              label="Require Screenshot"
              name="screenshot"  defaultChecked={props.event.requireScreenshot ?? false}
              key={form.key("requireScreenshot")}
              {...form.getInputProps("requireScreenshot")}
            >
              Require Screenshot
            </Checkbox>

            <Checkbox
              name="public"
              label="Public"  defaultChecked={props.event.public ?? false}
              key={form.key("public")}
              {...form.getInputProps("public")}
            >
              Public
            </Checkbox>

            <Checkbox
              name="active"
              label="Active"
              defaultChecked={props.event.active ?? false}
              key={form.key("active")}
              {...form.getInputProps("active")}
            >
              Active
            </Checkbox>
            <Checkbox
              name="generatedTeams"
              label="Teams Generated"
              defaultChecked={props.event.generatedTeams}
              key={form.key("generatedTeams")}
              {...form.getInputProps("generatedTeams")}
            >
              Teams Generated
            </Checkbox>
          </Group>
  

        <Divider />

        <Button type="submit" color="Green">
          {props.createMode ? "Create Event" : "Save Changes"}
        </Button>

        {!props.createMode && (
          <Button type="submit" color="red" onClick={deleteModal}>
            Delete Event
          </Button>
        )}
      </Stack>
    </form>
  );
}
