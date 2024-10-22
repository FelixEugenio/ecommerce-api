const mongoose = require('mongoose');
const Store = mongoose.model('stores');

class StoreController{
    //listar todas as lojas
    index(req, res, next){
        Store.find({ }).select(' _id name phone address email cnpj')
        .then(stores => res.send({stores}))
        .catch(next)
    }

    //listar uma unica loja
    show(req, res, next){
        Store.findById(req.params.id).select(' _id name phone address email cnpj')
        .then(stores => res.send({stores}))
        .catch(next)
    }

    //criar uma nova loja
    store(req, res, next){
        const { name, phone, address, email, cnpj } = req.body;

        const error = []
        if(!name) error.push('name');
        if(!phone) error.push('phone');
        if(!address) error.push('address');
        if(!email) error.push('email');
        if(!cnpj) error.push('cnpj');

        if(error.length > 0) return res.status(422).json({ error: 'Please, fill in all fields' ,payload: error});

        const store = new Store({ name, phone, address, email, cnpj });

        store.save()
        .then(store => res.send({store}))
        .catch(next)
    }

    //atualizar uma loja
    update(req, res, next){
        const { name, phone, address, email, cnpj } = req.body;
        Store.findById(req.params.id)
        .then(store => {
            if(!store) return res.status(401).json({ error: 'Store not registered' });
            if(typeof name !== 'undefined') store.name = name;
            if(typeof phone !== 'undefined') store.phone = phone;
            if(typeof address !== 'undefined') store.address = address;
            if(typeof email !== 'undefined') store.email = email;
            if(typeof cnpj !== 'undefined') store.cnpj = cnpj;
            return store.save()
            .then(store => res.send({store}))
            .catch(next);
        })
        .catch(next);
    }

    //deletar uma loja
    remove(req, res, next){
        Store.findById(req.params.id)
        .then(store => {
            if(!store) return res.status(401).json({ error: 'Store not registered' });
            return store.deleteOne()
            .then(() => res.send({ deletado: true }))
            .catch(next);
        })
        .catch(next);
    }
};

module.exports = StoreController;