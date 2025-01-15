export interface clients {
  _id: string;
  fname: string;
  lname: string;
  phone_primary: string;
  budget: number;
  address: string;
  isArchive: boolean;
  pin: boolean;
}

export interface Items {
  _id: string;
  title: string;
  category: string;
  isActive: boolean;
  price: number;
  quantity: number;
}