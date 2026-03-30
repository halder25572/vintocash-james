// export type Vehicle = {
//   id: string;
//   name: string;
//   price: number;
//   mileage: number;
//   condition: "New" | "Excellent" | "Pristine" | "Good";
//   location: string;
//   image: string;
// };

export type ActivityItem = {
  id: string;
  text: string;
  time: string;
  status: "green" | "yellow" | "blue";
};

export type Vehicle = {
  id: string;
  name: string;
  price: number;
  mileage: number;
  condition: "New" | "Excellent" | "Pristine" | "Good" | "Like New";
  location: string;
  image: string;
  images?: string[];
  description?: string;
  features?: string[];
  specs?: {
    year: string;
    make: string;
    model: string;
    trim: string;
    fuelType: string;
    transmission: string;
    drivetrain: string;
    exteriorColor: string;
  };
  estimatedValue?: number;
  currentHighBid?: number;
};

// export type ActivityItem = {
//   id: string;
//   text: string;
//   time: string;
//   status: "green" | "yellow" | "blue";
// };