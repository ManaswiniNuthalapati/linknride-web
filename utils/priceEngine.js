export function calculateSuggestedPrice(distance, vehicleType, capacity) {

  const vehicleRates = {
    mini_truck: 18,
    dcm: 28,
    medium_truck: 38,
    container_24ft: 32,
    heavy_truck: 50
  }

  const capacityFactors = {
    small: 1,
    medium: 1.2,
    large: 1.5,
    heavy: 1.8
  }

  const minTripPrice = {
    mini_truck: 1500,
    dcm: 3000,
    medium_truck: 5000,
    container_24ft: 6000,
    heavy_truck: 7000
  }

  const rate = vehicleRates[vehicleType] || 30
  const factor = capacityFactors[capacity] || 1

  let price = distance * rate * factor

  if(price < minTripPrice[vehicleType]){
    price = minTripPrice[vehicleType]
  }

  return Math.round(price)
}