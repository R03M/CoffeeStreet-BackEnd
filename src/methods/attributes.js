const prisma = require("../utils/prisma");

const texture = ["veryFine", "fine", "medium", "coarse", "desertDunes"];
const body = ["light", "perceivable", "medium", "thick", "sirupy"];
const acidity = ["notFound", "light", "perceivable", "fresh", "high"];
const bitterness = ["light", "perceivable", "medium", "high", "veryHigh"];
const roast = ["cinnamon", "light", "city", "fullCity", "dark", "french", "italian"];
const color = ["yellow", "amber", "lightBrown", "hazelnut", "darkBrown", "dark"];

const verifyDataAttributes = data => {
	////valido que la data enviada de attributes exista y que su datatype sea el correcto, si hay un solo error la función retornará true

	if (
		!(data.cream === false || data.cream === true) ||
		typeof data.cream !== "boolean" ||
		!texture.includes(data.texture) ||
		!body.includes(data.body) ||
		!acidity.includes(data.acidity) ||
		!bitterness.includes(data.bitterness) ||
		!roast.includes(data.roast) ||
		!color.includes(data.color)
	)
		return true;
	else return false;
};

const createNewAttribute = async data => {
	const { cream, texture, body, acidity, bitterness, roast, color } = data;
	const dataAttributes = { cream, texture, body, acidity, bitterness, roast, color };

	//Primero verifco que la combinación de attributes enviada no exista ya en la db, si es así, se enviará la data necesaria para bloquear
	//y pedir corrección en la creación de los attributes del nuevo producto
	// const repeated = await prisma.attribute.findFirst({
	// 	where: {
	// 		cream,
	// 		texture,
	// 		body,
	// 		acidity,
	// 		bitterness,
	// 		roast,
	// 		color
	// 	}
	// });

	// if (repeated) {
	// 	const product = await prisma.product.findFirst({ where: { idAttribute: repeated.id } });
	// 	return { repeated: true, product };
	// } else {
	//Si no existe la combinación de attributos enviada desde el front, se crea un nuevo elemento en la tabla de attributes
	const newAttribute = await prisma.attribute.create({ data: dataAttributes });
	return newAttribute;
};

module.exports = { verifyDataAttributes, createNewAttribute };
