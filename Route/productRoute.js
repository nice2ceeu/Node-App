const express = require('express')

const {getProds ,getOneProd, createProd, deleteProd, updateProd } = require('../controller/productController')

const prodRouter = express();

prodRouter.post('/create', createProd);

prodRouter.get('/products', getProds);

prodRouter.get('/search', getOneProd);


// unused
prodRouter.delete('/:id',deleteProd );

prodRouter.put('/:id', updateProd);

module.exports = prodRouter;
