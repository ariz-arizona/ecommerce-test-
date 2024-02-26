'use client'

import { useEffect, useState } from 'react';
import { Alert, Col, Pagination, Row, Spin, Typography } from 'antd';
import md5 from 'md5';

import styles from "./page.module.css";
import Sidebar from './main/sidebar';
import Item from './main/item';
import { PageContext } from './components/context';
import type { ApiQuery, ApiData, ApiQueryFilterElements, ApiItem, ApiPage } from './components/context';

const PWD = process.env.NEXT_PUBLIC_PWD
const API_URL = process.env.NEXT_PUBLIC_API_URL

const apiRequest = (async (query: ApiQuery) => {
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



export default function Home() {
  const [page, setPage] = useState<ApiPage>({ offset: 0, limit: 50 })
  const [ids, setIds] = useState<string[]>([])
  const [items, setItems] = useState<ApiItem[]>([])
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

  const updateFilter = async (newFilterData: ApiQueryFilterElements): Promise<void> => {
    let ids: ApiData = { data: [], error: null }
    let newPage: ApiPage = { offset: 0, limit: page.limit }

    setLoading(true)
    setFilter(newFilterData)
    setPage(newPage)

    if (Object.keys(newFilterData).length) {
      ids = await apiRequest({ action: "filter", params: newFilterData })
    } else {
      ids = await apiRequest({ action: "get_ids", params: newPage })
    }

    setIds([...new Set(ids.data)])
    setLoading(false)

    const items = await apiRequest({ action: "get_items", params: { ids: ids.data } })
    setItems(items.data)
  }

  useEffect(() => {
    getData()
  }, [page.offset])

  const onPageChange = (newPage: number, pageSize: number) => {
    setPage({ offset: (newPage - 1) * pageSize, limit: page.limit })
  }

  return (
    <main className={styles.main}>
      <PageContext.Provider value={{ items, page, isLoading: isLoading || !!(ids.length && !items.length), filter, updateFilter }}>
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
