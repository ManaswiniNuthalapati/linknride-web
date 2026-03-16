import { useEffect, useState } from "react"

export default function CountdownTimer({expiry}:{expiry:number}){

 const [timeLeft,setTimeLeft] = useState(expiry - Date.now())

 useEffect(()=>{

  const timer = setInterval(()=>{

   setTimeLeft(expiry - Date.now())

  },1000)

  return ()=>clearInterval(timer)

 },[expiry])

 if(timeLeft <= 0){
   return <p className="text-red-500">Lock expired</p>
 }

 const minutes = Math.floor(timeLeft/60000)
 const seconds = Math.floor((timeLeft%60000)/1000)

 return (
  <p className="font-semibold text-[#F4B400]">
   Time Left: {minutes}:{seconds.toString().padStart(2,"0")}
  </p>
 )

}