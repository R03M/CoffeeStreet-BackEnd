const prisma = require("../utils/prisma");

const createOrder = async (req, res, next) => {
	let { status, date, idUser } = req.body;

	// date = new Date("2021-03-19T14:21:00+0200");

	try {
		const orderExist = await prisma.order.findFirst({
			where: {
				status,
				date,
				idUser
			}
		});
		if (orderExist === null) {
			const createdOrder = await prisma.order.create({
				data: {
					status,
					date,
					idUser
				}
			});

			res.status(200).json({ msg: "Order created succesfully", order: createdOrder });
		} else {
			res.status(200).json({ msg: "The order already exists" });
		}
	} catch (error) {
		next(error);
	}
};

const changeStatus = async (req, res, next) => {
	const { id } = req.params;
	const { status } = req.body;
	try {
		if (status === "pending" || status === "complete") {
			const foundOrder = await prisma.order.findUnique({
				where: {
					id
				}
			});
			if (foundOrder) {
				if (status !== foundOrder.status) {
					const updatedStatus = await prisma.order.update({
						where: {
							id
						},
						data: {
							status
						}
					});
					return res.status(200).json({ message: `The status was changed successfully to ${status}`, updatedStatus });
				} else return res.status(400).json({ errorMessage: "Please enter a different status" });
			} else return res.status(404).json({ errorMessage: "The order is not exist" });
		} else return res.status(400).json({ errorMessage: "Please enter a valid status" });
	} catch (error) {
		next(error);
	}
};

module.exports = { createOrder, changeStatus };
