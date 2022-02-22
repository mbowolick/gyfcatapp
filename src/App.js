import {
  ChakraProvider,
  Flex,
  Heading,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  useClipboard,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  generateToken,
  getRefinedGifs,
  getTrendingGifs,
} from "./services/gyfcatapi";

function GifCard(props) {
  const { onCopy } = useClipboard(props.gifLink);
  const toast = useToast();

  const handlerClick = () => {
    toast({
      position: "top",
      title: "GIF Link Copied to Clipboard",
      status: "success",
      duration: 1500,
    });
    onCopy();
  };

  return (
    <Tooltip label="Click to copy the GIF link" placement="top">
      <Image
        src={props.gifLink}
        alt={props.gfyName}
        h="200px"
        onClick={handlerClick}
        _hover={{
          boxShadow: "outline",
          cursor: "pointer",
        }}
        _active={{
          border: "1px solid",
          borderColor: "green.400",
          boxShadow: "sm",
        }}
      />
    </Tooltip>
  );
}

function RefinedGifs(props) {
  const [gifs, setGifs] = useState(null);

  useEffect(() => {
    const fetchRefinedGifs = async () => {
      const refinedGifs = await getRefinedGifs(
        props.accessToken,
        props.searchTerm
      );
      setGifs(refinedGifs);
    };
    fetchRefinedGifs();
  }, [props]);

  if (!gifs) return <Spinner />;

  return (
    <>
      <Heading as="h3" size="md">
        {`Searching by : "${props.searchTerm}"`}
      </Heading>
      <Flex flexWrap="wrap" gridGap={2}>
        {gifs.length === 0 ? (
          <Text mt={2}>No GIFs found :( Try Another search term.</Text>
        ) : (
          gifs.map((i) => (
            <GifCard gfyId={i.gfyId} gifLink={i.gifUrl} gfyName={i.gfyName} />
          ))
        )}
      </Flex>
    </>
  );
}

function TrendingGifs(props) {
  const [gifs, setGifs] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      const trendingGifs = await getTrendingGifs(props.accessToken);
      setGifs(trendingGifs);
    };
    fetchTrending();
  }, [props.accessToken]);

  if (!gifs) return <Spinner />;

  return (
    <>
      <Heading as="h3" size="md">
        Trending:
      </Heading>
      <Flex flexWrap="wrap" gridGap={2}>
        {gifs.map((i) => (
          <GifCard key={i.gfyId} gifLink={i.gifUrl} gfyName={i.gfyName} />
        ))}
      </Flex>
    </>
  );
}

function Base() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const token = await generateToken();
      setAccessToken(token);
    };
    fetchToken();
  }, []);

  if (!accessToken) {
    return (
      <Flex m={10} gridGap={4} flexDir="column" alignItems="center">
        <Text>Loading App...</Text>
        <Spinner />
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
          <RefinedGifs searchTerm={searchTerm} accessToken={accessToken} />
        ) : (
          <TrendingGifs accessToken={accessToken} />
        )}
      </Stack>
    </Flex>
  );
}

function App() {
  return (
    <ChakraProvider>
      <Base />
    </ChakraProvider>
  );
}

export default App;
