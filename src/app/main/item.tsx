import { Spin, Card, Typography, Skeleton } from "antd"
import { Item } from "../page"

type itemProps = {
    id: string,
    item?: Item
}
export default function Item({ id, item }: itemProps) {
    return item ? <Card title={item.product}>
        <Typography.Paragraph>{item.product}{item.brand ? ` от ${item.brand}` : ''}</Typography.Paragraph>
        <Typography.Paragraph ellipsis={true}>
            ID {item.id}
        </Typography.Paragraph>
        <Typography.Paragraph>
            Стоимость {item.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
        </Typography.Paragraph>
    </Card> : <Skeleton />
}