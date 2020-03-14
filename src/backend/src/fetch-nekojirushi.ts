import { instance as puppeteer } from './puppeteer'
import { CatProfile } from './types'

const SITE_URL = 'https://www.neko-jirushi.com' as const
const BASE_URL = `${SITE_URL}/foster/cat/st-1/`

export const fetchNekojirushi = async (
  pageNumber?: string
): Promise<CatProfile[]> => {
  const browser = await puppeteer.launch({ timeout: 0 })
  const page = await browser.newPage()

  if (typeof pageNumber === 'undefined') {
    pageNumber = ''
  }

  const requestUrl = `${BASE_URL}${pageNumber}`

  await page.goto(requestUrl)

  const data = await page.evaluate((domain): CatProfile[] => {
    const cats = document.querySelectorAll('.kitten-row .wanted')

    return Array.from(cats).map(cat => {
      const id = ((): string => {
        // /foster/12345 -> ['', 'foster', '12345']
        const id = cat
          .querySelector('.fosterImg > a')!
          .getAttribute('href')
          .split('/')[2]
        return `nj-${id}`
      })()

      const title = cat.querySelector('.fosterTxt .fosterDescriTop .title a')!
        .textContent!

      const area = cat
        .querySelector('.fosterTxt .fosterDescriTop p:nth-of-type(2)')!
        .textContent!.split(/\s/)[0]

      // ネコジルシは性別が入力されていないことがある
      const sex = ((): string => {
        const symbol: Element | null = cat.querySelector(
          '.fosterTxt .fosterDescriTop p:nth-of-type(2) > span'
        )

        if (symbol !== null) {
          return symbol.textContent!
        } else {
          return '性別不明'
        }
      })()

      const url = ((): string => {
        const href = cat
          .querySelector('.fosterImg a:nth-of-type(1)')!
          .getAttribute('href')!
        return `${domain}${href}`
      })()

      const thumbNailUrl = ((): string => {
        // `querySelector`の戻値は`Element`
        // Element型に`dataset`は存在しないので、`HTMLElement`にキャストする
        const $img = cat.querySelector('.fosterImg img')! as HTMLElement
        return `${domain}${$img.dataset.original!}`
      })()

      const ageRange = cat
        .querySelector(
          '.fosterTxt .fosterDescriBtm .applyinfo p:nth-of-type(2)'
        )!
        .textContent!.replace(/(\t|\n)/g, '')

      return {
        id,
        title,
        area,
        sex,
        ageRange,
        url,
        thumbNailUrl,
        from: 'ネコジルシ',
      }
    })
  }, SITE_URL)

  console.log(`Done fetch from ${requestUrl}`)

  // ネコジルシは詳細ページに掲載期間があるので
  // 一度データを取得した上で
  // ループで各詳細ページに行って取得する
  return (async (): Promise<CatProfile[]> => {
    try {
      for (const _data of data) {
        const browser = await puppeteer.launch({ timeout: 0 })
        const page = await browser.newPage()

        await page.goto(_data.url)

        const period = await page.evaluate((): string => {
          const date = document
            .querySelector(
              '.catDetail .detailArea tr:nth-of-type(7) > td > span'
            )!
            .textContent!.replace(/(（.）|日)/g, '')
            .replace(/(年|月)/g, '-')
            .split(/(\d{4})-(\d{1,2})-(\d{1,2})/)

          // prettier-ignore
          return `${date[1].padStart(2, 0)}-${date[2].padStart(2, 0)}-${date[3].padStart(2, 0)}`
        })

        console.log(period)

        _data.period = period

        await browser.close()
      }
    } catch (error) {
      console.log(error)
    }

    return data
  })()
}
