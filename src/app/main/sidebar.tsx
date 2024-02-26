import { useContext } from "react"
import { Button, Col, Form, Row, Select, Slider, Spin, Typography } from "antd"

import { PageContext } from "../page"

export default function Sidebar() {
    const { items, isLoading, filter, updateFilter } = useContext(PageContext)

    const names: string[] = []
    const brands: string[] = []
    const prices: number[] = []

    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        if (element.brand && !brands.includes(element.brand)) {
            brands.push(element.brand)
        }
        if (element.product && !names.includes(element.product)) {
            names.push(element.product)
        }
        if (element.price && !prices.includes(element.price)) {
            prices.push(element.price)
        }
    }

    prices.sort((a, b) => a - b);

    const filterFunc = (values: any) => {
        updateFilter(values)
    }
    const resetFilters = () => {
        updateFilter({})
    }
    return isLoading ?
        <Spin style={{ minHeight: '200px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} /> :
        <Form layout="vertical" onFinish={filterFunc}>
            <Typography.Paragraph>
                Фильтрация результатов по:
            </Typography.Paragraph>
            <Form.Item label="Названию" name="product" initialValue={filter.product}>
                <Select
                    style={{ width: '100%' }}
                    options={names.map(el => { return { value: el, label: el } })}
                    showSearch={true}
                    allowClear={true}
                />
            </Form.Item>
            <Form.Item label="Цене" name="price" initialValue={filter.price}>
                <Select
                    style={{ width: '100%' }}
                    options={prices.map(el => { return { value: el, label: el } })}
                    showSearch={true}
                    allowClear={true}
                />
            </Form.Item>
            <Form.Item label="Бренду" name="brand" initialValue={filter.brand}>
                <Select
                    style={{ width: '100%' }}
                    options={brands.map(el => { return { value: el, label: el } })}
                    showSearch={true}
                    allowClear={true}
                />
            </Form.Item>
            <Form.Item>
                <Row gutter={24} justify={'space-between'}>
                    <Col>
                        <Button type="default" onClick={resetFilters}>Сбросить фильтры</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit">Искать</Button>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
}