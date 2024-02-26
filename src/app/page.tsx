'use client'

import { Alert, Col, Row, Spin } from 'antd';
import md5 from 'md5';

import styles from "./page.module.css";
import Sidebar from './main/sidebar';
import Item from './main/item';
import { useEffect, useMemo, useState } from 'react';

type ApiData = {
  error: null | string
  data: any[]
}
type ApiQuery = {
  action: "get_ids" | "get_items",
  params: {
    ids?: string[],
    offset?: number,
    limit?: number
  }
}
export type Item = {
  brand: string | null,
  id: string,
  price: number,
  product: string
}

const apiRequest = (async (query: ApiQuery) => {
  const headers = new Headers();
  const [pD, pM, pY] = [...new Date().toLocaleDateString('ru', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('.')]
  const md5Hash = md5(`Valantis_${pY}${pM}${pD}`)
  headers.append('X-Auth', md5Hash)
  headers.append('Content-Type', 'application/json')

  const data: ApiData = { error: null, data: [] }

  try {
    const res = await fetch('http://api.valantis.store:40000/', {
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

  return data
})

export default function Home() {
  const [ids, setIds] = useState<string[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    const getItems = (async (ids:any[]) => {
      const { data } = await apiRequest({ action: "get_items", params: { ids } })
      return data
    })
    const getData = (async () => {
      const { error, data } = await apiRequest({ action: "get_ids", params: { offset: 0, limit: 3 } })
      setIds(data)
      setError(error)
      setLoading(false)
      setItems(await getItems(data))
    })
    getData()
  }, [])

  const errorMsg = error ? <Alert message={error} type='error' /> : null
  const loadingMsg = isLoading ? <Spin /> : null

  return (
    <main className={styles.main}>
      <Row>
        <Col span={6}><Sidebar /></Col>
        <Col span={18}>
          {(loadingMsg || errorMsg) ? loadingMsg || errorMsg :
            <Row>
              {ids.map((el: string, i: number) => <Col span={4} key={i}>
                <Item id={el} item={items.find(item => item.id === el)} />
              </Col>)}
            </Row>
          }
        </Col>
      </Row>
    </main>
  );
}
