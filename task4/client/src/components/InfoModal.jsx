import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Link,
  Box,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon, LockIcon } from "@chakra-ui/icons";

const InfoModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent
        bg="#3b4455ff"
        color="white"
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <ModalHeader>How TimeTracker Works</ModalHeader>
        <ModalCloseButton />
        <Box as="hr" bg={"#fff"} marginTop={2} marginX={3}></Box>
        <ModalBody
          pb={6}
          m={3}
          sx={{
            "::-webkit-scrollbar": {
              display: "none",
            },
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <VStack spacing={4} align="stretch">
            <Box margin={1}>
              <Text fontSize="lg" color="gray.300" mb={2}>
                🎯 What We Track
              </Text>
              <List spacing={2}>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={TimeIcon} color="gray.300" />
                  Active tab time tracking
                </ListItem>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={TimeIcon} color="gray.300" />
                  Website domain visits
                </ListItem>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={TimeIcon} color="gray.300" />
                  Time spent per website
                </ListItem>
              </List>
            </Box>

            <Box>
              <Text fontSize="lg" color="gray.300" mb={2}>
                ⚡ Accurate Timing
              </Text>
              <List spacing={2}>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={CheckCircleIcon} color="gray.300" />
                  Only tracks when tab is active and visible
                </ListItem>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={CheckCircleIcon} color="gray.300" />
                  Tracks URL changes within the same tab
                </ListItem>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={CheckCircleIcon} color="gray.300" />
                  Stops tracking when switching tabs or closing
                </ListItem>
              </List>
            </Box>

            <Box>
              <Text fontSize="lg" color="gray.300" mb={2}>
                🔒 Privacy First
              </Text>
              <List spacing={2}>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={LockIcon} color="gray.300" />
                  Only tracks domain names, not specific URLs
                </ListItem>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={LockIcon} color="gray.300" />
                  No personal data collection
                </ListItem>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={LockIcon} color="gray.300" />
                  Data stored securely in your account
                </ListItem>
              </List>
            </Box>
            <Box as="hr" bg={"#fff"} marginTop={2} marginX={3}></Box>
            <Box pt={1} borderColor="gray.600">
              <Text fontSize="sm" color="gray.400" textAlign={"center"}>
                Developed with 🩶 by{" "}
                <Link
                  href="https://github.com/parve5h"
                  isExternal
                  color="gray.100"
                  textDecoration="underline"
                >
                  Parvesh Bansal
                </Link>
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InfoModal;
