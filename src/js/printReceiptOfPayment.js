export default async() => {
    const iframe = document.frames ?
        document.frames["receiptOfPayment"] :
        document.getElementById("receiptOfPayment")
    const iframeWindow = iframe.contentWindow || iframe

    iframe.focus()
    iframeWindow.print()

    return false
}