const express = require('express');
const router = express.Router();
const connection = require('../connection')

router.post('/shopify-webhook', async (req, res) => {
  try {
    const customerData = req.body;
    const customerId = customerData.id;
    const customerName = customerData.first_name +" " + customerData.last_name;
    const customerEmail = customerData.email;
    const purchaseTokens = 5;
    const usedTokens = 0
    console.log('Webhook Event:', customerData);
    
    const existingCustomer = await getCustomerFromDatabase(customerId);
  
    
    if (!existingCustomer) {
      return new Promise((resolve, reject) => {
    
        const query = 'INSERT INTO customer (customer_ID, customer_Email, customer_Name, purchase_Tokens, used_Tokens) VALUES (?, ?, ?, ?, ?)';
        
        connection.query(query, [customerId, customerEmail, customerName, purchaseTokens, usedTokens], (error, results) => {
          if (error) {
            console.error('Error:', error);
            reject(error);
          } else {
            console.log('customer saved to the database');
            res.status(200).json({customerId})
            resolve(); 
          }
        });
      })
    }else{
      console.log('existing customer')
    }
    res.status(200).json({customerId})
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }});
    
  const getCustomerFromDatabase = (customerId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM customer WHERE customer_ID = ?';
      connection.query(query, [customerId], (error, results) => {
        if (error) {
          console.error('Error:', error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  };

module.exports = router;