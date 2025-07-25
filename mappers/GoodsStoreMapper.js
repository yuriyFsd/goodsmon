import mongodb from '../services/mongodb.js'

export class GoodsStoreMapper {
  constructor() {}
  async getAllProducts() {
    await mongodb.connect()
    const products = await mongodb.db().collection('goods').find({}).toArray()
    return products
  }

  /**
   *
   * @param string productUrl
   * @param array productPrices
   * @returns
   */
  async updateProductByUrl(productUrl, productProperty) {
    const updateResult = await mongodb
      .db()
      .collection('goods')
      .updateOne({ url: productUrl }, { $set: { ...productProperty, updated: new Date() } })
    return updateResult
  }

  async addNewProduct(productUrl, productTitle, productTitleOpenTag) {
    const insertResult = await mongodb
      .db()
      .collection('goods')
      .insertOne({ url: productUrl, title: productTitle, titleOpenTag: productTitleOpenTag, updated: new Date() })
    return insertResult
  }
}

//const goodsStoreMapper = new GoodsStoreMapper()
// await goodsStoreMapper.updateProduct()
// await goodsStoreMapper.getAllProducts()
