type itemProps = {
    id: string
}
export default function Item({ id }: itemProps) {
    return (`item file ${id}`)
}