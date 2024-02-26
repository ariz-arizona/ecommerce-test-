'use client'

import { Alert, Col, Pagination, Row, Spin } from 'antd';
import md5 from 'md5';

import styles from "./page.module.css";
import Sidebar from './main/sidebar';
import Item from './main/item';
import { createContext, useEffect, useMemo, useState } from 'react';

type ApiData = {
  error: null | string
  data: any[]
}

type ApiQueryIds = {
  action: "get_ids",
  params: {
    offset: number,
    limit: number
  }
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
type ApiQueryFilterElements = {
  price?: number,
  product?: string,
  brand?: string
}
type ApiQuery = ApiQueryIds | ApiQueryItems | ApiQueryFilter

export type Item = {
  brand: string | null,
  id: string,
  price: number,
  product: string
}

const PWD = process.env.NEXT_PUBLIC_PWD
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const apiRequest = (async (query: ApiQuery) => {
  if (!PWD || !API_URL) { return { error: 'no api', data: [] } }
  if (!Object.keys(query.params).length) { return { error: 'no params', data: [] } }

  const headers = new Headers();
  const [pD, pM, pY] = [...new Date().toLocaleDateString('ru', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('.')]
  const md5Hash = md5(`${PWD}_${pY}${pM}${pD}`)
  headers.append('X-Auth', md5Hash)
  headers.append('Content-Type', 'application/json')

  const data: ApiData = { error: null, data: [] }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(query)
    })

    if (res.status > 200) {
      data.error = `Произошла ошибка: ${res.status} ${res.statusText}`;
    } else {
      data.data = (await res.json()).result
    }
  } catch (err) {
    data.error = (err || 'ERR').toString()
  }

  if (data.error) {
    console.error(data.error)
    return apiRequest(query)
  } else {
    return data
  }
})


export const PageContext = createContext({
  items: [] as Item[],
  isLoading: false as boolean,
  filter: {} as any,
  updateFilter: null as any
})

export default function Home() {
  const [page, setPage] = useState<{ offset: number, limit: number }>({ offset: 0, limit: 50 })
  const [ids, setIds] = useState<string[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState<ApiQueryFilterElements>({})

  const getData = (async () => {
    setLoading(true)

    const ids = await apiRequest({ action: "get_ids", params: page })
    setIds([...new Set(ids.data)])

    setLoading(false)

    const items = await apiRequest({ action: "get_items", params: { ids: ids.data } })
    setItems(items.data)
  })

  useEffect(() => {
    getData()
  }, [page.offset])

  const onPageChange = (newPage: number, pageSize: number) => {
    setPage({ offset: (newPage - 1) * pageSize, limit: page.limit })
  }

  const updateFilter = async (newFilterData: ApiQueryFilterElements): Promise<void> => {
    setFilter(newFilterData)

    setLoading(true)
    let ids: ApiData = { data: [], error: null }
    if (Object.keys(newFilterData).length) {
      ids = await apiRequest({ action: "filter", params: newFilterData })
    } else {
      ids = await apiRequest({ action: "get_ids", params: page })
    }
    setIds([...new Set(ids.data)])
    setLoading(false)

    const items = await apiRequest({ action: "get_items", params: { ids: ids.data } })
    setItems(items.data)
  }

  return (
    <main className={styles.main}>
      <PageContext.Provider value={{ items, isLoading: isLoading || !!(ids.length && !items.length), filter, updateFilter }}>
        <Row gutter={24}>
          <Col span={6}><Sidebar /></Col>
          <Col span={18}>
            <Row gutter={[24, 24]}>
              {(!API_URL || !PWD) && <Alert message="API недоступно" type='error' />}
              {isLoading &&
                <Col span={24}>
                  <Spin style={{ minHeight: '200px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                </Col>}
              {ids.length > 0 && <>
                {ids.map((el: string, i: number) => <Col span={8} key={i}>
                  <Item id={el} item={items.find(item => item.id === el)} />
                </Col>)}
                <Col span={24}>
                  <Pagination
                    responsive={true}
                    total={300}
                    current={(page.offset / page.limit) + 1}
                    showSizeChanger={false}
                    pageSize={page.limit}
                    onChange={onPageChange}
                  />
                </Col>
              </>
              }
            </Row>
          </Col>
        </Row>
      </PageContext.Provider>
    </main>
  );
}
