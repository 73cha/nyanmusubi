import { promises as fs } from 'fs'
import { resolve } from 'path'
import { fetchNekojirushi } from './fetch-nekojirushi'
import { fetchPetHome } from './fetch-pethome'
;(async (): Promise<void> => {
  try {
    const response = await Promise.all([
      await fetchNekojirushi(),
      await fetchNekojirushi('?page=2'),
      await fetchNekojirushi('?page=3'),
      await fetchNekojirushi('?page=4'),
      await fetchNekojirushi('?page=5'),
      await fetchPetHome(),
      await fetchPetHome('page2/'),
      await fetchPetHome('page3/'),
      await fetchPetHome('page4/'),
      await fetchPetHome('page5/'),
    ])

    const results = response.flat()

    console.log(results.length)
    // JSONをprettifyする方法
    // https://qiita.com/wawoon/items/a47257bb76082e653f4d
    const input = `export const INFOMATIONS = ${JSON.stringify(
      results,
      null,
      2
    )}`

    // https://qiita.com/kulikala/items/135da20465c367348b52#import-%E6%96%87%E3%81%A7%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%82%80%E5%A0%B4%E5%90%88
    await fs.writeFile(resolve(__dirname, './db/data.ts'), input)

    console.log('Done generate data')
  } catch (error) {
    throw new Error(error)
  }
})()
