import { useState, useEffect } from "react"

export default function PriceSlider({ suggestedPrice, onPriceChange }) {

  const min = Math.round(suggestedPrice * 0.8)
  const max = Math.round(suggestedPrice * 1.2)

  const [price, setPrice] = useState(suggestedPrice)

  useEffect(()=>{
    onPriceChange(price)
  },[price])

  return (
    <div style={{marginTop:"20px"}}>

      <h3>Suggested Price</h3>

      <div style={{fontSize:"24px",fontWeight:"bold"}}>
        ₹{price}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={price}
        onChange={(e)=>setPrice(Number(e.target.value))}
        style={{width:"100%"}}
      />

      <div style={{display:"flex",justifyContent:"space-between"}}>
        <span>₹{min}</span>
        <span>₹{max}</span>
      </div>

    </div>
  )
}