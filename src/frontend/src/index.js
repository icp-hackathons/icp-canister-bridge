import * as React from "react";
import { render } from "react-dom";
import { main } from "../../declarations/main";

const MyHello = () => {
  const [message, setMessage] = React.useState('');
  const [amount, setAmount] = React.useState('');

  const [r_hash, setPaymentHash] = React.useState('');
  const [evm_address, setEvmAddr] = React.useState('');

  const [invoicePay, setInvoicePay] = React.useState('');
  /*
  async function doGreet() {
    const greeting = await custom_greeting_backend.greet(name);
    setMessage(greeting);
  }

  */

  const getInvoice = async () => {
    try{
      const resp = await main.generateInvoiceToSwapToRsk(Number(amount),evm_address);
      setMessage(resp);
      if(typeof window.webln !== 'undefined') {
        await window.webln.enable();
        const invoice = JSON.parse(resp).payment_request;
        const result = await window.webln.sendPayment(invoice);
        const r_hash = JSON.parse(resp).r_hash.replace(/\+/g, '-').replace(/\//g, '_')
        const invoiceCheckResp = await main.swapFromLightningNetwork(r_hash);
        console.log(invoiceCheckResp);
        setMessage(invoiceCheckResp);
      }
    } catch(err){
      setMessage(err.message)
    }
  }
  const payInvoice = async () => {
    try{
      let resp;
      if(typeof window.webln !== 'undefined') {
        await window.webln.enable();
        const invoice = await webln.makeInvoice({
          amount: amount,
          defaultMemo: evm_address
        });
        resp = await main.payInvoice(invoice.paymentRequest);
      } else {
        resp = await main.payInvoice(invoicePay);
      }
      setMessage(resp);
    }catch(err){
      setMessage(err.message)
    }
  }
  const checkInvoice = async () => {
    try{
      const resp = await main.swapFromLightningNetwork(r_hash.replace(/\+/g, '-').replace(/\//g, '_'));
      setMessage(resp);
    }catch(err){
      setMessage(err.message)
    }
  }

  return (
    <div style={{ "fontSize": "30px" }}>
      <div style={{ "backgroundColor": "yellow" }}>
        <p>Greetings, from DFINITY!</p>
        <p>
          {" "}
          Type your message in the Name input field, then click{" "}
          <b> Get Greeting</b> to display the result.
        </p>
      </div>
      <div style={{ margin: "30px" }}>
        <p>Input r_hash from invoice generated by service after you pay</p>
        <input
          id="r_hash"
          value={r_hash}
          onChange={(ev) => setPaymentHash(ev.target.value)}
        ></input>
        <button onClick={checkInvoice}>Check Invoice!</button>
      </div>
      <div style={{ margin: "30px" }}>
          <p>Ask service to pay invoice generate by you</p>
          <label>Amount</label>
          <input
            id="invoice_pay"
            value={invoicePay}
            onChange={(ev) => setInvoicePay(ev.target.value)}
          ></input>
          <label>EVM Address</label>
          <input
            id="invoice_pay_memo"
            value={evm_address}
            onChange={(ev) => setEvmAddr(ev.target.value)}
          ></input>
          <button onClick={payInvoice}>Send Invoice!</button>
      </div>
      <div style={{ margin: "30px" }}>
          <p>Ask service to generate invoice to swap to rsk</p>
          <label>Amount</label>

          <input
            id="amount"
            value={amount}
            onChange={(ev) => setAmount(ev.target.value)}
          ></input>
          <label>EVM Address</label>
          <input
            id="addr"
            value={evm_address}
            onChange={(ev) => setEvmAddr(ev.target.value)}
          ></input>
          <button onClick={getInvoice}>Get Invoice!</button>
      </div>
      <div>
        <span style={{ color: "blue" }}>{message}</span>
      </div>
    </div>
  );
};

render(<MyHello />, document.getElementById("app"));
