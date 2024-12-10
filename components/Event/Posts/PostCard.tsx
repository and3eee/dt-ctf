import {
  Avatar,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { Post, User } from "@prisma/client";
import { PostEditModal } from "./PostEdit";

export interface PostFull extends Post {
  linkedUsers: User[];
}

export default function PostCard(props: { post: PostFull, admin?:boolean }) {
  const post = props.post;

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Title order={2}>{post.title}</Title>
        {props.post.linkedUsers && (
          <Avatar.Group>
            {props.post.linkedUsers.map((user: User) => (
              <Tooltip key={user.name} label={user.name}>
                <Avatar src={user.image} />
              </Tooltip>
            ))}
          </Avatar.Group>
        )}
      </Group>

      <Text size="xs" c="dimmed">{post.postedOn.toLocaleString()}</Text>
      <Text>{post.content}</Text>
      {props.admin && <PostEditModal post={props.post} eventID={post.eventId} userList={post.linkedUsers}/> }
    </Stack>
  );
}
