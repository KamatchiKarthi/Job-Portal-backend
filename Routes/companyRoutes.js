const { UpdateCompany, getMycompany } = require('../Controllers/CompanyControllers');
const checkTokenValid = require('../Middlewares/authmiddleware.js');

const companyRouter = require('express').Router();

companyRouter.post('/create', checkTokenValid, UpdateCompany);

companyRouter.put('/update', checkTokenValid, UpdateCompany);

companyRouter.get('/me', checkTokenValid, getMycompany);

module.exports = companyRouter;
