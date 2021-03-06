const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const { verificaToken, verificaUsuarioRol } = require('../middlewares/autenticacion');
const usuario = require('../models/usuario');
const _ = require('underscore');

const app = express();

app.get('/usuario', verificaToken, function(req, res) {

    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
    });

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuarios
            });
        });
    // res.json('Hello World');
});

app.post('/usuario', [verificaToken, verificaUsuarioRol], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaUsuarioRol], function(req, res) {



    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estdo']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
});
app.delete('/usuario/:id', [verificaToken, verificaUsuarioRol], function(req, res) {

    let id = req.params.id;
    //let body = _.pick(req.body, ['estdo']);
    // Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioaborrar) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            usuario: usuarioaborrar
        });

    })

    /*    Usuario.findByIdAndRemove(id, (err, usuarioaborrar) => {

           if (err) {
               return res.status(400).json({
                   ok: false,
                   err
               });
           };
           res.json({
               ok: true,
               usuario: usuarioaborrar
           });


       }); */

});

module.exports = app;