import { instance as puppeteer } from './puppeteer'
import { CatProfile } from './types'

const SITE_URL = 'https://www.pet-home.jp' as const
const BASE_URL = `${SITE_URL}/cats/status_2/`

export const fetchPetHome = async (
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
    const cats = document.querySelectorAll(
      '.contribute_result_wrap .contribute_result'
    )

    return Array.from(cats).map(cat => {
      const id = ((): string => {
        // /cats/kanagawa/pn304765/ -> ['', 'cats', 'kanagawa', 'pn304765', '']
        const id = cat
          .querySelector('.title > a')!
          .getAttribute('href')!
          .split('/')[3]
          .replace('pn', '')

        return `ph-${id}`
      })()

      const title = cat.querySelector('.title')!.textContent!.replace(/\n/g, '')

      const area = cat
        .querySelector('.pet_area')!
        .textContent!.replace(/\s/, '')

      const [sex, ageRange] = cat
        .querySelector('.pet_sex')!
        .textContent!.split(/\n/)
        .filter(item => item !== '')

      const period = ((): string => {
        const period = cat.querySelector('.pet_limit_date')!.textContent!

        if (/期限まであと(?:.+)日/.test(period)) {
          return period.replace(/\n/g, '')
        } else {
          return period.replace(/(\n|まで|日|\s)/g, '').replace(/(年|月)/g, '-')
        }
      })()

      const url = ((): string => {
        const href = cat.querySelector('.title > a')!.getAttribute('href')!
        return `${domain}${href}`
      })()

      const thumbNailUrl = cat
        .querySelector('.img_container > img')!
        .getAttribute('src')!

      console.log(period)

      return {
        id,
        title,
        area,
        sex,
        ageRange,
        period,
        url,
        thumbNailUrl,
        from: 'ペットのおうち',
      }
    })
  }, SITE_URL)

  await browser.close()

  console.log(`Done fetch from ${requestUrl}`)

  return data
}
