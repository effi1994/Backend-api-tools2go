const { PrismaClient } = require('@prisma/client')
const createError = require('http-errors')
const config = require("config");
const path = require("path");
const fs = require("fs");

const outputFolder = "public/assets";
class ProductsService {
    constructor() {
        this.products = new PrismaClient().products;
        this.productImage = new PrismaClient().productImages;
        this.users = new PrismaClient().users;
    }



    async getAllProducts() {
        try {
            const productAndImage = [];

            const allProducts = await this.products.findMany({});

            for (const product of allProducts) {
                let user = await this.users.findUnique({
                    where: { id: product.userId },
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        phone: true,
                        city: true,
                    }

                });
                const images = await this.productImage.findMany({
                    where: {
                        productId: product.id
                    }
                });

                const p = this.listingMapper(images);
                productAndImage.push({ product, images: p, user });
            }

            return productAndImage;
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }


    listingMapper(images) {
        let image = [];
        const baseUrl = config.get("assetsBaseUrl");
        images.forEach(element => {
            image.push(
                {
                    url: `${baseUrl}${element.fileName}_full.jpg`,
                    thumbnailUrl: `${baseUrl}${element.fileName}_thumb.jpg`
                }
            )
        });
        return image;

    }

    async getMyProduct(userId) {
        try {
            const myProducts = await this.products.findMany({
                where: {
                    userId: userId
                }
            });
            return myProducts;
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }

    async addProduct(product) {
        try {
            console.log(product, 'product');
            delete product.id;

            const newProduct = await this.products.create({
                data: product
            });
            newProduct.productId = newProduct.id;
            await this.products.update({
                where: {
                    id: newProduct.id
                },
                data: {
                    productId: newProduct.id
                }
            });

            return newProduct;
        } catch (error) {
            return createError(400, error);
        }
    }

    async addProductImages(productImage) {
        try {
            await this.productImage.createMany({
                data: productImage
            });
            const newProductImages = await this.productImage.findMany({
                where: {
                    productId: productImage[0].productId
                }
            });

            let images = [];
            images = this.listingMapper(newProductImages);

            return images;
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }

    async editProduct(product) {
        try {
            console.log(product, 'product');
            const editProduct = await this.products.update({
                where: {
                    id: product.id
                },
                data: {
                    name: product.name,
                    price: product.price,
                    categoryId: product.categoryId,
                    description: product.description,
                    postDate: new Date()
                }
            });
            return editProduct;
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }

    async editProductImages(productImage) {
        try {
            for (let i = 0; i < productImage.length; i++) {
                if (productImage[i].id) {
                    await this.productImage.update({
                        where: {
                            id: productImage[i].id
                        },
                        data: productImage[i]
                    });
                } else {
                    delete productImage[i].id;
                    await this.productImage.create({
                        data: productImage[i]
                    });
                }
            }
            const newProductImages = await this.productImage.findMany({
                where: {
                    productId: productImage[0].productId
                }
            });
            return newProductImages;
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }

    async deleteProducts(id) {
        try {
            let fileNames = [];
            fileNames = await this.productImage.findMany({
                where: {
                    productId: id
                },
                select: {
                    fileName: true
                }
            });
            await this.deleteImgs(fileNames.map((fileName) => fileName.fileName));

            const ids = await this.products.delete({
                where: {
                    id: id
                }
            });
            return ids;
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }

    async deleteImgs(fileNames) {
        // _thumb.jpg  _full.jpg
        try {
            console.log(fileNames);
            for (let i = 0; i < fileNames.length; i++) {
                fs.unlinkSync(path.resolve(outputFolder, fileNames[i] + "_thumb.jpg"));
                fs.unlinkSync(path.resolve(outputFolder, fileNames[i] + "_full.jpg"));
            }
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }

    async getUserProduct(userId) {
        try {
            let user = await this.users.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    city: true,
                }

            });
            return user;
        } catch (error) {
            return createError(400, 'userData is empty');
        }

    }

    async getProductById(id) {
        try {
            const product = await this.products.findUnique({
                where: {
                    id: id
                }
            });
            return product;
        } catch (error) {
            return createError(400, 'userData is empty');
        }
    }


}

module.exports = ProductsService;
