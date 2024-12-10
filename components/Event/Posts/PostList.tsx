"use client"
import { Timeline } from "@mantine/core";
import PostCard, { PostFull } from "./PostCard";

export default function PostList(props: { posts: PostFull[] , admin?:boolean}) {


  return (
    <Timeline active={props.posts.length-1}>
      {props.posts.map((post: PostFull) => (
        <Timeline.Item key={post.id}>
          <PostCard post={post} admin={props.admin} />
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
