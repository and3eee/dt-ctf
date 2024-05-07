"use client";

import { prisma } from "@/lib/prisma";
import {
  Button,
  Collapse,
  Grid,
  Group,
  Loader,
  NavLink,
  ScrollArea,
  Stack,
} from "@mantine/core";
import { RiddleResource } from "@prisma/client";
import RiddleResourceCard from "./RiddleResourceCard";
import { GetRiddleResources } from "./RRController";
import { Suspense, useState } from "react";
import RiddleResourceModal from "./RiddleResourceModal";
import { useDisclosure } from "@mantine/hooks";
import {
  RiArrowDownSFill,
  RiArrowDropRightFill,
  RiArrowRightSFill,
  RiFile2Line,
} from "react-icons/ri";

export default function RiddleResourceList(props: {
  resources: RiddleResource[];
}) {
  const [opened, { toggle }] = useDisclosure(false);

  const [resources, updateResources] = useState<RiddleResource[]>(
    props.resources
  );

  if (resources)
    return (
      <Stack gap="sm">
        <NavLink
          href="#resources"
          label="Riddle Resources"
          leftSection={<RiFile2Line size="1rem" />}
          rightSection={opened ? <RiArrowDownSFill /> : <RiArrowRightSFill />}
          onClick={toggle}
        />

        <Collapse in={opened}>
     <Stack gap="md">
          <RiddleResourceModal
            createNew
            resource={{
              id: 0,
              name: "New Resource",
              description: null,
              link: null,
              AuthInfo: null,
              owner: null,
            }}
          />
          <ScrollArea.Autosize h="30rem" scrollbarSize={2} offsetScrollbars>
          
              <Suspense fallback={<Loader />}>
                <Grid  h="30rem" >
                  {resources &&
                    resources.map((resource: RiddleResource) => (
                      <Grid.Col span={4} key={resource.id}>
                        <RiddleResourceCard
                          key={resource.id}
                          resource={resource}
                        />
                      </Grid.Col>
                    ))}
                </Grid>
              </Suspense>
           
          </ScrollArea.Autosize> </Stack>
        </Collapse>
      </Stack>
    );
}
