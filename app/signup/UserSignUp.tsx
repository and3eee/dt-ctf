"use client";
import { prisma } from "@/lib/prisma";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useState } from "react";

import {
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function UserSignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
        return onOpen();
      } else {
        router.replace("/api/auth/signin");
      }
    } else {
      return null;
    }
  };

  return (
    <Card className="grid cols-1 gap-1 max-w-md mx-auto ">
      <CardHeader>
        <p className="text-large">Sign Up</p>
      </CardHeader>{" "}
      <Divider />
      <CardBody className="flex flex-col gap-1">
        <Input
          className="grow"
          type="email"
          label="Email"
          placeholder="Enter your email"
          isRequired
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="text"
          label="Name"
          placeholder="Enter your name"
          isRequired
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Pin"
          placeholder="Enter your Pin"
          isRequired
          onChange={(e) => setPassword(e.target.value)}
          type="number"
        />
      </CardBody>
      <Divider />
      <CardFooter>
        <Button color="primary" onPress={create}>
          Sign Up
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Sign Up Error
                </ModalHeader>
                <ModalBody>
                  <p>
                    A User with that email is already registered. Please use the
                    sign in if you wish to access your account.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onClick={onClose}>
                    Close
                  </Button>
                  <Button color="primary" href="/api/auth/signin" as={Link}>
                    Sign In
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </CardFooter>
    </Card>
  );
}
