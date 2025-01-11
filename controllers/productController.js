import prisma from '../config/db.js';

export const getAllProduct = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json({products})
    } catch (error) {
        console.log("Error in getAllProduct", error);
        res.status(500).json({ message: "Error fetching products",error});
    }
}

export const addProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        if(!name || !price || !stock ) {
            return res.status(400).json({ message: "ต้องป้อนข้อมูล ชื่อสินค้า, ราคา และจำนวนสินค้าให้ครบ"})
        }

        const productName = await prisma.product.findFirst({
            where: {
                name: name
            }
        })
        if(productName) {
            return res.status(400).json({ message: "ชื่อสินค้าซ้ำ!!"})
        } 
        const newProduct = await prisma.product.create({
            data: {
                name,
                price,
                stock
            }
        })
        res.status(201).json({ 
            message: "Create Product success",
            product: newProduct
        });
       
    } catch (error) {
        console.log("Error in create product", error);
        res.status(500).json({ message : "Server error"})
    }
}

export const editProduct = async (req, res) => {
    const {id} = req.params;
    const {name, price, stock} = req.body;
    try {

        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id)}
        })

        if(!existingProduct) {
            return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการแก้ไข"})
        }

        const editProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                price,
                stock,
            },
        });
        res.status(200).json({
            message: "แก้ไขข้อมูลสิ้นค้าเสร็จสิ้น",
            product: editProduct});

    } catch (error) {
        console.log("Error in editProduct", error);
        res.status(500).json({ message: "ไม่สามรถแก้ไขสินค้าได้"})
    }
}

export const deleteProduct = async(req, res) => {
    const {id} = req.params;
    try {


        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id)}
        })

        if(!existingProduct) {
            return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการลบ"})
        }

        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).json({ message: "ลบสินค้าเรียบร้อยแล้ว"});
        
    } catch (error) {
        console.log("Error in deleteProduct", error);
        res.status(500).json({ message: "ลบสินค้าไม่ได้"})
    }
};

export const searchProducts = async (req, res) => {
    const {query} = req.query;

    try {
        const product = await prisma.product.findMany({
            where: {
                name: {
                    contains: query
                },
            },
        });

       

        res.status(200).json(product);
    } catch (error) {
        console.log("Error in search product", error);
        res.status(500).json({ message: "ไม่สามารถค้นหาสินค้าได้"})
    }
}
  