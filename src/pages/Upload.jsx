import React, { useState, useRef } from 'react';
import {
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Container,
  Stack,
  useToast,
  Button,
  Box,
  Flex,
  Text,
  Heading,
  UnorderedList,
  ListItem,
  CloseButton,
  Circle,
  AspectRatio,
  Progress,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import { RiVideoUploadFill } from 'react-icons/ri';
import Footer from '../components/basic/Footer';

import { uploadToTheta, uploadVideo } from '../services/videoService';

const Upload = () => {
  const [videoData, setVideoData] = useState(null);
  const [videoPreview, setvideoPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();
  const toastId = 'required-video-toast';
  const mainBG = useColorModeValue("white", "black");
  const secondaryBG = useColorModeValue("gray.200", "whiteAlpha.50");
  const hideBelowMd = useBreakpointValue({ base: 'none', md: 'block' });

  //reference to input type file
  const fileInputRef = useRef();

  const handleVideoUpload = async (VideoFile) => {
    var mime = VideoFile.type,
      rd = new FileReader(),
      size = Math.floor(VideoFile.size / 1000000);

    if (size > 400) {
      toast({
        title: 'Video size should be less than 400 MB',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (mime !== 'video/mp4' && mime !== 'video/quicktime') {
      toast({
        title: 'Video format not supported',
        description: 'Only MP4 and MOV format is accepted',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      return;
    }


    try {
      rd.onload = function (e) {
        var blob = new Blob([e.target.result], { type: mime }), // create a blob of buffer
          url = URL.createObjectURL(blob), // create o-URL of blob
          video = document.createElement('video');

        video.preload = 'metadata'; // preload setting
        video.addEventListener('loadedmetadata', function () {
          if (video.duration > 120) {
            toast({
              title: 'Video is too long',
              description: 'Video must be less than 2 minutes',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });

            return;
          }

          if (video.videoWidth < 1280 || video.videoHeight < 720) {
            toast({
              title: 'This resolution is not allowed',
              description: '1280x720 resolution or higher is required (Maintain 16:9 ratio)',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });

            return;
          }

          function roundToTwo(num) {
            return +(Math.round(num + "e+2") + "e-2");
          }

          //check if video is 16:9 ratio
          if (roundToTwo(video.videoWidth / video.videoHeight) !== roundToTwo(16 / 9)) {
            toast({
              title: 'This resolution is not allowed',
              description: '1280x720 resolution or higher is required (Maintain 16:9 ratio)',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });

            return;
          }

          URL.revokeObjectURL(url);
          setvideoPreview(url);

          // setVideoData(url);
        });
        video.src = url; // start video load
      };

      rd.readAsArrayBuffer(VideoFile);
      setVideoData(VideoFile);
    } catch (error) {
      handleError();
    }
  };

  const handleError = () => {
    setTitle('');
    setCaption('');
    setVideoData(null);
    setvideoPreview(null);
    setSubmitted(false);
    setUploadProgress(0);

    toast({
      title: 'Error occured in uploading video',
      description: 'Try again!',
      status: 'error',
      duration: 5000,
    });
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    setIsLoading(true);

    if (videoData === null) {
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: 'Video is required',
          description: 'What are you planning to upload without a video??',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      return;
    }

    try {
      const thetaVideo = await uploadToTheta(videoData, setUploadProgress);


      if (thetaVideo.status !== 200) {
        handleError();
        setIsLoading(false);
        return;
      }

      const scubrVideo = await uploadVideo(
        thetaVideo.data.video_url,
        title,
        caption
      );


      if (scubrVideo.status === 201) {
        setTitle('');
        setCaption('');
        setVideoData(null);
        setvideoPreview(null);
        setSubmitted(false);
        setUploadProgress(0);
        toast({
          title: 'Video uploaded successfully',
          description: 'Video might take some time to appear in your profile',
          status: 'success',
          duration: 8000,
          isClosable: true,
        });
      } else {
        handleError();
      }

      setIsLoading(false);

    } catch (error) {
      handleError();
      setIsLoading(false);
      return;
    }

  };


  return (
    <>
      <Flex direction={"column"} pt="10" align={"center"} pb={100}>
        <Box w="100vw" pos={"fixed"} zIndex="10" top={"8vh"}>
          <Progress
            h="2vh"
            flex="1"
            hasStripe
            bg={mainBG}
            value={uploadProgress}
          />
        </Box>
        <Container maxW={'5xl'}>
          <Stack
            as={Box}
            spacing={{ base: 8, md: 14 }}
            py={10}
            mt={20}
          >
            <Box textAlign={'center'}>
              <Heading
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}>
                Upload video
              </Heading>
              <Text mt={{ base: "2", md: "6" }} color={'gray.500'}>
                Post your videos to the Scubr community.
              </Text>
            </Box>
            <AspectRatio ratio={16 / 9}>
              {videoPreview ? (
                <Flex
                  w="90%"
                  h="80%"
                  borderRadius="12px"
                  overflow="hidden"
                  position="relative"
                >
                  <Circle
                    bg="red.500"
                    position="absolute"
                    zIndex="1"
                    right="5"
                    top="5"
                    onClick={() => {
                      setVideoData(null);
                      setvideoPreview(null);
                    }}
                  >
                    <CloseButton color="white" size="lg" />
                  </Circle>

                  <video width="100%" autoPlay loop>
                    <source src={videoPreview} />
                    Your browser does not support HTML5 video.
                  </video>
                </Flex>
              ) : (
                <Flex
                  onClick={() => fileInputRef.current.click()}
                  cursor="pointer"
                  bg={secondaryBG}
                  w="90%"
                  h="80%"
                  borderRadius="12px"
                  align="center"
                  justify="center"
                  direction="column"
                  overflow="hidden"
                >
                  <RiVideoUploadFill color="#B6C5E1" size="100" />
                  <Box color="#B6C5E1" display={hideBelowMd}>
                    <Heading mt="5">Select a video to upload</Heading>
                    <UnorderedList mt="8" fontSize="20">
                      <ListItem>MP4 or MOV</ListItem>
                      <ListItem>1280x720 resolution or higher (Maintain 16:9 ratio)</ListItem>
                      <ListItem>Up to 2 minutes</ListItem>
                      <ListItem>Less than 400MB</ListItem>
                    </UnorderedList>
                  </Box>
                </Flex>
              )}
            </AspectRatio>
            <FormControl display="none">
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(event) => {
                  handleVideoUpload(event.target.files[0]);
                  event.target.value = null;
                }}
              />
            </FormControl>

            <FormControl isInvalid={submitted && title === ''}>
              <FormLabel fontSize="2xl" fontWeight="800">
                Title
              </FormLabel>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Keep your title short and sweet"
                variant="filled"
                focusBorderColor={useColorModeValue("#D3D9E4", "gray.900")}
              />
              <FormErrorMessage>Title is required</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={submitted && caption === ''}>
              <FormLabel fontSize="2xl" fontWeight="800">
                Caption
              </FormLabel>
              <Textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Might as well add tags here"
                variant="filled"
                focusBorderColor={useColorModeValue("#D3D9E4", "gray.900")}
                maxHeight="200px"
              />
              <FormErrorMessage>Caption is required</FormErrorMessage>
            </FormControl>

            <Button
              variant="solid"
              isLoading={isLoading}
              onClick={handleSubmit}
              _focus={{
                boxShadow: '0 0 1px 1px #cccccc',
              }}
            >
              Upload
            </Button>

          </Stack>
        </Container>
      </Flex>
      <Box pb={8}>
        <Footer />
      </Box>
    </>

  );
};

export default Upload;
