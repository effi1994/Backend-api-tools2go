const CreditCardService = require('../services/creditCard.service');

class CreditCardController {
       constructor() {
              this.creditCardService = new CreditCardService();
       }

       async getCreditCardByUserId(req, res, next) {
              try {
                     let userId = req.body.userId;
                     let creditCard = await this.creditCardService.getCreditCardByUserId(userId);
                     res.status(200).json({ data: creditCard, message: 'getCreditCardByUserId' });
              } catch (error) {
                     next(error);
              }
       }

       async createCreditCard(req, res, next) {
              try {
                let newCreditCard = req.body.newCreditCard;
                let creditCard = await this.creditCardService.createCreditCard(newCreditCard, res);
                console.log('1');
            
                if (creditCard instanceof Error) {
                  // Handle the case where creditCard is an instance of Error
                  console.error('Error: Credit card creation failed');
                  // Respond with an appropriate error response
                  return res.status(500).json({ error: creditCard.message });
                } else if (typeof creditCard === 'object') {
                  // Handle the case where creditCard is an object representing a credit card
                  console.log('Credit card created successfully');
                  res.status(200).json({ data: creditCard, message: 'createCreditCard' });
                } else {
                  // Handle other cases (unexpected result)
                  console.error('Unexpected result:', creditCard);
                  return res.status(500).json({ error: 'Unexpected result' });
                }
              } catch (error) {
                next(error);
              }
            }
            

       async deleteCreditCardById(req, res, next) {
              try {
                     let userId = req.body.userId;
                     console.log(userId);
                      await this.creditCardService.deleteCreditCardById(userId);
                     res.status(200).json({ data: userId, message: 'deleteCreditCardById' });
              } catch (error) {
                     next(error);
              }
       }
}

module.exports = CreditCardController;