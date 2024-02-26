import { useContext, useState } from "react"
import { Button, Col, Form, Input, Row, Select, Spin, Typography } from "antd"
import { PageContext } from "../components/context"

type formStateT = {
    [key: string]: string | number | undefined
}

export default function Sidebar() {
    const { items, page, isLoading, filter, updateFilter } = useContext(PageContext)

    const [formState, setFormState] = useState<formStateT>({
        product: filter.product ?? undefined,
        price: filter.price ?? undefined,
        brand: filter.brand ?? undefined
    })

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

    const filterFunc = () => {
        const newState = Object.assign({}, formState)
        Object.entries(newState).map(el => {
            if (!el[1]) delete newState[el[0]]
        })
        if (updateFilter) updateFilter(newState)
    }
    const resetFilters = () => {
        setFormState({ product: undefined, brand: undefined, price: undefined })
        if (updateFilter) updateFilter({})
    }
    const onSelectChange = (v: string | number, name: 'product' | 'price' | 'brand') => {
        const newState = Object.assign({}, formState)
        for (let index = 0; index < Object.keys(formState).length; index++) {
            const element = Object.keys(formState)[index];
            if (element === name) {
                newState[element] = v
            } else {
                newState[element] = undefined
            }
        }
        setFormState(newState)
    }

    return <>{isLoading ?
        <Spin style={{ minHeight: '200px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} /> :
        <Form layout="vertical" onFinish={filterFunc}>
            <Typography.Paragraph>
                Фильтрация результатов по:
            </Typography.Paragraph>
            <Form.Item label="Названию">
                <Input
                    style={{ width: '100%' }}
                    allowClear={true}
                    onChange={(v) => onSelectChange(v.target.value, 'product')}
                    value={formState.product}
                />
            </Form.Item>
            <Form.Item label="Цене">
                <Select
                    style={{ width: '100%' }}
                    options={prices.map(el => { return { value: el, label: el } })}
                    showSearch={true}
                    allowClear={true}
                    onChange={(v) => onSelectChange(v, 'price')}
                    value={formState.price}
                />
            </Form.Item>
            <Form.Item label="Бренду">
                <Select
                    style={{ width: '100%' }}
                    options={brands.map(el => { return { value: el, label: el } })}
                    showSearch={true}
                    allowClear={true}
                    onChange={(v) => onSelectChange(v, 'brand')}
                    value={formState.brand}
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
        </Form>}
        <Col span={24}>
            <Typography.Paragraph code>FILTER {JSON.stringify(filter)}</Typography.Paragraph>
            <Typography.Paragraph code>PAGE {JSON.stringify(page)}</Typography.Paragraph>
        </Col>
    </>
}