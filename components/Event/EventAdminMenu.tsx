'use client';

import { EventProps } from "@/types";
import { Menu, Button, rem } from "@mantine/core";
import { RiAdminFill, RiFilePaper2Line, RiPencilLine } from "react-icons/ri";
import EventModal from "./EventModal";
import { Event } from "@prisma/client";
import Link from 'next/link'
 
export default function EventAdminMenu(props:{event:Event}){


    const baseLink = "/" + props.event.id.slice(0,5) + "/"


    return (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button maw="10rem">Admin Options</Button>
          </Menu.Target>
    
          <Menu.Dropdown>
          
            <Menu.Item leftSection={<RiPencilLine  />} >
              <EventModal event={props.event}/>
            </Menu.Item>
            <Menu.Item  leftSection={<RiAdminFill/>}>
            <Link  href={baseLink + "admin"} >Event Admin Page</Link>
            </Menu.Item>
            <Menu.Item  leftSection={<RiFilePaper2Line  />}>
              <Link href={baseLink + "admin/dryrun"} >Dry Run Page</Link>
            </Menu.Item>
          
          </Menu.Dropdown>
        </Menu>
      );
}