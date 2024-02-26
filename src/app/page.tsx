import { Alert, Col, Row } from 'antd';
import md5 from 'md5';

import styles from "./page.module.css";
import Sidebar from './main/sidebar';
import Item from './main/item';

type Items = {
  error: null | string
  list: string[]
}

export const getData = (async () => {
  const headers = new Headers();
  const [pD, pM, pY] = [...new Date().toLocaleDateString('ru', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('.')]
  const md5Hash = md5(`Valantis_${pY}${pM}${pD}`)
  headers.append('X-Auth', md5Hash)
  headers.append('Content-Type', 'application/json')

  const items: Items = { list: [], error: null }

  try {
    const res = await fetch('http://api.valantis.store:40000/', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        "action": "get_ids",
        "params": { "offset": 0, "limit": 3 }
      })
    })

    if (res.status > 200) {
      items.error = `Произошла ошибка: ${res.status} ${res.statusText}`;
    } else {
      items.list = (await res.json()).result
    }
  } catch (err) {
    items.error = (err || 'ERR').toString()
  }

  return items
})

export default async function Home() {
  const { list, error } = await getData()

  return (
    <main className={styles.main}>
      <Row>
        <Col span={6}><Sidebar /></Col>
        <Col span={18}>
          {error ? <Alert message={error} type='error' /> :
            <Row>
              {list.map((el: string, i: number) => <Col span={4} key={i}>
                <Item id={el} />
              </Col>)}
            </Row>
          }
        </Col>
      </Row>
    </main>
  );
}
