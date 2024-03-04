import { ButtonGroup, Img, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Tag, useToast } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
	Box,
	Button,
	CircularProgress,
	CircularProgressLabel,
	Flex,
	Progress,
	SimpleGrid,
	Spacer,
	Stat,
	StatLabel,
	StatNumber,
	Text,
} from '@chakra-ui/react'
import Card from '../components/Card _D/Card'
import CardBody from '../components/Card _D/CardBody';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';

import preAbi from '../components/abi/pre.json'
import erc404Abi from '../components/abi/ERC404.json'
import { useContractRead, useContractWrite } from 'wagmi';
import { useBalance, useAccount } from 'wagmi';
import { BigNumber, ethers } from 'ethers';

const verifyWl = require('../utils/merkle/verifyWl');



const Home: NextPage = () => {

	const toast = useToast()
	//contract addr
	const token = '0x7bC3Aef1991c5C9D60F0880FB182f09e394108b1'
	//const stable = '0xD78e68810fd0c410bE7B6e51f75a02aE7EE4F67E'
	const presale = '0x671Ca1210a79B8fd4599Eb5D799CCbEa71Ff32b6'
	const chain = 84532
	let res;
	let ver: boolean;
	//state variables

	const [state, setState] = useState({
		connected: false,
		sale: false,
		whitelisted: false,
		privateRaised: 0,
		publicRaised: 0,
		totalRaised: 0,
		Remaining: 0,
		userClaim: 0,
		userBalance: 0,
		priAmount: 0,
		pubAmount: 0,
		pubApproved: false,
		priApproved: false,
		render: false,
		proof: null
	});

	//contract hooks
	const { address, isConnected } = useAccount();
	const { data } = useBalance({
		address: address,
		formatUnits: 'ether',
		chainId: chain,
		watch: true
	})


	const token404 = useContractRead({
		address: token,
		abi: erc404Abi,
		functionName: 'balanceOf',
		chainId: chain,
		args: [presale],
		watch: true
	})

	const preState = useContractRead({
		address: presale,
		abi: preAbi,
		functionName: 'presaleIsOpen',
		chainId: chain,
		watch: true
	})

	const pubRaised = useContractRead({
		address: presale,
		abi: preAbi,
		functionName: 'publicRaised',
		chainId: chain,
		watch: true
	})

	const priRaised = useContractRead({
		address: presale,
		abi: preAbi,
		functionName: 'privateRaised',
		chainId: chain,
		watch: true
	})

	const alloc = useContractRead({
		address: presale,
		abi: preAbi,
		functionName: 'alloc',
		chainId: chain,
		args: [address],
		watch: true,

	})
	/*
		const wl = useContractRead({
			address: presale,
			abi: preAbi,
			functionName: 'isWhitelisted',
			chainId: chain,
			args: [proof, address],
			watch: true
		})
		*/
	const { writeAsync: pub } = useContractWrite({
		mode: 'recklesslyUnprepared',
		address: presale,
		abi: preAbi,
		chainId: chain,
		functionName: 'depositPublic',
		args: [],
		overrides: { value:ethers.utils.parseEther(state.pubAmount.toString())},
		onError(error) {
			toast({
				title: 'Transaction Failed',
				description: extractReasonText(error.message),
				position: 'top-right',
				status: 'error',
				variant: 'left-accent',
				duration: 2000,
				isClosable: true
			})
		},
		onSuccess(data) {
			toast({
				title: 'Transaction Success',
				position: 'top-right',
				status: 'success',
				variant: 'left-accent',
				duration: 2000,
				isClosable: true,
				description: data.hash
			})
			setState((prevState) => ({ ...prevState, pubApproved: false }));

		}
	})



	const { writeAsync: pri } = useContractWrite({
		mode: 'recklesslyUnprepared',
		address: presale,
		abi: preAbi,
		functionName: 'depositPrivate',
		chainId: chain,
		args: [],
		overrides: { value: ethers.utils.parseEther(state.priAmount.toString()) },
		onError(error) {
			toast({
				title: 'Transaction Failed',
				description: extractReasonText(error.message),
				position: 'top-right',
				status: 'error',
				variant: 'left-accent',
				duration: 2000,
				isClosable: true
			})
		},
		onSuccess(data) {
			toast({
				title: 'Transaction Success',
				position: 'top-right',
				status: 'success',
				variant: 'left-accent',
				duration: 2000,
				isClosable: true,
				description: data.hash

			})
			setState((prevState) => ({ ...prevState, priApproved: false }));


		},
	})
	/*
		const {writeAsync:approvePub}= useContractWrite({
			mode:'recklesslyUnprepared',
			address: stable,
			abi: erc20ABI,
			functionName: 'approve',
			chainId:chain,
			args:[presale, ethers.utils.parseEther(state.pubAmount.toString())],
			onError(error){
				toast({
					title:'Transaction Failed',
					description: extractReasonText(error.message),
					position:'top-right', 
					status:'error',
					variant:'left-accent',
					duration:2000,
					isClosable:true
				})
				setState((prevState) => ({ ...prevState, priApproved: false}));
			},
			onSuccess() {
				setState((prevState) => ({ ...prevState, pubApproved: true}));
			},
		})
	
		const {writeAsync:approvePri}= useContractWrite({
			mode:'recklesslyUnprepared',
			address: stable,
			abi: erc20ABI,
			functionName: 'approve',
			chainId:chain,
			args:[presale, ethers.utils.parseEther(state.priAmount.toString()) ],
			onError(error){
				toast({
					title:'Transaction Failed',
					description: extractReasonText(error.message),
					position:'top-right', 
					status:'error',
					variant:'left-accent',
					duration:2000,
					isClosable:true
				})
				setState((prevState) => ({ ...prevState, priApproved: false}));
			},
			onSuccess() {
				setState((prevState) => ({ ...prevState, priApproved: true}));
			},
	*/
	const { writeAsync: claimCall } = useContractWrite({
		mode: 'recklesslyUnprepared',
		address: presale,
		abi: preAbi,
		functionName: 'claim',
		chainId: chain,
		onSuccess(data) {
			toast({
				title: 'Transaction Success',
				position: 'top-right',
				status: 'success',
				variant: 'left-accent',
				duration: 2000,
				isClosable: true,
				description: data.hash,
			})

		},
		onError(error) {
			toast({
				title: 'Transaction Failed',
				description: extractReasonText(error.message),
				position: 'top-right',
				status: 'error',
				variant: 'left-accent',
				duration: 2000,
				isClosable: true
			})
		},
	})



	//functions and logic


	useEffect(() => {
		onPageLoad();
		onConnect()
	},)

	useEffect(() => {
		onConnect()
	}, [isConnected, address])

	function onPageLoad() {
		if (token404.isSuccess) {
			setState((prevState) => ({ ...prevState, Remaining: roundTo3(ethers.utils.formatEther(BigNumber.from(token404.data))) }));
		}

		if (preState.isSuccess) {
			setState((prevState) => ({ ...prevState, sale: Boolean(preState.data) }));
		}

		if (pubRaised.isSuccess) {
			setState((prevState) => ({ ...prevState, publicRaised: roundTo3(ethers.utils.formatEther(BigNumber.from(pubRaised.data))) }));
		}


		if (priRaised.isSuccess) {
			setState((prevState) => ({ ...prevState, privateRaised: roundTo3(ethers.utils.formatEther(BigNumber.from(priRaised.data))) }));
		}
		console.log(state)
	}


	function onConnect() {

		setState((prevState) => ({ ...prevState, connected: isConnected }));
		if (isConnected) {
			setState((prevState) => ({ ...prevState, userBalance: roundTo3(data?.formatted) }));
			if (alloc.isSuccess) {
				setState((prevState) => ({ ...prevState, userClaim: roundTo3(ethers.utils.formatEther(BigNumber.from(alloc.data))) }));
			}
			res = verifyWl(address)
			ver = res.verified;
			
			if (ver) {
				var proof =  res.proof
				setState((prevState) => ({ ...prevState, whitelisted: Boolean(ver) }));
				setState((prevState) => ({ ...prevState, proof: proof }));
			}
		}
		else {
			setState((prevState) => ({ ...prevState, userBalance: 0 }));
			setState((prevState) => ({ ...prevState, userClaim: 0 }));
			setState((prevState) => ({ ...prevState, whitelisted: false }));
		}
		console.log(state)
	}

	async function claim() {
		if (claimCall) {
			await claimCall()
		}
	}

	async function depositPub() {

		if (pub && isConnected) {
			await pub()
		}
	}
	/*
		async function appPub(){
			if(!state.pubApproved && isConnected && state.pubAmount>0){
				//await approvePub()
			}
		}
	
		async function appPri(){
			if(!state.pubApproved && isConnected && state.priAmount>0){
				//await approvePri()
			}
		}
	*/
	async function depositPri() {
		if (pri && isConnected) {
			await pri()
		}
	}

	function roundTo3(_data: any) {
		var data = Math.round(Number(_data) * 1e4) / 1e4
		return data
	}

	function extractReasonText(error_message: string) {
		const pattern = /reason="([^"]+):([^"]+)"/;
		const match = error_message.match(pattern);
		if (match) {
			const reason = match[2].trim(); // Extract the second part after the ":" and trim whitespace
			return reason;
		} else {
			return "Unknown Error"; // No match found
		}
	}


	function timer() {
		setState((prevState) => ({ ...prevState, render: !state.render }));
		setTimeout(timer, 3000)
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>ZebraSwap Presale</title>
				<meta
					content="Zebra token presale"
					name="description"
				/>
				<link href="logo.png" rel="icon" />
			</Head>

			<main style={{ minHeight: '100vh', padding: '4em auto' }}>
				<Flex as='nav' alignItems='center'   >
					<Box p='3' >
						<Img h='28px' src='zebraswapwhite.png'></Img>
					</Box>
					<Spacer />
					<ButtonGroup >
						<ConnectButton />
					</ButtonGroup>
				</Flex>

				<Flex flexDirection='column' pt={{ base: '120px', md: '75px' }}>
					<SimpleGrid columns={{ sm: 1, md: 4, xl: 4 }} spacing='24px'>
						<Card>
							<CardBody>
								<Flex flexDirection='row' align='center' justify='center' w='100%'>
									<Stat me='auto'>
										<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
											404 Remaining
										</StatLabel>
										<Flex>
											<StatNumber fontSize='lg' color='#fff'>
												{state.Remaining} /10000
											</StatNumber>
										</Flex>
									</Stat>
								</Flex>
								<Box>
									<Progress value={50}></Progress>
								</Box>

							</CardBody>
						</Card>
						<Card>
							<CardBody>
								<Flex flexDirection='row' align='center' justify='center' w='100%'>
									<Stat me='auto'>
										<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
											Private Raised
										</StatLabel>
										<Flex>
											<StatNumber fontSize='lg' color='#fff'>
												{state.privateRaised} ETH
											</StatNumber>
										</Flex>
									</Stat>
								</Flex>
								<Box>
								</Box>

							</CardBody>
						</Card>
						<Card>
							<CardBody>
								<Flex flexDirection='row' align='center' justify='center' w='100%'>
									<Stat me='auto'>
										<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
											Public Raised
										</StatLabel>
										<Flex>
											<StatNumber fontSize='lg' color='#fff'>
												{state.publicRaised} ETH
											</StatNumber>
										</Flex>
									</Stat>
								</Flex>
								<Box>
								</Box>

							</CardBody>
						</Card>
						<Card>
							<CardBody>
								<Flex flexDirection='row' align='center' justify='center' w='100%'>
									<Stat me='auto'>
										<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
											Claimable
										</StatLabel>
										<Flex>
											<StatNumber fontSize='lg' color='#fff'>
												{state.userClaim} 404
											</StatNumber>
										</Flex>
									</Stat>
									<Button onClick={() => claim()} disabled={!state.sale} h='45px' background='linear-gradient(257.66deg, #26AFE6 -7.04%, #FE3DCE 106.8%);'
										color='whitesmoke' >Claim</Button>

								</Flex>
								<Box>

								</Box>

							</CardBody>
						</Card>
					</SimpleGrid>
					{/*Sale Grid */}
					<SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 3 }} my='26px' gap='18px'>
						{/* Sale Stats*/}
						<Card border='2px' borderColor='#AA6AD8'>
							<Flex direction='column' w='100%' >
								<Flex justify='space-between' align='center' mb='40px'>
									<Text color='#fff' fontSize='lg' fontWeight='bold'>
										404 Sale
									</Text>
									<Text color='whitesmoke' fontSize='md' fontWeight='thin'>
										now
									</Text>
									<Flex direction='row' >
										{state.sale ? <Tag m={0.5} w='58px' borderRadius='5px' border='2px' borderColor='#05CD99' bgColor='transparent' color='#05CD99'>Active</Tag> : <Tag m={0.5} w='65px' borderRadius='5px' border='2px' borderColor='gray.400' bgColor='transparent' color='gray.400'>Inactive</Tag>}
									</Flex>
								</Flex>
								<Flex direction={{ sm: 'column', md: 'row' }}>
									<Flex direction='column' me={{ md: '6px', lg: '52px' }} mb={{ sm: '16px', md: '0px' }}>
										<Flex
											direction='column'
											p='15px'
											pe={{ sm: '22e', md: '8px', lg: '22px' }}
											minW={{ sm: '220px', md: '140px', lg: '220px' }}
											bg='#1A1F27'
											borderRadius='10px'
											mb='20px'>
											<Text color='gray.400' fontSize='sm' mb='4px'>
												Total Raised
											</Text>
											<Text color='#fff' fontSize='lg' fontWeight='bold'>
												${state.privateRaised + state.publicRaised}
											</Text>
										</Flex>
										<Flex
											direction='column'
											p='15px'
											pe={{ sm: '22px', md: '8px', lg: '22px' }}
											minW={{ sm: '170px', md: '140px', lg: '170px' }}
											bg='#1A1F27'
											borderRadius='10px' border='2px' borderColor='rgba(255, 255, 255, 1)'>
											<Text color='gray.400' fontSize='sm' mb='4px'>
												Soft Cap
											</Text>
											<Text color='#fff' fontSize='lg' fontWeight='bold'>
												10 ETH
											</Text>
											<Text color='gray.400' fontSize='sm' mb='4px'>
												Hard Cap
											</Text>
											<Text color='#fff' fontSize='lg' fontWeight='bold'>
												30 ETH
											</Text>
										</Flex>
									</Flex>
									<Box mx={{ sm: 'auto', md: '0px' }} >
										<CircularProgress
											size={170}
											value={Math.floor(((state.privateRaised + state.publicRaised) / 300000) * 100)}
											thickness={6}
											color='#AA6AD8'

										>
											<CircularProgressLabel>
												<Flex direction='column' justify='center' align='center'>
													<Text color='gray.400' fontSize='sm'>
														Amount Raised
													</Text>
													<Text
														color='#fff'
														fontSize={{ md: '30px', lg: '35px' }}
														fontWeight='bold'
														mb='4px'>
														{Math.floor(((state.privateRaised + state.publicRaised) / 300000) * 100)}%
													</Text>
													<Text color='gray.400' fontSize='sm'>
														Total
													</Text>
												</Flex>
											</CircularProgressLabel>
										</CircularProgress>
									</Box>
								</Flex>
							</Flex>
						</Card>
						{/*Public Sale Card */}
						<Card >
							<Flex direction='column'>
								<Flex justify='space-between' align='center' mb='40px'>
									<Text color='#fff' fontSize='lg' fontWeight='bold'>
										Public Sale
									</Text>
									<Flex>
										<Tag m={0.5} borderRadius='5px' border='2px' borderColor='#05CD99' bgColor='transparent' color='#05CD99'>0.006ETH / 404</Tag>
									</Flex>
								</Flex>
								<Flex direction={{ sm: 'column', md: 'row' }}>
									<Flex direction='column' me={{ md: '6px', lg: '52px' }} mb={{ sm: '16px', md: '0px' }}>
										<Flex
											direction='column'
											p='15px'
											pe={{ sm: '22e', md: '8px', lg: '22px' }}
											minW={{ sm: '220px', md: '140px', lg: '220px' }}
											bg='#1A1F27'
											borderRadius='10px'
											mb='20px'>
											<Text color='gray.400' fontSize='sm' mb='4px'>
												Your Balance
											</Text>
											<Text color='#fff' fontSize='lg' fontWeight='bold'>
												{state.userBalance} ETH
											</Text>
										</Flex>
										<Flex
											direction='column'
											p='15px'
											pe={{ sm: '22px', md: '8px', lg: '22px' }}
											minW={{ sm: '170px', md: '140px', lg: '170px' }}
											bg='#1A1F27'
											borderRadius='10px'>
											<Text color='gray.400' fontSize='sm' mb='4px'>
												Max: 1 ETH
											</Text>
											<Box paddingBottom={1}>

												<NumberInput precision={4} onChange={(e) => setState((prevState) => ({ ...prevState, pubAmount: Number(e) }))} color='white' defaultValue={0}  step={0.002} max={1} min={0}>
													<NumberInputField />
													<NumberInputStepper>
														<NumberIncrementStepper color='white' />
														<NumberDecrementStepper color='white' />
													</NumberInputStepper>
												</NumberInput>
											</Box>
											<Text color='gray.400' fontSize='sm' mb='4px'>
												Will Recieve: {roundTo3(state.pubAmount / 0.006)} 404
											</Text>

											<Button onClick={() => depositPub()} w='100%' color='whitesmoke' background='linear-gradient(257.66deg, #26AFE6 -7.04%, #FE3DCE 106.8%);'>
												Buy</Button>







										</Flex>
									</Flex>

								</Flex>
							</Flex>
						</Card>
						{/*Private Sale Card*/}
						{state.whitelisted ?
							<Card >
								<Flex direction='column'>
									<Flex justify='space-between' align='center' mb='40px'>
										<Text color='#fff' fontSize='lg' fontWeight='bold'>
											Private Sale
										</Text>
										<Flex>
											<Tag m={0.5} borderRadius='5px' border='2px' borderColor='#05CD99' bgColor='transparent' color='#05CD99'>0.004ETH / 404</Tag>
										</Flex>
									</Flex>
									<Flex direction={{ sm: 'column', md: 'row' }}>
										<Flex direction='column' me={{ md: '6px', lg: '52px' }} mb={{ sm: '16px', md: '0px' }}>
											<Flex
												direction='column'
												p='15px'
												pe={{ sm: '22e', md: '8px', lg: '22px' }}
												minW={{ sm: '220px', md: '140px', lg: '220px' }}
												bg='#1A1F27'
												borderRadius='10px'
												mb='20px'>
												<Text color='gray.400' fontSize='sm' mb='4px'>
													Your Balance
												</Text>
												<Text color='#fff' fontSize='lg' fontWeight='bold'>
													{state.userBalance} ETH
												</Text>
											</Flex>
											<Flex
												direction='column'
												p='15px'
												pe={{ sm: '22px', md: '8px', lg: '22px' }}
												minW={{ sm: '170px', md: '140px', lg: '170px' }}
												bg='#1A1F27'
												borderRadius='10px'>
												<Text color='gray.400' fontSize='sm' mb='4px'>
													Max: 1 ETH
												</Text>
												<Box paddingBottom={1}>
													<NumberInput precision={4} onChange={(e) => setState((prevState) => ({ ...prevState, priAmount: Number(e) }))} color='white' defaultValue={0}  step={0.002} max={1} min={0}>
														<NumberInputField />
														<NumberInputStepper>
															<NumberIncrementStepper color='white' />
															<NumberDecrementStepper color='white' />
														</NumberInputStepper>
													</NumberInput>
												</Box>
												<Text color='gray.400' fontSize='sm' mb='4px'>
													Will Recieve: {roundTo3(state.priAmount / 0.004)} 404
												</Text>

												<Button onClick={() => depositPri()} w='100%' color='whitesmoke' background='linear-gradient(257.66deg, #26AFE6 -7.04%, #FE3DCE 106.8%);'>
													Buy</Button>




											</Flex>
										</Flex>

									</Flex>
								</Flex>
							</Card>
							: <Box></Box>}
					</SimpleGrid>
				</Flex>


			</main>

		</div>
	);
};

export default Home;




