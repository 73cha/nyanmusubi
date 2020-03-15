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
        perPage?: number
        page?: number
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
      const count = INFOMATIONS.length

      if (first && after) {
        const start = ((): number => {
          const index = INFOMATIONS.findIndex(info => info.id === after)
          return index === 0 ? index : index + 1
        })()
        const edges = INFOMATIONS.slice(start, start + first).map(edge => ({
          node: edge,
          cursor: edge.id,
        }))

        return {
          edges,
          pageInfo: {
            total: count,
            totalPages: Math.ceil(count / first),
            startCursor:
              start === 0 ? edges[0].cursor : INFOMATIONS[start - 1].id,
            endCursor: edges[edges.length - 1].cursor,
            currentPage: page,
            hasNextPage: count < start + first ? false : true,
          },
        }
      }

      if (last && before) {
        const start = ((): number => {
          const index = INFOMATIONS.findIndex(info => info.id === before)
          return index + 1 === count ? -1 : index
        })()
        const left = start - count - last
        const isLeft = count <= Math.abs(left)
        const end = isLeft ? 0 : left

        console.log(left)
        const edges = INFOMATIONS.slice(end, start - count).map(edge => ({
          node: edge,
          cursor: edge.id,
        }))

        return {
          edges,
          pageInfo: {
            total: count,
            totalPages: Math.ceil(count / last),
            startCursor:
              start === -1
                ? edges[edges.length - 1].cursor
                : INFOMATIONS[start].id,
            endCursor: edges[0].cursor,
            hasPreviousPage: isLeft ? false : true,
          },
        }
      }
    },
  },
}

export default resolvers
