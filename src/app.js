const fs = require('fs');
const express = require('express');
const app = express();


// Importing products from products.json file
const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/product.json`)
);


// Middlewares
app.use(express.json());

// Write PATCH endpoint to buy a product for the client here
// Endpoint /api/v1/products/:id

app.patch('/api/v1/products/:id', (req, res) => {
    const proId=  req.params.id;  
    let product= products.find((p)=> p.id == proId );
    
    if(product)
    {
        let quantityAvailable=parseInt(product.quantity);
        if(quantityAvailable)
        {
             product={...product,quantity:quantityAvailable-1};
             let updatedProducts= products.map((item)=>item.id==proId?product:item);
             fs.writeFileSync(`${__dirname}/data/product.json`,JSON.stringify(updatedProducts));
             return res.status(200).send({
                    status: "success",
                    message: `Thank you for purchasing ${product.name}`,
                    product: product
             })
        }   
        else
        {
              return res.status(404).send(
                { status: "success", message: `${product.name} , Out of stock!`, }
              )
        }  
    }
    else
    {
       return res.status(404).send(
            { status: "failed", message: "Product not found!" } 

        )
    }
})


module.exports = app;
