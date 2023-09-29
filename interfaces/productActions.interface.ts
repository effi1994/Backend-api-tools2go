export interface SearchAviableProduct {
    productId: number;
    startDate: Date;
    endDate: Date;
}

export interface RentMyProducts {
    id: number;
    productId: number;
    userIdRenter: number;
    dateFromRent: Date;
    price: number;
    dateToRent: Date;
}