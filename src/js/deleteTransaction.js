import axios from "axios"
import { base_url } from "./config"
export default async(id) => {
    let url = base_url + "/transaction",
        res = axios.delete(url, {
            data: {
                transaction_id: id,
            },
        })
    return res
}