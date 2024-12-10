import {
  Avatar,
  Text,
  Card,
  Group,
  MultiSelect,
  MultiSelectProps,
  Badge,
} from "@mantine/core";
import { User } from "@prisma/client";

export default function UserSelect(props: {
  userList: User[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  //Check if no users, if so return badge with msg
  if (props.userList.length == 0) return <Badge>No Users Available</Badge>;
  const userListWrapped = props.userList.map((user: User) => user.email);
  const userMap = new Map(
    props.userList.map((user) => [
      user.email,
      { image: user.image, name: user.name },
    ])
  );


  const renderUserSelect: MultiSelectProps["renderOption"] = ({ option }) => (
    <Group gap="sm">
      <Avatar src={userMap.get(option.value)?.image} size={36} radius="xl" />
      <div>
        <Text size="sm">{userMap.get(option.value)?.name}</Text>
        <Text size="xs" opacity={0.5}>
          {option.value}
        </Text>
      </div>
    </Group>
  );

  return (
    <MultiSelect
      value={props.value}
      onChange={props.onChange}
      label="Select Users"
      data={userListWrapped}
      renderOption={renderUserSelect}
      maxDropdownHeight={200}
    />
  );
}
