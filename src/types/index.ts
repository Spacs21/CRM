export interface clients {
    _id: string,
    fname: string,
    lname: string,
    phone_primary: string,
    address: string,
    budget: number
}
export interface Items {
  _id: string;
  title: string;
  category: string;
  isActive: boolean;
  price: number;
  quantity: number;
}