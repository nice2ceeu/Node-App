const express = require('express')

const {getProds ,getOneProd, createProd, deleteProd, updateProd } = require('../controller/productController')

const prodRouter = express();

prodRouter.post('/node-app-lzb6.onrender.com/create', createProd);

prodRouter.get('/node-app-lzb6.onrender.com/products', getProds);

prodRouter.get('/node-app-lzb6.onrender.com/search', getOneProd);


// unused
prodRouter.delete('/:id',deleteProd );

prodRouter.put('/updateProd', updateProd);

module.exports = prodRouter;
