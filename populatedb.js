  
import mongodb from './services/mongodb.js'
const goodsInitial = [
  {
    url: 'https://www.atbmarket.com/product/morozivo-90-g-svoa-linia-briket-mup',
    titleOpenTag: '<h1 class="page-title product-page__title">',
    title: 'Морозиво 90 г Своя лінія Брикет м/уп'
  },
  {
    url: 'https://www.atbmarket.com/product/morozivo-90g-lasunka-plombir-ice-cake-zi-smvanili-ta-z-kakao-u-pecivi-ta-kondglaz-z-arah',
    titleOpenTag: '<h1 class="page-title product-page__title">',
    title:
      'Морозиво 90г Ласунка пломбір Ice-Cake зі см.ванілі та з какао у печиві та конд.глаз. з арах.'
  },
  {
    url: 'https://www.atbmarket.com/product/morozivo-100-g-oliver-smith-lakomij-plombir-u-zbitij-konditerskij-glazuri',
    titleOpenTag: '<h1 class="page-title product-page__title">',
    title: 'Морозиво 100  г Oliver Smith Лакомий пломбір у збитій кондитерській глазурі'
  },
  {
    url: 'https://www.atbmarket.com/product/ikra-310-g-veres-z-kabackiv-ekstra-skbanka',
    titleOpenTag: '<h1 class="page-title product-page__title">',
    title: 'Ікра 310 г Верес з кабачків Екстра ск/банка'
  },
  {
    url: 'https://www.atbmarket.com/product/morozivo-70g-rud-100-morozivo',
    titleOpenTag: '<h1 class="page-title product-page__title">',
    title: 'Морозиво 70г Рудь 100% морозиво'
  }
]

populatedb().catch(err=>console.log(err))
async function populatedb() {
    await mongodb.connect()

    const res = await mongodb.db().collection('goods').insertMany(goodsInitial) //TODO: insert or update
    console.log({ res })
    mongodb.close()
}
