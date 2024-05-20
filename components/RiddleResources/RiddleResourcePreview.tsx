import {
  Card,
  Divider,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Blockquote,
  ActionIcon,
} from "@mantine/core";
import { RiddleResource } from "@prisma/client";
import { RiInformation2Fill, RiPencilLine } from "react-icons/ri";
import RiddleResourceModal from "./RiddleResourceModal";
import { modals } from "@mantine/modals";

export default function RiddleResourcePreview(props: {
  resource: RiddleResource;
}) {
  return (
    <Card shadow="lg" withBorder padding={8}>
      <Stack>
        <Group grow>
          <Title order={4} miw="12rem" maw="20rem">
            {props.resource.name}{" "}
          </Title>
        </Group>
        <Divider />

        {props.resource.AuthInfo && (
          <Stack gap={0}>
            <Text size="xs" c="dimmed">
              Access Info:
            </Text>
            <Text size="s">{props.resource.AuthInfo}</Text>
          </Stack>
        )}

        <Stack gap={0}>
          <Text size="xs" c="dimmed">
            Description:
          </Text>
          <Text>{props.resource.description}</Text>
        </Stack>

        {props.resource.link && (
          <Stack>
            <Button component="a" href={props.resource.link!}>
              Link
            </Button>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
