const { PrismaClient } = require('@prisma/client')
const createError = require('http-errors')

class CreditCardService {
       constructor() {
              this.creditCards = new PrismaClient().creditCard;
              this.bankMiddleware = new PrismaClient().bankMiddeleware;
       }

       async getCreditCardByUserId(userId) {
              try {
                     if (!userId) return createError(400, 'userId is empty');
                     const findCreditCard = await this.creditCards.findFirst({ where: { userId: userId } });
                     if (!findCreditCard) return createError(409, "CreditCard doesn't exist");
                     return findCreditCard;
              } catch (error) {
                     return createError(400, error.message);
              }
       }


       async createCreditCard(newCreditCard) {
              try {
                     
                     if (!newCreditCard) return createError(400, 'newCreditCard is empty');
                     delete newCreditCard.id;
                     console.log("1");
                     if (!this.checkCreditCard(newCreditCard)) return createError(400, 'newCreditCard is not valid');
                     console.log("2");
                     const findCreditCard = await this.creditCards.findFirst({ where: { cardNumber: newCreditCard.cardNumber } });
                     if (findCreditCard) return createError(409, `This cardNumber ${newCreditCard.cardNumber} already exists`);


                     const findUserId = await this.creditCards.findFirst({ where: { userId: newCreditCard.userId } });
                     if (findUserId) return createError(409, `This userId ${newCreditCard.userId} already exists`);

                     const findPersonId = await this.creditCards.findFirst({ where: { personId: newCreditCard.personId } });
                     if (findPersonId) return createError(409, `This personId ${newCreditCard.personId} already exists`);
                     
                     console.log("2");
                     console.log(newCreditCard);
                     const createCreditCard = await this.creditCards.create({ data: newCreditCard });
                     
                     let  money = 1000;
                     let bankMiddleware = {
                            id:0,
                            money:money,
                            creditCardId:createCreditCard.id
                     }
                   delete   bankMiddleware.id
                     await this.bankMiddleware.create({data:bankMiddleware})
                     console.log("3");

                     return createCreditCard;
              } catch (error) {
                     return createError(400, error.message);
              }
       }


       async deleteCreditCardById(userId) {
              try {
                     if (!userId) return createError(400, 'creditCardId is empty');
                     const findCreditCard = await this.creditCards.findFirst({ where: { userId: userId } });
                     console.log(findCreditCard);
                     if (!findCreditCard) return createError(409, "CreditCard doesn't exist");
                     await this.creditCards.delete({ where: { id: findCreditCard.id } });
                     return userId;
              } catch (error) {
                     return createError(400, error.message);
              }
       }

       checkCreditCard(creditCard) {
              // is number and length 16 and not empty
              // cvv is number and length 3 and not empty
              // personId is number and length 9 and not empty
              // expiryDate is date and not empty and is not expired

              if (!creditCard.cardNumber) return createError(400, 'cardNumber is empty');
              if (!creditCard.cvv) return createError(400, 'cvv is empty');
              if (!creditCard.personId) return createError(400, 'personId is empty');
              if (!creditCard.expiryDate) return createError(400, 'expiryDate is empty');

              if (creditCard.cardNumber.length !== 16) return createError(400, 'cardNumber length is not 16');
              if (creditCard.cvv.length !== 3) return createError(400, 'cvv length is not 3');
              if (creditCard.personId.length !== 9) return createError(400, 'personId length is not 9');
              let today = new Date();
              //expiryDate  =  'mm/yy'
              let expiryDate = creditCard.expiryDate.split('/');
              console.log(expiryDate);
              if (expiryDate.length !== 2) return createError(400, 'expiryDate is not valid');
              if (expiryDate[0] < 1 || expiryDate[0] > 12) return createError(400, 'expiryDate month is not valid');              
              if (expiryDate[1] < today.getFullYear()) return createError(400, 'expiryDate year is not valid');
              if (expiryDate[1] == today.getFullYear() && expiryDate[0] < today.getMonth() + 1) return createError(400, 'expiryDate is expired');
              console.log(expiryDate[1], today.getFullYear());
              return true;
       }

       

}

module.exports = CreditCardService;
