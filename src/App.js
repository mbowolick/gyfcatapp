import { ChakraProvider, Flex, Heading, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";

function TrendingGifs() {
  return (
    <>
      <Heading as="h3" size="md">
        Trending:
      </Heading>
      <Flex>Trending Goes here</Flex>
    </>
  );
}

function RefinedGifs(props) {
  return (
    <>
      <Heading as="h3" size="md">
        {`Searching by : "${props.searchTerm}"`}
      </Heading>
      <Flex>Searched gifs goes here</Flex>
    </>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const renderGifBlock = () => {
    // When searching show the refined block, else show trending
    if ((searchTerm !== "") & (searchTerm.length > 2)) {
      return <RefinedGifs searchTerm={searchTerm} />;
    } else return <TrendingGifs />;
  };

  return (
    <ChakraProvider>
      <Flex m={10}>
        <Stack gridGap={4}>
          <Heading as="h1">Welcome to the One Stop GIF Shop!</Heading>
          <Input
            placeholder="Search here for specific GIFs"
            w="400px"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Stack>{renderGifBlock()}</Stack>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
