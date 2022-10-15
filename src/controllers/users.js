const prisma = require("../utils/prisma");
const authMethods = require("../methods/auth");

const getUsers = async (req, res, next) => {
	const { email } = req.body;

	try {
		if (email) {
			const userEmail = await authMethods.emailVerify(email);
			if (!userEmail) return res.status(400).json({ errorMessage: "This email is not registered" });
			else return res.status(200).json(userEmail);
		} else {
			const users = await prisma.user.findMany();
			if (users) return res.status(200).json(users);
			else return res.status(404).json({ errorMessage: "Users Not Found" });
		}
	} catch (error) {
		next(error);
	}
};

const getUserFavourites = async (req, res, next) => {
	const { id } = req.params;

	try {
		const doesUserExist = await prisma.user.findUnique({
			where: {
				id
			}
		});

		if (doesUserExist) {
			const favouritesProductsByUser = await prisma.favourite_Product.findMany({
				where: {
					idUser: id
				},
				select: {
					idProduct: true
				}
			});

			if (favouritesProductsByUser.length) {
				const idProductsArray = favouritesProductsByUser.map(favProduct => favProduct.idProduct);

				const favProductsByUser = [];
				for (let i = 0; i < idProductsArray.length; i++) {
					const favProduct = await prisma.product.findUnique({
						where: {
							id: idProductsArray[i]
						}
					});
					favProductsByUser.push(favProduct);
				}

				return res.status(200).json(favProductsByUser);
			} else return res.status(200).json({ errorMessage: "This user does not have favourites" });
		} else return res.status(404).json({ errorMessage: "There is no user with that id" });
	} catch (error) {
		next(error);
	}
};

const addUserFavourites = async (req, res, next) => {
	const { id } = req.params;
	const { idProduct } = req.body;

	try {
		const doesUserExist = await prisma.user.findUnique({
			where: {
				id
			}
		});

		if (doesUserExist) {
			const doesProductExist = await prisma.product.findUnique({
				where: {
					id: idProduct
				}
			});

			if (doesProductExist) {
				const favProductsByUser = await prisma.favourite_Product.findMany({
					where: {
						idUser: id
					},
					select: {
						idProduct: true
					}
				});

				const productAlreadyInFavs = favProductsByUser.find(favProduct => favProduct.idProduct === idProduct);

				if (productAlreadyInFavs)
					return res.status(200).json({
						errorMessage: `${doesProductExist.name} is already in ${doesUserExist.name} ${doesUserExist.surname}'s favourites`
					});
				else {
					await prisma.favourite_Product.create({
						data: {
							idUser: id,
							idProduct
						}
					});

					return res.status(200).json({
						message: `${doesProductExist.name} added to ${doesUserExist.name} ${doesUserExist.surname}'s favourites`
					});
				}
			} else return res.status(404).json({ errorMessage: "There is no product with that id" });
		} else return res.status(404).json({ errorMessage: "There is no user with that id" });
	} catch (error) {
		next(error);
	}
};

module.exports = { getUsers, getUserFavourites, addUserFavourites };
