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

export default function RiddleResourceCard(props: {
  resource: RiddleResource;
}) {
  return (
    <Card withBorder padding={8}>
      <Stack>
        <Group grow>
          <Title order={4} miw="12rem" maw="20rem">
            {props.resource.id} : {props.resource.name}{" "}
          </Title>
          <RiddleResourceModal resource={props.resource} />

        </Group>
        <Divider />
        <Group grow>
          <Stack gap={0}>
            <Text size="xs" c="dimmed">
              Owner:{" "}
            </Text>
            <Text size="md">{props.resource.owner}</Text>
          </Stack>
          {props.resource.AuthInfo && <Stack gap={0}>
            <Text size="xs" c="dimmed">
              AuthInfo:{" "}
            </Text>
            <Text size="xs">{props.resource.AuthInfo}</Text>
          </Stack>}

          {props.resource.link && (
            <Stack>
              <Button component="a" href={props.resource.link!}>
                Link
              </Button>
            </Stack>
          )}
        </Group>

        <Text size="xs" c="dimmed">
          Description:{" "}
        </Text>
        <Blockquote
          radius={"xl"}
          color="blue"
          cite={"– " + props.resource.owner}
          icon={<RiInformation2Fill />}
          m="lg"
        >
          {props.resource.description}
        </Blockquote>
      </Stack>
    </Card>
  );
}
