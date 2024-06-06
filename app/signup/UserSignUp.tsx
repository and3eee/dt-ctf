'use client';
import { prisma } from "@/lib/prisma";

import { useState } from "react";


import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Card, Divider, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function UserSignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [opened, { open, close }] = useDisclosure(false);
  const create = async () => {
    if (email && name && password) {
      const body = {
        name: name,
        email: email,
        password: password,
      };

      const res = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();

      if (!response.created) {
        return open();
      } else {
        router.replace("/api/auth/signin");
      }
    } else {
      return null;
    }
  };

  return (
    <Card className="grid cols-1 gap-1 max-w-md mx-auto ">
      <Card.Section >
        <p className="text-large">Sign Up</p>
      </Card.Section >{" "}
      <Divider />
      <Card.Section className="flex flex-col gap-1">
        <TextInput
          className="grow"
          type="email"
          label="Email"
          placeholder="Enter your email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          type="text"
          label="Name"
          placeholder="Enter your name"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label="Pin"
          placeholder="Enter your Pin"
          required
          onChange={(e) => setPassword(e.target.value)}
          type="number"
        />
      </Card.Section>
      <Divider />
      <Card.Section >
        <Button color="primary" onClick={create}>
          Sign Up
        </Button>
        <Modal opened={opened} onClose={close}>
          <ModalContent>

                <ModalHeader className="flex flex-col gap-1">
                  Sign Up Error
                </ModalHeader>
                <ModalBody>
                  <p>
                    A User with that email is already registered. Please use the
                    sign in if you wish to access your account.
                  </p>
                </ModalBody>

                  <Button color="danger" variant="light" onClick={close}>
                    Close
                  </Button>
                  <Button color="primary" href="/api/auth/signin" component="a">
                    Sign In
                  </Button>
    

          </ModalContent>
        </Modal>
      </Card.Section >
    </Card>
  );
}
