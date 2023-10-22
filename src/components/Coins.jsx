import { Button, Container, HStack, Radio, RadioGroup } from '@chakra-ui/react'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { server } from '../index';
import Loader from './Loader';
import ErrorComponents from './ErrorComponents';
import CoinComponents from './CoinComponents';

const Coins = () => {
  
  const [error, setError] = useState(false);
  const [coins, setCoins] = useState([]);
  const [laoding, setLoading]= useState(true);
  const [currency, setCurrency]= useState("inr");
  const [page, setPage]= useState(1);
  // $,€,₹
  const currencySymbol=currency==="inr"?"₹":currency==="eur"?"€":"$";
  const changePage=(page)=>{
    setPage(page);
    setLoading(true);
  }
  const btn= new Array(132).fill(1);

  useEffect(() => {
    const fetchCoins= async()=>{
      try {
        const {data}= await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`);
        console.log(data);
        setCoins(data);
        setLoading(false)
      } catch (error) {
        setError(true);
        setLoading(false);
      }

    }
    fetchCoins();
  }, [currency,page])
  
  if (error) 
  return <ErrorComponents message={"error while feching the coins"}/>;
  return <Container maxW={"container.xl"} >
    {
    laoding?(<Loader/>):
    <>

    <RadioGroup value={currency} onChange={setCurrency}>
      <HStack spacing={"4"}>
        <Radio value={"inr"} >₹ INR</Radio>
        <Radio value={"eur"}>€ ERU</Radio>
        <Radio value={"usd"}>$ USD</Radio>
      </HStack>

    </RadioGroup>
      <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
        {
          coins.map((i)=>(
            <CoinComponents key={i.id} symbol={i.symbol} name={i.name} img={i.image} id={i.id} price={i.current_price} currencySymbol={currencySymbol} />
          ))
        }

      </HStack>

      <HStack w={'full'} overflowX={"auto"} p={"8"}>
        {
          btn.map((item,index)=>(
            <Button bgColor={'blackAlpha.900'} key={index} color={'white'} onClick={()=>changePage(index+1)}>
              {index+1}
            </Button>
          ))
        }
      </HStack>
    </>
  }
  </Container>
}

export default Coins