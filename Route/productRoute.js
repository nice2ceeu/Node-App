const express = require('express')

const {getProds ,getOneProd, createProd, deleteProd, updateProd } = require('../controller/productController')

const prodRouter = express();

prodRouter.post('/node-app-y9kl.onrender.com/create', createProd);

prodRouter.get('/node-app-y9kl.onrender.com/products', getProds);

prodRouter.get('/node-app-y9kl.onrender.com/search', getOneProd);


// unused
prodRouter.delete('/node-app-y9kl.onrender.com/:id',deleteProd );

prodRouter.put('/node-app-y9kl.onrender.com/updateProd', updateProd);

module.exports = prodRouter;
