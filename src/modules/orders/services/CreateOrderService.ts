import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer address already used.');
    }

    const allProducts = await this.productsRepository.findAllById(products);

    if (products.length > 0 && products.length !== allProducts.length) {
      throw new AppError('Products address already used.');
    }

    await this.ordersRepository.create({
      customer,
      products: allProducts,
    });
    // const productsDTO = products.map<IProductDTO>(prod => {
    //   const prodDTO = new IProductDTO();

    //   return prodDTO;
    // });
    // const dto = new ICreateOrderDTO();
    // dto.

    // const order = await this.ordersRepository.create({
    //   customer_id,
    //   products,
    // });

    return new Order();
  }
}

export default CreateProductService;
