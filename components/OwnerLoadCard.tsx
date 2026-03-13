import { useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebaseConfig"

export default function OwnerLoadCard({load}:any){

  const customerPrice = load.price

  const [bidPrice,setBidPrice] = useState(customerPrice)

  const commission = Math.round(bidPrice * 0.05)

  const ownerEarning = bidPrice - commission

  const confirmBid = async () => {

    const ref = doc(db,"loads",load.id)

    await updateDoc(ref,{
      finalPrice: bidPrice,
      commission: commission,
      ownerEarning: ownerEarning,
      status:"accepted"
    })

    alert("Load accepted successfully 🚚")
  }

  return(

    <div className="bg-white shadow-lg rounded-xl p-6">

      <h3 className="text-lg font-bold">{load.typeOfGoods}</h3>

      <p className="text-gray-500">
        {load.pickup} → {load.drop}
      </p>

      <p className="mt-2">
        Capacity: {load.capacityRequired} tons
      </p>

      <div className="mt-4">

        <p className="font-semibold">
          Customer Price: ₹{customerPrice}
        </p>

      </div>

      {/* BID SLIDER */}

      <div className="mt-4">

        <label className="text-sm font-semibold">
          Your Bid Price
        </label>

        <input
          type="range"
          min={customerPrice}
          max={Math.round(customerPrice * 1.1)}
          value={bidPrice}
          onChange={(e)=>setBidPrice(Number(e.target.value))}
          className="w-full mt-2"
        />

        <div className="flex justify-between text-sm">
          <span>₹{customerPrice}</span>
          <span>₹{Math.round(customerPrice*1.1)}</span>
        </div>

        <div className="mt-2 font-bold text-lg">
          ₹{bidPrice}
        </div>

      </div>

      {/* COMMISSION */}

      <div className="mt-4 text-sm text-gray-600">

        <p>Platform Fee (5%): ₹{commission}</p>

        <p className="font-semibold text-black">
          Your Earnings: ₹{ownerEarning}
        </p>

      </div>

      {/* CONFIRM BUTTON */}

      <button
        onClick={confirmBid}
        className="mt-4 w-full bg-[#F4B400] py-2 rounded-lg font-semibold"
      >
        Confirm Bid
      </button>

    </div>
  )
}