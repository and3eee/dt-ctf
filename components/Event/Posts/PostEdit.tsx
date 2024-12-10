"use client";
import UserSelect from "@/components/User/UserSelect";
import { Button, Text, Card, Textarea, TextInput, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Post, User } from "@prisma/client";
import { useState } from "react";
import { CreatePost, UpdatePost } from "./PostControl";
import { useRouter } from "next/navigation";
import { PostFull } from "./PostCard";

export default function PostEdit(props: {
  createMode?: Boolean;
  post?: PostFull;
  eventID: string;
  userList: User[];
}) {
  const examplePost: Post = {
    id: "",
    title: "Example Post",
    content: "This is a placeholder post. Please edit it before posting.",
    postedOn: new Date(),
    updatedAt: new Date(),
    eventId: props.eventID,
  };
  const [postVar, setPost] = useState<Post>(props.post ?? examplePost);
  const [selectedEmails, setSelected] = useState<string[]>(
    props.post ? props.post.linkedUsers.map((user) => user.email) : []
  );

  const router = useRouter();

  const post = async () => {
    if (props.createMode) {
      const resp = await CreatePost(postVar, selectedEmails);
      if (resp) router.refresh();
    } else {
      const resp = await UpdatePost(postVar, selectedEmails);
      if (resp) router.refresh();
    }
  };
  return (
    <Stack>
      <TextInput
        label="Title"
        value={postVar.title}
        onChange={(event) => {
          setPost({
            id: postVar.id,
            title: event.currentTarget.value,
            content: postVar.content,
            postedOn: new Date(),
            updatedAt: new Date(),
            eventId: props.eventID,
          });
        }}
      />

      <Textarea
        label="Content"
        value={postVar.content}
        onChange={(event) => {
          setPost({
            id: postVar.id,
            title: postVar.title,
            content: event.currentTarget.value,
            postedOn: new Date(),
            updatedAt: new Date(),
            eventId: props.eventID,
          });
        }}
      />
      <UserSelect
        userList={props.userList}
        value={selectedEmails}
        onChange={setSelected}
      />
      <Button onClick={post}>Post it</Button>
    </Stack>
  );
}

export function PostEditModal(props: {
  createMode?: Boolean;
  post?: PostFull;
  eventID: string;
  userList: User[];
}) {
  const openModal = () =>
    modals.open({
      title: props.createMode ? "Create Post" : "Edit Post",
      children: (
        <PostEdit
          createMode={props.createMode}
          post={props.post}
          eventID={props.eventID}
          userList={props.userList}
        />
      ),
    });

  return (
    <Button maw={"8rem"} onClick={openModal}>
      {props.createMode ? "Create Post" : "Edit Post"}
    </Button>
  );
}
