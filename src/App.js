import {
  Button,
  ChakraProvider,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { RefinedGifs, TrendingGifs, GyfCatCallback } from "./components/gyfcat";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Fetch Environment Variables (requires .env file in app root)
const { REACT_APP_CLIENT_ID } = process.env;

// Redirect URI is established for now for local development only
const redirectUri = "http%3A%2F%2Flocalhost%3A3000%2Fhandler";

function Base(props) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!props.accessToken) {
    return (
      <Flex m={10}>
        <Stack gridGap={4}>
          <Heading as="h1">Welcome to the One Stop GIF Shop!</Heading>
          <Text>Please login to start your GIF shopping :) </Text>
          <Flex>
            <Button
              as="a"
              color="blue.400"
              href={`https://gfycat.com/oauth/authorize?client_id=${REACT_APP_CLIENT_ID}&scope=all&state=login&response_type=token&redirect_uri=${redirectUri}`}
            >
              Login through GyfCat
            </Button>
          </Flex>
        </Stack>
      </Flex>
    );
  }

  return (
    <Flex m={10}>
      <Stack gridGap={4}>
        <Heading as="h1">Welcome to the One Stop GIF Shop!</Heading>
        <Input
          placeholder="Search here for specific GIFs"
          w="400px"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm !== "" && searchTerm.length > 2 ? (
          // When searching show the refined block, else show trending
          <RefinedGifs
            searchTerm={searchTerm}
            accessToken={props.accessToken}
          />
        ) : (
          <TrendingGifs accessToken={props.accessToken} />
        )}
      </Stack>
    </Flex>
  );
}

function App() {
  const [accessToken, setAccessToken] = useState("");

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Base accessToken={accessToken} />} />
          <Route
            path="/handler"
            element={<GyfCatCallback setAccessToken={setAccessToken} />}
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
