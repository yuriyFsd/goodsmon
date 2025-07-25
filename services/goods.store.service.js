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

  async addNewProduct(url, title, titleOpenTag) {
    const OPENTAG = '<h1 class="page-title product-page__title">'
    titleOpenTag = titleOpenTag?.length > 1 ? titleOpenTag : OPENTAG
    console.log({ titleOpenTag })
    return this.goodsStoreMapper.addNewProduct(url, title, titleOpenTag)
  }
}

// (async () => {
//   const goodsStoreService = new GoodsStoreService()
//   const res = await goodsStoreService.getAllProducts()
//   console.log({ res })
//   // await goodsStoreService.updateProductsInStorage()
// })()
