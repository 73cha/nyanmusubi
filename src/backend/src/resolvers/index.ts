import { INFOMATIONS } from '../db/data'
import { CatProfile, PageInfo } from '../types'

const resolvers = {
  Query: {
    infomations: (
      parent,
      {
        perPage,
        page,
        area,
        first,
        after,
        last,
        before,
      }: {
        perPage: number
        page: number
        area?: string
        first?: number
        after?: string
        last?: number
        before?: string
      }
    ): {
      edges: { node: CatProfile; cursor: string }[]
      pageInfo: PageInfo
    } => {
      const start = page === 1 ? 0 : (page - 1) * perPage
      const end = perPage * page
      const defaultPageInfo: PageInfo = {
        currentPage: page,
        hasPreviousPage: page > 1 ? true : false,
      }

      if (area) {
        const infomations = INFOMATIONS.filter(edge =>
          new RegExp(area).test(edge.area)
        ).map(edge => ({ node: edge, cursor: edge.id }))
        const edges = infomations.slice(start, end)
        const totalPages: number = Math.ceil(infomations.length / perPage)

        if (infomations.length > 0) {
          return {
            edges,
            // prettier-ignore
            pageInfo: {
              ...defaultPageInfo,
              total: infomations.length,
              totalPages,
              startCursor: page === 1
                ? infomations[0].cursor
                : infomations[end - perPage - 1].cursor, // 前回の結果の最後の要素のcursor
              endCursor: edges[edges.length - 1].cursor, // 常にedgesの最後のcursor
              hasNextPage: page < totalPages ? true : false,
            }
          }
        } else {
          return {
            edges: infomations,
            pageInfo: {
              ...defaultPageInfo,
              total: edges.length,
              totalPages,
              hasPreviousPage: false,
              hasNextPage: false,
            },
          }
        }
      } else {
        const infomations = INFOMATIONS.map(edge => ({
          node: edge,
          cursor: edge.id,
        }))
        const edges = infomations.slice(start, end)
        const totalPages: number = Math.ceil(INFOMATIONS.length / perPage)

        return {
          edges,
          pageInfo: {
            ...defaultPageInfo,
            total: INFOMATIONS.length,
            totalPages,
            startCursor:
              page === 1
                ? infomations[0].cursor
                : infomations[end - perPage - 1].cursor, // 前回の結果の最後の要素のcursor
            endCursor: edges[edges.length - 1].cursor, // 常にedgesの最後のcursor
            hasNextPage: page < totalPages ? true : false,
          },
        }
      }
    },
  },
}

export default resolvers
