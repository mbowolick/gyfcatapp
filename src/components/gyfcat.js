import {
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  useClipboard,
  useToast,
  Tooltip,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { getRefinedGifs, getTrendingGifs } from "../services/gyfcatapi";

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

export function RefinedGifs(props) {
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
            <GifCard key={i.gfyId} gifLink={i.gifUrl} gfyName={i.gfyName} />
          ))
        )}
      </Flex>
    </>
  );
}

export function TrendingGifs(props) {
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

export function GyfCatCallback(props) {
  const url = useLocation();
  const slug = url.hash.split("&")[0].substring(1);

  // Set accessToken from props setter function trigger on component mount
  useEffect(() => {
    if (!slug.includes("error")) {
      props.setAccessToken(slug);
    }
  }, [props, slug]);

  // If something went wrong
  if (slug.includes("error")) {
    return (
      <Flex m={10} gridGap={4} flexDir="column" alignItems="center">
        <Alert
          status="warning"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          width="800px"
        >
          <AlertIcon />
          <AlertTitle mr={2}>Login Error!</AlertTitle>
        </Alert>
        <Text>
          Looks like an error occurred somewhere along the way, jump back home
          and try again.
        </Text>
        <Button as="a" href="/" variant="outline">
          Return Home
        </Button>
      </Flex>
    );
  }

  // Finally redirect home
  return <Navigate to="/" />;
}
