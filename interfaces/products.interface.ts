export interface ProductAndImage{
    product:Product;
    images:ProductImage[];
}

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    postDate: Date;
    category: number;
    userId: number;
    productId: number;
    location: string;       
}

export interface ProductImage {
    id: number;
    productId: number;
    image: string;
}


export interface ImagesUrl {
    uri: string;
    type: string;
    name: string;
}

export interface ProductAndImagesUrl {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    postDate: Date;
    category: string;
    userId: number;
    productId: number; 
    images: ImagesUrl[];
}   
    
    

