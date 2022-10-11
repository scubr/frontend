import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    useColorModeValue,
    Box
} from '@chakra-ui/react'

const WalletTransactions = () => {

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    return (
        <Box
            w="100%"
            bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
            p={10}
            maxW={{ base: "92vw", md: "100%" }}
            rounded={"xl"}
            maxH={{ base: "90vh", xl: "100%" }}
            overflow={"scroll"}
            className={isMac ? "" : "hide-scrollbars"}
        >
            <TableContainer
            >
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Date</Th>
                            <Th isNumeric>Total likes</Th>
                            <Th isNumeric>Total Views</Th>
                            <Th isNumeric>Earned SET</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>9 Aug 2022</Td>
                            <Td isNumeric>5</Td>
                            <Td isNumeric>8</Td>
                            <Td isNumeric>250</Td>
                        </Tr>
                        <Tr>
                            <Td>10 Aug 2022</Td>
                            <Td isNumeric>2</Td>
                            <Td isNumeric>5</Td>
                            <Td isNumeric>120</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default WalletTransactions