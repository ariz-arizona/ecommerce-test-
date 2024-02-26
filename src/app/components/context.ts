import { createContext } from "react"

export type ApiData = {
    error: null | string
    data: any[]
}

type ApiQueryIds = {
    action: "get_ids",
    params: ApiPage
}
type ApiQueryItems = {
    action: "get_items",
    params: {
        ids: string[]
    }
}
type ApiQueryFilter = {
    action: "filter",
    params: ApiQueryFilterElements
}
export type ApiQueryFilterElements = {
    price?: number,
    product?: string,
    brand?: string
}
export type ApiQuery = ApiQueryIds | ApiQueryItems | ApiQueryFilter

export type ApiItem = {
    brand: string | null,
    id: string,
    price: number,
    product: string
}

export type ApiPage = {
    offset: number,
    limit: number
}
interface PageContext {
    items: ApiItem[],
    isLoading: boolean,
    filter: ApiQueryFilterElements,
    page: ApiPage,
    updateFilter?: ((v: ApiQueryFilterElements) => Promise<void>),
}
export const PageContext = createContext<PageContext>({
    items: [],
    isLoading: false,
    filter: {},
    page: { offset: 0, limit: 50 }
})