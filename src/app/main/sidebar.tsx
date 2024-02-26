import { useContext } from "react"
import { Button, Form, Select, Slider, Space, Spin, Typography } from "antd"

import { PageContext } from "../page"

export default function Sidebar() {
    const { items, isLoading } = useContext(PageContext)

    const names: string[] = []
    const brands: string[] = []

    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        if (element.brand && !brands.includes(element.brand)) {
            brands.push(element.brand)
        }
        if (element.product && !names.includes(element.product)) {
            names.push(element.product)
        }
    }

    const prices = items.map(el => el.price)
    const slider = { min: Math.min(...prices), max: Math.max(...prices) }

    const filterFunc = (values: any) => {
        console.log(values)
    }
    return isLoading ?
        <Spin style={{ minHeight: '200px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} /> :
        <Form layout="vertical" onFinish={filterFunc}>
            <Typography.Paragraph>
                Фильтрация результатов по:
            </Typography.Paragraph>
            <Form.Item label="Названию" name="name">
                <Select
                    style={{ width: '100%' }}
                    showSearch={true}
                    options={names.map(el => { return { value: el, label: el } })}
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                />
            </Form.Item>
            <Form.Item label="Цене" name="price" initialValue={[slider.min, slider.max]}>
                <Slider range max={slider.max} min={slider.min} />
            </Form.Item>
            <Form.Item label="Бренду" name="brand">
                <Select style={{ width: '100%' }} options={brands.map(el => { return { value: el, label: el } })} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Искать</Button>
            </Form.Item>
        </Form>
}