import React from 'react';
import {
    Modal,
    ModalOverlay,
    useBreakpointValue,
    ModalContent as MdContent,
    ModalHeader as MdHeader,
    ModalFooter as MdFooter,
    ModalBody as MdBody,
    ModalCloseButton,
    Box,
    Drawer,
    DrawerBody as DrBody,
    DrawerFooter as DrFooter,
    DrawerHeader as DrHeader,
    DrawerOverlay,
    DrawerContent as DrContent,
} from "@chakra-ui/react"

const ModalFrame = React.forwardRef(({
    Button,
    isOpen,
    showCloseBtn = true,
    onClose,
    HeaderProps,
    BodyProps,
    modalHeaderFunc,
    modalContentFunc,
    modalFooterFunc,
    drawerContentFunc,
    drawerHeaderFunc,
    drawerFooterFunc
}, initialFocusRef) => {


    return (
        <>

            <Box>
                <Button />
            </Box>

            <Modal
                onClose={onClose}
                isOpen={useBreakpointValue({ base: false, md: isOpen })}
                scrollBehavior={'outside'}
                size={"2xl"}
                initialFocusRef={initialFocusRef}
            >
                <ModalOverlay />
                <MdContent>

                    {modalHeaderFunc && (
                        <MdHeader
                            {...HeaderProps}
                        >
                            {modalHeaderFunc()}
                        </MdHeader>
                    )}

                    {showCloseBtn && <ModalCloseButton />}

                    {modalContentFunc && (
                        <MdBody
                            {...BodyProps}
                        >
                            {modalContentFunc()}
                        </MdBody>
                    )}

                    {modalFooterFunc && (
                        <MdFooter>
                            {modalFooterFunc()}
                        </MdFooter>
                    )}
                </MdContent>
            </Modal>

            <Drawer
                isOpen={useBreakpointValue({ base: isOpen, md: false })}
                placement='right'
                onClose={onClose}
                size="full"
            >
                <DrawerOverlay />
                <DrContent>

                    {drawerHeaderFunc && (
                        <DrHeader px={4}>
                            {drawerHeaderFunc()}
                        </DrHeader>
                    )}

                    {drawerContentFunc && (
                        <DrBody p={0}>
                            {drawerContentFunc()}
                        </DrBody>
                    )}

                    {drawerFooterFunc && (
                        <DrFooter>
                            {drawerFooterFunc()}
                        </DrFooter>
                    )}
                </DrContent>
            </Drawer>

        </>
    )
});

export default ModalFrame
