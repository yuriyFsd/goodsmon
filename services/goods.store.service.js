import { GoodsStoreMapper } from '../mappers/GoodsStoreMapper.js'

export class GoodsStoreService {
  constructor() {
    this.goodsStoreMapper = new GoodsStoreMapper()
  }
  async getAllProducts() {
    return this.goodsStoreMapper.getAllProducts()
  }

  async updateProductsInStorage(url, property) {
    console.log({ just_updated_in_db: url, property })
    return this.goodsStoreMapper.updateProductByUrl(url, property)
  }
}

// (async () => {
//   const goodsStoreService = new GoodsStoreService()
//   const res = await goodsStoreService.getAllProducts()
//   console.log({ res })
//   // await goodsStoreService.updateProductsInStorage()
// })()
