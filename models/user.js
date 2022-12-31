const { ObjectID } = require('bson');
const { MongoDBNamespace } = require('mongodb');
const mongoose = require('mongoose');
const Product = require('./product');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false,
        default: 'Yok'
    },
    resetToken: String,
    resetTokenExpiration: Date,
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
});

userSchema.methods.addToCart = function (product) {
    const index = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [...this.cart.items];

    let itemQuantity = 1;
    if (index >= 0) {
        itemQuantity = this.cart.items[index].quantity + 1;
        updatedCartItems[index].quantity = itemQuantity;
    }
    else {
        updatedCartItems.push({
            productId: product._id,
            quantity: itemQuantity
        });
    }

    this.cart = {
        items: updatedCartItems
    }

    return this.save();
}

userSchema.methods.getCart = function () {
    const ids = this.cart.items.map(i => {
        return i.productId;
    });

    return Product.find({
        _id: {
            $in: ids
        }
    })
        .select('name price image')
        .then(products => {
            return products.map(p => {
                return {
                    _id: p._id,
                    name: p.name,
                    price: p.price,
                    image: p.image,
                    quantity: this.cart.items.find(i => {
                        return i.productId.toString() === p._id.toString()
                    }).quantity
                }
            })
        })
}

userSchema.methods.deleteCartItem = function (productid) {
    const cartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productid.toString()
    });
    this.cart.items = cartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = { items: []};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);