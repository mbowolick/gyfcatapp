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
    });
    onCopy();
  };

  return (
    <Tooltip label="Click to copy the GIF link" placement="top">
      <Image
        key={props.gfyId}
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

function TrendingGifs(props) {
  const [gifs, setGifs] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      const trendingGifs = await getTrendingGifs(props.accessToken);
      setGifs(trendingGifs);
    };
    fetchTrending();
  }, []);

  if (!gifs) return <Spinner />;

  return (
    <>
      <Heading as="h3" size="md">
        Trending:
      </Heading>
      <Flex flexWrap="wrap" gridGap={2}>
        {gifs.map((i) => (
          <GifCard gfyId={i.gfyId} gifLink={i.gifUrl} gfyName={i.gfyName} />
        ))}
      </Flex>
    </>
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
        {gifs.length == 0 ? (
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

function App() {
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
      <ChakraProvider>
        <Flex m={10} gridGap={4} flexDir="column" alignItems="center">
          <Text>Loading App...</Text>
          <Spinner />
        </Flex>
      </ChakraProvider>
    );
  }

  const renderGifBlock = () => {
    // When searching show the refined block, else show trending
    if ((searchTerm !== "") & (searchTerm.length > 2)) {
      return <RefinedGifs searchTerm={searchTerm} accessToken={accessToken} />;
    } else return <TrendingGifs accessToken={accessToken} />;
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
