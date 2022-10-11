import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import { BiSearch } from "react-icons/bi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Heading, Box, useColorModeValue, Divider, HStack, Avatar, Input, useBreakpointValue } from "@chakra-ui/react"
import './SearchBar.css';
import SmallThumbnailVideo from '../card/SmallThumbnailVideo';
import { searchVideos, searchAccounts } from '../../services/searchService';
import { useDebounce } from '../../hooks/debounceHook';
import { useNavigate } from 'react-router-dom';
import SearchSkeleton from './SearchSkeleton';

function SearchBar(props) {

    const [isExpanded, setExpanded] = useState(false);
    const [parentRef, isClickedOutside] = useClickOutside();
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setLoading] = useState(false);
    const searchBarWidth = useBreakpointValue({ base: "50vw", lg: "30vw" });

    const [accountsResults, setAccountsResults] = useState([]);
    const [videosResults, setVideosResults] = useState([]);

    const [noAccountsResults, setNoAccountsResults] = useState(false);
    const [noVideosResults, setNoVideosResults] = useState(false);
    const inputRef = useRef();
    const bgColor = useColorModeValue("#EDF2F7", "#171923");
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    //check if products are empty
    const isAccountsEmpty = !accountsResults || accountsResults.length === 0;
    const isVideosEmpty = !videosResults || videosResults.length === 0;


    const changeHandler = (e) => {
        // e.preventDefault();
        !isExpanded && setExpanded(true);
        setLoading(true);
        if (e.target.value.trim() === "") {
            setNoAccountsResults(false);
            setNoVideosResults(false);
            setAccountsResults([]);
            setVideosResults([]);
            setLoading(false);
        }
        setSearchQuery(e.target.value);
    };


    const collapseContainer = () => {
        setSearchQuery("");
        setLoading(false);
        setNoAccountsResults(false);
        setNoVideosResults(false);
        setAccountsResults([]);
        setVideosResults([]);
        if (inputRef.current) inputRef.current.value = "";
        setExpanded(false);
    };

    //close search bar when clicked outside search bar
    useEffect(() => {
        if (isClickedOutside) collapseContainer();
    }, [isClickedOutside]);



    const handleSearch = (searchQuery) => {
        setLoading(true);
        setNoVideosResults(false);
        setNoAccountsResults(false);
        searchVideos(searchQuery).then(res => {

            if (res.length === 0) {
                setNoVideosResults(true);
            }
            setVideosResults(res);
            setLoading(false);


        })

        searchAccounts(searchQuery).then(res => {

            if (res.length === 0) {
                setNoAccountsResults(true);
            }
            setAccountsResults(res);
            setLoading(false);
        })


    }


    useDebounce(searchQuery, 1000, () => handleSearch(searchQuery));




    //framer motion animation valus
    const containerVariants = {
        expanded: {
            height: "30em",
            boxShadow: "0px 2px 12px 3px rgba(0, 0, 0, 0.14)",
        },
        collapsed: {
            height: "4.5vh",
        },
    };

    const containerTransition = { type: "spring", damping: 22, stiffness: 150 };




    return (
        <motion.div
            className='searchBarContainer'
            borderRadius={"6px"}
            animate={isExpanded ? "expanded" : "collapsed"}
            style={{
                position: "absolute",
                left: "25%",
                top: 14,
                minWidth: "30%",
                width: "100%",
                maxWidth: searchBarWidth,
                zIndex: 2,
                overflow: "hidden",
                backgroundColor: bgColor,
                height: "4.5vh",
            }}
            variants={containerVariants}
            transition={containerTransition}
            ref={parentRef}
        >

            <Box
                display="flex"
                alignItems="center"
                pos={"relative"}
                px={"14px"}
                maxH="5vh"
                h="100%"
            >
                <BiSearch size={28} color="#bebebe" />
                <Input
                    w={"100%"}
                    h={"100%"}
                    bg={bgColor}
                    border="none"
                    outline={"none"}
                    _focus={{ outline: "none" }}
                    type="text"
                    placeholder="Search items and accounts"
                    ref={inputRef}
                    value={searchQuery}
                    onChange={changeHandler}
                />
                <AnimatePresence>
                    {isExpanded && (
                        <motion.span
                            className="CloseIcon"
                            whileHover={{ scale: 1.5, color: "#bebebe" }}
                            key="close-icon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={collapseContainer}
                            transition={{ duration: 0.2 }}
                        >
                            <AiFillCloseCircle cursor="pointer" size={22} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </Box>
            {isExpanded && (
                <>
                    <Divider />
                    <Box py={4} overflow="scroll" className={isMac ? "" : "hide-scrollbars"}>
                        {!isLoading && isAccountsEmpty && isVideosEmpty && !noAccountsResults && !noVideosResults ? (
                            <div className="LoadingWrapper">
                                <span className="WarningMessage">Start typing to Search</span>
                            </div>
                        ) : (
                            <>
                                <Heading px={4} mb={2} fontSize={"sm"} color="gray.500">Accounts</Heading>
                                <RenderResults
                                    type="accounts"
                                    isLoading={isLoading}
                                    isEmpty={isAccountsEmpty}
                                    noResults={noAccountsResults}
                                    results={accountsResults}
                                    collapseContainer={collapseContainer}

                                />
                                <Heading px={4} my={2} fontSize={"sm"} color="gray.500">Videos</Heading>
                                <RenderResults
                                    type="videos"
                                    isLoading={isLoading}
                                    isEmpty={isVideosEmpty}
                                    noResults={noVideosResults}
                                    results={videosResults}
                                    collapseContainer={collapseContainer}
                                />
                            </>
                        )}
                    </Box>
                </>
            )}
        </motion.div>
    )
}

export default SearchBar


const RenderResults = ({ type, isLoading, isEmpty, noResults, results, collapseContainer }) => {

    const navigate = useNavigate();

    return (
        <Box>

            {isLoading && (
                <SearchSkeleton type={type} />
            )}
            {!isLoading && isEmpty && !noResults && (
                <div className="LoadingWrapper">
                    <span className="WarningMessage">Start typing to Search</span>
                </div>
            )}
            {!isLoading && noResults && (
                <div className="LoadingWrapper">
                    <span className="WarningMessage">{type === "accounts" ? "No such accounts" : "No such videos"}</span>
                </div>
            )}
            {!isLoading && !isEmpty && (
                <>
                    {type === "accounts" && results.slice(0, 4).map(account => <RenderAccounts key={account.account_id} collapseContainer={collapseContainer} account={account} navigate={navigate} />)}
                    {type === "videos" && results.slice(0, 4).map(video => <RenderVideos key={video.video_id} collapseContainer={collapseContainer} video={video} navigate={navigate} />)}
                </>
            )}
        </Box>
    )
}

const RenderAccounts = ({ account, navigate, collapseContainer }) => {
    return (
        <Box
            px={4}
            py={3}
            cursor="pointer"
            _hover={useColorModeValue({ bg: "gray.200" }, { bg: "gray.700" })}
            onClick={() => {
                collapseContainer();
                navigate(`/profile/${account.account_id}`)
            }}
        >
            <HStack>
                <Avatar bg="gray.300" size={"sm"} src={account.image_url} />
                <Heading size={"sm"} ml="3">{account.name}</Heading>
            </HStack>
        </Box>
    )
}

const RenderVideos = ({ video, navigate, collapseContainer }) => {
    return (
        <Box
            px={4}
            py={3}
            cursor="pointer"
            _hover={useColorModeValue({ bg: "gray.200" }, { bg: "gray.700" })}
            onClick={() => {
                collapseContainer();
                navigate(`/video/${video.video_id}`, { state: { navigated: true } })
            }}
        >
            <HStack align="start" spacing={3}>
                <SmallThumbnailVideo
                    video_id={video.video_id}
                    url={video.video_url}
                    minW={"10vw"}
                />
                <Heading py={1} size={"sm"}>{video.title}</Heading>
            </HStack>
        </Box>
    )
}
