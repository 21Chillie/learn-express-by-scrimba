export type CartItemTypes = {
	id: number;
	user_id: number;
	product_id: number;
	quantity: number;
};

export type TotalCartItemsTypes = {
	total_quantity: number;
};

export type AllItemListsTypes = {
	cartItemId: number;
	quantity: number;
	title: string;
	artist: string;
	price: number;
};
