import { Spin } from "antd"
import { Item } from "../page"

type itemProps = {
    id: string,
    item?: Item
}
export default function Item({ id, item }: itemProps) {
    return <>{item ? item.product : < Spin />}</>
}