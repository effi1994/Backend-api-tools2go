
export interface SignupUser{
       id: number;
       fullName: string;
       email: string;
       password: string;
       phone: string;
       city: string;
       expoToken?: string;
       imageProfile?: string;
       isAdmin?: boolean;
       isOnline?: boolean;
       memberShip: string;

}

export enum Status {
       BASIC = 'BASIC',// no moor than 3 ads pordoh
       PREMIUM= 'PREMIUM',// no moor than 30 ads pordoh
       BUSINESS= 'BUSINESS',//no limit
}

export interface LoginUser{
       email: string;
       password: string;
}

/*

   id                   Int              @id @default(autoincrement())
  email                String           @unique
  token                String           @unique
  fullName             String
  phone                String           @unique
  city                 String
  expoToken            String
  imageProfile         String?           @db.Text() 
  isAdmin              Boolean          @default(false)
*/ 

